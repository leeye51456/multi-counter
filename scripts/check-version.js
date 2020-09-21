const { spawnSync } = require('child_process');

function printError(message) {
  console.error(`check-version.js: ${message}`);
}

function getCurrentBranch() {
  const branch = spawnSync('git', ['branch', '--show-current']);
  if (branch.status !== 0) {
    return null;
  }
  return branch.stdout.toString().trim();
}

function getTags() {
  const tag = spawnSync('git', ['tag']);
  if (tag.status !== 0) {
    return null;
  }
  return tag.stdout.toString().trim().split(/\n+/);
}

function checkVersion() {
  const currentBranch = getCurrentBranch();
  if (!currentBranch) {
    printError('Cannot find current branch');
    return 1;
  }
  if (currentBranch !== 'master') {
    printError('Current branch is not `master`');
    return 1;
  }

  const packageVersion = process.env.npm_package_version;
  if (!/^(?:[1-9]\d*|0)\.(?:[1-9]\d*|0)\.(?:[1-9]\d*|0)$/.test(packageVersion)) {
    printError(`Version \`${packageVersion}\` is not deployable`);
    return 1;
  }

  const tags = getTags();
  if (!tags) {
    printError('Cannot get tag list');
  }
  for (const tag of tags) {
    if (tag.includes(packageVersion)) {
      printError(`Version \`${packageVersion}\` has already been deployed.`);
      return 1;
    }
  }

  return 0;
}

process.exitCode = checkVersion();
