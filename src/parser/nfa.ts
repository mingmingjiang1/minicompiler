import chalk from "chalk";
import { atoi, getWhiteChar, transformCharacter } from "../utils";
import graph, {
  characters,
  connect,
  getEndofPath,
  Graph,
  mutipliy,
  Node,
  or,
  plus,
  VertexNode,
} from "./node";
const fs = require("fs");

const leafs: { index: number; action: Function }[] = [];

const resultGlobal: { pattern: string; action: string }[][] = [
  [
    {
      pattern: "[abcd]|[a-z][a-z0-9]+|[0-9]*test", // 括号只有可能作为捕获存在，所以|左右两侧的操作符，左侧的[a-z][a-z0-9]*先计算完一个节点M，即M|rjrjjr,然后计算M|r的Node N，push到stack内[N, jrjjr]
      action: "return 'ID'",
    },
  ],
  [
    {
      pattern: "[a-z][a-z0-9]*|rjrjjr", // 括号只有可能作为捕获存在，所以|左右两侧的操作符，左侧的[a-z][a-z0-9]*先计算完一个节点M，即M|rjrjjr,然后计算M|r的Node N，push到stack内[N, jrjjr]
      action: "return 'ID'",
    },
  ],
  [
    {
      pattern: "a|bc|d",
      action: "return 'ERROR'",
    },
  ],
  [
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
    //   pattern: "\\(", // 转义括号
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
      pattern: "a|[a-z]+",
      action: "return 'ERROR'",
    },
    // {
    //   pattern: "\\s",
    //   action: "return 'WHITE'",
  ],
  [
    {
      pattern: "a|bdef|c|xxxx|y", // 贪婪读取。一直读到下一个｜或者是(),需要贪婪匹配的一些符号，eg: |, (, [,对于a|b|c, 先用
      action: "return 'ERROR'",
    },
  ],
];

