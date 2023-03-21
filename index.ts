import { ProductionType } from "./production";
import {
  Add_Class,
  Assign_Class,
  Expression_Class,
  Formal_Class,
  Function_Class,
  Indentifier_Class,
  Int_Contant_Class,
  Mutiply_Class,
  Program_Class,
  Return_Class,
} from "./tree";

export enum Token {
  TypeToken = 0,
  IdendifierToken = 1,
  ConstantToken = 2,
  KeywordToken = 3,
}


let matches: any[] = [];

// State的每一项
interface ItemType extends ProductionType {
  pointer: number; // 状态转移的指针
  expr: string; // 产生式整个表达式，eg：S->ES
}

class Item implements ItemType {
  public lfh;
  public rfh;
  public ind;
  public expr: string;
  public pointer: number;
  constructor(expr: string, ptr: number, ind: number) {
    this.expr = expr;
    this.pointer = ptr;
    const [l, r] = expr.split("->");
    this.lfh = l;
    this.rfh = r;
    this.ind = ind;
  }

  equal(item: Item) {
    if (this.pointer !== item.pointer) {
      return false;
    }
    let [l1, l2] = [0, 0];
    while (
      l1 < this.expr.length &&
      l2 < item.expr.length &&
      this.expr[l1] === item.expr[l2]
    ) {
      l1++;
      l2++;
    }
    return this.expr[l1++] === item.expr[l2++] && l1 === l2;
  }
}

const firstElements = (I: Set<Item>) => {
  const res: string[] = [];
  for (const i of I) {
    if (i.rfh[i.pointer] && !res.includes(i.rfh[i.pointer])) {
      res.push(i.rfh[i.pointer]);
    }
  }
  return res;
};

class Production implements ProductionType {
  public lfh: string;
  public rfh: string;
  public ind: number;
  constructor(expr: string) {
    try {
      if (!/->/.test(expr)) {
        console.log("eror: 不合法的推导式");
        return;
      }
      const [l, r] = expr.split("->");
      this.lfh = l;
      this.rfh = r;
    } catch (e) {
      console.log("eror: 不合法的推导式");
    }
  }
}

