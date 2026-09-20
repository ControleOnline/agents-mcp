import fs from 'node:fs';

const API = 'https://api.github.com';
const GRAPHQL = 'https://api.github.com/graphql';
const ORG = process.env.GOVERNANCE_ORG || 'ControleOnline';
const PROJECT_NUMBER = Number(process.env.GOVERNANCE_PROJECT_NUMBER || '1');
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const DRY_RUN = String(process.env.GOVERNANCE_DRY_RUN || 'false').toLowerCase() === 'true';
const WORKING_LIMIT = 5;
const RULESET_NAME = 'ControleOnline protected integration flow';
const CHECK_CONTEXT = 'source-policy';
const WORKFLOW_PATH = '.github/workflows/integration-source-gate.yml';

if (!TOKEN) throw new Error('Missing GH_TOKEN/GITHUB_TOKEN');

const workflow = `name: Integration source gate

on:
  pull_request:
    branches: [dev, staging, master]
    types: [opened, synchronize, reopened, edited, ready_for_review]

permissions:
  contents: read
  pull-requests: read

jobs:
  source-policy:
    runs-on: ubuntu-latest
    steps:
      - name: Enforce task or frozen RC source
        env:
          HEAD_REF: \${{ github.head_ref }}
          BASE_REF: \${{ github.base_ref }}
        run: |
          set -eu
          if [ "$BASE_REF" = "dev" ]; then
            echo "$HEAD_REF" | grep -Eq '^task-[1-9][0-9]*$' || {
              echo "::error::dev only accepts task-<numeric issue>."
              exit 1
            }
            exit 0
          fi
          echo "$HEAD_REF" | grep -Eq '^rc/[0-9]+\\.[0-9]+\\.[0-9]+-rc\\.[1-9][0-9]*$' || {
            echo "::error::$BASE_REF only accepts a frozen rc/X.Y.Z-rc.N source."
            exit 1
          }

      - uses: actions/checkout@v4
        if: github.base_ref != 'dev'
        with:
          ref: \${{ github.head_ref }}

      - name: Validate frozen RC manifest
        if: github.base_ref != 'dev'
        env:
          HEAD_REF: \${{ github.head_ref }}
        run: |
          set -eu
          test -f .release/rc-manifest.json || {
            echo "::error::Missing .release/rc-manifest.json"
            exit 1
          }
          node --input-type=module <<'NODE'
          import fs from 'node:fs';
          const m = JSON.parse(fs.readFileSync('.release/rc-manifest.json', 'utf8'));
          const branch = process.env.HEAD_REF;
          const match = /^rc\\/(\\d+\\.\\d+\\.\\d+)-rc\\.([1-9][0-9]*)$/.exec(branch);
          if (!match) throw new Error('invalid RC branch');
          if (m.branch !== branch || m.version !== match[1] || Number(m.rc) !== Number(match[2])) throw new Error('manifest identity mismatch');
          if (m.frozen !== true) throw new Error('manifest is not frozen');
          if (!Array.isArray(m.tasks) || m.tasks.length < 1 || m.tasks.length > 5) throw new Error('RC must contain 1..5 tasks');
          const tasks = m.tasks.map(Number);
          if (tasks.some((id) => !Number.isInteger(id) || id < 1)) throw new Error('invalid task id');
          if (new Set(tasks).size !== tasks.length) throw new Error('duplicate RC tasks');
          if (!/^[0-9a-f]{40}$/i.test(String(m.baseMaster || ''))) throw new Error('invalid baseMaster');
          const repos = m.repositories || {};
          if (!Object.keys(repos).length) throw new Error('empty repositories manifest');
          for (const [repo, sha] of Object.entries(repos)) {
            if (!/^ControleOnline\\/[A-Za-z0-9_.-]+$/.test(repo) || !/^[0-9a-f]{40}$/i.test(String(sha))) throw new Error('invalid repository manifest entry');
          }
          console.log('Frozen RC manifest valid:', branch, tasks);
          NODE
`;

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'controleonline-governance-installer',
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) throw new Error(`${response.status} ${url}: ${typeof body === 'string' ? body : JSON.stringify(body)}`);
  return body;
}

