/* 目标代码生成 */

import exp from "constants";
import {
  Add_Class,
  Assign_Class,
  Branch_Class,
  Caller_Class,
  Cond_Class,
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

// const hello = require('../../build/Release/addon.node');
const fs = require("fs");

// console.log(hello.parseInt32(32))
// console.log(hello.hello());

interface Scope {
  scope: string[];
  next?: Scope[];
  parent?: Scope;
}

export function cgenCaller(
  e: Caller_Class,
  data?: Data[],
  params?: string[], // 形式参数
  declarations?: Scope
) {
  let res = "";
  res += "sw $30, 0($29)\naddiu $29, $29, -4\n";
  res += cgenParams(e.params, data, params, declarations);
  res += `jal ${e.id}\n`;
  return res;
}

export function cgenParams(
  e: Expression_Class,
  data: Data[],
  params: string[],
  declarations?: Scope
) {
  // 实参
  let res = "",
    tmp;
  // 逆转参数
  console.log(declarations, 979797, params);
  while (e) {
    res += switchCase(e, data, params, declarations);
    res += "sw $a0, 0($29)\naddiu $29, $29, -4\n"; // 保存参数，但是这个参数可能是局部变量
    e = e.next as any;
  }
  return [res, tmp];
}

export function cgenExpressions(
  e: Expression_Class,
  data: Data[],
  params?: string[],
  declarations?: Scope
  // isBlock?: boolean,
  // blockDeclarations?: string[]
) {
  let res: string = "";
  while (e) {
    res += switchCase(e, data, params, declarations);
    // if (e instanceof Sub_Class) {
    //   res += cgenSub(e, data, params, declarations, isBlock, blockDeclarations);
    // } else if (e instanceof Add_Class) {
    //   res += cgenAdd(e, data, params, declarations, isBlock, blockDeclarations);
    // } else if (e instanceof Div_Class) {
    //   res += cgenDiv(e, data, params, declarations);
    // } else if (e instanceof Mul_Class) {
    //   res += cgenMul(e, data, params, declarations);
    // } else if (e instanceof Function_Class) {
    //   // 函数定义
    //   cgenFunction(e, data); // 因为函数声明只能在最外层，所以这里面直接做了把函数定义放在了text里
    // } else if (e instanceof Assign_Class) {
    //   res += cgenForIDDeclartion(e, data, params, declarations, isBlock, blockDeclarations);
    //   declarations.push(e.name);
    // } else if (e instanceof Caller_Class) {
    //   res += cgenCaller(e, data, params, declarations);
    // } else if (e instanceof Return_Class) {
    //   res += cgenReturn(e, data, params, declarations, isBlock, blockDeclarations);
    // } else if (e instanceof Indentifier_Class) {
    //   res += cgenForID(
    //     e,
    //     data,
    //     params,
    //     declarations,
    //     0,
    //     isBlock,
    //     blockDeclarations
    //   );
    // } else if (e instanceof Branch_Class) {
    //   res += cgenBranch(e, data, params, declarations);
    // } else if (e instanceof Int_Contant_Class) {
    //   res += cgenForIntContant(e);
    // } else if (e instanceof Cond_Class) {
    //   res += cgenCondition(e, data, params, declarations);
    // }
    e = e.next;
  }
  return res;
}

function cgenBase() {
  const data: Data[] = [
    {
      // 数据段
      padding: 0,
      key: "data",
      content: ".data\nnewLine:  .asciiz \"\\n\"\n",
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
  return data;
}

function genPadding(num: number) {
  let res = "";
  for (let i = 0; i < num; i++) {
    res += " ";
  }
  return res;
}

interface Data {
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

export function cgenProgram(e: Program_Class, fileName: string, rootDir: string) {
  // 初始化data and text, code gen entry
  const data = cgenBase();
  cgenPrintFunction(data);
  const res = cgenExpressions(e.expr, data);
  // 说明存在全局的表达式
  // const main = findTargetEle("main", data);
  // if (main) {
  //   main.content += res + "li $v0, 10\nsyscall\n";
  // }
  // console.log(9999777, main)
  /* 
    li $v0, 1
syscall
li $v0, 10
syscall

    */
  const content = cgenEnd(data);
  console.log(fileName, 7777775464, `${rootDir}/${fileName.split('/')[fileName.split('/').length - 1]}`)
  fs.writeFileSync(
    `${rootDir}/${fileName.split('/')[fileName.split('/').length - 1]}`,
    content
  );
}

function cgenDiv(
  e: Sub_Class,
  data: Data[],
  params: string[],
  declarations?: Scope
) {
  let res = "";
  res += switchCase(e.lvalue, data, params, declarations);
  res += `sw $a0, 0($29)\n`;
  res += `addiu $29, $29, -4\n`;
  res += switchCase(e.rvalue, data, params, declarations);
  res += `lw $t0, 4($29)\n`;
  res += `addiu $29, $29, 4\n`;
  res += `div $a0, $t0, $a0\n`;
  return res;
}

function cgenMul(
  e: Sub_Class,
  data: Data[],
  params: string[],
  declarations?: Scope
) {
  let res = "";
  res += switchCase(e.lvalue, data, params, declarations);
  res += `sw $a0, 0($29)\n`;
  res += `addiu $29, $29, -4\n`;
  res += switchCase(e.rvalue, data, params, declarations);
  res += `lw $t0, 4($29)\n`;
  res += `addiu $29, $29, 4\n`;
  res += `mul $a0, $t0, $a0\n`;
  return res;
}

function cgenSub(
  e: Sub_Class,
  data: Data[],
  params: string[],
  declarations?: Scope
) {
  console.log(1212121, declarations, e);
  let res = "";
  res += switchCase(e.lvalue, data, params, declarations);
  res += `sw $a0, 0($29)\n`;
  res += `addiu $29, $29, -4\n`;
  res += switchCase(e.rvalue, data, params, declarations);
  res += `lw $t0, 4($29)\n`;
  res += `addiu $29, $29, 4\n`;
  res += `sub $a0, $t0, $a0\n`;
  return res;
}

function cgenAdd(
  e: Add_Class,
  data: Data[],
  params: string[],
  declarations?: Scope
) {
  let res = "";
  res += switchCase(e.lvalue, data, params, declarations);
  res += `sw $a0, 0($29)\n`;
  res += `addiu $29, $29, -4\n`;
  res += switchCase(e.rvalue, data, params, declarations);
  res += `lw $t0, 4($29)\n`;
  res += `addiu $29, $29, 4\n`;
  res += `add $a0, $t0, $a0\n`;
  return res;
}

function cgenForIntContant(e: Int_Contant_Class, isBlock?: boolean) {
  // code gen for int const corresponding to using int
  let res = "";
  console.log(77777, e.token);
  res += `li $a0, ${e.token}\n`;
  return res;
}

function cgenForID(
  e: Indentifier_Class,
  data: Data[],
  params: string[],
  declarations?: Scope
) {
  // code gen for id using corresponding to using id
  let res = "";
  let cur = declarations;
  let ans;
  let offset = 0;
  // if (isBlock) {
  //   console.log('block', blockDeclarations, declarations);
  //   const target = findTargetEle("data", data);
  //   // load id to $a0, x
  //   if (blockDeclarations.indexOf(e.token) !== -1) {
  //     // 说明是局部变量，
  //     res += `lw $a0, ${
  //       (blockDeclarations.indexOf(e.token) + 1 + declarations.length) * -4 +
  //       offset +
  //       declarations.length
  //     }($30)\n`;
  //   } else if (params.indexOf(e.token) !== -1) {
  //     // 说明是参数
  //     res += `lw $a0, ${(params.indexOf(e.token) + 1) * 4}($30)\n`;
  //   }
  //   return res;
  // }
  console.log("------", params, declarations);
  const target = findTargetEle("data", data);
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
    res += `lw $a0, ${(ans.scope.indexOf(e.token) + offset + 1) * -4}($30)\n`;
    return res;
  }
  console.log("ans", ans);
  if (params.indexOf(e.token) !== -1) {
    // 说明是参数
    res += `lw $a0, ${(params.indexOf(e.token) + 1) * 4}($30)\n`;
  }
  return res;
  // [fn, param1, param2]，使用变量的时候应该从data里取变量，声明的时候，把变量存到data里
}

//遇到声明变量，先递生成右表达式的结构
function cgenForIDDeclartion(
  assign: Assign_Class,
  data: Data[],
  params: string[],
  declarations?: Scope
) {
  // code gen for Identifier declaration corresponding to id declaration
  let res = "";
  const target = findTargetEle("data", data);
  // declare id in text area
  const r = assign.r; // 获取右侧赋值表达式

  if (r instanceof Sub_Class) {
    res += cgenSub(r, data, params, declarations); // 结果存到a0
  } else if (r instanceof Add_Class) {
    res += cgenAdd(r, data, params, declarations); // 结果存到a0
  } else if (r instanceof Div_Class) {
    res += cgenDiv(r, data, params, declarations);
  } else if (r instanceof Mul_Class) {
    res += cgenMul(r, data, params, declarations);
  } else if (r instanceof Int_Contant_Class) {
    res += cgenForIntContant(r); // 结果存到a0
  } else if (r instanceof Indentifier_Class) {
    res += cgenForID(r, data, params, declarations); // 结果存到a0
  } else if (r instanceof Caller_Class) {
    res += cgenCaller(r, data, params, declarations);
  }
  // res += switchCase(r, data, params, declarations);

  res += `sw $a0, 0($29)\n`;
  res += `addiu $29, $29, -4\n`;
  return res;
}

// 获取局部变量的总的个数
function getTotalVar(scopes: Scope) {
  console.log(scopes, 9999);
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
  data: Data[],
  params: string[],
  declarations?: Scope // 当前作用域
) {
  let res = "";
  const expr = e.expr;

  res += cgenExpressions(expr, data, params, declarations); // 存储结果在a0
  res += `move $v0, $a0\n`;
  res += `addiu $29, $29, ${getTotalVar(declarations) * 4}\n`;
  res += `lw $31, 4($29)\n`; //
  res += `addiu $29, $29, ${params.length * 4 + 8}\n`;
  res += `lw $30, 0($29)\n`; //
  res += `jr $31\n`;
  return res;
}

let cnt = 0;

export function cgenBranch(
  e: Branch_Class,
  data: Data[],
  params?: string[],
  parent?: Scope
) {
  // 生成分支语法
  const cnt1 = ++cnt;
  const cnt2 = ++cnt;
  let resTrue = `statement${cnt1}:\n`;
  let children;
  let { ifCond, statementTrue, statementFalse } = e;

  let cur: Scope = {
    scope: [],
    next: [],
    parent,
  };

  let hasReturnForTrue = false,
    hasReturnForFalse = false;

  while (statementTrue) {
    if (statementTrue instanceof Sub_Class) {
      resTrue += cgenSub(statementTrue, data, params, cur);
    } else if (statementTrue instanceof Add_Class) {
      resTrue += cgenAdd(statementTrue, data, params, cur);
    } else if (statementTrue instanceof Div_Class) {
      resTrue += cgenDiv(statementTrue, data, params, cur);
    } else if (statementTrue instanceof Mul_Class) {
      resTrue += cgenMul(statementTrue, data, params, cur);
    } else if (statementTrue instanceof Assign_Class) {
      console.log("if 语句", statementTrue, e);
      resTrue += cgenForIDDeclartion(statementTrue, data, params, cur);
      cur.scope.push(statementTrue.name);
    } else if (statementTrue instanceof Caller_Class) {
      resTrue += cgenCaller(statementTrue, data, params, cur);
    } else if (statementTrue instanceof Return_Class) {
      resTrue += cgenReturn(statementTrue, data, params, cur);
      hasReturnForTrue = true;
      break; // 遇到return语句一定结束
    } else if (statementTrue instanceof Indentifier_Class) {
      resTrue += cgenForID(statementTrue, data, params);
    } else if (statementTrue instanceof Branch_Class) {
      resTrue += cgenBranch(statementTrue, data, params, cur);
    }
    statementTrue = statementTrue.next;
  }

  if (!hasReturnForTrue) {
  }

  parent?.next?.push(cur);

  let target = findTargetEle("text", data);
  if (target) {
    children = target.children;
  }
  children.push({
    padding: 0,
    content: resTrue,
    key: `statement${cnt1}`,
  });

  let resFalse = `statement${cnt2}:\n`;

  cur = {
    scope: [],
    next: [],
    parent,
  };

  while (statementFalse) {
    if (statementFalse instanceof Sub_Class) {
      resFalse += cgenSub(statementFalse, data, params, cur);
    } else if (statementFalse instanceof Add_Class) {
      resFalse += cgenAdd(statementFalse, data, params, cur);
    } else if (statementFalse instanceof Div_Class) {
      resFalse += cgenDiv(statementFalse, data, params, cur);
    } else if (statementFalse instanceof Mul_Class) {
      resFalse += cgenMul(statementFalse, data, params, cur);
    } else if (statementFalse instanceof Assign_Class) {
      console.log("else 语句", statementFalse, e);
      resFalse += cgenForIDDeclartion(statementFalse, data, params, cur);
      cur.scope.push(statementFalse.name);
      // declarations.push(statementFalse.name);
    } else if (statementFalse instanceof Caller_Class) {
      resFalse += cgenCaller(statementFalse, data, params, cur);
    } else if (statementFalse instanceof Return_Class) {
      resFalse += cgenReturn(statementFalse, data, params, cur);
      hasReturnForFalse = true;
    } else if (statementFalse instanceof Indentifier_Class) {
      resFalse += cgenForID(statementFalse, data, params);
    } else if (statementFalse instanceof Branch_Class) {
      resFalse += cgenBranch(statementFalse, data, params, cur);
      const target = findTargetEle("text", data);
      if (target) {
        console.log(
          target.children.find((item) => item.key === `statement2`),
          22222
        );
      }
    }
    statementFalse = statementFalse.next;
  }

  parent.next.push(cur);

  if (!hasReturnForFalse) {
  }

  target = findTargetEle("text", data);
  if (target) {
    children = target.children;
  }
  children.push({
    padding: 0,
    content: resFalse,
    key: `statement${cnt2}`,
  });

  const { op, lExpr, rExpr } = ifCond;
  let res = "";

  switch (op) {
    case "==":
      res += switchCase(lExpr, data, params);
      // res += cgenForID(lExpr as any, data, params, declarations);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `beq	$t0, $a0, statement${cnt1}\nb statement${cnt2}\n`;
      break;
    case ">=":
      res += switchCase(lExpr, data, params);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `bge	$t0, $a0, statement${cnt1}\nb statement${cnt2}\n`;
      break;
    case ">":
      res += switchCase(lExpr, data, params);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `bgt	$t0, $a0, statement${cnt1}\nb statement${cnt2}\n`;
      break;
    case "<=":
      res += switchCase(lExpr, data, params);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `ble	$t0, $a0, statement${cnt1}\nb statement${cnt2}\n`;
      break;
    case "<":
      res += switchCase(lExpr, data, params);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `blt	$t0, $a0, statement${cnt1}\nb statement${cnt2}\n`;
      break;
    case "!=":
      res += switchCase(lExpr, data, params);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `bnt	$t0, $a0, statement${cnt1}\nb statement${cnt2}\n`;
      break;
  }

  return res;
}

function findTargetEle(key: string, data: Data[] = []): false | Data {
  for (const item of data) {
    const { padding, key: cnt, children } = item;
    if (key === cnt) {
      return item;
    }
    const res = findTargetEle(key, children);
    if (res) {
      return res;
    }
  }
  return false;
}

function cgenCondition(
  expr: Cond_Class,
  data: Data[],
  params?: string[],
  declarations?: Scope
) {
  let res = "";
  const { lExpr, rExpr, op } = expr;

  switch (op) {
    case "==":
      res += switchCase(lExpr, data, params, declarations);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params, declarations);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `sub $a0, $t0, $a0\n`;
      res += `seq $a0, $a0, $zero\n`; // if t0 < a0 => 1 else => 1
      break;
    case ">=":
      res += switchCase(lExpr, data, params, declarations);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params, declarations);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `sub $a0, $t0, $a0\n`;
      res += `sge $a0, $a0, $zero\n`;
      break;
    case ">":
      res += switchCase(lExpr, data, params, declarations);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params, declarations);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `sub $a0, $t0, $a0\n`;
      res += `sgt $a0, $a0, $zero\n`;
      break;
    case "<=":
      res += switchCase(lExpr, data, params, declarations);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params, declarations);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `sub $a0, $t0, $a0\n`;
      res += `sle $a0, $a0, $zero\n`;
      break;
    case "<":
      res += switchCase(lExpr, data, params, declarations);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params, declarations);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `sub $a0, $t0, $a0\n`;
      res += `slt $a0, $a0, $zero\n`;
      break;
  }

  return res;
}

