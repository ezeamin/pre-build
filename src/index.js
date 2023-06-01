#!/usr/bin/env node

/**
 * pre-build
 * Apply lint to app before building
 *
 * @author Ezequiel Amin <https://ezequielamin.com>
 */

import init from './utils/init.js';
import cli from './utils/cli.js';
import log from './utils/log.js';

import { runPreBuildScript } from './utils/pre-build.js';

const input = cli.input;
const flags = cli.flags;
const { build, debug } = flags;

(async () => {
  init({ build });
  input.includes(`help`) && cli.showHelp(0);

  build && runPreBuildScript();
})();
