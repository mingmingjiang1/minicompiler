import chalk from "chalk";
import { atoi, transformCharacter, getWhiteChar } from "../utils";

const fs = require("fs");

function Multiply_NFA(base: Node) {
  // base是*标记的前一个节点
  console.log("base", base);
  let cur = base;
  while (cur.next) {
    cur = cur.next;
  }
  const node = new Node(base, null); // 叶子节点
  cur.next = node;
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
  return Multiply_NFA(res);
}

function Mutiple_NFA(s: string) {
  const node1 = new Node(null, null);
  const node2 = new Node(null);
  for (const char of s) {
    node2.inEdges.push(char);
  }
  node1.next = node2;
  // Connect_NFA(node1, nod)
  return node1;
}

function Or_NFA(a: Node, b: Node) {
  // 找到a和b的入度，给node1的next加2个元素；node2的入度加2个null
  // const node1 = new Node();
  const node2 = new Node(null);
}

// NFA的节点
class Node {
  static node_index: number = 0;
  public value: string;
  public next: Node | null;
  public inEdges: string[] = []; // 入度
  public index: number;
  public isEnd?: boolean = false;
  constructor(next: Node, edgeValue?: string) {
    edgeValue !== undefined && this.inEdges.push(edgeValue);
    this.next = next || null;
    this.index = Node.node_index++;
  }
}

// a | b

export function readToken(filename: string) {
  // 读取文件，获取正则规则和action
  const data = fs.readFileSync(filename);
  // /%%([\s\S]*)%%/g.test(data.toString());
  const matchIterator = data.toString().matchAll(/%%([\s\S]*?)%%/g);
  const matches: string[] = [];
  for (const item of matchIterator) {
    matches.push(item[1]);
  }
  // console.log(matches[0], 222, eval(matches[0]))
  const res = matches[1]
    .trim()
    .split("\n")
    .map((item) => {
      const res = item.split(/\s{2}/);
      return { pattern: res[0], action: res[1] };
    });
  return flex(res);
  // console.log(edges[8][9], edges[10][11], 2323);
}

// (if([a-z][a-z0-9])*) | ([0-9]+@[a-z]+\.com)
/* 
[i f ([a-z][a-z0-9]) * ]
遇到）应该取出，再放回去
*/