let target: any;
function switchCase(
  expr: Expression_Class,
  data: Data[] = [],
  params?: string[],
  declarations?: Scope // 当前作用域
) {
  let res = "";
  if (expr instanceof Sub_Class) {
    res += cgenSub(expr, data, params, declarations);
  } else if (expr instanceof Add_Class) {
    res += cgenAdd(expr, data, params, declarations);
  } else if (expr instanceof Div_Class) {
    res += cgenDiv(expr, data, params, declarations);
  } else if (expr instanceof Mul_Class) {
    res += cgenMul(expr, data, params, declarations);
  } else if (expr instanceof Assign_Class) {
    res += cgenForIDDeclartion(expr, data, params, declarations);
    declarations.scope.push(expr.name);
  } else if (expr instanceof Caller_Class) {
    res += cgenCaller(expr, data, params, declarations);
    console.log(77777, declarations.scope);
  } else if (expr instanceof Return_Class) {
    res += cgenReturn(expr, data, params, declarations);
    if (target) {
      // 说明之前出现分支语句了
      // target.content += res;
      console.log(target.content, "++++++++", res);
    }
  } else if (expr instanceof Indentifier_Class) {
    res += cgenForID(expr, data, params, declarations);
  } else if (expr instanceof Int_Contant_Class) {
    res += cgenForIntContant(expr);
  } else if (expr instanceof Cond_Class) {
    res += cgenCondition(expr, data, params, declarations);
  } else if (expr instanceof Function_Class) {
    cgenFunction(expr, data);
  } else if (expr instanceof Branch_Class) {
    res += cgenBranch(expr, data, params, declarations);
  }

  return res;
}

