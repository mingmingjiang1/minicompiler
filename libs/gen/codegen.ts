/* 目标代码生成 */
import {
  Add_Class,
  Assign_Class,
  Bool_Class,
  Branch_Class,
  Caller_Class,
  Cond_Class,
  Declare_Class,
  Div_Class,
  Expression_Class,
  Function_Class,
  Indentifier_Class,
  Int_Contant_Class,
  Mul_Class,
  Program_Class,
  Return_Class,
  Sub_Class,
} from "../semantic/tree";
import { findTargetEle, hasBranch } from "../utils";
import {
  ADD,
  ADDIU,
  BLT,
  DIV,
  EXIT,
  JAL,
  JR,
  JUMP,
  LOAD,
  LOADIM,
  MOVE,
  MUL,
  NOP,
  PRINTINT,
  PRINTSTR,
  STORE,
  SUB,
} from "./template";

const fs = require("fs");

interface Scope {
  scope: string[];
  next?: Scope[];
  parent?: Scope;
}

export function cgenCaller(
  e: Caller_Class,
  params?: string[], // 形式参数
  declarations?: Scope
) {
  let res = "";
  res += STORE(0, "$fp"); // "sw $30, 0($29)\n";
  res += ADDIU(-4); // "addiu $29, $29, -4\n";
  res += cgenParams(e.params, data, params, declarations);
  res += JAL(`f_${e.id}`); // `jal f_${e.id}\n`;
  return res;
}

export function cgenParams(
  e: Expression_Class,
  data: Data[],
  params: string[],
  declarations?: Scope
) {
  // 实参
  let res = "";
  // 逆转参数
  while (e) {
    res += switchCase(e, params, declarations);
    res += STORE(0); // "sw $a0, 0($29)\n"
    res += ADDIU(-4); // "addiu $29, $29, -4\n"; // 保存参数，但是这个参数可能是局部变量
    e = e.next as any;
  }
  return res;
}

export function cgenExpressions(
  e: Expression_Class,
  params?: string[],
  declarations?: Scope,
  label?: string
) {
  let res: string = "";
  while (e) {
    res += switchCase(e, params, declarations, label);
    if (e instanceof Branch_Class) break;
    e = e.next;
  }
  return res;
}

const data: Data[] = [
  {
    // 数据段
    padding: 0,
    key: "data",
    content: '.data\nnewLine:  .asciiz "\\n"\n',
    value: {},
  },
  {
    // 代码段
    padding: 0, // 本层级的
    key: "text",
    content:
      ".text            # text section\n\n.globl main                 # call main by SPIM\n", // 本层级的
    children: [
      // {
      //   padding: 0,
      //   content: "main:\n",
      //   key: "main",
      // },
    ],
  },
];

function genPadding(num: number) {
  let res = "";
  for (let i = 0; i < num; i++) {
    res += " ";
  }
  return res;
}

export interface Data {
  content: string;
  padding: number;
  children?: Data[];
  key: string;
  value?: {
    [key: string]: string;
  };
}

function cgenEnd(data: Data[] = []) {
  let res = "";
  for (const item of data) {
    const { padding, content, children } = item;
    res += genPadding(padding) + content;
    res += cgenEnd(children);
  }
  return res;
}

export function cgenProgram(
  e: Program_Class,
  fileName: string,
  rootDir: string
) {
  // initialize data and text, code gen entry
  cgenPrintFunction();
  const res = cgenExpressions(e.expr);
  // 说明存在全局的表达式
  // const main = findTargetEle("main", data);
  // if (main) {
  //   main.content += res + "li $v0, 10\nsyscall\n";
  // }
  const content = cgenEnd(data);
  fs.writeFileSync(
    `${rootDir}/${fileName
      .split("/")
      [fileName.split("/").length - 1].replace(/mc/g, "s")}`,
    content
  );
}

function cgenDiv(e: Sub_Class, params: string[], declarations?: Scope) {
  let res = "";
  res += switchCase(e.lvalue, params, declarations);
  res += STORE(0);
  res += ADDIU(-4);
  res += switchCase(e.rvalue, params, declarations);
  res += LOAD(4, "$t0", "$sp");
  res += ADDIU(4);
  res += DIV;
  return res;
}

