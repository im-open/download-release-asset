# download-release-asset

This action can be used to download an asset from a GitHub release.  The GitHub release where the artifacts will be download from are identified by tag which is provided as an argument to the action.  The action downloads the release asset to the root of the workspace.

## Inputs

| Parameter      | Is Required | Description                                                             |
| -------------- | ----------- | ----------------------------------------------------------------------- |
| `github-token` | true        | A token with permission to download assets from repository releases     |
| `asset-name`   | true        | The name of the release asset                                           |
| `tag-name`     | true        | The tag associated with the release that contains the asset to download |

## Outputs

No Outputs

## Example

```yml
deploy-code:
    
    env:
      ASSET_ZIP: 'published_app.zip' 
      UNZIPPED_ASSET: 'published_app'
      DEPLOY_ZIP: 'deploy.zip'

    steps:
      - name: Download artifacts from release
        uses: im-open/download-release-asset@v1.0.1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          asset-name: ${{ env.ASSET_ZIP }}
          tag-name: ${{ github.event.inputs.tag}}

      - name: Unzip release asset
        run: unzip -qq ${{ env.ASSET_ZIP }} -d ./${{ env.UNZIPPED_ASSET }}

     ...
```


## Code of Conduct

This project has adopted the [im-open's Code of Conduct](https://github.com/im-open/.github/blob/master/CODE_OF_CONDUCT.md).

## License

Copyright &copy; 2021, Extend Health, LLC. Code released under the [MIT license](LICENSE).
