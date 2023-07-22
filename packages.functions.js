import { getToPath } from './scripts/fs.functions.js';
import { packagesPath } from './packages.constants.js';

/**
 * @param {string} path
 * @param {import('./packages.d.ts').INxTargets} commands
 * @returns {import('./packages.d.ts').INxProject}
 */
export function generateNxProjectJson(path, commands = {}) {
  const sourceRoot = `${packagesPath}/${path}`;
  return {
    name: path,
    projectType: 'library',
    sourceRoot,
    tags: [],
    targets: {
      ...commands,
      ...baseCommands(sourceRoot),
      ...dockerCommands(path),
    },
  };
}

/**
 * @param {string} path
 * @returns {import('./packages.d.ts').INxTargets}
 */
function baseCommands(path) {
  const relativePath = getToPath(path, packagesPath);
  return {
    'repo:update': {
      executor: 'nx:run-commands',
      options: {
        commands: [`nx run ${relativePath}:repo:update-version`, `nx run ${relativePath}:repo:clone`],
        parallel: false,
        cwd: path,
        color: true,
      },
    },
    'repo:update-version': {
      executor: 'nx:run-commands',
      options: {
        commands: [`node ${relativePath}/repo.update-version.js`],
        parallel: false,
        cwd: path,
        color: true,
      },
    },
    'repo:clone': {
      executor: 'nx:run-commands',
      options: {
        commands: [`node ${relativePath}/repo.clone.js`],
        parallel: false,
        cwd: path,
        color: true,
      },
    },
  };
}

/**
 * @param {string} path
 * @returns {import('./packages.d.ts').INxTargets}
 */
function dockerCommands(path) {
  return {
    'docker:install': {
      executor: 'nx:run-commands',
      options: {
        commands: [`node docker run -t ffmpeg-wasm npx nx run ${path}:install`],
        parallel: false,
        cwd: '',
        color: true,
      },
    },
    'docker:emmake': {
      executor: 'nx:run-commands',
      options: {
        commands: [`node docker run -t ffmpeg-wasm npx nx run ${path}:emmake`],
        parallel: false,
        cwd: '',
        color: true,
      },
    },
    'docker:make': {
      executor: 'nx:run-commands',
      options: {
        commands: [`node docker run -t ffmpeg-wasm npx nx run ${path}:make`],
        parallel: false,
        cwd: '',
        color: true,
      },
    },
  };
}