const fs = require('fs');
const core = require('@actions/core');
const github = require('@actions/github');

const requiredArgOptions = {
  required: true,
  trimWhitespace: true
};

const token = core.getInput('github-token', requiredArgOptions);
const assetName = core.getInput('asset-name', requiredArgOptions);
const tag = core.getInput('tag-name', requiredArgOptions);
const repoInput = core.getInput('repository', { trimWhitespace: true });

const owner = repoInput ? repoInput.split('/')[0] : github.context.repo.owner;
const repo = repoInput ? repoInput.split('/')[1] : github.context.repo.repo;

const octokit = github.getOctokit(token);

function writeToFile(assetName, download) {
  try {
    core.info(`\nWriting download to file "${assetName}"...`);
    const bufferFromArray = Buffer.from(download);
    const downloadFilePath = `${process.cwd()}/${assetName}`;
    fs.writeFileSync(downloadFilePath, bufferFromArray);

    // Write this out both ways.  The previous implementation was in a bash script but the output
    // would be set as 'download-file-path' even though the script set it as 'download_file_path'.
    // Just to avoid any breaking changes or confusion, do it both ways.
    core.setOutput('download_file_path', downloadFilePath);
    core.setOutput('download-file-path', downloadFilePath);
  } catch (error) {
    core.setOutput('error-condition', 'Writing to file failed');
    core.setFailed(`Writing download to file "${assetName}" failed: ${error.message}`);
  }
}

async function downloadAsset(owner, repo, assetId) {
  core.info(`\nDownloading asset "${assetId}"...`);
  let download;

  await octokit.rest.repos
    .getReleaseAsset({
      owner,
      repo,
      asset_id: assetId,
      headers: {
        Accept: 'application/octet-stream'
      }
    })
    .then(response => {
      core.info(`Download for asset "${assetId}" succeeded`);
      download = response.data;
    })
    .catch(error => {
      core.setOutput('error-condition', 'Asset download failed');
      core.setFailed(`Download for asset "${assetId}" failed: ${error.message}`);
    });
  return download;
}

function getAssetFromRelease(assetsList, assetName) {
  core.info(`\nLooking for asset with name "${assetName}"...`);

  if (!assetsList || assetsList.length === 0) {
    core.setOutput('error-condition', 'Release does not have assets');
    core.setFailed(`The release does not contain any assets.`);
    return;
  }

  const asset = assetsList.find(({ name }) => name === assetName);
  if (!asset) {
    core.setOutput('error-condition', 'No assets match the name');
    core.setFailed(`No asset found with name "${assetName}"`);
  } else {
    core.info(`Found asset with name "${assetName}"`);
  }
  return asset;
}

async function getRelease(tag) {
  core.info(`\nLooking for release with tag "${tag}"...`);
  let release;
  await octokit.rest.repos
    .getReleaseByTag({
      owner,
      repo,
      tag
    })
    .then(response => {
      core.info(`Found release with tag "${tag}"`);
      release = response.data;
    })
    .catch(error => {
      if (error.status === 404) {
        core.setOutput('error-condition', 'Release with tag does not exist');
        core.setFailed(`The release with tag "${tag}" does not exist`);
      } else {
        core.setOutput('error-condition', 'Unknown error getting release');
        core.setFailed(`An error occurred getting release with tag "${tag}": ${error.message}`);
      }
    });

  return release;
}

async function run() {
  core.info('Downloading asset...');

  let release = await getRelease(tag);
  if (!release) return;

  const asset = getAssetFromRelease(release.assets, assetName);
  if (!asset) return;

  const download = await downloadAsset(owner, repo, asset.id);
  if (!download) return;

  writeToFile(assetName, download);
}
run();
