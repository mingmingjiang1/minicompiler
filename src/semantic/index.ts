import { scan } from "../../src/parser";
import {
  Program_Class,
} from "./tree";
import { cgenProgram } from "../gen/codegen";
import { TOKEN } from "../type";
import { success } from "../utils";
import { key2production, test as production2key } from "./enum";
import { cloneDeep, isEqual } from "lodash";
import { switchCase } from "./setUtil";
import { semanticmMain } from "./check";
import path from "path";

const fs = require("fs");

export const EMPTY = "ε";
const START = "E";
export const END = "$";

interface ProductionType {
  lfh: string;
  rfh: string[];
  ind: number;
}

let prevFollowSet = {};

// 读取action，在执行规约动作的时候push进action的左值入stack

// put right value in stack until reduce
function doAction(action: string, yyvalsp: any[], len: number) {
  // 这个函数是针对reduce执行的，执行对应的action
  const res = eval(action);
  // while (len) {
  //   yyvalsp.pop();
  // }
  yyvalsp.push(res);
  return;
}

let matches: any[] = [];

// State的每一项
interface ItemType extends ProductionType {
  pointer: number; // 状态转移的指针
}

class Item implements ItemType {
  public lfh;
  public rfh;
  public ind;
  public pointer: number;
  constructor(ptr: number, ind: number, lfh: string, rfh: string[]) {
    this.pointer = ptr;
    // const [l, r] = expr.split("->");
    this.lfh = lfh;
    this.rfh = rfh;
    this.ind = ind;
  }

  equal(item: Item) {
    if (this.pointer !== item.pointer) {
      return false;
    }
    let [l1, l2] = [0, 0];
    while (
      l1 < this.rfh.length &&
      l2 < item.rfh.length &&
      this.rfh[l1] === item.rfh[l2]
    ) {
      l1++;
      l2++;
    }
    return this.rfh[l1++] === item.rfh[l2++] && l1 === l2;
  }
}

const firstElements = (I: Set<Item>): [string[], boolean] => {
  const res: string[] = [];
  let flag = false;
  for (const i of I) {
    if (i.rfh[i.pointer] && !res.includes(i.rfh[i.pointer])) {
      // 存在终结态
      res.push(i.rfh[i.pointer]);
    } else if (!i.rfh[i.pointer]) {
      flag = true;
    }
  }
  return [res, flag];
};

export class Production implements ProductionType {
  public lfh: string;
  public rfh: string[];
  public ind: number;
  constructor(lfh: string, rfh: string[]) {
    try {
      this.lfh = lfh;
      this.rfh = rfh;
    } catch (e) {
      console.log("eror: 不合法的推导式");
      throw new Error("invalid production");
    }
  }
}

const hasTargetItem = (I: Set<Item>, target: Item) => {
  for (const i of I) {
    if (i.equal(target)) {
      return true;
    }
  }
  return false;
};

interface State {
  Iindex: number;
  items: Set<Item>;
  key: number;
  ptrKey: number | string;
}

interface Edge {
  from: State;
  to: State | string;
  value: string;
}

interface AST {
  value: string;
  isLeaf?: boolean;
  children?: AST[];
  type?: string | number; // 用于类型声明
  identifier?: string | number;
  features?: any;
  expressions?: any;
  typeDeclartion?: any;
}

class Parser {
  private states: Map<number, Production>;
  private statesReverse: Map<string, number>;
  private lfh2rfh: Map<string, { index: number; value: string[] }[]>;
  private ind: number;
  private stack: number[] = [];
  private table: Record<string, Array<string>>;
  private tokenEnum: (string | TOKEN)[];
  private nonTerminalSymbol: Set<string> = new Set();
  private terminalSymbol: Set<string | TOKEN>;
  private memo: Map<string, string[]>;
  private _firstSet: {
    [key: string]: Set<string>;
  } = {};
  private _followSet: {
    [key: string]: Set<string>;
  } = {};
  constructor() {
    this.table = {};
    this.states = new Map();
    this.statesReverse = new Map([["EP$", 0]]);
    this.lfh2rfh = new Map([]);
    this.ind = 0;
  }

  add_TOKEN_enum(tokenEnum: (string | TOKEN)[]) {
    this.tokenEnum = tokenEnum;
    this.terminalSymbol = new Set(tokenEnum.map(item => String(item)));
  }

