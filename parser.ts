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

const fs = require("fs");

/** 0-9a-zA-Z'' */
const edges = new Array(20).fill(0).map((item) => {
  return new Array(75).fill(0);
});

edges[0][1] = atoi('i');
edges[0][3] = null;
edges[0][8] = null;
edges[8][9] = idCnt('0', '9');

edges[9][12] = null;
edges[12][10] = null;
edges[10][11] = idCnt('0', '9');

edges[11][12] = null;

edges[0][13] = null;
edges[1][2] = atoi('f');
// edges1[2][18] = 1;
edges[3][4] = idCnt('a', 'z');
edges[4][7] = null;
edges[7][5] = null;
edges[5][6] = [...idCnt('0', '9'), ...idCnt('a', 'z')];
edges[6][7] = null;

edges[13][14] = idCnt(':', '`'); // 这里仅用64表示其他字符idCnt(':', '`')

function idCnt(start: string, end: string) {
  const res: number[] = [];
  let startIndex = atoi(start), endIndex = atoi(end);
  for (let i = startIndex; i <= endIndex; i++) {
    res.push(i);
  }
  return res;
}

function idCnt2(start: string, end: number) {
  const res: number[] = [];
  let startIndex = atoi(start);
  for (let i = startIndex; i <= end; i++) {
    res.push(i);
  }
  return res;
}

function atoi(s: string) {
  return s.charCodeAt(0) - '0'.charCodeAt(0);
}

// console.log(edges);

class baseDFA {
  constructor() {}
}

type char = string;

const charMap = [];

// get target state node from source node state by edge c
// 入参是某个节点
function getEndofEdges(state: number, c: number | null) {
  const res: number[] = [];
  let i = 0;
  for (const edge of edges[state]) {
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

console.log(getEndofEdges(1, atoi('f')), 999);

// 所以edges得先确定

// epsilon closure
// 入参是节点状态集合
enum TOKEN {
  IF = 1,
  ID,
  NUM,
  ERROR,
}
const TOKENMAP = {
  [TOKEN.IF]: "IF",
  [TOKEN.ID]: "ID",
  [TOKEN.NUM]: "NUM",
  [TOKEN.ERROR]: "ERROR",
};
const leafs: (TOKEN | boolean)[] = [
  false,
  false,
  TOKEN.IF,
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
];
// const TOKENMAP = {
//   TOKEN.
// }
function getClosure(S: number[], c: number | null) {
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

// console.log(getClosure([0], atoi('i')), 999);

function DFAedge(states: number[], c: number) {
  const from = states.reduce(
    (pre, state) => [...pre, ...getEndofEdges(state, c)],
    []
  );
  return getClosure(from, null);
}
console.log(111, DFAedge([0, 3, 8, 13], atoi('f'))); // [ 1, 4, 14, 7, 5 ]
console.log(DFAedge([0, 3, 8, 13], atoi('g'))); // [ 4, 14, 7, 5 ]
console.log(DFAedge([ 1, 4, 14, 7, 5 ], atoi('f'))); // [ 2, 6, 7, 5 ]
console.log(DFAedge([ 1, 4, 14, 7, 5 ], atoi('z'))); // [ 6, 7, 5 ]
console.log(DFAedge([ 1, 4, 14, 7, 5 ], 9)); // [ 6, 7, 5 ]
console.log(DFAedge([9, 10, 12, 14], 0)); // [ 11, 12, 10 ]
console.log(DFAedge([0, 3, 8, 13], atoi('`'))); // [14]

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
console.log("-----");
function NFA2DFA(alpabets: number[], initState: number[]) {
  const states: {
    path?: number[];
    isEnd?: boolean;
    ind?: number[];
    key?: number;
  }[] = new Array(20);
  const trans: {
    path?: number[];
    isEnd?: boolean;
    ind?: number[];
    key?: number;
  }[][] = new Array(9).fill(0).map((item) => {
    return new Array(9);
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
      // console.log(e, char, states[j])
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
        console.log(states[p]);
        trans[j][char] = states[p]; // trans[1][9] = 2, states[2] = []
      }
    }
    j = j + 1;
  }
  return trans;
}

const trans = NFA2DFA(idCnt('0', 'z'), [0, 3, 8, 13]);
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
    ind: [0, 3, 8, 13],
    isEnd: false,
    key: 1,
  };
  const path: string[] = []; // 存储原始字符
  const tokens: string[] = []; // 存储token
  for (let i = 0; i < input.length; i++) {
    let code: number;
    code = atoi(input[i]);
    // }
    // 特殊判断
    startState = trans[startState.key][code];
    console.log(startState, 9999, trans[1][code], code, input[i])
    if (!trans[startState.key]?.[code]) {
      throw new Error(`Uncaught SyntaxError: Unexpected token ${input[i-1]}`);
    }
  }
  // console.log(leafs[startState.key], startState.key, leafs);
  const target = startState.ind.find((item) => Boolean(leafs[item]));
  if (target) {
    console.log("是终态", leafs[target] && TOKENMAP[leafs[target] as TOKEN]);
  }
  console.log("endState: ", startState);
}

