import { success } from "../utils";
import { FunctionMap } from "./check";
const fs = require("fs");

/* 
定义基本类：
函数类：Function_Class(形式参数类，表达式，返回类型)
形参类：Formal_Class
表达式类：Expression_Class
赋值语句类：Assign_Class
函数调用类：Caller_Class
整数常量类：Int_Constant_Class
字符串类：String_Class
*/
export abstract class TreeNode {
  public next: TreeNode;
  constructor() {
  }

  beforeTransvrse() {
  }

  afterTransvrse() {
  }

  abstract transverse(...args: any[]): void;
}



export class Program_Class extends TreeNode {
  public expr: Expression_Class;
  constructor(func: Function_Class) {
    super();
    this.expr = func;
  }
  transverse() {
    // 先dfs + 然后bfs
    success('开始遍历抽象语法树');
    this.expr.transverse();
    success('结束遍历抽象语法树');
  }
}

export class Expression_Class extends TreeNode {
  constructor() {
    super();
  }

  transverse(): void {
    success("开始遍历表达式: ");
    if (this.next) {
      this.next.transverse();
    }
  }
}

// 返回值语句类型
export class Return_Class extends Expression_Class {
  public expr: Expression_Class;
  constructor(expr: Expression_Class) {
    super();
    this.expr = expr;
  }

  transverse(): void {
    success("开始遍历返回值表达式: ");
    if (this.next) {
      this.next.transverse();
    }
  }
}

export class Caller_Class extends Expression_Class {
  public id: string;
  public params: Expression_Class;
  public params_list: string[] = [];
  constructor(id: string, params?: Expression_Class, next?: Expression_Class) {
    super();
    this.id = id;
    this.params = params;
    this.next = next;
    while (params) {
      
      this.params_list.unshift((params as any).token);
      params = params.next as any;
    }
    console.log(this.params_list, 333)
  }

  transverse(): void {
    success("开始遍历表达式: ");
    if (this.next) {
      this.next.transverse();
    }
  }
}

export class Expressions_Class extends TreeNode {
  constructor(next: Expression_Class) {
    super();
  }

  transverse(...args: any[]): void {
    
  }
}

export class Function_Class extends Expression_Class {
  public name: string; //函数名
  public expressions: Expression_Class; // 表达式
  public formals: Formal_Class; // 形参
  public return_type: string; //函数名
  public formal_list: {type: string, id
    : string}[] = [];
  constructor(returnType: string, name: string, formals?: Formal_Class, expressions?: Expression_Class, next?: Expression_Class) {
    super();
    this.name = name;
    this.expressions = expressions;
    this.formals = formals;
    this.next = next;
    this.return_type = returnType;
    while (formals) {
      this.formal_list.unshift({type: formals.type, id: formals.name});
      formals = formals.next as any
    }
    console.log(444, this.formal_list)
  }

  transverse() {
    // 先dfs + 然后bfs
    success('开始遍历函数: ');
    console.log("函数名: ", this.name);
    console.log("函数预期返回类型:", this.return_type);
    const isExisted = FunctionMap.get(this.name);
    if (isExisted) {
      throw new Error("Duplicate function implementation");
    }
    FunctionMap.set(this.name, this);
    this.formals?.transverse();
    this.expressions?.transverse();
    if (this.next) {
      this.next.transverse();
    }
  }
}

export class Params_Class extends Expression_Class {
  public id: Int_Contant_Class | Indentifier_Class; //参数名
  constructor(id: Int_Contant_Class | Indentifier_Class, next?: Params_Class) {
    super();
    this.id = id;
    this.next = next;
  }
}

export class Branch_Class extends Expression_Class {
  public ifCond: Cond_Class;
  public statementTrue: Expression_Class;
  public statementFalse: Expression_Class;
  constructor(ifCond: Cond_Class, statementTrue: Expression_Class, statementFalse: Expression_Class) {
    super();
    this.ifCond = ifCond;
    this.statementTrue = statementTrue;
    this.statementFalse = statementFalse;
  }
  // transverse(): void {
  //   success("开始遍历if-else: ");
  //   console.log("if: ", this.ifCond);
  //   console.log("then: ", this.statementTrue);
  //   console.log("else: ");
  //   console.log("then: ", this.statementFalse);
  //   if (this.next) {
  //     this.next.transverse();
  //   }
  // }
}

export class Cond_Class extends Expression_Class {
  public lExpr: Expression_Class; //参数名
  public rExpr: Expression_Class; //参数名
  public op: string;
  constructor(lExpr: Expression_Class, operator: string, rExpr: Expression_Class) {
    super();
    this.lExpr = lExpr;
    this.rExpr = rExpr;
    this.op = operator;
  }
  transverse(): void {
    success("开始遍历条件判断表达式: ");
    console.log("条件表达式左值: ", this.lExpr);
    console.log("条件表达式右值: ", this.rExpr);
    if (this.next) {
      this.next.transverse();
    }
  }
}

