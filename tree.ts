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
class TreeNode {
  constructor() {

  }
}

export class Program_Class extends TreeNode {
  public features: Function_Class[] = [];
  constructor() {
    super();
  }
  append_func(func: Function_Class) {
    this.features.push(func);
  }
  append_funcs(...funcs: Function_Class[]) {
    this.features.push(...funcs);
  }
}

export class Expression_Class extends TreeNode {
  constructor() {
    super();
  }
}

// 返回值语句类型
export class Return_Class extends Expression_Class {
  private name: string
  constructor(name: string) {
    super();
    this.name = name;
  }
}

export class Function_Class extends TreeNode {
  private name: string; //函数名
  public expressions: Expression_Class[]; // 表达式
  public formals: Formal_Class[]; // 形式参数
  private return_type: string;
  constructor(name: string, formals: Formal_Class[], expressions: Expression_Class[], return_type: string) {
    super();
    this.name = name;
    this.expressions = expressions;
    this.formals = formals;
    this.return_type = return_type;
  }
}

export class Formal_Class extends TreeNode {
  private name: string; //参数名
  private type: string; //参数类型
  constructor(name: string, type: string) {
    super();
    this.name = name;
    this.type = type
  }
}

export class Assign_Class extends Expression_Class {
  private name: string; // 左变量名字
  // public expr: Expression_Class;
  private ltype: string; // 左变量类型
  private rname: string | Int_Contant_Class; // 右变量名字(可以是变量)
  constructor(name: string, ltype: string, rname: Int_Contant_Class) {
    super();
    this.name = name;
    this.ltype = ltype;
    this.rname = rname;
  }
}

class Caller_Class extends TreeNode {
  constructor() {
    super();
  }
}

export class Int_Contant_Class extends Expression_Class {
  private token: string; // 常量
  constructor(token: string) {
    super();
    this.token = token;
  }
}

export class Indentifier_Class extends Expression_Class {
  private token: string; // 常量
  constructor(token: string) {
    super();
    this.token = token;
  }
}

export class Add_Class extends Expression_Class {
  private token: string; // 常量
  constructor(token: string) {
    super();
    this.token = token;
  }
}

export class Mutiply_Class extends Expression_Class {
  private token: string; // 常量
  constructor(token: string) {
    super();
    this.token = token;
  }
}