function cgenMul(e: Sub_Class, params: string[], declarations?: Scope) {
  let res = "";
  res += switchCase(e.lvalue, params, declarations);
  res += STORE(0);
  res += ADDIU(-4);
  res += switchCase(e.rvalue, params, declarations);
  res += LOAD(4, "$t0", "$sp");
  res += ADDIU(4);
  res += MUL;
  return res;
}

function cgenSub(e: Sub_Class, params: string[], declarations?: Scope) {
  let res = "";
  res += switchCase(e.lvalue, params, declarations);
  res += STORE(0);
  res += ADDIU(-4);
  res += switchCase(e.rvalue, params, declarations);
  res += LOAD(4, "$t0", "$sp");
  res += ADDIU(4);
  res += SUB;
  return res;
}

function cgenAdd(e: Add_Class, params: string[], declarations?: Scope) {
  let res = "";
  res += switchCase(e.lvalue, params, declarations);
  res += STORE(0); // `sw $a0, 0($29)\n`;
  res += ADDIU(-4); // `addiu $29, $29, -4\n`;
  res += switchCase(e.rvalue, params, declarations);
  res += LOAD(4, "$t0", "$sp"); // `lw $t0, 4($29)\n`;
  res += ADDIU(4); // `addiu $29, $29, 4\n`;
  res += ADD; // `add $a0, $t0, $a0\n`;
  return res;
}

function cgenForIntContant(e: Int_Contant_Class) {
  // code gen for int const corresponding to using int
  let res = "";
  // res += // `li $a0, ${e.token}\n`;
  res += LOADIM(e.token);
  return res;
}

function cgenForID(
  e: Indentifier_Class,
  params: string[],
  declarations?: Scope
) {
  // code gen for id using corresponding to using id
  let res = "";
  let cur = declarations;
  let ans;
  let offset = 0;
  // load id to $a0, x
  // 说明是局部变量，
  while (cur) {
    const curScope = cur.scope;
    const isFind = curScope.indexOf(e.token);
    if (ans) {
      offset += cur.scope.length;
    }
    if (isFind !== -1) {
      ans = cur;
    }
    cur = cur.parent;
  }
  if (ans) {
    res += LOAD((ans.scope.indexOf(e.token) + offset + 1) * -4, "$a0", "$fp"); // `lw $a0, ${(ans.scope.indexOf(e.token) + offset + 1) * -4}($30)\n`;
    return res;
  }
  if (params.indexOf(e.token) !== -1) {
    // 说明是参数
    res += LOAD((params.indexOf(e.token) + 1) * 4, "$a0", "$fp"); // `lw $a0, ${(params.indexOf(e.token) + 1) * 4}($30)\n`;
  }
  return res;
}

// meet decalre statement，first gen right expression
function cgenForIDDeclartion(
  assign: Declare_Class,
  params: string[],
  declarations?: Scope
) {
  // code gen for Identifier declaration corresponding to id declaration
  let res = "";
  // declare id in text area
  const r = assign.r;
  res += switchCase(r, params, declarations);

  res += STORE(0); // `sw $a0, 0($29)\n`;
  res += ADDIU(-4); // `addiu $29, $29, -4\n`;
  return res;
}

function cgenForAssign(
  assign: Assign_Class,
  params: string[],
  declarations?: Scope
) {
  // code gen for Identifier declaration corresponding to id declaration
  let res = "";
  // declare id in text area
  const r = assign.r; // 获取右侧赋值表达式

  res += switchCase(r, params, declarations);

  let cur = declarations;
  let ans;
  let offset = 0;
  while (cur) {
    const curScope = cur.scope;
    const isFind = curScope.indexOf(assign.name.token);
    if (ans) {
      offset += cur.scope.length;
    }
    if (isFind !== -1) {
      ans = cur;
    }
    cur = cur.parent;
  }
  if (ans) {
    // res += `sw $a0, ${
    //   (ans.scope.indexOf(assign.name.token) + offset + 1) * -4
    // }($30)\n`;
    res += STORE(
      (ans.scope.indexOf(assign.name.token) + offset + 1) * -4,
      "$a0",
      "$fp"
    );
    return res;
  }
  if (params.indexOf(assign.name.token) !== -1) {
    // 说明是参数
    // res += `sw $a0, ${(params.indexOf(assign.name.token) + 1) * 4}($30)\n`;
    res += STORE((params.indexOf(assign.name.token) + 1) * 4, "$a0", "$fp");
  }

  return res;
}