  // 添加production
  add_rule(lfh: string, rfh: string[], index: number) {
    if (!this.tokenEnum.includes(lfh)) {
      this.tokenEnum.push(lfh);
      this.nonTerminalSymbol.add(lfh);
    }
    this.states.set(index, new Production(lfh, rfh));
    this.statesReverse.set(lfh + rfh, index);
    let tmp = this.lfh2rfh.get(lfh);
    if (!tmp) {
      tmp = [];
      this.lfh2rfh.set(lfh, tmp);
    }
    tmp.push({
      index: index,
      value: rfh,
    });

    // this.ind++;
  }

  isNonTermainl(s: string) {
    return this.nonTerminalSymbol.has(s);
  }

  // 计算closure
  build_closure(I: Set<Item>): [Set<Item>, number, string] {
    const queue: Item[] = [...I];
    let key = 0;
    const ptrKey = new Array(this.states.size).fill("0");
    let pre = "";
    I.forEach((val) => {
      // ptrKey += String(val.pointer);
      // const ind = this.statesReverse.get(val.lfh + val.rfh)
      const ind = val.ind;
      ptrKey[ind] = String(val.pointer);
      // pre += val.rfh.length;
    });
    I.forEach((val) => {
      key += 1 << val.ind;
    });
    while (queue.length) {
      const head = queue.pop();
      const cur = head!.rfh[head!.pointer];
      if (this.isNonTermainl(cur)) {
        // 如果是非终结符遍历map
        for (const [_ind, item] of this.states) {
          if (item?.lfh === cur) {
            let _key: any;
            for (const [ind, production] of this.states.entries()) {
              if (
                production.lfh + "->" + production.rfh ===
                item.lfh + "->" + item.rfh
              ) {
                _key = ind;
              }
            }
            key += 1 << production2key[item.lfh + "->" + item.rfh];
            // ptrKey += 1 << (0 + pre);
            const ind = this.statesReverse.get(item.lfh + item.rfh);
            ptrKey[ind] = "0";
            // pre += item.rfh.length;
            const tmp = new Item(0, _key, item.lfh, item.rfh);
            if (!hasTargetItem(I, tmp)) {
              queue.push(tmp);

              I.add(tmp);
            }
          }
        }
      }
    }
    return [I, key, ptrKey.join("")];
  }

  // 计算action(状态转移)
  goto(I: Set<Item>, X: string): [Set<Item>, number, string] {
    const J: Set<Item> = new Set();
    for (const i of I) {
      if (i.rfh[i.pointer] === X) {
        const newI = new Item(i.pointer + 1, i.ind, i.lfh, i.rfh);
        J.add(newI);
      }
    }
    return this.build_closure(J);
  }

  reduce() {}

  // for (const rfh of this.lfh2rfh.get(lfh)) {
  //   if (!this.isNonTermainl(rfh.value[0])) {
  //     ans.push(rfh.value[0]);
  //     // return ans;
  //   } else {
  //     for (const char of rfh.value) {
  //       // 遍历所有非终结符
  //       if (!this.lfh2rfh.get(char)) {
  //         // 说明是终结符
  //         continue;
  //       }
  //       const res = this.firstSet(char);
  //       if (res.length) {
  //         ans.push(...res);
  //         break;
  //         // return res;
  //       }
  //     }
  //   }
  // }

  _processFirst(nts: string, memo: Set<string>) {
    memo.add(nts);
    for (const grammarArr of this.lfh2rfh.get(nts)) {
      const len = grammarArr.value.length;
      for (let i = 0; i < len; i += 1) {
        const ch = grammarArr.value[i];
        if (this.terminalSymbol.has(ch)) {
          this._firstSet[nts].add(ch);
          break;
        } else {
          // console.log('----------, ', ch)
          if (i === 0 && ch === nts) {
            // 避免左递归
            break;
          }
          if (memo.has(ch)) {
            // 避免循环递归
            break;
          }
          
          this._processFirst(ch, memo);
          for (const v of this._firstSet[ch]) this._firstSet[nts].add(v);
          if (!this._firstSet[ch].has(EMPTY)) break;
        }
      }
    }
  }