async function graphql(query, variables = {}) {
  const body = await request(GRAPHQL, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
  });
  if (body.errors) throw new Error(JSON.stringify(body.errors));
  return body.data;
}

async function paginateRepos() {
  const repos = [];
  for (let page = 1; ; page += 1) {
    const batch = await request(`${API}/orgs/${ORG}/repos?type=all&per_page=100&page=${page}&sort=full_name`);
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

async function branchExists(repo, branch) {
  try {
    await request(`${API}/repos/${ORG}/${repo}/branches/${branch}`);
    return true;
  } catch (error) {
    if (/ 404 |404 https:/.test(error.message)) return false;
    throw error;
  }
}

async function getContent(repo, path, ref = 'master') {
  try {
    return await request(`${API}/repos/${ORG}/${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`);
  } catch (error) {
    if (/ 404 |404 https:/.test(error.message)) return null;
    throw error;
  }
}

async function installWorkflow(repo) {
  const current = await getContent(repo, WORKFLOW_PATH, 'master');
  const desired = Buffer.from(workflow).toString('base64');
  if (current?.content?.replace(/\\n/g, '') === desired) return 'unchanged';
  if (DRY_RUN) return current ? 'would-update' : 'would-create';

  const payload = {
    message: 'ci: enforce ControleOnline integration governance',
    content: desired,
    branch: 'master',
    ...(current?.sha ? { sha: current.sha } : {}),
  };
  await request(`${API}/repos/${ORG}/${repo}/contents/${WORKFLOW_PATH}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return current ? 'updated' : 'created';
}

function rulesetPayload() {
  return {
    name: RULESET_NAME,
    target: 'branch',
    enforcement: 'active',
    conditions: {
      ref_name: {
        include: ['refs/heads/dev', 'refs/heads/staging', 'refs/heads/master'],
        exclude: [],
      },
    },
    rules: [
      { type: 'deletion' },
      { type: 'non_fast_forward' },
      {
        type: 'pull_request',
        parameters: {
          dismiss_stale_reviews_on_push: false,
          require_code_owner_review: false,
          require_last_push_approval: false,
          required_approving_review_count: 0,
          required_review_thread_resolution: false,
          allowed_merge_methods: ['merge'],
        },
      },
      {
        type: 'required_status_checks',
        parameters: {
          strict_required_status_checks_policy: true,
          do_not_enforce_on_create: false,
          required_status_checks: [{ context: CHECK_CONTEXT }],
        },
      },
    ],
    bypass_actors: [],
  };
}

async function upsertRuleset(repo) {
  const all = await request(`${API}/repos/${ORG}/${repo}/rulesets?per_page=100`);
  const current = all.find((item) => item.name === RULESET_NAME);
  if (DRY_RUN) return current ? 'would-update' : 'would-create';
  const method = current ? 'PUT' : 'POST';
  const url = current
    ? `${API}/repos/${ORG}/${repo}/rulesets/${current.id}`
    : `${API}/repos/${ORG}/${repo}/rulesets`;
  await request(url, { method, body: JSON.stringify(rulesetPayload()) });
  return current ? 'updated' : 'created';
}

function statusName(item) {
  const value = item.fieldValues?.nodes?.find((node) => node?.field?.name === 'Status');
  return value?.name || '';
}

async function projectSnapshot() {
  const query = `query($org:String!, $number:Int!, $cursor:String) {
    organization(login:$org) {
      projectV2(number:$number) {
        id
        fields(first:50) {
          nodes {
            ... on ProjectV2SingleSelectField {
              id name options { id name }
            }
          }
        }
        items(first:100, after:$cursor) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id
            fieldValues(first:20) {
              nodes {
                ... on ProjectV2ItemFieldSingleSelectValue {
                  name
                  field { ... on ProjectV2SingleSelectField { id name } }
                }
              }
            }
            content {
              ... on Issue {
                number createdAt
                repository { nameWithOwner }
              }
            }
          }
        }
      }
    }
  }`;

  let cursor = null;
  let project = null;
  const items = [];
  do {
    const data = await graphql(query, { org: ORG, number: PROJECT_NUMBER, cursor });
    const pageProject = data?.organization?.projectV2;
    if (!pageProject) throw new Error(`Project ${ORG}#${PROJECT_NUMBER} not found`);
    if (!project) project = { ...pageProject, items: { ...pageProject.items, nodes: [] } };
    items.push(...(pageProject.items?.nodes || []));
    const pageInfo = pageProject.items?.pageInfo;
    cursor = pageInfo?.hasNextPage ? pageInfo.endCursor : null;
  } while (cursor);
  project.items.nodes = items;
  return { organization: { projectV2: project } };
}