// if (e instanceof Sub_Class) {
//   res += cgenSub(e, data, params, declarations, isBlock, blockDeclarations);
// } else if (e instanceof Add_Class) {
//   res += cgenAdd(e, data, params, declarations, isBlock, blockDeclarations);
// } else if (e instanceof Div_Class) {
//   res += cgenDiv(e, data, params, declarations);
// } else if (e instanceof Mul_Class) {
//   res += cgenMul(e, data, params, declarations);
// } else if (e instanceof Function_Class) {
//   // 函数定义
//   cgenFunction(e, data); // 因为函数声明只能在最外层，所以这里面直接做了把函数定义放在了text里
// } else if (e instanceof Assign_Class) {
//   res += cgenForIDDeclartion(e, data, params, declarations, isBlock, blockDeclarations);
//   declarations.push(e.name);
// } else if (e instanceof Caller_Class) {
//   res += cgenCaller(e, data, params, declarations);
// } else if (e instanceof Return_Class) {
//   res += cgenReturn(e, data, params, declarations, isBlock, blockDeclarations);
// } else if (e instanceof Indentifier_Class) {
//   res += cgenForID(
//     e,
//     data,
//     params,
//     declarations,
//     0,
//     isBlock,
//     blockDeclarations
//   );
// } else if (e instanceof Branch_Class) {
//   res += cgenBranch(e, data, params, declarations);
// } else if (e instanceof Int_Contant_Class) {
//   res += cgenForIntContant(e);
// } else if (e instanceof Cond_Class) {
//   res += cgenCondition(e, data, params, declarations);
// }