const isTermainl = (s: string): boolean => {
  return /[A-Z]/.test(s);
};

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
  private ind: number;
  private stack: number[] = [];
  private table: Record<string, Array<string>>;
  private tokenEnum: (string | Token)[];
  constructor() {
    this.table = {};
    this.states = new Map();
    this.ind = 1;
  }

  add_token_enum(tokenEnum: (string | Token)[]) {
    this.tokenEnum = tokenEnum;
  }

  // 添加production
  add_rule(expr: string) {
    this.states.set(this.ind++, new Production(expr));
  }

  printStates() {
    for (const state of this.states) {
      console.log(state);
    }
  }

  // LR(0)添加初始态
  prepare() {
    this.add_rule("E-S$");
  }

  // 计算closure
  build_closure(I: Set<Item>): [Set<Item>, number, number] {
    const queue: Item[] = [...I];
    let key = 0;
    let ptrKey = 0;
    let pre = 0;
    I.forEach((val) => {
      // key += (1 << val.ind) + ((1 << (val.pointer + 1)) << val.ind);
      ptrKey += 1 << (val.pointer + pre);
      console.log(ptrKey);
      pre += val.rfh.length;
    });
    I.forEach((val) => {
      key += 1 << val.ind;
    });
    while (queue.length) {
      const head = queue.pop();
      const cur = head!.rfh[head!.pointer];
      if (isTermainl(cur)) {
        // 遍历map
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
            key += 1 << ProductionEnum[item.lfh + "->" + item.rfh];
            ptrKey += 1 << (0 + pre);
            pre += item.rfh.length;
            const tmp = new Item(item.lfh + "->" + item.rfh, 0, _key);
            if (!hasTargetItem(I, tmp)) {
              queue.push(tmp);

              I.add(tmp);
            }
          }
        }
      }
    }
    // console.log(I, 'closure endding');
    return [I, key, ptrKey];
  }

  // 计算action(状态转移)
  goto(I: Set<Item>, X: string): [Set<Item>, number, number] {
    const J: Set<Item> = new Set();
    for (const i of I) {
      if (i.rfh[i.pointer] === X) {
        // const newI: Item = {
        //   ...i,
        //   pointer: i.pointer + 1,
        //   equal: i.equal,
        // };
        const newI = new Item(i.expr, i.pointer + 1, i.ind);
        J.add(newI);
      }
    }
    return this.build_closure(J);
  }

  reduce() {}

  // 处理输入，进行语法分析
  trace(input: string) {
    const symStack = [];
    this.stack.push(1); // 起始状态
    let i = 0;
    let s = input + "$";
    let sym = "";
    let curState = 1;
    const ast: AST[] = [];
    const Root = new Program_Class();
    let expressions = [],
      typeDeclartion = [],
      funcs = [],
      expr,
      return_type,
      formals = [];
    while (i < s.length && this.stack.length) {
      // if (['(', ')', 'x', ',', '$', 'S', 'L'].includes(s[i])) {
      let curAction;
      // if (/x/.test(s[i])) {
      //     curAction = this.table['x'][curState] as string;
      // } else {
      // console.log(
      //   222,
      //   curState,
      //   s[i],
      //   this.table[s[i]][curState],
      //   this.table[s[i]],
      //   999,
      //   this.stack
      // );
      curAction = this.table[s[i]][curState] as string;
      // }
      if (!curAction) {
        console.error("不支持该文法,请重新输入");
      }
      if (/s(\d+)/.test(curAction)) {
        // 则是shift
        curState = Number(RegExp.$1);
        this.stack.unshift(curState);
        symStack.unshift(s[i]);
        // sym += s[i];
        // ast.unshift({
        //   value: s[i],
        //   isLeaf: true,
        // });
        i++;
      } else if (/r(\d+)/.test(curAction)) {
        // 则是规约
        curState = Number(RegExp.$1);
        // 表达式bottom-up
        const production = this.states.get(curState);
        let tmp = production!.rfh.length;
        // const start = sym.indexOf(production.rfh);
        const children: AST[] = [];
        console.log(production.lfh + "->" + production.rfh);

        // 规约，弹出
        matches = [];
        while (tmp) {
          this.stack.shift();
          const cur = symStack.shift();
          matches.unshift(cur);
          tmp--;
          switch (production.lfh + "->" + production.rfh) {
            case ProductionEnummap[11]: // +运算
              // 四则运算 A->A+C, A->A*C
              break;
            case ProductionEnummap[12]: // *运算
              break;
            case ProductionEnummap[14]:
              // 常量
              break;
            case ProductionEnummap[15]:
              break;
            case ProductionEnummap[10]:
              break;
            case ProductionEnummap[5]:
              break;
            case ProductionEnummap[9]:
              break;
            case ProductionEnummap[4]:
              break;
            case ProductionEnummap[3]:
              if (cur instanceof Formal_Class) {
                console.log(cur);
              }
              // make func class
              // pop stack组装
              break;
          }
        }
        console.log(matches, "matches", production.rfh);
        switch (production.lfh + "->" + production.rfh) {
          case ProductionEnummap[11]: // +运算
            // 四则运算 A->A+C, A->A*C
            const arth1 = new Add_Class("plus");
            symStack.unshift(arth1);
            break;
          case ProductionEnummap[12]: // *运算
            const arth2 = new Mutiply_Class("plus");
            symStack.unshift(arth2);
            break;
          case ProductionEnummap[14]:
            // 常量
            const intClass = new Indentifier_Class("identifier");
            symStack.unshift(intClass);
            break;
          case ProductionEnummap[15]:
            const idClass = new Int_Contant_Class("constant");
            symStack.unshift(idClass);
            break;
          case ProductionEnummap[13]:
            // const idClass = new Int_Contant_Class("constant");
            symStack.unshift(matches[0]);
            break;
          case ProductionEnummap[10]:
            const returnClass = new Return_Class("return");
            symStack.unshift(returnClass);
            break;
          case ProductionEnummap[9]:
            console.log(matches[5].length, 7277);
            let tmp;
            if (matches?.[5]?.length) {
              tmp = [new Assign_Class("assign", "", "" as any), ...matches[5]];
            } else {
              tmp = [new Assign_Class("assign", "", "" as any), matches[5]];
            }
            symStack.unshift(tmp);
            break;
          case ProductionEnummap[4]:
            const formClass = new Formal_Class("param", production.rfh?.[0]);
            symStack.unshift(formClass);
            break;
          case ProductionEnummap[5]:
            // 处理多个参数
            formals.push(
              matches?.[0] ? matches[0] : {},
              new Formal_Class(production.rfh[0], production.rfh?.[1]),
            );
            symStack.unshift(formals);
            break;
          case ProductionEnummap[3]:
            // make func class
            const func = new Function_Class(
              "function",
              matches[3],
              matches[6],
              matches[0]
            );
            // pop stack组装
            // funcs.push(func);
            symStack.unshift(func);
            expressions = [];
            formals = [];
            break;
          case ProductionEnummap[2]:
            // 处理多个函数
            console.log(matches, 'end')
            if (matches[0].length) {
              Root.append_funcs(...matches[0], matches[2]);
            } else {
              Root.append_funcs(matches[0], matches[2]);
            }
            break;
          case ProductionEnummap[1]:
            // 处理多个参数\
            console.log(111, matches);
            symStack.unshift(matches[0]);
            // Root.append_func(matches[0]);
            break;
        }
        console.log(symStack);
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
        return Root;
      }
    }
    return false;
  }

  get_dfa() {
    const T: Set<State> = new Set(); // 状态集合T
    const E: Set<Edge> = new Set(); // 边集合
    const accept: Set<Edge> = new Set(); // 接受态集合
    const R: Set<{ State: State }> = new Set(); // 归约态集合
    let ind = 2;
    const keys: any[] = [];
    const [startItems, key, ptrKey] = this.build_closure(
      new Set([new Item("E->P$", 0, ProductionEnum["E->P$"])])
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
      const firstEles = firstElements(head.items);

      // 归约态处理
      if (!firstEles.length) {
        R.add({
          State: head,
        });
        continue;
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
        // if () { // 防止环状节点
        // console.log(J, key);
        // newState应该是查找集合
        console.log("start", firstE);
        console.dir(J, { depth: null });
        console.log("当前节点", ind);
        console.log("-----");
        // console.dir(head, { depth: null })
        console.log("end");
        const isRepeated = keys.find((item) => item.key === key);
        console.log(isRepeated, 8787, ptrKey, "ptrkey");
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
          console.log("出现重复key", key);
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
      this.table[token] = new Array(200);
    });

    // 接受态
    accept.forEach((item) => {
      this.table["$"][item.from.Iindex] = "accept";
    });
    // 归约态
    R.forEach((value) => {
      // console.log(value.State.items, value.State);
      value.State.items.forEach((item) => {
        Object.keys(this.table).forEach((key) => {
          this.table[key][value.State.Iindex] = "r" + item.ind;
        });
      });
    });
    // shift态
    E.forEach((value) => {
      this.table[value.value][value.from.Iindex] =
        "s" + (value.to as State).Iindex;
      // console.log('start: ', value.from.Iindex, '对应的状态是:', value.from.items, '=>', 'end: ', value.to.Iindex, '对应的状态是:', value.to.items, 'edge is: ', value.value)
    });
    // console.dir(this.table, { depth: null });
  }
}