export function readToken(filename: string) {
  // 读取文件，获取正则规则和action
  const data = fs.readFileSync(filename);
  // /%%([\s\S]*)%%/g.test(data.toString());
  const matchIterator = data.toString().matchAll(/%%([\s\S]*?)%%/g);
  const matches: string[] = [];
  for (const item of matchIterator) {
    matches.push(item[1]);
  }
  console.log(matches[0], 222);
  fs.writeFileSync("/Users/bytedance/Desktop/icompiler/type.d.ts", matches[0]);
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

function flex(
  tokens: { pattern: string; action: string }[]
): [any[][], { index: number; action: Function }[]] {
  // 读取以p结尾的文件，过滤注释，解析由%%包裹的部分，即语法
  console.log(tokens, 999);
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
    //   pattern: "(", // 转义括号
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
    // {
    //   pattern: "a|[a-z]+",
    //   action: "return 'ERROR'",
    // },
    // {
    //   pattern: "\\s",
    //   action: "return 'WHITE'",
    // },
    // {
    //   pattern: "a|bdef|c|xxxx|y", // 贪婪读取。一直读到下一个｜或者是(),需要贪婪匹配的一些符号，eg: |, (, [,对于a|b|c, 先用
    //   action: "return 'ERROR'",
    // },
    // {
    //   pattern: "a|bc|d", //
    //   action: "return 'ERROR'",
    // },
    // {
    //   pattern: "a|[0-9]*&", // 括号只有可能作为捕获存在，所以|左右两侧的操作符，左侧的[a-z][a-z0-9]*先计算完一个节点M，即M|rjrjjr,然后计算M|r的Node N，push到stack内[N, jrjjr]
    //   action: "return 'ID'",
    // },
  ];

  const greedyRead = (char: string, s: string) => {
    return s.indexOf(char); // 返回下一个预期符号的位置的前一位
  };

  const node = new VertexNode(1, null);
  graph.addVertexNode(node, node.index);
  Graph.node_id = 2;
  for (const item of tokens) {
    // 遍历规则
    const { action } = item;
    let pattern = item.pattern;
    if (!pattern.length) {
      throw new Error("error: 规则模式不能为空");
    }

    let parentThesis: (string | VertexNode)[] = []; // 圆括号对应的包裹的字符
    let squareBracket: (string | VertexNode)[] = []; // 方括号对应的包裹的字符
    let squareBracketMode: boolean = false; // 方括号模式
    let outer = 0;
    function test(pattern: string, deepth: number) {
      let orMode = false;
      let stack: (string | VertexNode)[] = [];
      let i = 0;
      while (i < pattern.length) {
        switch (pattern[i]) {
          // support chars Regx
          case "]":
            squareBracketMode = false;
            let cur;
            // if ], pop until meet [
            while (cur !== "[") {
              // use
              cur = stack.pop();
              cur !== "[" && squareBracket.unshift(cur);
            }
            // console.log(squareBracket, 8888);
            let isBar = false;
            const stackForSquare: string[] = [];
            const chars = [];
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
            chars.push(...stackForSquare);
            const node2 = characters(chars);
            // graph.add_single_vertex(Graph.node_id - 1, null);

            stack.push(node2);
            squareBracket = [];
            break;
          case "|":
            // support or Regx
            // pop two tmies
            orMode = true;
            console.log("++++++", pattern);
            const pos = greedyRead("|", pattern.slice(i + 1)); // find next position
            console.log("889", i + 1, pos, pattern.slice(i + 1, pos + i + 1));
            const res = test(
              pos === -1
                ? pattern.slice(i + 1)
                : pattern.slice(i + 1, pos + 1 + i),
              deepth + 1
            );
            if (pos === -1) {
              i = pattern.length - 1;
            } else {
              i = pos + i;
              console.log("--------", i);
            }
            const head4 = stack.pop();
            const test2 = or(res as VertexNode, head4 as VertexNode);
            console.log(88888888888);
            stack.push(test2);
            break;
          case "*":
            const head = stack.pop();
            stack.push(mutipliy(head as VertexNode));
            break;
          case "[":
            // if [, push until meet ]
            stack.push(pattern[i]);
            squareBracketMode = true;
            break;
          case "+":
            const head3 = stack.pop();
            stack.push(head3);
            stack.push(plus(head3 as VertexNode));
            break;
          // case "?":
          //   // support optional Regx
          //   break;
          case "\\":
            // support translate character
            if (!squareBracketMode) {
              let node;
              if (pattern[i + 1] === "s") {
                // white character
                node = new VertexNode(Graph.node_id, " ");
                graph.addVertexNode(node, node.index);
                stack.push(node);
              } else if (pattern[i + 1] === "t") {
                // \t
                node = new VertexNode(Graph.node_id, "\t");
                graph.addVertexNode(node, node.index);
                stack.push(node);
              } else if (pattern[i + 1] === "n") {
                // \n
                node = new VertexNode(Graph.node_id, "\n");
                graph.addVertexNode(node, node.index);
                stack.push(node);
              }

              // if (pattern[i + 1] === "+") {
              //   // white character
              // } else if (pattern[i + 1] === "*") {
              //   // \t
              // }
              console.log(88888888)
              i += 1;
            }
          default:
            // plain character
            if (squareBracketMode) {
              console.log(999991, pattern[i]);
              if (transformCharacter(pattern[i])) {
                console.log("494949");
                i += 1;
                stack.push(getWhiteChar(pattern[i]));
              } else {
                stack.push(pattern[i]);
              }
            } else {
              const node3 = new VertexNode(Graph.node_id, pattern[i]);
              graph.addVertexNode(node3, node3.index);
              stack.push(node3);
            }
            break;
        }
        i++;
      }
      if (squareBracketMode) {
        // not meet ], can't translate [ directly, if inteiously, plz use /[ to translate
        throw new Error(
          `Uncaught SyntaxError: Invalid regular expression: missing /`
        );
      }

      // 构建边
      // 组合成一个新的大的NFA
      let start = stack.pop();
      if (deepth === 0) {
        console.log(getEndofPath(start as VertexNode).index);
        leafs.push({
          index: getEndofPath(start as VertexNode).index,
          action: new Function("yytext", "TOKEN", action),
        }); // 寻找叶子节点
      }
      console.log(chalk.green("leaf node: "), start, stack.length); // 在这里确定叶子节点,放置action动作，the element of top stack

      while (stack.length) {
        const cur = stack.pop();
        start = connect(cur as VertexNode, start as VertexNode);
        // start = connect((tmp as Node).index, (start as Node).index);
      }
      return start;
    }
    const start = test(pattern, outer);
    if (!node?.firstEdge) {
      node.firstEdge = new Node(
        (start as VertexNode).index,
        null,
        (start as VertexNode).edgeVal
      );
    } else {
      node.firstEdge = new Node(
        (start as VertexNode).index,
        node.firstEdge,
        (start as VertexNode).edgeVal
      );
    }
    console.log(chalk.green("start: "), start);
  }

  const ans: any[] = [];
  const paths: (string | string[])[][] = [];
  const vis: [number, number][] = [];
  console.log(leafs, 8485885);
  const edges = new Array(200).fill(0).map((item) => {
    return new Array(200).fill(0);
  });
  build_edges(node, [], ans, vis, [], paths, edges);
  console.log(edges[1][40], 222222);
  return [edges, leafs];
}

// flex([]);

function build_edges(
  root: VertexNode,
  res: (number | string)[],
  ans: any,
  vis: [number, number][],
  path: (string | string[])[],
  paths: (string | string[])[][],
  edges: any
) {
  // Union
  // 建图，需要对or特殊处理，对于or，需要遍历其邻接表
  // const edges = new Array(50).fill(0).map((item) => {
  //   return new Array(128).fill(0);
  // });
  // 获取邻接表
  res.push(root.index);
  path.push(root.edgeVal);

  if (leafs.find((leaf) => leaf.index === root.index)) {
    ans.push([...res]);
    paths.push([...path]);
  }

  let cur = root.firstEdge;
  while (cur) {
    if (vis.find((item) => item[0] === root.index && item[1] === cur.index)) {
      cur = cur.next;
      continue;
    }
    const node = graph.getVertex(cur.index);
    edges[root.index][cur.index] = Array.isArray(node.edgeVal)
      ? node.edgeVal.map((char) => (char === null ? null : atoi(char)))
      : node.edgeVal === null
      ? null
      : atoi(node.edgeVal);
    vis.push([root.index, cur.index]);
    // console.log(edges[root.index][cur.index], 9999, root.index, cur.index)
    // console.log(2222, cur.edge, root.edgeVal)
    build_edges(node, res, ans, vis, path, paths, edges);
    vis.pop();
    res.pop();
    path.pop();
    cur = cur.next;
  }
}

/* 
贪婪读取
明天做一些测试用例，然后把parser部分完结
commit一次
以及把semantic
*/
