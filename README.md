# download-release-asset

This action can be used to download an asset from a GitHub release.  The GitHub release where the artifacts will be download from are identified by tag which is provided as an argument to the action.  The action downloads the release asset to the root of the workspace.

## Index <!-- omit in toc -->

- [download-release-asset](#download-release-asset)
  - [Inputs](#inputs)
  - [Outputs](#outputs)
  - [Usage Examples](#usage-examples)
  - [Contributing](#contributing)
    - [Incrementing the Version](#incrementing-the-version)
    - [Source Code Changes](#source-code-changes)
    - [Updating the README.md](#updating-the-readmemd)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)

## Inputs

| Parameter      | Is Required | Default                                                                             | Description                                                                                                                                                                                                                                                                       |
|----------------|-------------|-------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `github-token` | true        | N/A                                                                                 | A token with permission to download assets from repository releases. When downloading from the repository the action is running in `secrets.GITHUB_TOKEN` is sufficient.  If downloading from a separate repo, a different token with permission to that repo should be provided. |
| `asset-name`   | true        | N/A                                                                                 | The name of the release asset.                                                                                                                                                                                                                                                    |
| `tag-name`     | true        | N/A                                                                                 | The tag associated with the release that contains the asset to download. You may also use the tag name `latest`.                                                                                                                                                                  |
| `repository`   | false       | `github.repository`<br/> <i>The organization/repository where the action is run</i> | The organization/repository to download the release asset from.                                                                                                                                                                                                                   |

## Outputs

| Name                 | Description                           |
|----------------------|---------------------------------------|
| `download-file-path` | Absolute path to the downloaded asset |

## Usage Examples

```yml
deploy-code:
    
    env:
      ASSET_ZIP: 'published_app.zip' 
      UNZIPPED_ASSET: 'published_app'
      DEPLOY_ZIP: 'deploy.zip'

    steps:
      - name: Download artifacts from release
        # You may also reference just the major or major.minor version
        uses: im-open/download-release-asset@v1.2.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          asset-name: ${{ env.ASSET_ZIP }}
          tag-name: ${{ github.event.inputs.tag}}

      - name: Unzip release asset
        run: unzip -qq ${{ env.ASSET_ZIP }} -d ./${{ env.UNZIPPED_ASSET }}

      # ----
      - name: Download artifacts from latest release in a different repo
        uses: im-open/download-release-asset@v1.2.1
        with:
          github-token: ${{ secrets.PERSONAL_PAT }} # GitHub PAT that has permissions to the org/repo
          asset-name: ${{ env.ASSET_ZIP }}
          tag-name: latest
          repository: im-enrollment/repo-with-release

     ...
```

## Contributing

When creating PRs, please review the following guidelines:

- [ ] The action code does not contain sensitive information.
- [ ] At least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version] for major and minor increments.
- [ ] The README.md has been updated with the latest version of the action.  See [Updating the README.md] for details.

### Incrementing the Version

This repo uses [git-version-lite] in its workflows to examine commit messages to determine whether to perform a major, minor or patch increment on merge if [source code] changes have been made.  The following table provides the fragment that should be included in a commit message to active different increment strategies.

| Increment Type | Commit Message Fragment                     |
|----------------|---------------------------------------------|
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

### Source Code Changes

The files and directories that are considered source code are listed in the `files-with-code` and `dirs-with-code` arguments in both the [build-and-review-pr] and [increment-version-on-merge] workflows.  

If a PR contains source code changes, the README.md should be updated with the latest action version.  The [build-and-review-pr] workflow will ensure these steps are performed when they are required.  The workflow will provide instructions for completing these steps if the PR Author does not initially complete them.

If a PR consists solely of non-source code changes like changes to the `README.md` or workflows under `./.github/workflows`, version updates do not need to be performed.

### Updating the README.md

If changes are made to the action's [source code], the [usage examples] section of this file should be updated with the next version of the action.  Each instance of this action should be updated.  This helps users know what the latest tag is without having to navigate to the Tags page of the repository.  See [Incrementing the Version] for details on how to determine what the next version will be or consult the first workflow run for the PR which will also calculate the next version.

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/main/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2023, Extend Health, LLC. Code released under the [MIT license](LICENSE).

<!-- Links -->
[Incrementing the Version]: #incrementing-the-version
[Updating the README.md]: #updating-the-readmemd
[source code]: #source-code-changes
[usage examples]: #usage-examples
[build-and-review-pr]: ./.github/workflows/build-and-review-pr.yml
[increment-version-on-merge]: ./.github/workflows/increment-version-on-merge.yml
[git-version-lite]: https://github.com/im-open/git-version-lite
