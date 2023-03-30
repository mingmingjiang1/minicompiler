/* 
DFA
target：
写一个NFA->DFA,看情况只会写一个DFA也可以
输入: 字符流
eg:
int test() {
  int x = m + n;
  return x;
}

[type \s Identifier ( ) { \n \t Identifier \s Identifier \s + \s Identifier ; \n \t ]

输出：Token流

Token类

[
  {
    value: 原始值
    token: 类型
  }
]
*/

import { atoi, error, idCnt, success } from "./src/utils";
import { readToken } from "./src/nfa/node";
const chalk = require('chalk');


/** 0-9a-zA-Z'' */
// const edges = new Array(20).fill(0).map((item) => {
//   return new Array(75).fill(0);
// });

// edges[0][1] = atoi('i');
// edges[0][3] = null;
// edges[0][8] = null;
// edges[8][9] = idCnt('0', '9');

// edges[9][12] = null;
// edges[12][10] = null;
// edges[10][11] = idCnt('0', '9');

// edges[11][12] = null;

// edges[0][13] = null;
// edges[1][2] = atoi('f');
// // edges1[2][18] = 1;
// edges[3][4] = idCnt('a', 'z');
// edges[4][7] = null;
// edges[7][5] = null;
// edges[5][6] = [...idCnt('0', '9'), ...idCnt('a', 'z')];
// edges[6][7] = null;

// edges[13][14] = idCnt(':', '`'); // idCnt(':', '`')

