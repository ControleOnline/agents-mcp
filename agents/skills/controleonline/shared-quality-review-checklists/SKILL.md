# Developer Verification and Security Review

Use these checklists as part of the active Developer and Security subtasks.
The Developer records applicable implementation and local-test evidence in
their Paperclip subtask. Security records its review evidence in its own
subtask. The Manager revalidates both before dispatching DevOps.

## Developer verification

- [ ] Base branch and task ancestry are confirmed against current `origin/master`.
- [ ] Existing components, hooks, services and helpers are reused where
      applicable; frontend work follows
      `agents/skills/controleonline/shared-quality-review-checklists/component-reuse-checklist.md`.
- [ ] Relevant PHP and JavaScript tests are added or updated and run locally.
- [ ] The issue and the most specific `AGENTS.md` were consulted.
- [ ] Test commands, result and exact commit SHA are recorded in the Paperclip
      subtask; secrets are not included.

## Security review

- [ ] Authorization and access control were validated.
- [ ] Data exposure and unauthorized reads were reviewed.
- [ ] IDOR, mass assignment and unauthorized state changes were considered.
- [ ] Applicable `securityFilter` protections for reads and writes were checked.
- [ ] Sensitive domain rules and the scope-specific `AGENTS.md` were reviewed.
