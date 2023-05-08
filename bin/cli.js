#!/usr/bin/env node

const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");
// require("../src/parser");

console.log(chalk.green.bold("nfvnvn"));

if (process.argv.includes('-h') || process.argv.includes('--help')) {
  console.log(`
usage: mccompile filename [options]
  options:
    -h --help       See the help
    -V  --version   Show version
  `);
} else {
  shell.exec("ts-node -v");

  shell.exec(
    `ts-node ${path.dirname(__dirname, "..")}/src/semantic/index.ts ${
      process.argv[2]
    } ${shell.pwd()}`
  );
}

