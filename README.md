# Download Release Asset

An Action to download a release asset via GitHub Release API

## Usage

```yml
- uses: colbylwilliams/download-release-asset@v1
  with:
    # Repository name with owner. For example, colbylwilliams/download-release-asset
    # Default: ${{ github.repository }}
    repository: ''

    # Personal access token (PAT) used to fetch the asset.
    #
    # We recommend using a service account with the least permissions necessary. Also
    # when generating a new PAT, select the least scopes necessary.
    #
    # [Learn more about creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
    #
    # Default: ${{ github.token }}
    token: ''

    # The tag name of the release the asset is on. For example v1.0.0.
    #
    # This is required if the action was not triggered by a release event, whereas the
    # release object in the event payload will be used.
    tag: ''

    # Relative path under $GITHUB_WORKSPACE to place the asset.
    path: ''

    # The name of the uploaded asset to download, including the extention.  For example, MyFile.zip
    asset: ''
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