const ProductionEnum = {
  ["E" + "->" + "P$"]: 0,
  ["P" + "->" + "F"]: 1,
  ["P" + "->" + "P" + ";" + "F"]: 2,
  ["F" +
  "->" +
  Token.TypeToken +
  Token.IdendifierToken +
  "(" +
  "O" +
  ")" +
  "{" +
  "B" +
  "}"]: 3,
  ["O" + "->" + Token.TypeToken + Token.IdendifierToken]: 4,
  ["O" + "->" + "O" + "," + Token.TypeToken + Token.IdendifierToken]: 5,
  // ["T" + "->" + Token.TypeToken + Token.IdendifierToken]: 6,
  // ["S" + "->" + Token.TypeToken + Token.IdendifierToken]: 7,
  // ["B" +
  // "->" +
  // Token.TypeToken +
  // Token.IdendifierToken +
  // "=" +
  // Token.ConstantToken +
  // ";" +
  // "B"]: 8, // assign
  ["B" +
  "->" +
  Token.TypeToken +
  Token.IdendifierToken +
  "=" +
  "A" +
  ";" +
  "B"]: 9, // 加减乘除 语句
  ["B" + "->" + Token.KeywordToken + Token.IdendifierToken + ";"]: 10, // return 语句
  ["A->A+C"]: 11,
  ["A->A*C"]: 12,
  ["A->C"]: 13,
  ["C" + "->" + Token.IdendifierToken]: 14,
  ["C" + "->" + Token.ConstantToken]: 15,
};

