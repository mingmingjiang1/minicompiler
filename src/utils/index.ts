const chalk = require("chalk");

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

// 处理转义字符
export const transformCharacter = (s: string) => {
  if (s === "\\") {
    // 说明是转义字符
    return true;
  }
  return false;
};

export const getWhiteChar = (s: string) => {
  switch (s) {
    case "s":
      // 空白
      return " ";
    case "t":
      // 空白
      return "\t";
    case "n":
      // 空白
      return "\n";
    // 多+一个1
  }
  return s;
};