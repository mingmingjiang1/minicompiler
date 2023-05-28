import { atoi, errorMsg, idCnt, success } from "../utils";
import { readToken } from "./nfa";
import { TOKEN } from "../type";
const path = require("path");

let yytext = "",
  yylength = 0,
  number_line = 1;

const [edges, endStates] = readToken(path.join(__dirname, '../..') + "/flex.p");


// get target state node from source node state by edge c
// 入参是某个节点
function getEndofEdges(state: number, c: number | null) {
  const res: number[] = [];
  let i = 0;
  for (const edge of edges[state]) {
    if (edge === null || edge || (edge !== null && edge.length)) {
      // 说明存在边
      if (
        edge === c ||
        (edge !== null && edge.length >= 0 && edge?.includes(c))
      ) {
        res.push(i);
      }
    }
    i++;
  }
  if (!res.length) {
    // 说明是叶子节点，没有出边
  }
  return res;
}

const res = [];

export function getClosure(S: number[], c: number | null) {
  const queue = [...S];
  const res = [...S];
  while (queue.length) {
    const head = queue.pop();
    const targets = getEndofEdges(head, c);
    // if (!targets.length || targets?.[0] === head) {
    //   // 说明head是叶子节点
    //   leafs[head] = true;
    // }
    queue.push(...targets);
    res.push(...targets);
  }
  return res;
}

export function DFAedge(states: number[], c: number) {
  const from = states.reduce(
    (pre, state) => [...pre, ...getEndofEdges(state, c)],
    []
  );
  return getClosure(from, null);
}

// spec test

// console.log(111, DFAedge([1, 4, 14, 9], atoi("i"))); // [ 2, 5, 8, 6 ]
// console.log(DFAedge([1, 4, 14, 9], atoi("g"))); // [ 5, 8, 6 ]
// console.log(DFAedge([2, 5, 15, 8, 6], atoi("f"))); // [ 3, 7, 8, 6 ]
// console.log(DFAedge([2, 5, 15, 8, 6], atoi("z"))); // [ 7, 8, 6 ]
// console.log(DFAedge([2, 5, 15, 8, 6], atoi("0"))); // [ 7, 8, 6 ]
// console.log(DFAedge([10, 11, 13, 15], atoi("0"))); // [ 12, 13, 11 ]
// console.log(DFAedge([1, 4, 14, 9], atoi("`"))); // [15]
// console.log(atoi(' '), DFAedge([1, 4, 9, 14], atoi(' '))); // [15]
// console.log(DFAedge([1, 4, 9, 14], atoi('{'))); // [16]

// // 获取nfa对应的dfa
function NFA2DFA(alpabets: number[], initState: number[]) {
  const states: {
    path?: number[];
    isEnd?: boolean;
    ind?: number[];
    key?: number;
  }[] = new Array(60);
  const trans: {
    path?: number[];
    isEnd?: boolean;
    ind?: number[];
    key?: number;
  }[][] = new Array(100).fill(0).map((item) => {
    return new Array(100);
  });
  states[0] = {
    ind: [],
  };
  states[1] = {
    // path: ,
    ind: initState,
    isEnd: false,
    key: 1,
  }; // 其实是NFA起始点的epsilon closure, 即getClosure(0, 62);
  // console.log(DFAedge(states[1], 'i'.charCodeAt(0) - 'a'.charCodeAt(0) + 10), 'i'.charCodeAt(0) - 'a'.charCodeAt(0) + 10)
  let p = 1,
    j = 0;
  while (j <= p) {
    for (const char of alpabets) {
      const e = DFAedge(states[j].ind, char);
      // 如果存在这样的状态
      const [isExist, i] = isExisted(e, states);
      if (isExist) {
        trans[j][char] = states[i];
      } else {
        p = p + 1;
        // states[p] = e;
        // console.log(j, char)
        // if (e.includes(0)) {
        //   // 说明是终态
        //   const newE = {
        //     isEnd: true,
        //     ind: e,
        //     path: [char],
        //     key: p,
        //   };
        //   states[p] = newE;
        // } else {
          const newE = {
            isEnd: false,
            ind: e,
            path: [char],
            key: p,
          };
          states[p] = newE;
        // }
        trans[j][char] = states[p]; // trans[1][9] = 2, states[2] = []
      }
    }
    j = j + 1;
  }
  return trans;
}


