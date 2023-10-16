module.exports = async (core, fs, downloadFilePath, expectedFilePath) => {
  if (!fs.existsSync(downloadFilePath)) {
    core.setFailed(`The asset does not exist at the expected location: ${downloadFilePath}`);
    return;
  }
  core.info(`The asset exists here: ${downloadFilePath}`);

  const expectedContent = fs.readFileSync(expectedFilePath, 'utf8');
  const actualContent = fs.readFileSync(downloadFilePath, 'utf8');

  if (expectedContent !== actualContent) {
    core.setFailed(`The expected content does not match the actual downloaded content:`);
    core.info(`Expected:\n"${expectedContent}"`);
    core.info(`\nActual:\n"${actualContent}"`);
  } else {
    core.info(`The expected and actual content match!`);
    core.info(`Content:\n"${expectedContent}"`);
  }
};
