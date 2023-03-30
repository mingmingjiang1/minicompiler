const chalk = require('chalk');

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
  let startIndex = atoi(start), endIndex = atoi(end);
  for (let i = startIndex; i <= endIndex; i++) {
    res.push(i);
  }
  return res;
}

export function atoi(s: string) {
  // return s.charCodeAt(0) - '0'.charCodeAt(0);
  return s.charCodeAt(0);
}

export const success = (desc: string,...rest: any[]) => {
  console.log(
    chalk.green.bold(`${desc}`) + chalk.white(...rest)
  );
};

export const error = (desc: string, ...rest: any[]) => {
  console.log(
    chalk.red.bold(`${desc}`) + chalk.white(...rest));
};