// const trans = NFA2DFA(idCnt('\x00', '\x80'), [0, 3, 8, 13]);
const trans = NFA2DFA(
  [
    ...idCnt("0", "z"),
    atoi(" "),
    atoi("\n"),
    atoi("\t"),
    atoi("{"),
    atoi("}"),
    atoi("("),
    atoi(")"),
    atoi(","),
    atoi("-"),
    atoi("+"),
    atoi("*"),
    atoi("/"),
    atoi("!"),
  ],
  getClosure([1], null)
);


// // 后续在生成dfa的时候，如果存在叶子节点，且可能是多个nfa的叶子节点，需要优先级判断，以第一个nfa为基准
export function scan(input: string) {
  let startState: {
    path?: number[];
    isEnd?: boolean;
    ind?: number[];
    key?: number;
  } = {
    // path: ,
    ind: getClosure([1], null),
    isEnd: false,
    key: 1,
  };
  const path: string[] = []; // 存储原始字符
  const tokens: [number, TOKEN | string, string][] = []; // 存储token
  let preState: {
    path?: number[];
    isEnd?: boolean;
    ind?: number[];
    key?: number;
  };
  let preToken;
  let i = 0;
  while (i < input.length) {
    if (preToken === TOKEN.COMMENT) {
      i += 1;
      if (input[i] === "\n") {
        tokens.pop();
        preToken = undefined;
      } else {
        continue;
      }
    }
    
    let code: number;
    code = atoi(input[i]);
    preState = startState;
    startState = trans[startState?.key][code];
    if (!startState || !trans[startState?.key]?.[code]) {

      const res = [];
      for (const tt of endStates) {
        if (preState.ind.some((index) => index === tt.index)) {
          res.push(tt);
        }
      }

      const target = endStates.find((item) =>
        preState.ind.some((index) => index === item.index)
      );
      if (target) {
        preToken = target.action(yytext, TOKEN);
        if (preToken === undefined) {
          throw new Error(
            errorMsg(`the type from action ${target.action} is error: ${yytext}`)
          );
        }
        if (yytext === "?") {
          console.log(preToken, yytext);
        }
        tokens.push([number_line, preToken, yytext]);
        // tokens.push(TOKENMAP[leafs[target] as TOKEN] === undefined ? [number_line, '', input[i-1]] : [number_line, TOKENMAP[leafs[target] as TOKEN], yytext]);
      } else {
        throw new Error(errorMsg(`Uncaught SyntaxError: Unexpected token ${input[i]}`));
      }
      startState = {
        ind: getClosure([1], null),
        isEnd: false,
        key: 1,
      };
      (yylength = 0), (yytext = "");
      continue;
    }
    (yylength += 1), (yytext += input[i]);
    if (input[i] === "\n") {
      number_line += 1;
    }
    i += 1;
  }
  const target = endStates.find((item) =>
    startState.ind.some((index) => index === item.index)
  );


  if (target) {
    tokens.push([number_line, target.action(yytext, TOKEN), yytext]);
  }  else if (preToken === TOKEN.COMMENT) {
    tokens.pop();
  }else {
    throw new Error(errorMsg(`Uncaught SyntaxError: Unexpected token ${input[i - 1]}， ${number_line }`));
  }

  console.log(
    "tokens stream: ",
    tokens.filter((item) => item[1] !== TOKEN.WHITE)
  );
  return tokens.filter((item) => item[1] !== TOKEN.WHITE);
}

function isExisted(
  src: number[],
  targets: { path?: number[]; isEnd?: boolean; ind?: number[] }[]
): [boolean, number] {
  // const left = src.reduce((pre, item) => pre + (1 << item), 0);
  let res: number;
  return [
    targets.some((item, index) => {
      // const right = item.ind.reduce((pre, m) => (1 << m) + pre, 0);
      if (item.ind.length !== src.length) return false;
      for (const i in item.ind) {
        if (item.ind[i] !== src[i]) {
          return false;
        }
      }
      res = index;
      return true;
    }),
    res,
  ];
}
