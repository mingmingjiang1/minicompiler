import { TOKEN } from "../type";
const fs = require("fs");

let production_cnt = 0;
export const key2production: {
  [key: number]: string;
} = {};

// export const production2key: {
//   [key: number]: string;
// } = {};

export const invertKeyValues = (obj: any) =>
  Object.keys(obj).reduce(
    (acc, key) => {
      acc[obj[key as any]] = Number(key);
      return acc;
    },
    {} as {
      [key: string]: number;
    }
  );

export function readSemantic(filename: string) {
  // 读取文件，获取正则规则和action
  const data = fs.readFileSync(filename);
  const matchIterator = data.toString().matchAll(/%%([\s\S]*?)%%/g);
  const matches: string[] = [];
  for (const item of matchIterator) {
    matches.push(item[1]);
  }
  // console.log(99997, matches[0])
  fs.writeFileSync("/Users/bytedance/Desktop/icompiler/semanti.ts", matches[0]);
  // xxx -> xxx : {} | xxx: {}
  const pattern = /(.*?)->(?:.*?:\s*?\{.*?\}\s*\|?;)/gms;
  let resStr = `let prod; switch (prod) {`;
  const pattern2 = /([^->|]*?):\s*?{(.*?)}/gms; // 1-rfh, 2-action
  const resIterator = matches[1].matchAll(pattern);
  for (const test of resIterator) {
    console.log(test[0], test[1], 1111); // 匹配一级单元
    const lfh = test[1];
    const tmp = test[0];
    const resIterator = tmp.matchAll(pattern2);
    for (const test of resIterator) {
      const tmp = lfh.trim() + "->" + transformChar(test[1].trim().split(" "));
      console.log(tmp);
      resStr += `case ${production_cnt}: 
      ${test[2].trim()};
      break;`;
      if (!key2production[production_cnt]) {
        key2production[production_cnt++] = tmp;
      }
    }
  }

  resStr += "}";
  fs.writeFileSync("/Users/bytedance/Desktop/icompiler/semanti.ts", resStr, {
    flag: "a+",
  });
}

function transformChar(str: string[]) {
  const res: string[] = [];
  for (const s of str) {
    if (s.startsWith("TOKEN")) {
      try {
        res.push(TOKEN[s.slice(s.indexOf(".") + 1) as any]);
      } catch (e) {
        console.log(e);
      }
    } else {
      res.push(s);
    }
  }
  return res.join("");
}

readSemantic("/Users/bytedance/Desktop/icompiler/semantic.y");

/* 
string -> parser -> token
[[line, TypeEnum, yytext]]
yytext和yylength是全局变量，每当匹配到一个特定的token时候，更新yytext和yylength


token -> sematic -> ast (进行语yi分析)
parser阶段生成的自定义终结符semantic要知道
sematic自定义的非终结符可以任意，这些非终结符如何转为一个单一的符号
组成的production转为枚举值
$1, $2 等等要转为 stack[-1], stack[-2]

gen，我觉得可以先把词素值如何保留的事情做掉，然后写gen，看下整链路是否通
*/