const ProductionEnummap = {
  0: "E" + "->" + "P$",
  1: "P" + "->" + "F",
  2: "P" + "->" + "P" + ";" + "F",
  3:
    "F" +
    "->" +
    Token.TypeToken +
    Token.IdendifierToken +
    "(" +
    "O" +
    ")" +
    "{" +
    "B" +
    "}",
  4: "O" + "->" + Token.TypeToken + Token.IdendifierToken, // 1
  5: "O" + "->" + "O" + "," + Token.TypeToken + Token.IdendifierToken, // 复数
  // 6: "T" + "->" + Token.TypeToken + Token.IdendifierToken,
  // 7: "S" + "->" + Token.TypeToken + Token.IdendifierToken,
  // 8: "B" +
  // "->" +
  // Token.TypeToken +
  // Token.IdendifierToken +
  // "=" +
  // Token.ConstantToken +
  // ";" +
  // "B", // assign
  9:
    "B" +
    "->" +
    Token.TypeToken +
    Token.IdendifierToken +
    "=" +
    "A" +
    ";" +
    "B", // 加减乘除 语句
  10: "B" + "->" + Token.KeywordToken + Token.IdendifierToken + ";", // return 语句
  11: "A->A+C",
  12: "A->A*C",
  13: "A->C",
  14: "C" + "->" + Token.IdendifierToken,
  15: "C" + "->" + Token.ConstantToken,
};