  _processFollow(_nts: string) {
    // console.log(_nts, 1111)
    // 3 若存在一个表达式 X -> ABCD 则 Follow(A) 需要加上 First(B) - ε，若First(B) 包含 ε，则Follow(A) 需要加上 First(C) - ε，向右迭代... 迭代至表达式结束。
    for (const nts of this.nonTerminalSymbol) {
      for (let grammarArr of this.lfh2rfh.get(nts)) {
        const len = grammarArr.value.length;
        let index = -1;
        // 找到 B
        for (let i = 0; i < len; i += 1) {
          const ch = grammarArr.value[i];
          if (ch === _nts) {
            index = i;
            break;
          }
        }
        if (index === -1) continue;
        while (index + 1 < len) {
          const ch = grammarArr.value[index + 1];
          if (this.terminalSymbol.has(ch)) {
            // 终结符直接加入
            this._followSet[_nts].add(ch);
            break;
          } else {
            const set = this._firstSet[ch];
            // if (_nts === 'Arigthm' || _nts === 'Token') {
            //   console.log(77771, set)
            // }
            
            // const set2 = this._followSet[ch];
            // console.log(8888, set);
            // if (set.size === 0) {
            //   // 如果first(ch) === 空
            //   for (const v of Array.from(set2 || []))
            //   if (v !== EMPTY) this._followSet[_nts].add(v);
            // }
            for (const v of Array.from(set || []))
              if (v !== EMPTY) this._followSet[_nts].add(v);
            if (!set?.has(EMPTY)) break;
            index += 1;
          }
        }
      }
    }
    // 2 若存在一个产生式 X -> Y1Y2Y3...Yn 则  Follow(Yn) 集合需要加上 Follow(X) 集合，若 First (Yn) 包含 ε 则，向左迭代，即 Follow(Yn-1) 集合需要加上 Follow(X) 集合，若 First (Yn-1) 包含 ε 则，向左迭代... 迭代至表达式结束。
    const set = this._followSet[_nts];
    for (let grammarArr of this.lfh2rfh.get(_nts)) {
      const len = grammarArr.value.length;
      for (let i = len - 1; i >= 0; i -= 1) {
        const ch = grammarArr.value[i];
        if (this.terminalSymbol.has(ch)) break;
        const newSet = this._followSet[ch];
        for (let v of Array.from(set)) {
          if (!newSet) {
            // this._followSet[ch].add();
          }
          newSet?.add(v);
        }
        if (!this._firstSet?.[ch]?.has(EMPTY)) {
          break;
        }
      }
    }
  }

  // 求lfh的firstSet
  firstSet(lfh: string): string[] {
    const ans: string[] = [];
    for (const rfh of this.lfh2rfh.get(lfh)) {
      if (!this.isNonTermainl(rfh.value[0])) {
        ans.push(rfh.value[0]);
        // return ans;
      } else {
        for (const char of rfh.value) {
          // 遍历所有非终结符
          if (!this.lfh2rfh.get(char)) {
            // 说明是终结符
            continue;
          }
          const res = this.firstSet(char);
          if (res.length) {
            ans.push(...res);
            break;
            // return res;
          }
        }
      }
    }
    return ans;
  }

  // 求lfh对应的follow set
  /* 
    1. 将$放入结果中
    2. 对于当前lfh，寻找包含该lfh的所有其他产生shi，如果该产生shi作为其他产生shi的末尾，则当前lfh merge(followSet(该产生shi的lfh))；
    3. 否则，merge(firstSet(该产生shi的lfh的后面一位)，当然如果求得的结果为空，
    则继续followSet(该shi))
  */
  followSet(lfh: string, memo: Map<string, string[]>) {
    // 针对单个lfh求follow set
    const ans: string[] = [];
    const rfhs = this.lfh2rfh.get(lfh);
    for (const rfh of rfhs) {
      // 特殊处理$
      if (rfh.value.includes("$")) {
        rfh.value.pop();
        if (!ans.includes("$")) {
          ans.push("$");
        }
      }
    }

    if (memo.get(lfh)) {
      return memo.get(lfh);
    }

    // should exclude self ?
    for (const [_lfh, rfhs] of this.lfh2rfh) {
      // 遍历所有产生shi
      for (const rfh of rfhs) {
        // 遍历该lfh的所有可能性
        // lfh !== _lfh这个是防止自递归的
        const _copy = rfh.value.slice();
        if (rfh.value.includes("$")) {
          _copy.pop();
        }
        if (lfh === _copy[_copy.length - 1] && lfh === _lfh) {
          continue;
        }
        if (
          _copy.indexOf(lfh) !== -1 &&
          _copy.indexOf(lfh) === _copy.length - 1
        ) {
          // || this.firstSet(rfh[rfh.indexOf(lfh) + 1], this.lfh2rfh.get(rfh[rfh.indexOf(lfh)]));
          if (memo.get(_lfh)) {
            ans.push(...memo.get(_lfh));
          } else {
            const tmp = this.followSet(_lfh, memo);
            ans.push(...tmp);
          }
        } else if (
          _copy.indexOf(lfh) !== -1 &&
          !this.isNonTermainl(_copy[_copy.indexOf(lfh) + 1])
        ) {
          // 终结符
          ans.push(_copy[_copy.indexOf(lfh) + 1]);
        } else if (_copy.indexOf(lfh) !== -1) {
          let res1 = this.firstSet(_copy[_copy.indexOf(lfh) + 1]);

          const res2 = this.followSet(_copy[_copy.indexOf(lfh) + 1], memo);
          ans.push(...res1, ...res2);
        }
      }
    }
    const filteredAns: string[] = [];
    ans.forEach((item) => {
      if (!filteredAns.includes(item)) {
        filteredAns.push(item);
      }
    });
    // console.log('ending', lfh, filteredAns)
    memo.set(lfh, filteredAns);
    return ans;
  }