async function normalizeWorking() {
  const first = await projectSnapshot();
  const project = first?.organization?.projectV2;
  if (!project) throw new Error(`Project ${ORG}#${PROJECT_NUMBER} not found`);

  const field = project.fields.nodes.find((node) => node?.name === 'Status' && Array.isArray(node.options));
  const ready = field?.options?.find((option) => option.name === 'Ready');
  if (!field || !ready) throw new Error('Status/Ready option not found');

  const working = project.items.nodes
    .filter((item) => statusName(item) === 'Working' && item.content?.repository?.nameWithOwner)
    .sort((a, b) => {
      const time = Date.parse(a.content.createdAt) - Date.parse(b.content.createdAt);
      if (time !== 0) return time;
      return a.content.number - b.content.number;
    });

  const overflow = working.slice(WORKING_LIMIT);
  if (!overflow.length) return { workingCount: working.length, moved: [] };

  const moved = [];
  for (const item of overflow) {
    const ref = `${item.content.repository.nameWithOwner}#${item.content.number}`;
    if (!DRY_RUN) {
      await graphql(`mutation($project:ID!, $item:ID!, $field:ID!, $option:String!) {
        updateProjectV2ItemFieldValue(input:{
          projectId:$project, itemId:$item, fieldId:$field,
          value:{singleSelectOptionId:$option}
        }) { projectV2Item { id } }
      }`, { project: project.id, item: item.id, field: field.id, option: ready.id });
    }
    moved.push(ref);
  }
  return { workingCount: working.length, kept: working.slice(0, WORKING_LIMIT).map((i) => `${i.content.repository.nameWithOwner}#${i.content.number}`), moved };
}

async function main() {
  const repos = await paginateRepos();
  const targets = [];
  for (const repo of repos) {
    if (repo.archived || repo.fork || repo.disabled) continue;
    if (!(await branchExists(repo.name, 'master'))) continue;
    // Scope branch governance to repositories participating in the dev/staging/master flow.
    const hasDev = await branchExists(repo.name, 'dev');
    const hasStaging = await branchExists(repo.name, 'staging');
    if (!hasDev && !hasStaging) continue;
    targets.push(repo.name);
  }

  const results = [];
  for (const repo of targets) {
    try {
      const workflowResult = await installWorkflow(repo);
      const rulesetResult = await upsertRuleset(repo);
      results.push({ repo: `${ORG}/${repo}`, ok: true, workflow: workflowResult, ruleset: rulesetResult });
    } catch (error) {
      const unsupported = /Upgrade to GitHub Pro or make this repository public to enable this feature/i.test(error.message || '');
      if (unsupported) {
        results.push({ repo: `${ORG}/${repo}`, ok: true, ruleset: 'unsupported-by-github-plan', warning: error.message });
      } else {
        results.push({ repo: `${ORG}/${repo}`, ok: false, error: error.message });
      }
    }
  }

  let project;
  try {
    project = await normalizeWorking();
  } catch (error) {
    project = { ok: false, error: error.message };
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    dryRun: DRY_RUN,
    org: ORG,
    targetCount: targets.length,
    successCount: results.filter((r) => r.ok).length,
    failureCount: results.filter((r) => !r.ok).length,
    project,
    results,
  };
  fs.mkdirSync('/tmp/governance', { recursive: true });
  fs.writeFileSync('/tmp/governance/summary.json', JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));

  if (summary.failureCount || project?.ok === false) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
