/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const fs = require('node:fs/promises');
const path = require('node:path');
const glob = require('glob');
const getOutput = require('./get-output.js');

async function removeMatches(output, patterns, filterFn) {
  const matches = new Set();

  patterns.forEach((pattern) => {
    glob.sync(pattern, { cwd: output, dot: true }).forEach((match) => {
      if (!filterFn || filterFn(match)) matches.add(match);
    });
  });

  await Promise.all(
    Array.from(matches).map((match) =>
      fs.rm(path.join(output, match), {
        recursive: true,
        force: true,
      }),
    ),
  );
}

async function buildClean(project, cb) {
  if (process.env.NODE_ENV === 'development' && project !== 'core') {
    cb();
    return;
  }
  const output = `${getOutput()}/${project}`;

  await removeMatches(
    output,
    ['**/*.js', '*.js'],
    (match) => path.basename(match) !== 'postinstall.js',
  );
  await removeMatches(output, [
    '**/*.ts',
    '*.ts',
    '**/*.svelte',
    '*.svelte',
    '**/*.css',
    '*.css',
    '**/*.less',
    '*.less',
    '**/*.map',
    '*.map',
    'cjs',
    'esm',
    'components',
    'less',
    'modules',
    'types/*.ts',
    'types/components',
    'types/modules',
    'types/shared',
  ]);

  if (cb) cb();
}

module.exports = buildClean;