  startuildFirstSet() {
    for (let nts of this.nonTerminalSymbol) this._firstSet[nts] = new Set();
    for (let nts of this.nonTerminalSymbol) {
      const memo = new Set([]);
      this._processFirst(nts, memo);
    }
  }

  startBuildFollowSet() {
    for (let nts of this.nonTerminalSymbol) {
      this._followSet[nts] = new Set();
    }
    this._followSet[START].add(END);
    while (true) {
      let flag = false;
      for (let nts of this.nonTerminalSymbol) {
        this._processFollow(nts);
        if (isEqual(prevFollowSet, this._followSet)) flag = true;
        else flag = false;
        prevFollowSet = cloneDeep(this._followSet);
      }
      if (flag) break;
    }
  }

  // 处理输入，进行语法分析
  trace(input: [number, TOKEN | string, string][]) {
    const yyvalsp: any[] = [];
    this.stack.push(1); // 起始状态
    let i = 0;
    input.push([0, "$", "$"]);
    let curState = 1;
    while (i < input.length && this.stack.length) {
      let curAction;
      curAction = this.table[input[i][1]][curState] as string;
      if (!curAction) {
        console.log(curState)
        throw new Error(
          `syntax error at line ${input[i][0]}: unexpected token ${input[i][2]}`
        );
      }
      if (/s(\d+)/.test(curAction)) {
        // 则是shift
        curState = Number(RegExp.$1);
        this.stack.unshift(curState);
        yyvalsp.unshift(input[i]);
        i++;
      } else if (/r(\d+)/.test(curAction)) {
        // 则是规约
        curState = Number(RegExp.$1);
        // 表达式bottom-up
        const production = this.states.get(curState);
        let tmp = production!.rfh.length;
        // let res;
        const res = switchCase(production, key2production, yyvalsp);
        // 规约，弹出
        matches = [];
        while (tmp) {
          this.stack.shift();
          yyvalsp.shift();
          // matches.unshift(cur); // 全局变量，匹配匹配的字符，理想上设置成$$, $1, $2, ...,
          tmp--;
        }
        yyvalsp.unshift(res);
        // 规约跳转
        if (
          this.table[production!.lfh]?.[this.stack[0]]?.slice(1) !== undefined
        ) {
          this.stack.unshift(
            Number(this.table[production!.lfh][this.stack[0]]?.slice(1))
          );
        }
        curState = this.stack[0];
      } else if (!curAction) {
        return false;
      } else {
        success("sematic bingo!!!!");
        
        return new Program_Class(yyvalsp[0]);
      }
    }
    return false;
  }