const edges = readToken("./flex.p");
// get target state node from source node state by edge c
// 入参是某个节点
function getEndofEdges(state: number, c: number | null) {
  const res: number[] = [];
  let i = 0;
  for (const edge of edges[state]) {
    // console.log(111, edge);
    if (edge === null || edge || (edge !== null && edge.length)) {
      // 说明存在边
      if (edge === c || (edge !== null && edge.length >= 0 && edge?.includes(c))) {
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

success('get union NFA start nodes: ', getClosure([0], null));


// 所以edges得先确定

// epsilon closure
// 入参是节点状态集合
enum TOKEN {
  IF = 1,
  ID,
  NUM,
  ERROR,
  WHITE,
  LEFTBIG,
  RIGHTBIG,
  LEFTPARENT,
  RIGHTPARENT,
  SEMICOLON,
  COMMA,
  KEYWORD,
  TYPE,
}
const TOKENMAP = {
  [TOKEN.IF]: "IF",
  [TOKEN.ID]: "ID",
  [TOKEN.NUM]: "NUM",
  [TOKEN.ERROR]: "ERROR",
  [TOKEN.WHITE]: "WHITE",
  [TOKEN.LEFTBIG]: "LEFTBIG",
  [TOKEN.RIGHTBIG]: "RIGHTBIG",
  [TOKEN.LEFTPARENT]: "LEFTPARENT",
  [TOKEN.RIGHTPARENT]: "RIGHTPARENT",
  [TOKEN.SEMICOLON]: "SEMICOLON",
  [TOKEN.COMMA]: "COMMA",
  [TOKEN.KEYWORD]: "KEYWORD",
  [TOKEN.TYPE]: "TYPE",
};
const leafs: (TOKEN | boolean)[] = [
  false,
  false,
  TOKEN.IF,
  false,
  false,
  TOKEN.TYPE,
  false,
  false,
  false,
  false,
  false,
  TOKEN.KEYWORD,
  false,
  false,
  false,
  false,
  TOKEN.ID,
  false,
  false,
  false,
  false,
  TOKEN.NUM,
  false,
  TOKEN.ERROR,
  TOKEN.WHITE,
  TOKEN.LEFTBIG,
  TOKEN.RIGHTBIG,
  TOKEN.LEFTPARENT,
  TOKEN.RIGHTPARENT,
  TOKEN.SEMICOLON,
  TOKEN.COMMA,
  TOKEN.TYPE,
];
// const TOKENMAP = {
//   TOKEN.
// }
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

// console.log(111, DFAedge([0, 3, 13, 8], atoi('i'))); // [ 1, 4, 7, 5 ]
// console.log(DFAedge([0, 3, 13, 8], atoi('g'))); // [ 4, 7, 5 ]
// console.log(DFAedge([ 1, 4, 14, 7, 5 ], atoi('f'))); // [ 2, 6, 7, 5 ]
// console.log(DFAedge([ 1, 4, 14, 7, 5 ], atoi('z'))); // [ 6, 7, 5 ]
// console.log(DFAedge([ 1, 4, 14, 7, 5 ], atoi('0'))); // [ 6, 7, 5 ]
// console.log(DFAedge([9, 10, 12, 14], atoi('0'))); // [ 11, 12, 10 ]
// console.log(DFAedge([0, 3, 13, 8], atoi('`'))); // [14]
// console.log(atoi(' '), DFAedge([0, 3, 8, 13], atoi(' '))); // [15]
// console.log(DFAedge([0, 3, 8, 13], atoi('{'))); // [16]

// NFA模拟算法
// function getNFA(initState: number[], k: number, chars: number[]) {
//   let j = initState;
//   for (let i = 0;i < k;i++) {
//     // j是某一个节点状态的集合
//     j = DFAedge(j, chars[i]);
//   }
// }

// getNFA()

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
  }[][] = new Array(60).fill(0).map((item) => {
    return new Array(60);
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
      // console.log(e)
      // 如果存在这样的状态
      const [isExist, i] = isExisted(e, states);
      // console.log(char, trans[j], isExist, j, trans.length)
      if (isExist) {
        trans[j][char] = states[i];
      } else {
        p = p + 1;
        // states[p] = e;
        // console.log(j, char)
        if (e.includes(0)) {
          // 说明是终态
          const newE = {
            isEnd: true,
            ind: e,
            path: [char],
            key: p,
          };
          states[p] = newE;
        } else {
          const newE = {
            isEnd: false,
            ind: e,
            path: [char],
            key: p,
          };
          states[p] = newE;
        }
        trans[j][char] = states[p]; // trans[1][9] = 2, states[2] = []
      }
    }
    j = j + 1;
  }
  return trans;
}

// const trans = NFA2DFA(idCnt('\x00', '\x80'), [0, 3, 8, 13]);
const trans = NFA2DFA([...idCnt('0', 'z'), atoi(' '), atoi('{'), atoi('}'), atoi('('), atoi(')'), atoi(','), atoi(';')], getClosure([0], null))
// // console.log(leafs, 8787, leafs.length, leafs[8])
// // 后续在生成dfa的时候，如果存在叶子节点，且可能是多个nfa的叶子节点，需要优先级判断，以第一个nfa为基准

function scan(input: string) {
  let startState: {
    path?: number[];
    isEnd?: boolean;
    ind?: number[];
    key?: number;
  } = {
    // path: ,
    ind: [0, 3, 13, 8],
    isEnd: false,
    key: 1,
  };
  const path: string[] = []; // 存储原始字符
  const tokens: string[] = []; // 存储token
  let preState;
  let i  = 0;
  while (i < input.length) {
    let code: number;
    code = atoi(input[i]);
    // 特殊判断
    // console.log(startState, input[i])
    preState = startState;
    startState = trans[startState?.key][code];
    if(!startState || !trans[startState?.key]?.[code]) {
      const target = preState.ind.find((item) => Boolean(leafs[item]));
      error('该节点不存在对应输入的出边，上一个状态key%s，第%s个字符，%s： ', preState.key, i, input[i]);
      console.log(chalk.blue('可能该节点是叶子节点，也有可能是该节点确实是个死胡同'));
      if (target) {
        tokens.push(TOKENMAP[leafs[target] as TOKEN]);
        // console.log("是终态", leafs[target] && TOKENMAP[leafs[target] as TOKEN]);
      } 
      startState = {
        ind: [0, 3, 13, 8],
        isEnd: false,
        key: 1,
      };
      continue;
    }
    i += 1;
  }
  const target = startState.ind.find((item) => Boolean(leafs[item]));
  if (target) {
    // console.log("是终态", leafs[target] && TOKENMAP[leafs[target] as TOKEN]);
    tokens.push(TOKENMAP[leafs[target] as TOKEN]);
  } else {
    throw new Error(`Uncaught SyntaxError: Unexpected token ${input[i-1]}`);
  }
  // console.log(leafs[startState.key], startState.key, leafs);
  success("tokens stream: ", tokens);
}

scan("int test(int x, int y) { return x;}");

function isExisted(
  src: number[],
  targets: { path?: number[]; isEnd?: boolean; ind?: number[] }[]
): [boolean, number] {
  const left = src.reduce((pre, item) => pre + (1 << item), 0);
  let res: number;
  return [
    targets.some((item, index) => {
      const right = item.ind.reduce((pre, m) => (1 << m) + pre, 0);
      if (right === left) {
        res = index;
      }
      return right === left;
    }),
    res,
  ];
}

/* 
trans[startState][char] = nextState;
应该定制一些基本的dfa，如：
+
*
?
然后联合形成一个大的NFA，
然后得到大的NFA的edges
基于edges获取closure转换成dfa
还需要考虑的事情：
为了方便使用，需要留有yyval和yytext保留词素,在action里执行，生成token对象，包含yyval属性，
*/