/* 
  res += cgenExpressions(expr, params, declarations); // 存储结果在a0
  res += MOVE('$v0', '$a0') // `move $v0, $a0\n`;
  res += ADDIU(getTotalVar(declarations) * 4) // `addiu $29, $29, ${getTotalVar(declarations) * 4}\n`;
  res += LOAD(4, '$ra', '$sp') // `lw $31, 4($29)\n`; //
  res += ADDIU(params.length * 4 + 8) // `addiu $29, $29, ${params.length * 4 + 8}\n`;
  res += LOAD(0, '$fp', '$sp') // `lw $30, 0($29)\n`; //
*/

// 获取局部变量的总的个数
function getTotalVar(scopes: Scope) {
  let cnt = 0;
  let cur = scopes;
  while (cur) {
    cnt += cur.scope.length;
    cur = cur.parent;
  }
  return cnt;
}

export function cgenReturn(
  e: Return_Class,
  params: string[],
  declarations?: Scope // 当前作用域
) {
  let res = "";
  const expr = e.expr;

  res += cgenExpressions(expr, params, declarations); // 存储结果在a0
  // res += `move $v0, $a0\n`;
  res += MOVE("$v0", "$a0");

  // res += `addiu $29, $29, ${getTotalVar(declarations) * 4}\n`;
  res += ADDIU(getTotalVar(declarations) * 4);
  // res += `lw $31, 4($29)\n`; //
  res += LOAD(4, "$ra", "$sp");
  // res += `addiu $29, $29, ${params.length * 4 + 8}\n`;
  res += ADDIU(params.length * 4 + 8);
  //res += `lw $30, 0($29)\n`; //
  res += LOAD(0, "$fp", "$sp");
  res += JR;
  // res += `jr $31\n`;
  return res;
}

let cnt = 0;

