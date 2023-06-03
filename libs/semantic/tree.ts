import { Scope } from "./check";

/* 
function：Function_Class
foramls：Formal_Class
expressiom：Expression_Class
assign：Assign_Class
caller：Caller_Class
int constant：Int_Constant_Class
return: return_Class
*/
export abstract class TreeNode {
  abstract next?: TreeNode;
  constructor() {}

  beforeTransvrse() {}

  afterTransvrse() {}

  transverse() {

  };
}

export class Program_Class extends TreeNode {
  public expr: Function_Class;
  public next?: TreeNode;
  constructor(func: Function_Class) {
    super();
    this.expr = func;
  }
}

export class Expression_Class extends TreeNode {
  public next: Expression_Class;
  constructor() {
    super();
  }
}

export class Return_Class extends Expression_Class {
  public expr: Expression_Class;
  constructor(expr: Expression_Class) {
    super();
    this.expr = expr;
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
      if (params instanceof Int_Contant_Class) {
        this.params_list.unshift(params.token);
      } else if (params instanceof Indentifier_Class) {
        this.params_list.unshift(params.token);
      } else if (params instanceof Caller_Class) {
        this.params_list.unshift(params.id);
      }
      params = params.next;
    }
  }
}

export class Expressions_Class extends TreeNode {
  public next: TreeNode;
  constructor(next: Expression_Class) {
    super();
  }

  transverse(...args: any[]): void {}
}

export class Function_Class extends TreeNode {
  public next: Function_Class;
  public name: string; //函数名
  public expressions: Expression_Class; // 表达式
  public formals: Formal_Class; // 形参
  public return_type: string; //函数名
  public formal_list: { type: string; id: string }[] = [];
  public total?: number = 0;
  public scope: Scope;
  constructor(
    returnType: string,
    name: string,
    formals?: Formal_Class,
    expressions?: Expression_Class,
    next?: Function_Class
  ) {
    super();
    this.name = name;
    this.expressions = expressions;
    this.formals = formals;
    this.next = next;
    this.return_type = returnType;
    while (formals) {
      this.formal_list.unshift({ type: formals.type, id: formals.name });
      formals = formals.next;
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
  constructor(
    ifCond: Cond_Class,
    statementTrue: Expression_Class,
    statementFalse?: Expression_Class
  ) {
    super();
    this.ifCond = ifCond;
    this.statementTrue = statementTrue;
    this.statementFalse = statementFalse;
  }
}

export class Cond_Class extends Expression_Class {
  public lExpr: Expression_Class; //参数名
  public rExpr: Expression_Class; //参数名
  public op: string;
  constructor(
    lExpr: Expression_Class,
    operator: string,
    rExpr: Expression_Class
  ) {
    super();
    this.lExpr = lExpr;
    this.rExpr = rExpr;
    this.op = operator;
  }
}

export class Formal_Class extends Expression_Class {
  public name: string; //参数名
  public type: string; //参数类型
  public next: Formal_Class;
  constructor(name: string, type: string, next?: Formal_Class) {
    super();
    this.name = name;
    this.type = type;
    this.next = next;
  }
}

export class Declare_Class extends Expression_Class {
  public name: string; // 左变量名字
  // public expr: Expression_Class;
  public ltype: string; // 左变量类型
  public r: Expression_Class; // 右变量名字(可以是变量)
  constructor(
    name: string,
    ltype: string,
    r: Expression_Class,
    next?: Expression_Class
  ) {
    super();
    this.name = name;
    this.ltype = ltype;
    this.r = r;
  }
}

export class Assign_Class extends Expression_Class {
  public name: Indentifier_Class; // 左变量名字
  // public expr: Expression_Class;
  public r: Expression_Class; // 右变量名字(可以是变量)
  constructor(
    name: Indentifier_Class,
    r: Expression_Class,
    next?: Expression_Class
  ) {
    super();
    this.name = name;
    this.r = r;
  }
}

export class Bool_Class extends Expression_Class {
  public token: string;
  constructor(token: string) {
    super();
    this.token = token === 'true' ? '1' : '0';
  }
}

export class Int_Contant_Class extends Expression_Class {
  public token: string;
  constructor(token: string) {
    super();
    this.token = token;
  }
}

export class Indentifier_Class extends Expression_Class {
  public token: string;
  constructor(token: string) {
    super();
    this.token = token;
  }
}

export class Sub_Class extends Expression_Class {
  public lvalue: Indentifier_Class | Int_Contant_Class;
  public rvalue: Indentifier_Class | Int_Contant_Class;
  constructor(
    lvalue: Indentifier_Class | Int_Contant_Class,
    rvalue: Indentifier_Class | Int_Contant_Class
  ) {
    super();
    this.lvalue = lvalue;
    this.rvalue = rvalue;
  }
}

export class Add_Class extends Expression_Class {
  public lvalue: Indentifier_Class | Int_Contant_Class;
  public rvalue: Indentifier_Class | Int_Contant_Class;
  constructor(
    lvalue: Indentifier_Class | Int_Contant_Class,
    rvalue: Indentifier_Class | Int_Contant_Class
  ) {
    super();
    this.lvalue = lvalue;
    this.rvalue = rvalue;
  }
}

export class Div_Class extends Expression_Class {
  public lvalue: Indentifier_Class | Int_Contant_Class;
  public rvalue: Indentifier_Class | Int_Contant_Class;
  constructor(
    lvalue: Indentifier_Class | Int_Contant_Class,
    rvalue: Indentifier_Class | Int_Contant_Class
  ) {
    super();
    this.lvalue = lvalue;
    this.rvalue = rvalue;
  }
}

export class Mul_Class extends Expression_Class {
  public lvalue: Indentifier_Class | Int_Contant_Class;
  public rvalue: Indentifier_Class | Int_Contant_Class;
  constructor(
    lvalue: Indentifier_Class | Int_Contant_Class,
    rvalue: Indentifier_Class | Int_Contant_Class
  ) {
    super();
    this.lvalue = lvalue;
    this.rvalue = rvalue;
  }

}
