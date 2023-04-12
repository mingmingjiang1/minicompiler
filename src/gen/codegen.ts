/* 目标代码生成 */

import {
  Add_Class,
  Assign_Class,
  Branch_Class,
  Caller_Class,
  Expression_Class,
  Function_Class,
  Indentifier_Class,
  Int_Contant_Class,
  Params_Class,
  Program_Class,
  Return_Class,
  Sub_Class,
} from "../../tree";

// const hello = require('../../build/Release/addon.node');
const fs = require("fs");

// console.log(hello.parseInt32(32))
// console.log(hello.hello());

// export let data: string = `.data\n`; // 数据段

// 单元表达式的生成

/* 
这个是fuzhi语句的代码，把值fugei   value变量
sw $a0, value
// la $a0, msg1
// li $v0,4          
// syscall              #print "\n"
lw $a0, value // 下面是打印
li $v0,1          
syscall              #print "\n"
*/

export function cgenCaller(e: Caller_Class, data?: Data[]) {
  let res = "";
  res += "sw $30, 0($29)\naddiu $29, $29, -4\n";
  res += cgenParams(e.params);
  res += `jal ${e.id}\n`;
  return res;;
}

export function cgenParams(e: Params_Class) {
  // 实参
  let res = "";
  // 逆转参数
  console.log("params", e)
  const id = e.id;
  while (e) {
    if (e instanceof Int_Contant_Class) {
      res += cgenForIntContant(e);
      console.log(5554, res)
    } else if (e instanceof Indentifier_Class) {
      console.log(222222);
      // res += cgenForID(e, data);
    }
    res += "sw $a0, 0($29)\naddiu $29, $29, -4\n"; // 保存参数
    e = e.next as any;
  }
  return res
}