export function cgenBranch(
  e: Branch_Class,
  params?: string[],
  parent?: Scope,
  label?: string
) {
  // 生成分支语法
  const cnt1 = ++cnt;
  // const cnt2 = ++cnt;
  let resTrue = ``;
  let children;
  let { ifCond, statementTrue, statementFalse } = e;

  // let cur: Scope = {
  //   scope: [],
  //   next: [],
  //   parent,
  // };

  resTrue += cgenExpressions(
    statementTrue,
    params,
    parent,
    e.next ? `common${cnt1}` : label
  );

  // parent?.next?.push(cur);

  let target = findTargetEle("text", data);
  if (target) {
    children = target.children;
  }

  // cur = {
  //   scope: [],
  //   next: [],
  //   parent,
  // };

  let resFalse = `statement_false${cnt1}:\n`;
  resFalse += cgenExpressions(
    statementFalse,
    params,
    parent,
    e.next ? `common${cnt1}` : label
  );

  // parent.next.push(cur);

  if (target) {
    children = target.children;
  }
  children.unshift({
    padding: 0,
    content:
      resFalse +
      (e.next ? JUMP(`common${cnt1}`) : label ? JUMP(label) : "\n") +
      NOP, // common承接，非根节点，false节点，往本层
    key: `common${cnt1}\n`,
  });

  let _common = e.next,
    common = `\ncommon${cnt1}:\n`;
  while (_common) {
    common += cgenExpressions(_common, params, parent);
    _common = _common.next;
  }

  if (target) {
    children = target.children;
  }
  e.next &&
    children.unshift({
      padding: 0,
      content: common + (label ? JUMP(label) : "\n"), // common承接，非根节点,应该往上一层
      key: `label${cnt}`,
    });

  const { op, lExpr, rExpr } = ifCond;
  let res = "";
  res += switchCase(lExpr, params, parent); // 加载左表达式
  res += STORE(0, "$a0", "$sp");
  res += ADDIU(-4);
  res += switchCase(rExpr, params, parent);
  res += LOAD(4, "$t0", "$sp");
  res += ADDIU(4);
  // res += `sw $a0, 0($29)\n`;
  // res += `addiu $29, $29, -4\n`;
  // res += switchCase(rExpr, params);
  // res += `lw $t0, 4($29)\n`;
  // res += `addiu $29, $29, 4\n`;
  switch (op) {
    case "==":
      res += `bne	$t0, $a0, statement_false${cnt1}\n`;
      res += `${resTrue}${
        e.next && !hasBranch(statementTrue) ? `b common${cnt1}\n` : "\n"
      }`;
      break;
    case ">=":
      res += `blt	$t0, $a0, statement_false${cnt1}\n`;
      res += `${resTrue}${
        e.next && !hasBranch(statementTrue) ? `b common${cnt1}\n` : "\n"
      }`;
      break;
    case ">":
      res += BLT(`statement_false${cnt1}`); // `blt	$t0, $a0, statement_false${cnt1}\n`;
      res += `${resTrue}${
        e.next && !hasBranch(statementTrue) ? JUMP(`common${cnt1}`) : "\n"
      }`; // 存在label说明不是最外层if-else,不存在e.next说明已经没有zi分支语句了
      break;
    case "<=":
      res += `bgt	$t0, $a0, statement_false${cnt1}\n`;
      res += `${resTrue}${
        e.next && !hasBranch(statementTrue) ? `b common${cnt1}\n` : "\n"
      }`;
      break;
    case "<":
      res += `bge	$t0, $a0, statement_false${cnt1}\n`;
      res += `${resTrue}${
        e.next && !hasBranch(statementTrue) ? `b common${cnt1}\n` : "\n"
      }`;
      break;
    case "!=":
      res += `beq	$t0, $a0, statement_false${cnt1}\n`;
      res += `${resTrue}${
        e.next && !hasBranch(statementTrue) ? `b common${cnt1}\n` : "\n"
      }`;
      break;
  }

  return res;
}

function cgenCondition(
  expr: Cond_Class,
  params?: string[],
  declarations?: Scope
) {
  let res = "";
  const { lExpr, rExpr, op } = expr;
  res += switchCase(lExpr, params, declarations);
  res += `sw $a0, 0($29)\n`;
  res += `addiu $29, $29, -4\n`;
  res += switchCase(rExpr, params, declarations);
  res += `lw $t0, 4($29)\n`;
  res += `addiu $29, $29, 4\n`;
  res += `sub $a0, $t0, $a0\n`;
  switch (op) {
    case "==":
      res += `seq $a0, $a0, $zero\n`; // if t0 < a0 => 1 else => 1
      break;
    case ">=":
      res += `sge $a0, $a0, $zero\n`;
      break;
    case ">":
      res += `sgt $a0, $a0, $zero\n`;
      break;
    case "<=":
      res += `sle $a0, $a0, $zero\n`;
      break;
    case "<":
      res += `slt $a0, $a0, $zero\n`;
      break;
    case "!=":
      res += `sne $a0, $a0, $zero\n`;
      break;
  }

  return res;
}

function switchCase(
  expr: Expression_Class,
  params?: string[],
  declarations?: Scope, // 当前作用域
  label?: string
) {
  let res = "";
  if (expr instanceof Sub_Class) {
    res += cgenSub(expr, params, declarations);
  } else if (expr instanceof Add_Class) {
    res += cgenAdd(expr, params, declarations);
  } else if (expr instanceof Div_Class) {
    res += cgenDiv(expr, params, declarations);
  } else if (expr instanceof Mul_Class) {
    res += cgenMul(expr, params, declarations);
  } else if (expr instanceof Declare_Class) {
    res += cgenForIDDeclartion(expr, params, declarations);
    declarations.scope.push(expr.name);
  } else if (expr instanceof Caller_Class) {
    res += cgenCaller(expr, params, declarations);
  } else if (expr instanceof Return_Class) {
    res += cgenReturn(expr, params, declarations);
  } else if (expr instanceof Indentifier_Class) {
    res += cgenForID(expr, params, declarations);
  } else if (expr instanceof Int_Contant_Class) {
    res += cgenForIntContant(expr);
  } else if (expr instanceof Cond_Class) {
    res += cgenCondition(expr, params, declarations);
  } else if (expr instanceof Function_Class) {
    cgenFunction(expr);
  } else if (expr instanceof Branch_Class) {
    res += cgenBranch(expr, params, declarations, label);
  } else if (expr instanceof Assign_Class) {
    res += cgenForAssign(expr, params, declarations);
  }

  return res;
}

