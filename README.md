# download-release-asset

This action can be used to download an asset from a GitHub release.  The GitHub release where the artifacts will be download from are identified by tag which is provided as an argument to the action.  The action downloads the release asset to the root of the workspace.

## Index

- [Inputs](#inputs)
- [Outputs](#outputs)
- [Example](#example)
- [Contributing](#contributing)
  + [Incrementing the Version](#incrementing-the-version)
- [Code of Conduct](#code-of-conduct)
- [License](#license)

## Inputs

| Parameter      | Is Required | Default                                                                             | Description                                                                                                                                                                                                                                                                       |
| -------------- | ----------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `github-token` | true        | N/A                                                                                 | A token with permission to download assets from repository releases. When downloading from the repository the action is running in `secrets.GITHUB_TOKEN` is sufficient.  If downloading from a separate repo, a different token with permission to that repo should be provided. |
| `asset-name`   | true        | N/A                                                                                 | The name of the release asset.                                                                                                                                                                                                                                                    |
| `tag-name`     | true        | N/A                                                                                 | The tag associated with the release that contains the asset to download. You may also use the tag name `latest`.                                                                                                                                                                  |
| `repository`   | false       | `github.repository`<br/> <i>The organization/repository where the action is run</i> | The organization/repository to download the release asset from.                                                                                                                                                                                                                   |

## Outputs

| Name                 | Description                           |
| -------------------- | ------------------------------------- |
| `download-file-path` | Absolute path to the downloaded asset |

## Example

```yml
deploy-code:
    
    env:
      ASSET_ZIP: 'published_app.zip' 
      UNZIPPED_ASSET: 'published_app'
      DEPLOY_ZIP: 'deploy.zip'

    steps:
      - name: Download artifacts from release
        uses: im-open/download-release-asset@v1.1.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          asset-name: ${{ env.ASSET_ZIP }}
          tag-name: ${{ github.event.inputs.tag}}

      - name: Unzip release asset
        run: unzip -qq ${{ env.ASSET_ZIP }} -d ./${{ env.UNZIPPED_ASSET }}

      # ----
      - name: Download artifacts from latest release in a different repo
        uses: im-open/download-release-asset@v1.1.0
        with:
          github-token: ${{ secrets.PERSONAL_PAT }} # GitHub PAT that has permissions to the org/repo
          asset-name: ${{ env.ASSET_ZIP }}
          tag-name: latest
          repository: im-enrollment/repo-with-release

     ...
```

## Contributing

When creating new PRs please ensure:
1. For major or minor changes, at least one of the commit messages contains the appropriate `+semver:` keywords listed under [Incrementing the Version](#incrementing-the-version).
2. The `README.md` example has been updated with the new version.  See [Incrementing the Version](#incrementing-the-version).
3. The action code does not contain sensitive information.

### Incrementing the Version

This action uses [git-version-lite] to examine commit messages to determine whether to perform a major, minor or patch increment on merge.  The following table provides the fragment that should be included in a commit message to active different increment strategies.
| Increment Type | Commit Message Fragment                     |
| -------------- | ------------------------------------------- |
| major          | +semver:breaking                            |
| major          | +semver:major                               |
| minor          | +semver:feature                             |
| minor          | +semver:minor                               |
| patch          | *default increment type, no comment needed* |

## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).

[git-version-lite]: https://github.com/im-open/git-version-lite
