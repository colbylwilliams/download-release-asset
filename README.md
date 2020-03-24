# Download Release Asset

An Action to download a release asset via GitHub Release API

## Inputs

### `asset_id`

**Required** The ID of the uploaded asset to download.

### `file_path`

**Required** The path of the directory to save the downloaded asset.

## Example usage

uses: colbylwilliams/download-release-asset@v1
with:
  asset_id: '1234567'