// 仅支持简单的正则
function flex(
  tokens: { pattern: string; action: string }[]
): [any[][], { action: string; index: number }[]] {
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
      pattern: "[:-`]",
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
  console.log(tokens);
  const startNode = new Node(null);
  const f = build_edges();
  let edges;
  let leafs = [];
  for (const item of tokens) {
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
    console.log(pattern.length, "s".length, 99999, `${pattern}`.length);
    while (i < pattern.length) {
      // if (pattern?.[i] === ")") {
      //   let start = stack.pop();
      //   while (stack.length && stack?.[stack.length - 1] !== "(") {
      //     const tmp = stack.pop();
      //     // parentThesis.unshift(tmp);
      //     start = Connect_NFA(tmp as Node, start as Node);
      //   }
      //   stack.pop(); // 还需要再把'('给pop一下
      //   stack.push(start);
      //   parentThesis = [];
      // } else
      if (pattern?.[i] === "]") {
        squareBracketMode = false;
        while (stack.length && stack?.[stack.length - 1] !== "[") {
          const tmp = stack.pop();
          squareBracket.unshift(tmp);
        }
        stack.pop(); // 还需要再把'['给pop一下
        console.log(chalk.green("遇到字符集: "), squareBracket);
        // const bar = squareBracket.indexOf('-');
        const chars = [];
        const stackForSquare: string[] = [];
        let isBar = false;
        for (let i = 0; i < squareBracket.length; i++) {
          if (isBar) {
            const tmp = stackForSquare.pop();
            for (
              let j = 0;
              j <=
              (squareBracket[i] as string).charCodeAt(0) -
                (tmp as string).charCodeAt(0);
              j++
            ) {
              chars.push(
                String.fromCharCode((tmp as string).charCodeAt(0) + j)
              );
            }
            isBar = false;
            continue;
          }
          if (squareBracket[i] === "-") {
            isBar = true;
            continue;
          }
          stackForSquare.push(squareBracket[i] as string);
        }
        console.log(stackForSquare);
        chars.push(...stackForSquare);
        const node1 = new Node(null, null);
        const node2 = new Node(null);
        for (const char of chars.join("")) {
          node2.inEdges.push(char);
        }
        stack.push(...[node1, node2]);
        // stack.push(Mutiple_NFA(chars.join("")));
        squareBracket = [];
      } else if (pattern?.[i] === "|") {
        // M | B
        // todo
      } else if (pattern[i] === "[") {
        squareBracketMode = true;
        stack.push(pattern[i]);
      } else if (squareBracketMode) {
        if (transformCharacter(pattern[i])) {
          i += 1;
          stack.push(getWhiteChar(pattern[i]));
        } else {
          stack.push(pattern[i]);
        }
      } else if (pattern[i] === "\\") {
        // 说明是转yi字符
        console.log("转yi字符", pattern[i], pattern[i + 1]);
        switch (pattern[i + 1]) {
          case "s":
            // 空白
            stack.push(Single_NFA(" ", false));
            break;
          case "t":
            // 空白
            stack.push(Single_NFA("\t", false));
          case "n":
            // 空白
            stack.push(Single_NFA("\n", false));
          // 多+一个1
        }
        i += 1;
        // else if (pattern[i] === "(" || pattern[i] === "[") {
        //   squareBracketMode = true;
        //   stack.push(pattern[i]);
        // }
      } else if (pattern[i] === "*") {
        // 修饰符
        const tmp = stack.pop(); // *标记的前一个字符
        stack.push(Multiply_NFA(tmp as Node));
      } else if (pattern[i] === "+") {
        const tmp = stack.pop(); //+标记的前一个字符
        stack.push(tmp);
        const test = Plus_NFA(tmp as Node);
        stack.push(test);
      } else {
        stack.push(Single_NFA(pattern[i], false));
      }
      i++;
    }
    // 构建边
    // 组合成一个新的大的NFA
    console.log(chalk.green("stack: "), stack); // 在这里确定叶子节点,放置action动作，the element of top stack
    let start = stack.pop();
    // (start as Node).isEnd = true;
    leafs.push({
      index: (start as Node).index,
      action,
    });
    while (stack.length) {
      const tmp = stack.pop();
      // parentThesis.unshift(tmp);
      start = Connect_NFA(tmp as Node, start as Node);
    }
    console.log(chalk.green("start: "), start);
    if (start) {
      edges = f(start as Node);
    }
  }
  console.log(edges[23][24])
  return [edges, leafs];
}

function build_edges() {
  // 为大的一个nfa构建边,目前仅支持50个节点，
  const edges = new Array(50).fill(0).map((item) => {
    return new Array(128).fill(0);
  });
  return function (node: Node) {
    edges[0][node.index] =
      node.inEdges.length && node.inEdges[0] !== null
        ? atoi(node.inEdges[0])
        : null; // 大的nfa起点到单一nfa的起点
    let cur = node;
    const memo: number[] = [];
    let flag = 0;
    node.index === 23 && console.log(node, 11111)
    while (cur.next && !memo.includes(cur.index)) {
      // 需要判断成环，链表
      // if (memo.includes(cur.index)) {
      // flag += 1;
      // } else {
      memo.push(cur.index);
      // }
      edges[cur.index][cur.next.index] = cur.next.inEdges.map((char) =>
        char === null ? null : atoi(char)
      );
      cur = cur.next;
    }
    return edges;
  };
}

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
2. action动作执行和Token枚举在flex.p中定义
3. yyval yytext
*/
