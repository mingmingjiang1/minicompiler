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

export function cgenCaller(
  e: Caller_Class,
  data?: Data[],
  params?: string[], // 形式参数
  declarations?: string[],
  isBlock?: boolean,
  blockDeclarations?: string[],
) {

  let res = "";
  res += "sw $30, 0($29)\naddiu $29, $29, -4\n";
  res += cgenParams(e.params, data, params, declarations)[0];
  res += `jal ${e.id}\n`;
  return res;
}

export function cgenParams(
  e: Expression_Class,
  data: Data[],
  params: string[],
  declarations: string[]
) {
  // 实参
  let res = "",
    tmp;
  // 逆转参数
  console.log("params", e, declarations, params);
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
  declarations?: string[],
  isBlock?: boolean,
  blockDeclarations?: string[]
) {
  let res: string = "";
  while (e) {
    res += switchCase(e, data, params, declarations, isBlock, blockDeclarations);
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
      content: ".data\n\n",
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

export function cgenProgram(e: Program_Class) {
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
  fs.writeFileSync(
    "/Users/bytedance/Desktop/icompiler/src/assemble/genAss2.s",
    content
  );
}

function cgenDiv(
  e: Sub_Class,
  data: Data[],
  params: string[],
  declarations: string[]
) {}

function cgenMul(
  e: Sub_Class,
  data: Data[],
  params: string[],
  declarations: string[]
) {}

function cgenSub(
  e: Sub_Class,
  data: Data[],
  params: string[],
  declarations: string[],
  isBlock?: boolean,
  blockDeclarations?: string[]
) {
  let res = "";
  res += switchCase(e.lvalue, data, params, declarations);
  // if (e.lvalue instanceof Int_Contant_Class) {
  //   res += cgenForIntContant(e.lvalue);
  // } else if (e.lvalue instanceof Sub_Class) {
  //   res += cgenSub(e.lvalue, data, params, declarations);
  // } else if (e.lvalue instanceof Add_Class) {
  //   res += cgenAdd(e.lvalue, data, params, declarations);
  // } else if (e.lvalue instanceof Div_Class) {
  //   res += cgenDiv(e.lvalue, data, params, declarations);
  // } else if (e.lvalue instanceof Mul_Class) {
  //   res += cgenMul(e.lvalue, data, params, declarations);
  // } else {
  //   res += cgenForID(e.lvalue, data, params, declarations);
  // }
  res += `sw $a0, 0($29)\n`;
  res += `addiu $29, $29, -4\n`;
  res += switchCase(e.rvalue, data, params, declarations);
  // if (e.rvalue instanceof Int_Contant_Class) {
  //   res += cgenForIntContant(e.rvalue);
  // } else if (e.rvalue instanceof Sub_Class) {
  //   res += cgenSub(e.rvalue, data, params, declarations);
  // } else if (e.rvalue instanceof Add_Class) {
  //   res += cgenAdd(e.rvalue, data, params, declarations);
  // } else if (e.rvalue instanceof Div_Class) {
  //   res += cgenDiv(e.rvalue, data, params, declarations);
  // } else if (e.rvalue instanceof Mul_Class) {
  //   res += cgenMul(e.rvalue, data, params, declarations);
  // } else {
  //   res += cgenForID(e.rvalue, data, params, declarations);
  // }
  res += `lw $t0, 4($29)\n`;
  res += `addiu $29, $29, 4\n`;
  res += `sub $a0, $a0, $t0\n`;
  return res;
}

function cgenAdd(
  e: Add_Class,
  data: Data[],
  params: string[],
  declarations: string[],
  isBlock?: boolean,
  blockDeclarations?: string[]
) {
  let res = "";
  switchCase(e.lvalue, data, params, declarations, isBlock, blockDeclarations);
  // if (e.lvalue instanceof Int_Contant_Class) {
  //   res += cgenForIntContant(e.lvalue);
  // } else if (e.lvalue instanceof Sub_Class) {
  //   res += cgenSub(e.lvalue, data, params, declarations, isBlock, blockDeclarations);
  // } else if (e.lvalue instanceof Add_Class) {
  //   res += cgenAdd(e.lvalue, data, params, declarations, isBlock, blockDeclarations);
  // } else if (e.lvalue instanceof Div_Class) {
  //   res += cgenDiv(e.lvalue, data, params, declarations);
  // } else if (e.lvalue instanceof Mul_Class) {
  //   res += cgenMul(e.lvalue, data, params, declarations);
  // } else {
  //   res += cgenForID(e.lvalue, data, params, declarations, 0, isBlock, blockDeclarations);
  // }
  res += `sw $a0, 0($29)\n`;
  res += `addiu $29, $29, -4\n`;
  res += switchCase(e.rvalue, data, params, declarations, isBlock, blockDeclarations);
  // if (e.rvalue instanceof Int_Contant_Class) {
  //   res += cgenForIntContant(e.rvalue);
  // } else if (e.rvalue instanceof Sub_Class) {
  //   res += cgenSub(e.rvalue, data, params, declarations, isBlock, blockDeclarations);
  // } else if (e.rvalue instanceof Add_Class) {
  //   res += cgenAdd(e.rvalue, data, params, declarations, isBlock, blockDeclarations);
  // } else if (e.rvalue instanceof Div_Class) {
  //   res += cgenDiv(e.rvalue, data, params, declarations);
  // } else if (e.rvalue instanceof Mul_Class) {
  //   res += cgenMul(e.rvalue, data, params, declarations);
  // } else {
  //   res += cgenForID(e.rvalue, data, params, declarations, 0, isBlock, blockDeclarations); // 因为第一个数又进去了一次
  // }
  res += `lw $t0, 4($29)\n`;
  res += `addiu $29, $29, 4\n`;
  res += `add $a0, $t0, $a0\n`;
  return res;
}

function cgenForIntContant(e: Int_Contant_Class, isBlock?: boolean) {
  // code gen for int const corresponding to using int
  let res = "";
  console.log(77777, e.token)
  res += `li $a0, ${e.token}\n`;
  return res;
}

function cgenForID(
  e: Indentifier_Class,
  data: Data[],
  params: string[],
  declarations: string[],
  offset: number = 0,
  isBlock?: boolean,
  blockDeclarations?: string[]
) {
  // code gen for id using corresponding to using id
  let res = "";

  if (isBlock) {
    console.log('block', blockDeclarations, declarations);
    const target = findTargetEle("data", data);
    // load id to $a0, x
    if (blockDeclarations.indexOf(e.token) !== -1) {
      // 说明是局部变量，
      res += `lw $a0, ${
        (blockDeclarations.indexOf(e.token) + 1 + declarations.length) * -4 +
        offset +
        declarations.length
      }($30)\n`;
    } else if (params.indexOf(e.token) !== -1) {
      // 说明是参数
      res += `lw $a0, ${(params.indexOf(e.token) + 1) * 4}($30)\n`;
    } 
    return res;
  }
  console.log('------', params)
  const target = findTargetEle("data", data);
  // load id to $a0, x
  if (params.indexOf(e.token) !== -1) {
    // 说明是参数
    res += `lw $a0, ${(params.indexOf(e.token) + 1) * 4}($30)\n`;
  } else if (declarations.indexOf(e.token) !== -1) {
    // 说明是局部变量，
    res += `lw $a0, ${
      (declarations.indexOf(e.token) + 1) * -4 + offset
    }($30)\n`;
  }
  return res;
  // [fn, param1, param2]，使用变量的时候应该从data里取变量，声明的时候，把变量存到data里
}

//遇到声明变量，先递生成右表达式的结构
function cgenForIDDeclartion(
  assign: Assign_Class,
  data: Data[],
  params: string[],
  declarations: string[],
  isBlock?: boolean,
  blockDeclarations?: string[]
) {
  // code gen for Identifier declaration corresponding to id declaration
  let res = "";
  const target = findTargetEle("data", data);
  // declare id in text area
  console.log(isBlock, blockDeclarations, 8888)
  const r = assign.r; // 获取右侧赋值表达式
  if (isBlock) {
    // block scope
    res += switchCase(r, data, params, declarations, isBlock, blockDeclarations);

    res += `sw $a0, 0($29)\n`;
    res += `addiu $29, $29, -4\n`;
    return res;
  }

  res += switchCase(r, data, params, declarations, isBlock, blockDeclarations);
  // if (r instanceof Sub_Class) {
  //   res += cgenSub(r, data, params, declarations);
  // } else if (r instanceof Add_Class) {
  //   res += cgenAdd(r, data, params, declarations);
  // } else if (r instanceof Div_Class) {
  //   res += cgenDiv(r, data, params, declarations);
  // } else if (r instanceof Mul_Class) {
  //   res += cgenMul(r, data, params, declarations);
  // } else if (r instanceof Int_Contant_Class) {
  //   res += cgenForIntContant(r, isBlock);
  // } else if (r instanceof Indentifier_Class) {
  //   res += cgenForID(r, data, params, declarations); // 结果存到a0
  // } else if (r instanceof Caller_Class) {
  //   res += cgenCaller(r, data, params, declarations);
  // }

  res += `sw $a0, 0($29)\n`;
  res += `addiu $29, $29, -4\n`;
  return res;
}

/* 
[fn, param1, return, y]
表达式有几种？
1.int x = Expression(单元（区分变量还是常量），+-)
2. Return
3. If-else
4. Caller
*/

export function cgenReturn(
  e: Return_Class,
  data: Data[],
  params: string[],
  declarations: string[],
  isBlock?: boolean,
  blockDeclarations?: string[]
) {
  let res = "";
  const expr = e.expr;

  if (isBlock) {
    res += cgenExpressions(
      expr,
      data,
      params,
      declarations,
      isBlock,
      blockDeclarations
    ); // 存储结果在a0
    // console.log("return:", e, params, declarations, 99991, declarations.length * 4 + 4)
    res += `move $v0, $a0\n`;
    res += `addiu $29, $29, ${
      (declarations.length + blockDeclarations.length) * 4
    }\n`;
    res += `lw $31, 4($29)\n`; //
    res += `addiu $29, $29, ${params.length * 4 + 8}\n`;
    res += `lw $30, 0($29)\n`; //
    res += `jr $31\n`;
    return res;
  }

  res += cgenExpressions(expr, data, params, declarations); // 存储结果在a0
  res += `move $v0, $a0\n`;
  res += `addiu $29, $29, ${declarations.length * 4}\n`;
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
  declarations?: string[]
) {
  // 生成分支语法
  const blockDeclarations: string[] = [];
  let res = `statement${cnt + 1}:\n`;
  let children;
  let { ifCond, statementTrue, statementFalse } = e;
  // 先生成statement1和statement2的代码；
  while (statementTrue) {
    if (statementTrue instanceof Sub_Class) {
      res += cgenSub(statementTrue, data, params, declarations);
    } else if (statementTrue instanceof Add_Class) {
      res += cgenAdd(statementTrue, data, params, declarations);
    } else if (statementTrue instanceof Div_Class) {
      res += cgenDiv(statementTrue, data, params, declarations);
    } else if (statementTrue instanceof Mul_Class) {
      res += cgenMul(statementTrue, data, params, declarations);
    } else if (statementTrue instanceof Assign_Class) {
      res += cgenForIDDeclartion(
        statementTrue,
        data,
        params,
        declarations,
        true,
        blockDeclarations
      );
      blockDeclarations.push(statementTrue.name);
    } else if (statementTrue instanceof Caller_Class) {
      res += cgenCaller(statementTrue, data, params, declarations);
    } else if (statementTrue instanceof Return_Class) {
      res += cgenReturn(
        statementTrue,
        data,
        params,
        declarations,
        true,
        blockDeclarations
      );
    } else if (statementTrue instanceof Indentifier_Class) {
      res += cgenForID(statementTrue, data, params, declarations, 0, true);
    } else if (statementTrue instanceof Branch_Class) {
      cnt += 2;
      res += cgenBranch(statementTrue, data, params, declarations);
      cnt -= 4;
    }
    statementTrue = statementTrue.next;
  }

  let target = findTargetEle("text", data);
  if (target) {
    children = target.children;
  }
  children.push({
    padding: 0,
    content: res,
    key: "function",
  });

  res = `statement${cnt + 2}:\n`;

  while (statementFalse) {
    if (statementFalse instanceof Sub_Class) {
      res += cgenSub(statementFalse, data, params, declarations);
    } else if (statementFalse instanceof Add_Class) {
      res += cgenAdd(statementFalse, data, params, declarations);
    } else if (statementFalse instanceof Div_Class) {
      res += cgenDiv(statementFalse, data, params, declarations);
    } else if (statementFalse instanceof Mul_Class) {
      res += cgenMul(statementFalse, data, params, declarations);
    } else if (statementFalse instanceof Assign_Class) {
      res += cgenForIDDeclartion(statementFalse, data, params, declarations);
      declarations.push(statementFalse.name);
    } else if (statementFalse instanceof Caller_Class) {
      res += cgenCaller(statementFalse, data, params, declarations);
    } else if (statementFalse instanceof Return_Class) {
      res += cgenReturn(statementFalse, data, params, declarations);
    } else if (statementFalse instanceof Indentifier_Class) {
      res += cgenForID(statementFalse, data, params, declarations);
    }  else if (statementFalse instanceof Branch_Class) {
      cnt += 2;
      res += cgenBranch(statementFalse, data, params, declarations);
      cnt -= 4;
    }
    statementFalse = statementFalse.next;
  }

  target = findTargetEle("text", data);
  if (target) {
    children = target.children;
  }
  children.push({
    padding: 0,
    content: res,
    key: "function",
  });

  const { op, lExpr, rExpr } = ifCond;
  res = "";

  console.log('========', cnt)
  switch (op) {
    case "==":
      res += switchCase(lExpr, data, params, declarations);
      // res += cgenForID(lExpr as any, data, params, declarations);
      res += `sw $a0, 0($29)\n`;
      res += `addiu $29, $29, -4\n`;
      res += switchCase(rExpr, data, params, declarations);
      res += `lw $t0, 4($29)\n`;
      res += `addiu $29, $29, 4\n`;
      res += `beq	$a0, $t0, statement${cnt + 1}\nb statement${cnt + 2}\n`;
      break;
    case ">=":
      res += cgenForID(lExpr as any, data, params, declarations);
      res += `bge	$a0, ${rExpr}, statement${cnt + 1}\nb statement${cnt + 2}\n`;
      break;
  }
  cnt += 2;
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
  declarations?: string[],
  isBlock?: boolean,
  blockDeclarations?: string[],
) {
  // let resFalse = `statementFalse${cnt + 2}:\n`;
  // resFalse += `li $a0, 0\n`;
  // const target = findTargetEle("text", data);

  // let children;

  // if (target) {
  //   children = target.children;
  // }
  // const tmp = {
  //   padding: 0,
  //   content: resFalse,
  //   key: "function",
  // };
  // children.push(tmp);

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
  }

  return res;
}

function switchCase(
  expr: Expression_Class,
  data: Data[] = [],
  params?: string[],
  declarations?: string[],
  isBlock?: boolean,
  blockDeclarations?: string[],
) {
  let res = "";
  if (expr instanceof Sub_Class) {
    res += cgenSub(expr, data, params, declarations, isBlock, blockDeclarations);
  } else if (expr instanceof Add_Class) {
    res += cgenAdd(expr, data, params, declarations, isBlock, blockDeclarations);
  } else if (expr instanceof Div_Class) {
    res += cgenDiv(expr, data, params, declarations);
  } else if (expr instanceof Mul_Class) {
    res += cgenMul(expr, data, params, declarations);
  } else if (expr instanceof Assign_Class) {
    res += cgenForIDDeclartion(expr, data, params, declarations, isBlock, blockDeclarations);
    declarations.push(expr.name);
  } else if (expr instanceof Caller_Class) {
    res += cgenCaller(expr, data, params, declarations);
  } else if (expr instanceof Return_Class) {
    res += cgenReturn(expr, data, params, declarations, isBlock, blockDeclarations);
  } else if (expr instanceof Indentifier_Class) {
    res += cgenForID(expr, data, params, declarations, 0, isBlock, blockDeclarations);
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
  const declarations: string[] = [];
  let res = `${f.name}:\n`;
  const { expressions, formals, formal_list } = f; // params是形式参
  const target = findTargetEle("text", data);
  let children;
  if (target) {
    children = target.children;
    res += "move $30, $29\nsw $31, 0($29)\naddiu $29, $29, -4\n"; // return addr 放在栈顶
    res += cgenExpressions(expressions, data, formal_list.reverse(), declarations); // 不可能是函数
  }
  // res += `lw $31, 4($29)\naddiu $29, $29, -${f.test.length * 4}\nlw $30, 0($29)\njr $31\n`; // 这里应该放置清空局部变量(n个)和参数以及return addr
  if (!f.return_type) {
    res += `move $v0, $a0\n`;
    res += `addiu $29, $29, ${declarations.length * 4}\n`;
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
  res += `lw $a0, 8($29)\nli $v0, 1\nsyscall\n`;
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
