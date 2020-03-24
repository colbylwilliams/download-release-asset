const core = require('@actions/core');
const { GitHub } = require('@actions/github');
const fs = require('fs');

async function run() {
    try {
        const github = new GitHub(process.env.GITHUB_TOKEN);

        const assetId = core.getInput('asset_id', { required: true });
        const filePath = core.getInput('file_path', { required: true });

        const headers = { 'Accept': 'application/octet-stream' };

        const getAssetResponse = await github.repos.getReleaseAsset({
            asset_id: assetId,
            headers
        });

        await fs.writeFile(filePath, getAssetResponse.data)

    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = run;
