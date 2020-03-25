const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
    try {
        const token = core.getInput('token', { required: true });
        const assetId = core.getInput('asset_id', { required: true });
        const filePath = core.getInput('file_path', { required: true });

        const userOwner = core.getInput('owner', { required: false })
        const userRepo = core.getInput('repo', { required: false })

        if ((userOwner && !userRepo) || (!userOwner && userRepo)) {
            throw { message: "Must provide values for both owner and repo, or neither to use the actions context" };
        }

        const repo = {
            owner: userOwner ?? github.context.repo.owner,
            repo: userRepo ?? github.context.repo.repo,
        };

        const client = new github.GitHub(token ?? process.env.GITHUB_TOKEN);

        const headers = { 'Accept': 'application/octet-stream' };

        const getAssetResponse = await client.repos.getReleaseAsset({
            asset_id: assetId,
            owner: repo.owner,
            repo: repo.repo,
            headers
        });

        await fs.writeFile(filePath, getAssetResponse.data)

    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = run;

run()