export function cgenFunction(f: Function_Class) {
  // function definition
  // const declarations: string[] = [];
  const rootScope: Scope = {
    scope: [], // 最顶层是函数作用域
    next: [],
  };
  let res = f.name === "main" ? `${f.name}:\n` : `f_${f.name}:\n`;
  const { expressions, formals, formal_list } = f; // params是形式参
  const target = findTargetEle("text", data);
  let children;
  if (target) {
    children = target.children;
    // res += "move $30, $29\n";
    res += MOVE("$fp", "$sp");
    res += STORE(0, "$ra", "$sp");
    res += ADDIU(-4);
    // res += "sw $31, 0($29)\naddiu $29, $29, -4\n"; // return addr 放在栈顶
    res += cgenExpressions(
      expressions,
      formal_list.map((formal) => formal.id).reverse(),
      rootScope
    ); // 不可能是函数
  }
  // res += `lw $31, 4($29)\naddiu $29, $29, -${f.test.length * 4}\nlw $30, 0($29)\njr $31\n`; // 这里应该放置清空局部变量(n个)和参数以及return addr
  if (f.return_type === "void") {
    res += `move $v0, $a0\n`;
    res += `addiu $29, $29, ${rootScope.scope.length * 4}\n`;
    res += `lw $31, 4($29)\n`; //
    res += `addiu $29, $29, ${formal_list.length * 4 + 8}\n`;
    res += `lw $30, 0($29)\n`; //
    res += `jr $31\n`;
  }

  if (f.name === "main") {
    // res += `li $v0, 10\nsyscall\n`;
    res += EXIT;
  }
  children.unshift({
    padding: 0,
    content: res,
    key: "function",
  });
}

// print函数定义
export function cgenPrintFunction() {
  // function definition
  let res = `f_print:\n`;
  const target = findTargetEle("text", data);
  let children;
  if (target) {
    children = target.children;
    // res += "move $30, $29\nsw $31, 0($29)\naddiu $29, $29, -4\n"; // return addr 放在栈顶
    res += MOVE("$fp", "$sp");
    res += STORE(0, "$ra", "$sp");
    res += ADDIU(-4);
  }
  // res += `lw $a0, 8($29)\nli $v0, 1\nsyscall\nla $a0, newLine  \nli $v0, 4\nsyscall\n`;
  res += LOAD(8, "$a0", "$sp");
  res += PRINTINT;
  res += PRINTSTR;

  // res += `lw $31, 4($29)\naddiu $29, $29, ${
  //   1 * 4 + 8
  // }\nlw $30, 0($29)\njr $31\n`;

  res += LOAD(4, "$ra", "$sp");
  res += ADDIU(12);
  res += LOAD(0, "$fp", "$sp");
  res += JR;

  children.unshift({
    padding: 0,
    content: res,
    key: "function",
  });
}

/*
其实可以自顶向上，直接基于ast来做？
但是理论上也可以bottom-up，基于bison来做
  构建ast的生成？
  y = x + 2;
  yyval.codegen = cgen(x+2);

  x + 2

  x -> endChar
  yyval.codegen = cgen(endChar);

  2 -> endChar
  yyval.codegen = cgen(endChar); 
}

其实写在表达式里是可行的vible的，因为ast的类结构，本身就描述了该语言的语法结构，而ast本身又是由
生产式规定的结构，整个一套都是合法的
我们可以在ast的节点上，插入对应的codegen函数
*/
