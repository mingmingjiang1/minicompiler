// const chalk = require("chalk");
import chalk from "chalk";
import fs from 'fs';
// const fs = require("fs");
chalk.level = 1;

export const findAllIndex = <T>(arr: T[], target: T): number[] => {
  const res: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      res.push(i);
    }
  }
  return res;
};

export function idCnt(start: string, end: string) {
  const res: number[] = [];
  let startIndex = atoi(start),
    endIndex = atoi(end);
  for (let i = startIndex; i <= endIndex; i++) {
    res.push(i);
  }
  return res;
}

export function atoi(s: string) {
  // return s.charCodeAt(0) - '0'.charCodeAt(0);
  return s.charCodeAt(0);
}

export const success = (desc: string, ...rest: any[]) => {
  console.log(chalk.green.bold(`${desc}`) + chalk.white(...rest));
};

export const error = (desc: string, ...rest: any[]) => {
  console.log(chalk.red.bold(`${desc}`) + chalk.white(...rest));
};

// deal with escape char
export const transformCharacter = (s: string) => {
  if (s === "\\") {
    // is escape char
    return true;
  }
  return false;
};

export const getWhiteChar = (s: string) => {
  switch (s) {
    case "s":
      // white
      return " ";
    case "t":
      // white
      return "\t";
    case "n":
      // white
      return "\n";
  }
  return s;
};

export const readSemantic = (filename: string) => {
  const data = fs.readFileSync(filename);
  // /%%([\s\S]*)%%/g.test(data.toString());
  const matchIterator = data.toString().matchAll(/%%([\s\S]*?)%%/g);
  const matches: string[] = [];
  for (const item of matchIterator) {
    matches.push(item[1]);
  }
  const res: string[] = [];
  console.log(matches[1], [...matches[1].matchAll(/(?:\S+\s*):\s*((?:[\s\S]+{[\s\S]+}\|?)+)/g)]);
  // for (const item of matches[1].trim().split('\n')) {
  //   if (/^\s*$/.test(item)) {
  //     continue;
  //   }
  //   console.log(item, 111);
  //   [...item.matchAll(/(\S+\s*):\s*((?:[\s\S]+{[\s\S]+}\|?)+)/g)]
  //   // res.push(item.split(/\s/))
  // }
  console.log(1111, res);
};

