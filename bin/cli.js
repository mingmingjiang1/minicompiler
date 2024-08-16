#!/usr/bin/env node

const path = require("path");
const shell = require("shelljs");
const chalk = require("chalk");
const { name, version } = require('../package.json');

if (process.argv.includes('-h') || process.argv.includes('--help') || process.argv.length <= 2) {
  console.log(`
usage: mccompiler filename [options]
  options:
    -h --help       See the help
    -V  --version   Show version
  `);
} else if (process.argv.includes('-v') || process.argv.includes('--version')) {
  console.log(`
name: ${name}
version: ${version}
  `);
} else {
  const major = nodeVersion.stdout.match(/node version: v(.*)\.(.*)\.(.*)/)?.[1]
  if (Number(major) < 14) {
      console.log(chalk.green.bold("请安装14以上的node版本"));
      shell.exit(1);
  }
  if ((path.extname(process.argv[2])) !== '.mc') {
    console.log(chalk.green.bold("请检查文件名后缀"));
    shell.exit(1);
  }
  if (shell.exec(`test -e ${process.argv[2]}`).code !== 0) {
    console.log(chalk.green.bold("源文件不存在"));
    shell.exit(1);
  }

  console.log(chalk.green.bold(`编译通过✅，生成目标.s文件`));
  shell.exec(`node ${path.dirname(__dirname, "..")} ${
    process.argv[2]
  } ${shell.pwd()} > output.log`);
}