export class Formal_Class extends Expression_Class {
  public name: string; //参数名
  public type: string; //参数类型
  constructor(name: string, type: string, next?: Formal_Class) {
    super();
    this.name = name;
    this.type = type
    this.next = next;
  }

  transverse() {
    success('开始遍历形参: ');
    console.log("形参名称:", this.name);
    console.log("形参类型:", this.type);
    if (this.next) {
      this.next.transverse();
    }
  }
}

export class Assign_Class extends Expression_Class {
  public name: string; // 左变量名字
  // public expr: Expression_Class;
  public ltype: string; // 左变量类型
  public r: Expression_Class; // 右变量名字(可以是变量)
  constructor(name: string, ltype: string, r: Expression_Class, next?: Expression_Class) {
    super();
    this.name = name;
    this.ltype = ltype;
    this.r = r;
  }

  transverse() {
    success('开始遍历赋值表达式: ');
    console.log("赋值左值:", this.name, this.ltype);
    this.r.transverse();
    if (this.next) {
      this.next.transverse();
    }
  }
}

export class Bool_Class extends Expression_Class {
  public token: string;
  constructor(token: string) {
    super();
    this.token = token === 'True' ? '1' : '0';
  }

  transverse() {
    success('开始遍历常量: ');
    console.log(this.token);
    if (this.next) {
      this.next.transverse();
    }
  }
}


export class Int_Contant_Class extends Expression_Class {
  public token: string; // 常量
  constructor(token: string) {
    super();
    this.token = token;
  }

  transverse() {
    success('开始遍历常量: ');
    console.log(this.token);
    if (this.next) {
      this.next.transverse();
    }
  }
}

export class Indentifier_Class extends Expression_Class {
  public token: string; // 常量
  constructor(token: string) {
    super();
    this.token = token;
  }

  transverse() {
    success('开始遍历标识符: ');
    console.log(this.token);
    if (this.next) {
      this.next.transverse();
    }
  }
}

export class Sub_Class extends Expression_Class {
  public lvalue: Indentifier_Class | Int_Contant_Class;
  public rvalue: Indentifier_Class | Int_Contant_Class;
  constructor(lvalue: Indentifier_Class | Int_Contant_Class, rvalue: Indentifier_Class | Int_Contant_Class) {
    super();
    this.lvalue = lvalue;
    this.rvalue = rvalue;
  }


  transverse() {
    success('开始遍历运算表达式: ');
    this.beforeTransvrse();
    this.lvalue.transverse();
    this.rvalue.transverse();
    if (this.next) {
      this.next.transverse();
    }
    this.afterTransvrse();
  }
}

export class Add_Class extends Expression_Class {
  public lvalue: Indentifier_Class | Int_Contant_Class;
  public rvalue: Indentifier_Class | Int_Contant_Class;
  constructor(lvalue: Indentifier_Class | Int_Contant_Class, rvalue: Indentifier_Class | Int_Contant_Class) {
    super();
    this.lvalue = lvalue;
    this.rvalue = rvalue;
  }


  transverse() {
    success('开始遍历运算表达式: ');
    this.beforeTransvrse();
    this.lvalue.transverse();
    this.rvalue.transverse();
    if (this.next) {
      this.next.transverse();
    }
    this.afterTransvrse();
  }
}

export class Div_Class extends Expression_Class {
  public lvalue: Indentifier_Class | Int_Contant_Class;
  public rvalue: Indentifier_Class | Int_Contant_Class;
  constructor(lvalue: Indentifier_Class | Int_Contant_Class, rvalue: Indentifier_Class | Int_Contant_Class) {
    super();
    this.lvalue = lvalue;
    this.rvalue = rvalue;
  }


  transverse() {
    success('开始遍历运算表达式: ');
    this.beforeTransvrse();
    this.lvalue.transverse();
    this.rvalue.transverse();
    if (this.next) {
      this.next.transverse();
    }
    this.afterTransvrse();
  }
}

export class Mul_Class extends Expression_Class {
  public lvalue: Indentifier_Class | Int_Contant_Class;
  public rvalue: Indentifier_Class | Int_Contant_Class;
  constructor(lvalue: Indentifier_Class | Int_Contant_Class, rvalue: Indentifier_Class | Int_Contant_Class) {
    super();
    this.lvalue = lvalue;
    this.rvalue = rvalue;
  }


  transverse() {
    success('开始遍历运算表达式: ');
    this.beforeTransvrse();
    this.lvalue.transverse();
    this.rvalue.transverse();
    if (this.next) {
      this.next.transverse();
    }
    this.afterTransvrse();
  }
}
