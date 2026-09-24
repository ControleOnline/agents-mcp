# Published Module Dependencies and Release Versioning

This contract applies to first-party frontend modules published to npm and PHP
modules published through Packagist. `dev` remains the source-development
workspace; production builds consume immutable published package versions.

## Development and production resolution

- **Development:** preserve the repository's current local `modules/` workflow
  so module code remains editable alongside the application. Do not force
  published-package resolution in local development.
- **Production frontend:** resolve first-party packages from `node_modules`,
  not the local `modules/` tree. Configure Babel aliases and the Metro resolver
  for the production mode explicitly; keep their current local-module behavior
  in development. Validate the actual production bundle and prove its module
  paths resolve inside `node_modules`.
- **Production PHP:** Composer resolves first-party PHP packages into
  `vendor/`; PHP autoloading uses Composer's generated `vendor/autoload.php`.
  Do not rewrite `composer.json`, run `composer require/update`, or regenerate
  manifests during installation/deploy. Use the committed `composer.lock` and
  an install-only deployment. The production artifact excludes the local
  `modules/` source tree and includes the generated `vendor/` dependencies.
- Never commit generated `node_modules/` or `vendor/` trees as a substitute for
  manifests and lockfiles.

## Pinning and reproducible installs

- Every first-party npm dependency is declared in the consuming `package.json`
  with an exact version (no `^`, `~`, wildcard, branch, or floating tag); commit
  the matching `package-lock.json`. Use `npm ci` for CI and production installs.
- Every first-party Composer dependency is declared with an exact stable version
  in `composer.json`; commit the matching `composer.lock`. Use
  `composer install` from that lockfile for CI and production. Do not add a
  manually maintained `version` field to a library `composer.json` as the
  release source; Packagist derives library versions from immutable VCS tags.
- An update to a published dependency is a source change: update the exact
  manifest constraint and lockfile together, then test the installed package
  tree. A branch name, floating `dev-*` reference, unpinned git URL, or local
  path is not a production dependency.
- Before and after production dependency installation, verify that
  `package.json`, `package-lock.json`, `composer.json` and `composer.lock` are
  unchanged. Installation consumes the manifests; it does not author them.

## RC version and package tags

1. Before freezing a new RC, select its target stable version `X.Y.Z` and update
   every canonical app version file in the RC source (including applicable
   `package.json`, `app.json`, PHP/application version files and generated
   version constants). `rc.N` is the candidate sequence, not part of the app's
   stable version. All app surfaces in the RC must report the same `X.Y.Z`.
2. Freeze the app version files, dependency manifests, lockfiles, module SHAs
   and package-release plan together in `.release/rc-manifest.json`. The
   manifest records each package name, ecosystem, exact package version, source
   repository and source SHA, plus its intended stable release tag. Do not
   change any of these after freeze; any change requires `rc.N+1` and
   re-homologation.
3. RC creation updates source version files but does **not** publish packages
   or create stable release tags. Only after explicit human authorization in
   `Deploy` may stable packages/tags be published.
4. On authorized Deploy, derive npm package versions from each package's
   `package.json`, publish those exact versions, and create the corresponding
   Git release tags only on the package SHAs recorded in the frozen manifest.
   Derive Composer package names from `composer.json`; create the manifest's
   exact `vX.Y.Z` Git tag on the frozen package SHA so Packagist can index it.
   Never move or reuse an existing release tag/version; publish a new version
   for corrections.
5. Promote the same frozen RC to production and verify installed versions from
   lockfiles/runtime metadata against the manifest. Do not install an untagged
   branch, rebuild a different package set, or let install hooks rewrite version
   files after approval.

If a package repository does not yet have a stable package version or the
manifest cannot map the app's lockfile to the exact repository SHA/tag, fail
closed before freeze. Do not infer package names, versions, tags, or registry
dist-tags from an app version; record the mapping explicitly.