scan("[x232");

function isExisted(
  src: number[],
  targets: { path?: number[]; isEnd?: boolean; ind?: number[] }[]
): [boolean, number] {
  const left = src.reduce((pre, item) => pre + (1 << item), 0);
  let res: number;
  return [
    targets.some((item, index) => {
      const right = item.ind.reduce((pre, m) => (1 << m) + pre, 0);
      // console.log(left, right, 2222);
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
为了方便使用，需要留有yyval和yytext保留词素
*/

function Multiply_NFA(base: Node) {
  const node = new Node(base);
  return node;
}

function Single_NFA(inEdge: string, isLeaf?: boolean, leafValue?: string) {
  const node = new Node(null, inEdge);
  if (isLeaf) {
    node.value = leafValue;
  }
  return node;
}

function Connect_NFA(from: Node, to?: Node) {
  if (!to) {
    return from;
  }
  let cur = from;
  while (cur.next) {
    cur = cur.next;
  }
  cur.next = to;
  return from;
}

// x?
function Optional_NFA(base: Node) {}

function Plus_NFA(base: Node) {
  // 基于old新建节点
  let total = 0;
  let cur = base;
  let pre: Node = {
    ...cur,
    next: null,
    index: Node.node_index++,
  };
  const res = pre;
  while (cur.next) {
    const now: Node = {
      ...cur.next,
      next: null,
      index: Node.node_index++,
    };
    pre.next = now;
    pre = now;
    cur = cur.next;
  }
  return Connect_NFA(base, Multiply_NFA(res));
}

function Mutiple_NFA(s: string) {
  const node1 = new Node(null);
  const node2 = new Node(null);
  for (const char of s) {
    node2.inEdges.push(char);
  }
  node1.next = node2;
  return node1;
}

function Or_NFA(a: Node, b: Node) {}

// NFA的节点
class Node {
  static node_index: number = 0;
  public value: string;
  public next: Node | null;
  public inEdges: string[] = [];
  public index: number;
  constructor(next: Node, edgeValue?: string) {
    edgeValue && this.inEdges.push(edgeValue);
    this.next = next || null;
    this.index = Node.node_index++;
  }
}

// a | b

function readToken(filename: string) {
  // 读取文件，获取正则规则和action
  fs.readFile(filename, function (err: Error, data: any) {
    if (err) {
      console.log(err);
    }
    /%%(.*)%%/.test(data.toString());
    // console.log("读取到的数据：", RegExp.$1, data.toString());
  });
}

// readToken('./flex.p');

// (if([a-z][a-z0-9])*) | ([0-9]+@[a-z]+\.com)
/* 
[i f ([a-z][a-z0-9]) * ]
遇到）应该取出，再放回去
*/

// 仅支持简单的正则
function flex() {
  // 读取以p结尾的文件，过滤注释，解析由%%包裹的部分，即语法
  const result: { pattern: string; action: string }[] = [
    {
      pattern: "if",
      action: "console.log(111);return 222",
    },
    {
      pattern: "[a-z][a-z0-9]*",
      action: "return 'ID'",
    },
    {
      pattern: "[0-9]+",
      action: "return 'NUM'",
    },
    {
      pattern: ".",
      action: "return 'ERROR'",
    },
    // {
    //   pattern: "[a-z][a-z0-9]*|rjrjjr", // 括号只有可能作为捕获存在，所以|左右两侧的操作符，左侧的[a-z][a-z0-9]*先计算完一个节点M，即M|rjrjjr,然后计算M|r的Node N，push到stack内[N, jrjjr]
    //   action: "return 'ID'",
    // },
    // {
    //   pattern: "\\(",
    //   action: "console.log(111);return 222",
    // },
    // {
    //   pattern: "\\)",
    //   action: "console.log(111);return 222",
    // },
    // {
    //   pattern: "([a-z][a-z0-9]*) | (rjrjjr)",
    //   action: "return 'ID'",
    // },
    {
      pattern: "\\s",
      action: "return 'WHITE'",
    },
  ];
  const startNode = new Node(null);
  const f = build_edges();
  for (const item of result) {
    // let res: { type: string; value:  }[] = [];
    let stack: (string | Node)[] = [];
    // 遍历规则
    const { pattern, action } = item;
    if (!pattern.length) {
      throw new Error("error: 规则模式不能为空");
    }

    let i = 0;
    let parentThesis: (string | Node)[] = []; // 圆括号对应的包裹的字符
    let squareBracket: (string | Node)[] = []; // 方括号对应的包裹的字符
    let squareBracketMode: boolean = false;
    while (i < pattern.length) {
      if (pattern?.[i] === ")") {
        let start = stack.pop();
        while (stack.length && stack?.[stack.length - 1] !== "(") {
          const tmp = stack.pop();
          // parentThesis.unshift(tmp);
          start = Connect_NFA(tmp as Node, start as Node);
        }
        // console.log("括号", parentThesis, Node.node_index);
        stack.pop(); // 还需要再把'('给pop一下
        stack.push(start);
        parentThesis = [];
      } else if (pattern?.[i] === "]") {
        squareBracketMode = false;
        while (stack.length && stack?.[stack.length - 1] !== "[") {
          const tmp = stack.pop();
          squareBracket.unshift(tmp);
        }
        stack.pop(); // 还需要再把'('给pop一下
        const bar = squareBracket.indexOf('-');
        const chars = [];
        if (bar > 0) {
          for (let i = 0; i <= (squareBracket[bar+1] as string).charCodeAt(0) - (squareBracket[bar-1] as string).charCodeAt(0);i++) {
            chars.push(String.fromCharCode((squareBracket[bar - 1] as string).charCodeAt(0) + i));
          }
        }
        stack.push(Mutiple_NFA(chars.join('')));
        squareBracket = [];
      } else if (pattern?.[i] === "|") {
        // M | B
        // todo
      } else if (pattern[i] === "\\") {
        // 说明是转yi字符
        console.log("转yi字符");
        switch (pattern[i + 1]) {
          case "s":
            // 空白
            console.log("空白符s忽略");
          case "t":
            // 空白
            i += 1; // 多+一个1
        }
        // stack.push();
      } else if (pattern[i] === "(" || pattern[i] === "[") {
        squareBracketMode = true;
        stack.push(pattern[i]);
      } else if (squareBracketMode) {
        stack.push(pattern[i]);
      } else if (pattern[i] === "*") {
        // 修饰符
        console.log("****", stack);
        const tmp = stack.pop(); // *标记的前一个字符
        console.log("tmp", tmp);
        stack.push(Multiply_NFA(tmp as Node));
      } else if (pattern[i] === "+") {
        const tmp = stack.pop(); //+标记的前一个字符
        const test = Plus_NFA(tmp as Node);
        stack.push(test);
      } else {
        stack.push(Single_NFA(pattern[i], false));
      }
      i++;
    }
    // 构建边

    // stack.length &&
    //   res.push({
    //     type: "plain",
    //     value: [...stack].join(""),
    //   });
    // let stack2: Node[] = []; // 用于后续的stack
    // const result = [];
    // let node;
    // for (const item of stack) {
    //   switch (item.type) {
    //     case "plain":
    //       if (item.value === "*") {
    //         const tmp = stack2.pop(); // *标记的前一个字符
    //         node = Multiply_NFA(tmp);
    //         while (stack2.length) {
    //           node = Connect_NFA(stack2.pop(), node);
    //         }
    //       } else if (item.value === "+") {
    //         const tmp = stack2.pop(); //+标记的前一个字符
    //         node = Plus_NFA(tmp);
    //         while (stack2.length) {
    //           node = Connect_NFA(stack2.pop(), node);
    //         }
    //       } else if (item.value === ".") {
    //         // console.log('....')
    //         node = Mutiple_NFA('.');
    //       } else {
    //         // console.log(item.value)
    //         let pre = Single_NFA(
    //           true,
    //           item.value as string
    //         );
    //         const head = pre;
    //         for (let i = 1; i < item.value.length; i++) {
    //           node = Single_NFA(false, item.value[i]);
    //           pre.next = node;
    //           pre = node;
    //         }
    //         node = head;
    //       }
    //       break;
    //     case "square":
    //       if (typeof item.value === 'object') {
    //         for (const ob of item.value) {
    //           node = Mutiple_NFA(ob.value);
    //         }
    //       } else {
    //         node = Mutiple_NFA(item.value);
    //       }
    //       break;
    //   }
    //   result.push(node);
    //   stack2.push(node);
    // }
    // console.log(1111, node.next.next?.next);
    // 组合成一个新的大的NFA
    let start = stack.pop();
    while (stack.length) {
      const tmp = stack.pop();
      // parentThesis.unshift(tmp);
      start = Connect_NFA(tmp as Node, start as Node);
    }
    if (start) {
      const edges = f(start as Node);
      console.log('edges', edges);
    }
  }
}

function build_edges() {
  // 为大的一个nfa构建边,目前仅支持20个点，
  const edges = new Array(20).fill(0).map((item) => {
    return new Array(75).fill(0);
  });
  return function(node: Node) {
    console.log(node, 9999999);
    edges[0][node.index] = node.inEdges.length ? atoi(node.inEdges[0]) : null; // 大的nfa起点到单一nfa的起点
    let cur = node;
    const memo: number[] = [];
    while (cur.next && !memo.includes(cur.index)) {
      // 需要判断成环，链表
      console.log(cur, 'cur85858503483409', cur.next.inEdges.map(char => atoi(char)));
      memo.push(cur.index);
      edges[cur.index][cur.next.index] = cur.next.inEdges.map(char => atoi(char));
      cur = cur.next;
    }
    return edges;
  }
}
// const edges = new Array(20).fill(0).map((item) => {
//   return new Array(62).fill(0);
// });

// edges[0][1] = 18;
// edges[0][3] = 62;
// edges[0][8] = 62;
// edges[8][9] = idCnt(0, 9);

// edges[9][12] = 62;
// edges[12][10] = 62;
// edges[10][11] = idCnt(0, 9);

// edges[11][12] = 62;

// edges[0][13] = 62;
// edges[1][2] = 15;
// // edges1[2][18] = 1;
// edges[3][4] = idCnt(10, 35);
// edges[4][7] = 62;
// edges[7][5] = 62;
// edges[5][6] = idCnt(0, 35);
// edges[6][7] = 62;
// edges[1][2] = 15;

// edges[13][14] = idCnt(0, 62); // 这里仅用64表示其他字符

// flex();

/* 
简单写下dfa：
空白：(" " | "\n" | ""\t)+
if: if
identifer: [a-z][a-z0-9]*
else: else
type: int | string
=: =
+: +
*: *
;: ;


nfa打通这周，
周末nfa和sematic打通


3-27剩余的工作：
1. 标识叶子节点
*/