  get_dfa(lr0?: boolean, slr?: boolean, lr1?: boolean) {
    this.startuildFirstSet();
    this.startBuildFollowSet();
    console.log('===============', this._firstSet, this._followSet);
    const T: Set<State> = new Set(); // 状态集合T
    const E: Set<Edge> = new Set(); // 边集合
    const accept: Set<Edge> = new Set(); // 接受态集合
    const R: Set<{ State: State }> = new Set(); // 归约态集合
    let ind = 2;
    const keys: any[] = [];
    const [startItems, key, ptrKey] = this.build_closure(
      new Set([new Item(0, production2key["E->Program $"], "E", ["Program", "$"])])
    );
    const queue: State[] = [
      {
        Iindex: 1,
        items: startItems,
        key,
        ptrKey,
      },
    ];
    while (queue.length) {
      const head: State = queue.pop() as State;
      const [firstEles, isReduce] = firstElements(head.items);
      // 归约态处理
      if (isReduce) {
        // success("reduce");
        R.add({
          State: head,
        });
        // console.log(head);
        // if (slr) {
        //   // slr文法, 在当前状态head，遇到超前查看符号_item,将用item进行规约
        //   for (const item of head.items) {
        //     for (const char of this.memo.get(item.lfh)) {
        //       console.log(char);
        //       R.add({
        //         State: head,
        //       });
        //     }
        //   }
        // } else {

        // }
      }
      for (const firstE of firstEles) {
        // const firstE = Iitem.rfh[Iitem.pointer];
        // if (firstE === '$' || !firstE) continue; // === '$'表示到了末尾，为空表示到了字符串末尾的下一位

        // 接受态处理
        if (firstE === "$") {
          accept.add({
            from: head,
            to: "accept",
            value: "$",
          });
          continue;
        }
        const [J, key, ptrKey] = this.goto(head!.items, firstE);
        const isRepeated = keys.find((item) => item.key === key);
        // console.log("=========", firstE, ptrKey, J, head, "=========");
        if (!isRepeated || (isRepeated && isRepeated.ptrKey !== ptrKey)) {
          // 条件1说明是相同集合，条件2说明是相同集合，但存在指针不同
          keys.push({
            key,
            ptrKey,
          });
          const newState = {
            Iindex: ind++,
            items: J,
            key,
            ptrKey,
          };
          E.add({
            from: head,
            to: newState,
            value: firstE,
          });
          queue.push(newState);
          T.add(newState);
        } else {
          // success("重复啦");
          for (const mm of T) {
            if (mm.key === key && mm.ptrKey === ptrKey) {
              const newState = {
                Iindex: mm.Iindex,
                items: J,
                key,
                ptrKey,
              };
              E.add({
                from: head,
                to: newState,
                value: firstE,
              });
            }
          }
        }
      }
    }

    // 初始化列表
    this.tokenEnum.map((token) => {
      this.table[token] = new Array(500);
    });

    // 接受态
    accept.forEach((item) => {
      this.table["$"][item.from.Iindex] = "accept";
    });
    // 归约态
    R.forEach((value) => {
      value.State.items.forEach((item) => {
        // 在状态I，遇到超前查看符号_item,将用item进行规约
        Object.keys(this.table).forEach((key) => {
          for (const char of Array.from(this._followSet[item.lfh])) {
            if (char === key && item.pointer >= item.rfh.length) {
              this.table[key][value.State.Iindex] = "r" + item.ind;
            }
          }
        });
      });
    });
    // shift态
    E.forEach((value) => {
      this.table[value.value][value.from.Iindex] = this.table[value.value][
        value.from.Iindex
      ]
        ? this.table[value.value][value.from.Iindex] +
          "s" +
          (value.to as State).Iindex
        : "s" + (value.to as State).Iindex;
      // console.log('start: ', value.from.Iindex, '对应的状态是:', value.from.items, '=>', 'end: ', value.to.Iindex, '对应的状态是:', value.to.items, 'edge is: ', value.value)
    });
  }
}

function main() {
  const targetFile = process.argv[2];
  const rootDir = process.argv[3];
  console.log(222, targetFile, rootDir, path.join(rootDir, targetFile));
  const data = fs.readFileSync(path.join(rootDir, targetFile));
  console.log(1111)
  const tokens = scan(data.toString());
  const parser = new Parser();

  // 符号理论上应该是根据semantic生成的
  parser.add_TOKEN_enum([
    "{",
    "}",
    "$",
    "(",
    ")",
    "*",
    "/",
    TOKEN.ASSIGN,
    ";",
    ",",
    "x",
    "*",
    "+",
    "-",
    "?",
    EMPTY,
    TOKEN.NUM,
    TOKEN.ID,
    TOKEN.KEYWORD,
    TOKEN.TYPE,
    TOKEN.ELSE,
    TOKEN.IF,
    TOKEN.COND,
    TOKEN.BOOL
  ]);

  Object.entries(production2key).forEach(([production, index]) => {
    const [l, r] = production.split("->");
    parser.add_rule(l, r.split(" "), index);
  });

  parser.get_dfa(false, false);
  const ast = parser.trace(tokens);
  console.dir(ast, { depth: null });
  if (ast) {
    ast.transverse();
    cgenProgram(ast, targetFile, rootDir);
    semanticmMain(ast);
  }
}

main();
