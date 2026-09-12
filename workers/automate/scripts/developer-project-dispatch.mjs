import fs from 'node:fs';

const GITHUB_API_URL = 'https://api.github.com/graphql';
const DEFAULT_AGENT_LOGIN = 'github-copilot[bot]';
const DEFAULT_AGENT_LOGINS = 'github-copilot[bot],copilot-swe-agent,copilot';
const PROTECTED_PROJECT_STATUSES = new Set(['blocked', 'backlog', 'in review', 'deploy', 'done']);

function env(name, fallback = '') {
  return (process.env[name] || fallback).trim();
}

function parseCsv(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function getToken() {
  return env('GITHUB_TOKEN') || env('GH_TOKEN');
}

async function githubGraphQL(query, variables = {}, extraHeaders = {}) {
  const token = getToken();
  if (!token) throw new Error('Missing GitHub token. Set GITHUB_TOKEN or GH_TOKEN.');

  const response = await fetch(GITHUB_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'controleonline-developer-automation',
      ...extraHeaders,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();
  if (!response.ok || json.errors) {
    throw new Error(JSON.stringify({ status: response.status, errors: json.errors || json }, null, 2));
  }

  return json.data;
}

async function getProjectSnapshot(org, projectNumber) {
  return githubGraphQL(
    `query($org:String!, $projectNumber:Int!) {
      organization(login:$org) {
        projectV2(number:$projectNumber) {
          id
          title
          fields(first:50) {
            nodes {
              ... on ProjectV2FieldCommon {
                id
                name
              }
              ... on ProjectV2SingleSelectField {
                id
                name
                options {
                  id
                  name
                }
              }
            }
          }
          items(first:100) {
            nodes {
              id
              fieldValues(first:20) {
                nodes {
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    name
                    field {
                      ... on ProjectV2SingleSelectField {
                        id
                        name
                      }
                    }
                  }
                }
              }
              content {
                ... on Issue {
                  id
                  number
                  title
                  url
                  state
                  createdAt
                  updatedAt
                  labels(first:50) { nodes { name } }
                  assignees(first:20) {
                    nodes {
                      login
                    }
                  }
                  repository {
                    id
                    nameWithOwner
                    suggestedActors(capabilities:[CAN_BE_ASSIGNED], first:20) {
                      nodes {
                        __typename
                        login
                        ... on Bot {
                          id
                        }
                        ... on User {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`,
    { org, projectNumber }
  );
}

function getStatusValue(item) {
  const value = item.fieldValues?.nodes?.find(
    (node) => node?.field?.name?.toLowerCase() === 'status'
  );
  return value?.name || null;
}

function isProtectedProjectStatus(status) {
  return PROTECTED_PROJECT_STATUSES.has(String(status || '').trim().toLowerCase());
}

function listWorkItems(project, workStatuses) {
  return (project.items?.nodes || []).filter((item) => {
    if (!item?.content?.repository?.nameWithOwner) return false;
    if (item.content.state !== 'OPEN') return false;
    const status = getStatusValue(item);
    if (isProtectedProjectStatus(status)) return false;
    return workStatuses.has(status?.toLowerCase());
  });
}

function assigneeLogins(issue) {
  return (issue.assignees?.nodes || [])
    .map((assignee) => (assignee?.login || '').trim().toLowerCase())
    .filter(Boolean);
}

function hasAgentAssignee(issue, agentLogins) {
  return assigneeLogins(issue).some((login) => agentLogins.has(login));
}

function hasHumanAssignee(issue, agentLogins) {
  return assigneeLogins(issue).some((login) => !agentLogins.has(login));
}

function hasHumanOnlyAssignee(issue, agentLogins) {
  return hasHumanAssignee(issue, agentLogins) && !hasAgentAssignee(issue, agentLogins);
}

function hasManagerHandoff(issue) {
  return (issue.labels?.nodes || []).some((label) => /^agent:manager(?::|$)/i.test(label?.name || ''));
}

function getStatusField(project) {
  return (project.fields?.nodes || []).find((field) => field?.name?.toLowerCase() === 'status' && Array.isArray(field.options));
}

function getStatusOptionId(project, statusName) {
  return getStatusField(project)?.options?.find((option) => option.name?.toLowerCase() === statusName)?.id || null;
}

async function moveProjectItem(projectId, itemId, fieldId, optionId) {
  return githubGraphQL(    `mutation($projectId:ID!, $itemId:ID!, $fieldId:ID!, $optionId:String!) {
      updateProjectV2ItemFieldValue(input: { projectId:$projectId, itemId:$itemId, fieldId:$fieldId, value:{ singleSelectOptionId:$optionId } }) { projectV2Item { id } }
    }`,
    { projectId, itemId, fieldId, optionId }
  );
}

function getAssignableActor(issue, preferredAgentLogin) {
  return (issue.repository?.suggestedActors?.nodes || []).find(
    (actor) => actor?.login?.toLowerCase() === preferredAgentLogin
  );
}

function sortByCreatedAt(items) {
  return [...items].sort((left, right) => {
    const leftTs = Date.parse(left.content?.createdAt || '') || 0;
    const rightTs = Date.parse(right.content?.createdAt || '') || 0;
    return leftTs - rightTs;
  });
}

function buildDeveloperInstructions(issueRef, issueNumber) {
  return [
    `Atue como o agent Developer da ControleOnline para a issue ${issueRef}.`,
    'Antes de agir, leia e siga `agents/roles/developer/agent.md` no repositório alvo.',
    'Leia também o `AGENTS.md` mais específico do código afetado.',
    `Trabalhe a partir do branch \`task-${issueNumber}\` derivado de \`master\`, reutilizando-o quando ele já existir.`,
    'Use GitHub como fonte de verdade para issue, PR, comentários, branch e evidências.',
    'A task já deve estar em `Working`; o Manager é o único responsável por mover o board.',
    'Ao concluir, publique a branch da task e crie uma task de entrega no Paperclip para o Manager; não altere o board.',
  ].join(' ');
}

function buildAssignmentComment(issueRef) {
  return [
    '### Developer iniciado',
    '',
    `Issue: ${issueRef}`,
    'Origem: coluna `Working`; o Manager capturou e organizou a task antes da atribuição.',
    'Critério: prioridade em Working; impedimentos já encaminhados ao Manager não são trabalho executável; Ready só entra abaixo do limite configurado.',
    'Ação inicial: confirme `origin/master` e leia o checklist QA antes de alterar.',
    'Ação: o runner atribuiu o agent `Developer` para iniciar a execução.',
  ].join('\n');
}

async function assignIssueToAgent(issueId, actorId, repositoryId, baseRef, customInstructions, model) {
  return githubGraphQL(
    `mutation(
      $issueId:ID!,
      $actorId:ID!,
      $repositoryId:ID!,
      $baseRef:String!,
      $customInstructions:String!,
      $model:String
    ) {
      replaceActorsForAssignable(input: {
        assignableId: $issueId,
        actorIds: [$actorId],
        agentAssignment: {
          targetRepositoryId: $repositoryId,
          baseRef: $baseRef,
          customInstructions: $customInstructions,
          model: $model
        }
      }) {
        assignable {
          ... on Issue {
            id
          }
        }
      }
    }`,
    { issueId, actorId, repositoryId, baseRef, customInstructions, model: model || null },
    {
      'GraphQL-Features': 'issues_copilot_assignment_api_support,coding_agent_model_selection',
    }
  );
}

async function addIssueComment(issueId, body) {
  return githubGraphQL(
    `mutation($subjectId:ID!, $body:String!) {
      addComment(input:{subjectId:$subjectId, body:$body}) {
        commentEdge {
          node {
            id
          }
        }
      }
    }`,
    { subjectId: issueId, body }
  );
}

function serializeItem(item, agentLogins, preferredAgentLogin) {
  const issue = item.content;
  const assignees = assigneeLogins(issue);
  const actor = getAssignableActor(issue, preferredAgentLogin);
  return {
    issue: {
      id: issue.id,
      ref: `${issue.repository.nameWithOwner}#${issue.number}`,
      title: issue.title,
      url: issue.url,
      state: issue.state,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    },
    projectItemId: item.id,
    currentProjectStatus: getStatusValue(item),
    assignees,
    hasAgentAssignee: hasAgentAssignee(issue, agentLogins),
    hasHumanAssignee: hasHumanAssignee(issue, agentLogins),
    hasHumanOnlyAssignee: hasHumanOnlyAssignee(issue, agentLogins),
    canAssignPreferredAgent: Boolean(actor?.id),
  };
}

function writeOutputFile(payload) {
  const outDir = env('DEVELOPER_OUTPUT_DIR', '/tmp');
  const outPath = `${outDir}/developer-project-dispatch.json`;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
  return outPath;
}

function getWorkingColumnLimit(project) {
  let configLimit;
  try {
    const configUrl = new URL('../../../config/ecosystem.config.json', import.meta.url);
    const config = JSON.parse(fs.readFileSync(configUrl, 'utf8'));
    configLimit = config?.runners?.defaults?.DEVELOPER_WORKING_LIMIT;
  } catch (error) {
    throw new Error(`Unable to read config/ecosystem.config.json for Working limit: ${error.message}`);
  }

  const configuredLimit = configLimit ?? project?.workingLimit ?? env('DEVELOPER_WORKING_LIMIT');
  const workingLimit = Number(configuredLimit);
  if (!Number.isInteger(workingLimit) || workingLimit < 1) {
    throw new Error('Working column limit is unavailable; read the current Project #1 column limit before dispatching.');
  }
  return workingLimit;
}

async function main() {
  const org = env('DEVELOPER_PROJECT_ORG', 'ControleOnline');
  const projectNumber = Number(env('DEVELOPER_PROJECT_NUMBER', '1'));
  const dryRun = env('DEVELOPER_DRY_RUN', 'true').toLowerCase() !== 'false';
  const workStatuses = new Set(parseCsv(env('DEVELOPER_WORK_STATUSES', 'Working')).map((value) => value.toLowerCase()));
  const readyStatus = env('DEVELOPER_READY_STATUS', 'Ready').toLowerCase();
  const workingStatus = env('DEVELOPER_WORKING_STATUS', 'Working').toLowerCase();
  const preferredAgentLogin = env('DEVELOPER_AGENT_LOGIN', DEFAULT_AGENT_LOGIN).toLowerCase();
  const agentLogins = new Set(
    parseCsv(env('DEVELOPER_AGENT_LOGINS', DEFAULT_AGENT_LOGINS)).map((login) => login.toLowerCase())
  );
  const baseRef = env('DEVELOPER_COPILOT_BASE_REF', 'master');
  const model = env('DEVELOPER_COPILOT_MODEL');

  const data = await getProjectSnapshot(org, projectNumber);
  const project = data?.organization?.projectV2;
  if (!project) throw new Error(`Project not found: ${org}/projects/${projectNumber}`);
  const workingColumnLimit = getWorkingColumnLimit(project);

  const workItems = sortByCreatedAt(listWorkItems(project, workStatuses));
  const workingItems = workItems.filter((item) => (getStatusValue(item) || '').toLowerCase() === workingStatus);
  const activeItems = workItems.filter((item) => {
    if (!hasAgentAssignee(item.content, agentLogins)) return false;
    return !hasHumanAssignee(item.content, agentLogins);
  });
  const humanOwnedItems = workItems.filter((item) => hasHumanOnlyAssignee(item.content, agentLogins));
  const isExecutable = (item) => {
    if (hasAgentAssignee(item.content, agentLogins)) return false;
    if (hasHumanOnlyAssignee(item.content, agentLogins)) return false;
    if (hasManagerHandoff(item.content)) return false;
    return true;
  };
  const workingCandidates = workingItems.filter(isExecutable);
  const readyItems = workItems.filter((item) => (getStatusValue(item) || '').toLowerCase() === readyStatus);
  const readyCandidates = readyItems.filter(isExecutable);
  const candidateItems = workingCandidates;

  const result = {
    generatedAt: new Date().toISOString(),
    dryRun,
    project: {
      org,
      number: projectNumber,
      id: project.id,
      title: project.title,
    },
    workStatuses: Array.from(workStatuses),
    readyStatus,
    workingStatus,
    workingColumnLimit,
    workingCount: workingItems.length,
    activeCount: activeItems.length,
    humanOwnedCount: humanOwnedItems.length,
    candidateCount: candidateItems.length,
    workingCandidateCount: workingCandidates.length,
    readyCandidateCount: readyCandidates.length,
    selectionPolicy: "Somente Working; o Manager captura Ready, cria subtasks Paperclip e organiza o board.",
    activeItems: activeItems.map((item) => serializeItem(item, agentLogins, preferredAgentLogin)),
    humanOwnedItems: humanOwnedItems.map((item) => serializeItem(item, agentLogins, preferredAgentLogin)),
    candidateItems: candidateItems.map((item) => serializeItem(item, agentLogins, preferredAgentLogin)),
  };

  if (workingItems.length >= workingColumnLimit) {
    result.ok = true;
    result.skipped = true;
    result.reason = `Working atingiu o limite configurado de ${workingColumnLimit} tasks; Ready não é capturado pelo Developer; o Manager é responsável pela captura e orquestração.`;
    const outPath = writeOutputFile(result);
    console.log(JSON.stringify({ ok: true, skipped: true, reason: result.reason, outPath }, null, 2));
    return;
  }

  if (candidateItems.length === 0) {
    result.ok = true;
    result.skipped = true;
    result.reason = workingItems.length >= workingColumnLimit ? `Working está em ${workingItems.length}/${workingColumnLimit}; não há vaga para capturar Ready.` : 'Nenhuma task executável em Working e nenhuma task elegível em Ready para preencher a capacidade disponível.';
    const outPath = writeOutputFile(result);
    console.log(JSON.stringify({ ok: true, skipped: true, reason: result.reason, outPath }, null, 2));
    return;
  }
  result.assignmentAttempts = [];

  for (const target of candidateItems) {
    const issue = target.content;
    const issueRef = `${issue.repository.nameWithOwner}#${issue.number}`;
    const actor = getAssignableActor(issue, preferredAgentLogin);
    const targetRecord = serializeItem(target, agentLogins, preferredAgentLogin);

    if (!actor?.id) {
      result.assignmentAttempts.push({
        issue: targetRecord.issue,
        status: 'skipped',
        reason: `O agent ${preferredAgentLogin} não apareceu em suggestedActors para ${issue.repository.nameWithOwner}.`,
      });
      continue;
    }

    result.selectedItem = targetRecord;
    const selectedStatus = (getStatusValue(target) || '').toLowerCase();
    const shouldMoveToWorking = false;
    const statusField = getStatusField(project);
    const workingOptionId = getStatusOptionId(project, workingStatus);
    if (shouldMoveToWorking && (!statusField?.id || !workingOptionId)) {
      result.assignmentAttempts.push({ issue: targetRecord.issue, status: 'skipped', reason: 'A opção Working do ProjectV2 não pôde ser resolvida; captura Ready recusada fail-closed.' });
      result.selectedItem = null;
      continue;
    }

    if (!dryRun) {
      // Board mutations belong exclusively to the Manager.
      await assignIssueToAgent(
        issue.id,
        actor.id,
        issue.repository.id,
        baseRef,
        buildDeveloperInstructions(issueRef, issue.number),
        model
      );
      await addIssueComment(issue.id, buildAssignmentComment(issueRef));
      result.executed = true;
    } else {
      result.executed = false;
      result.previewComment = buildAssignmentComment(issueRef);
      result.previewInstructions = buildDeveloperInstructions(issueRef, issue.number);
    }

    result.ok = true;
    result.assignedIssue = issueRef;
    result.assignedAgent = preferredAgentLogin;
    result.baseRef = baseRef;
    result.assignmentAttempts.push({
      issue: targetRecord.issue,
      status: dryRun ? 'preview' : 'assigned',
      reason: shouldMoveToWorking ? 'Fallback Ready autorizado: Working não tinha task executável e havia capacidade; item movido para Working antes da atribuição.' : 'Primeira task executável em Working e atribuível encontrada.',
    });

    const outPath = writeOutputFile(result);
    console.log(
      JSON.stringify(
        {
          ok: true,
          dryRun,
          assignedIssue: issueRef,
          assignedAgent: preferredAgentLogin,
          outPath,
        },
        null,
        2
      )
    );
    return;
  }

  result.ok = false;
  result.skipped = true;
  result.reason = 'Nenhuma task elegível em Ready pôde ser atribuída ao agent configurado.';
  const outPath = writeOutputFile(result);
  console.log(JSON.stringify({ ok: false, skipped: true, reason: result.reason, outPath }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
