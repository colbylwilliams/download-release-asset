const core = require('@actions/core')
// const github = require('@actions/github')
const { Octokit } = require('@octokit/rest')
const fs = require('fs')
const path = require('path')

async function run() {
    try {

        let workspacePath = process.env.GITHUB_WORKSPACE
        if (!workspacePath)
            throw new Error('GITHUB_WORKSPACE not defined.')

        workspacePath = path.resolve(workspacePath)

        const repository = core.getInput('repository') || process.env.GITHUB_REPOSITORY
        const splitRepository = repository.split('/')
        if (splitRepository.length !== 2 || !splitRepository[0] || !splitRepository[1])
            throw new Error(`Invalid repository '${repository}'. Expected format {owner}/{repo}.`)

        const repo = { owner: splitRepository[0], repo: splitRepository[1] }

        let assetPath = core.getInput('path', { required: false }) || '.'
        assetPath = path.resolve(workspacePath, assetPath)
        if (!(assetPath + path.sep).startsWith(workspacePath + path.sep))
            throw new Error(`Asset path '${assetPath}' is not under '${workspacePath}'`)

        const assetName = core.getInput('asset', { required: true });
        if (!assetName)
            throw new Error('Name must be provided.')

        assetPath = path.join(assetPath, assetName)

        // const token = core.getInput('token', { required: false }) || process.env.GITHUB_TOKEN

        let payload = {};

        if (process.env.GITHUB_EVENT_PATH)
            if (fs.existsSync(process.env.GITHUB_EVENT_PATH))
                payload = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            else
                throw new Error(`GITHUB_EVENT_PATH ${process.env.GITHUB_EVENT_PATH} does not exist.`);


        // const client = new github.GitHub(token)
        const client = new Octokit()

        let release;

        if (process.env.GITHUB_EVENT_NAME.toLowerCase() === 'release') {
            release = payload.release
            if (!release)
                throw new Error('Unable to get release from event payload.')
        } else {
            const tag = core.getInput('tag', { required: false })
            if (!tag)
                throw new Error(`Tag is required for '${process.env.GITHUB_EVENT_NAME} events. It may only be ommitted for 'release' events.`)

            core.info('Getting release')
            const releaseResponse = await client.repos.getReleaseByTag({
                owner: repo.owner,
                repo: repo.repo,
                tag: tag
            })

            if (releaseResponse.status != 200)
                throw new Error(`Unexpected response from GitHub API. Status: ${releaseResponse.status}, Data: ${releaseResponse.data}`)

            release = releaseResponse.data

            if (!release)
                throw new Error('Unable to get release from GitHub API.')
        }

        if (!Array.isArray(release.assets) || !release.assets.length)
            throw new Error('The release has no assets.')


        const asset = release.assets.find(a => a.name === assetName)

        if (!asset)
            throw new Error(`The release has no asset named ${assetName}.`)

        const headers = { 'Accept': 'application/octet-stream' }

        core.info('Downloading asset')
        const assetResponse = await client.repos.getReleaseAsset({
            asset_id: asset.id,
            owner: repo.owner,
            repo: repo.repo,
            headers
        })

        if (assetResponse.status != 200)
            throw new Error(`Unexpected response from GitHub API. Status: ${assetResponse.status}, Data: ${assetResponse.data}`)

        let fileData = Buffer.from(assetResponse) // response.data is ArrayBuffer

        core.info('Writing asset to disk')
        await fs.promises.writeFile(assetPath, fileData)

        fileData = Buffer.from('') // Free memory

    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = run;

run()