export function cgenFunction(f: Function_Class, data: Data[]) {
  // function definition
  // const declarations: string[] = [];
  const rootScope: Scope = {
    scope: [], // 最顶层是函数作用域
    next: [],
  };
  let res = `${f.name}:\n`;
  const { expressions, formals, formal_list } = f; // params是形式参
  const target = findTargetEle("text", data);
  let children;
  if (target) {
    children = target.children;
    res += "move $30, $29\nsw $31, 0($29)\naddiu $29, $29, -4\n"; // return addr 放在栈顶
    res += cgenExpressions(
      expressions,
      data,
      formal_list.map((formal) => formal.id).reverse(),
      rootScope
    ); // 不可能是函数
  }
  // res += `lw $31, 4($29)\naddiu $29, $29, -${f.test.length * 4}\nlw $30, 0($29)\njr $31\n`; // 这里应该放置清空局部变量(n个)和参数以及return addr
  console.log(11111, rootScope);
  if (f.return_type === "void") {
    res += `move $v0, $a0\n`;
    res += `addiu $29, $29, ${rootScope.scope.length * 4}\n`;
    res += `lw $31, 4($29)\n`; //
    res += `addiu $29, $29, ${formal_list.length * 4 + 8}\n`;
    res += `lw $30, 0($29)\n`; //
    res += `jr $31\n`;
  }

  if (f.name === "main") {
    res += `li $v0, 10\nsyscall\n`;
  }
  children.push({
    padding: 0,
    content: res,
    key: "function",
  });
}

// print函数定义
export function cgenPrintFunction(data: Data[]) {
  // function definition
  let res = `print:\n`;
  const target = findTargetEle("text", data);
  let children;
  if (target) {
    children = target.children;
    res += "move $30, $29\nsw $31, 0($29)\naddiu $29, $29, -4\n"; // return addr 放在栈顶
  }
  res += `lw $a0, 8($29)\nli $v0, 1\nsyscall\nla $a0, newLine  \nli $v0, 4\nsyscall\n`;
  res += `lw $31, 4($29)\naddiu $29, $29, ${
    1 * 4 + 8
  }\nlw $30, 0($29)\njr $31\n`;
  children.push({
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
