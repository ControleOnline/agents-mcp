# Package publication through GitHub Actions

## Scope

Publish ControleOnline npm and Composer packages through GitHub Actions in their source repositories. Do not run `npm publish` or `composer publish` from a workstation. The package repository is the source of truth for its version and release workflow.

Before changing a package, read `shared-github-github-flow/SKILL.md` and `shared-security-security-guardrails/SKILL.md`. Use a task branch and the repository's required review and merge flow; do not bypass branch protection or treat a green workflow as Security acceptance.

## npm packages

Each package repository must contain `.github/workflows/publish-npm.yml`. The workflow is the publication entry point and must use GitHub Actions OIDC with npm Trusted Publishing, not a workstation credential. It must:

1. Run only for the repository's release branches (`dev` / `master`) and stable `vX.Y.Z` tags; task-branch pushes must not publish.
2. Validate that `package.json` has a stable semantic version and that `repository.url` names the canonical `https://github.com/ControleOnline/<repository>` source. npm provenance checks this source identity.
3. When a package version changes on an allowed release branch, create an immutable annotated `vX.Y.Z` tag at that package commit and publish in the same workflow run. A tag created with `GITHUB_TOKEN` does not start another workflow run, so publication cannot depend on a second tag-triggered run.
4. When started by a version tag, require the tag to match `package.json` exactly before publishing.
5. Skip publication if that exact version is already in the npm registry. Never force-move or reuse a published version/tag; increment the package version for a corrected release.
6. Set the Git author identity before creating a tag and grant only the permissions required for contents and OIDC publication.

For a package's first npm publication, npm Trusted Publishing cannot bootstrap a package that does not yet exist. An authorized maintainer must perform the one-time initial creation through an approved GitHub Actions credential path, then configure the package's Trusted Publisher for the exact GitHub owner, repository, and workflow. Do not read or copy a developer's local `.npmrc` token. Once Trusted Publishing is configured, subsequent versions use OIDC only.

After merging the release change, inspect the run on the package's default/release branch, confirm the expected immutable tag, and query the npm registry for the exact version. A successful Actions run alone is not proof that the registry serves the version; registry propagation may take time.

## Composer packages

Composer modules are released from their individual `ControleOnline/<module>` repositories and consumed from Packagist. Use the repository's configured GitHub release workflow and approved stable version tag; do not publish from a local Composer session. Verify the workflow, pushed tag, and Packagist version before changing application pins.

In `api-community`, keep each `controleonline/*` production requirement pinned to an exact stable version. Update `composer.json`, `composer.lock`, and the corresponding module gitlink as one reviewed change. Validate that the lock entry has the same stable version and immutable source/dist commit as the approved release. Development may redirect Composer autoloading to module source checkouts; staging and production must install the locked package artifacts and must not silently run `composer update` to recover from stale pins.

The central package version tag worker may create a module tag only when its approval manifest names an already merged, exact commit. Verify that the worker has access to the required organization token and that the approved commit is on the module's default branch. A scheduled worker is not publication approval: do not add an unreviewed version to the approval manifest or infer Security acceptance from the tag.

## Completion evidence

For each package, record the repository, package name, exact version, release/tag URL, Actions run URL, and registry lookup result. Report failed packages separately with the actual failed gate or missing credential. Do not remove source modules/submodules until every package required by the application is published and its exact version is confirmed in the registry; retain wiki submodules when removing code modules.