export function cgenExpressions(e: Expression_Class, data: Data[]) {
  let res: string = "";
  while (e) {
    if (e instanceof Sub_Class) {
      res = cgenSub(e, data);
    } else if (e instanceof Add_Class) {
      cgenAdd(e);
    } else if (e instanceof Function_Class) {
      // 函数定义
      cgenFunction(e, data); // 因为函数声明只能在最外层，所以这里面直接做了把函数定义放在了text里
    } else if (e instanceof Assign_Class) {
      cgenForIDDeclartion(e, data);
    } else if (e instanceof Caller_Class) {
      res += cgenCaller(e);
    }
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
      value: {

      },
    },
    {
      // 代码段
      padding: 0, // 本层级的
      key: "text",
      content:
        ".text            # text section\n\n.globl main                 # call main by SPIM\n", // 本层级的
      children: [
        {
          padding: 0,
          content: "main:\n",
          key: "main",
        },
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
    [key: string]: string
  }
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
  const res = cgenExpressions(e.expr, data);
  if (res) {
    // 说明存在全局的表达式
    console.log("88887", res);
    const main = findTargetEle("main", data);
    if (main) {
      main.content += res + "li $v0, 10\nsyscall\n";
    }
  }
  console.dir(data, { depth: null });
  const content = cgenEnd(data);
  console.log(content);
  fs.writeFileSync("/Users/bytedance/Desktop/icompiler/src/gen/genAss.s", content);
}

function cgenSub(e: Sub_Class, data: Data[]) {
  let res = "";
  if (e.lvalue instanceof Int_Contant_Class) {
    res += cgenForIntContant(e.lvalue);
  } else {
    res += cgenForID(e.lvalue, data);
  }
  res += "sw $a0, 0($29)\naddiu $29, $29, -4\n";
  console.log(1111, e)
  if (e.rvalue instanceof Int_Contant_Class) {
    console.log(11111);
    res += cgenForIntContant(e.rvalue);
  } else {
    res += cgenForID(e.rvalue, data);
  }
  res += `lw $t0, 4($29)\n`; // get first number from stack top
  res += `addiu $29, $29, 4\n`; // stack 还原
  res += `sub $a0, $t0, $a0\n`;
  res += `li $v0, 1\n`;
  res += `syscall\n`;
  // res += `li $v0, 10\n`;
  // res += `syscall\n`;
  return res;
}

function cgenAdd(e: Add_Class) {
  // let res = "";
  // if (e.lvalue instanceof Int_Contant_Class) {
  //   cgenForIntContant(e.lvalue);
  // } else {
  //   cgenForID(e.lvalue);
  // }
  // res += `sw $a0, 0($29)
  // addiu $29, $29, -4`
  // if (e.rvalue instanceof Int_Contant_Class) {
  //   cgenForIntContant(e.rvalue);
  // } else {
  //   cgenForID(e.rvalue);
  // }
  // res += `\tlw $t0, 4($29)\n`; // get first number from stack top
  // res += `\taddiu $29, $29, 4\n`; // stack 还原
  // res += `\tsub $a0, $t0, $a0\n`;
  // res += `\tli $v0, 1\n`;
  // res += `\tsyscall\n`;
  // res += `\tli $v0, 10\n`;
  // res += `\tsyscall\n`;
}

function cgenForIntContant(e: Int_Contant_Class) {
  // code gen for int const corresponding to using int
  let res = "";
  res += `li $a0, ${e.token}\n`;
  return res;
}

function cgenForID(e: Indentifier_Class, data: Data[]) {
  // code gen for id using corresponding to using id
  console.log("75757755")
  let res = "";
  // const target = findTargetEle("data", data);
  // load id to $a0, x
  res += `lw $a0, 4($30)\n`; // (第一次offset: fn + 4, fn + 12)
  return res;
  try {
    // if (target) {
      // const variable = target?.value[e.token];
      // if (variable) {
        // res += `la $a0, ${variable}\n`;
      // } else {
      //   throw new Error("error: 变量未声明");
      // }
    // }
  } finally {
    return res;
  }
  // [fn, param1, param2]，使用变量的时候应该从data里取变量，声明的时候，把变量存到data里
}

function cgenForIDDeclartion(assign: Assign_Class, data: Data[]) {
  // code gen for Identifier declaration corresponding to id declaration
  let res = "";
  const target = findTargetEle("data", data);
  console.log(232323, target, assign)
  // declare id in text area
  const r = assign.r;
  if (r instanceof Sub_Class) {
    res += cgenSub(r, data);
  } else if (r instanceof Add_Class) {
    res += cgenAdd(r);
  } else if (r instanceof Int_Contant_Class) {
    res += cgenForIntContant(r);
    // 声明变量初始化为0, 如果是int就是word；如果是string就是space
    if (target) {
      const { value } = target;
      if (value) {
        console.log(7777)
        value[assign.name] = r.token;
        target.content += `${assign.name}:		.word	${r.token}\n` // 插入到data中
        console.log(656565, target, assign);
        res += `sw $a0, 0($29)\naddiu $29, $29, -4`; // 存入stack
      }
    }
  } else if (r instanceof Indentifier_Class) {
    res += cgenForID(r, data);
  }
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

export function cgenReturn(e: Return_Class) {
  // todo return asm
}

export function cgenBranch(e: Branch_Class) {
  // 生成分支语法
  let res = "";
  const { ifCond, statement1, statement2 } = e;
  // 先生成statement1和statement2的代码；
  const { op, lname, rname } = ifCond;
  switch (op) {
    case "==":
      res += `beq	$t0,$t1,statement1\n
      b statement2`;
      break;
  }
}

function findTargetEle(key: string, data: Data[] = []): false | Data {
  for (const item of data) {
    const { padding, key: cnt, children } = item;
    if (key === cnt) {
      return item;
    }
    const res = findTargetEle(key, children) 
    if (res) {
      return res;
    }
  }
  return false;
}

export function cgenFunction(f: Function_Class, data: Data[]) {
  // function definition
  let res = `${f.name}:\n`;
  const { expressions, formals } = f;
  const target = findTargetEle("text", data);
  let children;
  console.log(999997, target)
  if (target) {
    children = target.children;
    res += "move $30, $29\nsw $31, 0($29)\naddiu $29, $29, -4\n"; // return addr 放在栈顶
    res += cgenExpressions(expressions, data); // 不可能是函数
  }
  res += `lw $31, 4($29)\naddiu $29, $29, -${f.test.length * 4}\nlw $30, 0($29)\njr $31\n`; // 这里应该放置清空局部变量(n个)和参数以及return addr
  children.push({
    padding: 0,
    content: res,
    key: "function",
  })
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
