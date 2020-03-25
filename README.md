# Download Release Asset

An Action to download a release asset via GitHub Release API

## Inputs

### `token`

**Required** The access token to access GitHub with.

### `asset_id`

**Required** The ID of the uploaded asset to download.

### `file_path`

**Required** The path of the directory to save the downloaded asset.

### `owner`

**Optional** The owner of the repository.

### `repo`

**Optional** The name of the repository.

## Example usage

```yml
uses: colbylwilliams/download-release-asset@v1
with:
  asset_id: '1234567'
```