function main5() {
  const input = [
    Token.TypeToken, // 0
    Token.IdendifierToken, // 1
    "(",
    Token.TypeToken, // 0
    Token.IdendifierToken, // 1
    ")",
    "{",
    Token.TypeToken, // 0
    Token.IdendifierToken, // 1
    "=",
    Token.ConstantToken, // 2
    ";",
    // 测试四则运算start
    Token.TypeToken,
    Token.IdendifierToken, // 1
    "=",
    Token.IdendifierToken,
    "*",
    Token.IdendifierToken, // 2
    ";",
    // 测试四则运算end
    Token.KeywordToken, // 3
    Token.IdendifierToken, // 1
    ";",
    "}",
    ";",

    Token.TypeToken, // 0
    Token.IdendifierToken, // 1
    "(",
    Token.TypeToken, // 0
    Token.IdendifierToken, // 1
    ",",
    Token.TypeToken, // 0
    Token.IdendifierToken, // 1
    ")",
    "{",
    Token.TypeToken, // 0
    Token.IdendifierToken, // 1
    "=",
    Token.ConstantToken, // 2
    ";",
    Token.KeywordToken, // 3
    Token.IdendifierToken, // 1
    ";",
    "}",
  ];

  const parser = new Parser();
  /* 
  P: 程序
  S：类型声明：type 变量
  B：函数体，在这里包含几个表达式，赋值表达式和返回表达式
  */
  parser.add_token_enum([
    "{",
    "}",
    "S",
    "P",
    "B",
    "$",
    "(",
    ")",
    "=",
    ";",
    "F",
    ",",
    "M",
    "G",
    "T",
    "O",
    "A",
    "C",
    "Z",
    "*",
    "+",
    Token.ConstantToken,
    Token.IdendifierToken,
    Token.KeywordToken,
    Token.TypeToken,
  ]);

  parser.add_rule("P" + "->" + "F");
  parser.add_rule("P" + "->" + "P" + ";" + "F"); // 连续多个函数
  parser.add_rule(
    "F" +
      "->" +
      Token.TypeToken +
      Token.IdendifierToken +
      "(" +
      "O" +
      ")" +
      "{" +
      "B" +
      "}"
  ); // 返回类型声明，参数声明，{  函数体(表达式集合)  }
  parser.add_rule("O" + "->" + Token.TypeToken + Token.IdendifierToken);
  parser.add_rule(
    "O" + "->" + "O" + "," + Token.TypeToken + Token.IdendifierToken
  );
  // parser.add_rule("T" + "->" + Token.TypeToken + Token.IdendifierToken);
  // parser.add_rule("S" + "->" + Token.TypeToken + Token.IdendifierToken);
  // parser.add_rule(
  //   "B" +
  //     "->" +
  //     Token.TypeToken +
  //     Token.IdendifierToken +
  //     "=" +
  //     Token.ConstantToken +
  //     ";" +
  //     "B"
  // );
  parser.add_rule(
    "B" + "->" + Token.TypeToken + Token.IdendifierToken + "=" + "A" + ";" + "B"
  );
  parser.add_rule(
    "B" + "->" + Token.KeywordToken + Token.IdendifierToken + ";"
  );

  parser.add_rule("A->A+C");
  parser.add_rule("A->A*C");
  // parser.add_rule("C->C*Z");
  parser.add_rule("A->C");
  parser.add_rule("C" + "->" + Token.IdendifierToken);
  parser.add_rule("C" + "->" + Token.ConstantToken);

  parser.get_dfa();
  console.log(input.join(""), 1111);
  const ast = parser.trace([...input].join(""));
  console.dir(ast, { depth: null });
}

main5();

function test() {
  const input = [
    Token.TypeToken, // 0
    Token.IdendifierToken, // 1
    "(",
    Token.TypeToken, // 0
    Token.IdendifierToken, // 1
    ")",
    "{",
    Token.TypeToken, // 0
    Token.IdendifierToken, // 1
    "=",
    Token.ConstantToken, // 2
    ";",

    // 测试四则运算
    Token.IdendifierToken, // 1
    "=",
    Token.IdendifierToken + Token.IdendifierToken, // 2
    ";",

    Token.KeywordToken, // 3
    Token.IdendifierToken, // 1
    ";",
    "}",
  ];
  const s = `int test(int x) {
    int y = 3;
    return y;
  }`;
  const pattern =
    /(int|string)\s([a-zA-Z]+)\((int|string)\s([a-zA-Z]+)+\)\s{\n\s*(int|string)\s([a-zA-Z]+)\s=\s(\d+);\n\s*return\s([a-zA-Z]+);\n\s*}/;
  pattern.test(s);
  console.log(
    RegExp.$1,
    RegExp.$2,
    RegExp.$3,
    RegExp.$4,
    RegExp.$5,
    RegExp.$6,
    RegExp.$7,
    RegExp.$8,
    RegExp.$9
  );
}

// test();
