/* 
## 六、语义分析
在语义分析阶段可以做类型检查和基本的校验，这里放置了一些基本的类型检查动作：
1. 必须要有main函数，main函数的返回值必须是整形
2. 其他函数的返回值和实际返回值类型对应
3. 赋值语句左右两侧类型一致
4. 同一个作用域不得出现同名变量
5. 变量必须先声明并初始化才能使用
*/

import _ from "lodash";
import {
  Add_Class,
  Assign_Class,
  Bool_Class,
  Branch_Class,
  Caller_Class,
  Cond_Class,
  Div_Class,
  Expression_Class,
  Formal_Class,
  Function_Class,
  Indentifier_Class,
  Int_Contant_Class,
  Mul_Class,
  Program_Class,
  Return_Class,
  Sub_Class,
} from "./tree";

function funcIsExisted(
  func: Function_Class,
  functionMap: Map<
    string,
    {
      f: Function_Class;
      returnType: string;
      formalsType: { type: string; id: string }[];
    }[]
  >,
  name: string
) {
  const targets = functionMap.get(name) || [];
  // const { returnType, formalsType, f } = target;
  const isR = targets.some((target, index) => {
    return target.returnType === func.return_type &&
      target.formalsType.every(
        (formal, index) => formal.type === func.formal_list[index].type
      );
  });
  if (isR) {
    throw new Error(`函数签名重复: ${func.name}`);
  }
  return false;
}

export const FunctionMap = new Map<
  string,
  {
    f: Function_Class;
    returnType: string;
    formalsType: { type: string; id: string }[];
  }[]
>([]);

interface Scope {
  scope: { name: string; type: string }[];
  next?: Scope[];
  parent?: Scope;
}

const scopes: Scope = {
  scope: [], // 最顶层是函数作用域
  next: [],
};

export function semanticmMain(ast: Program_Class) {
  let cur = ast.expr as Function_Class;
  while (cur) {

    if (!funcIsExisted(cur, FunctionMap, cur.name)) {
      if (!FunctionMap.get(cur.name)) {
        FunctionMap.set(cur.name, []);
      }
      const copyF = _.cloneDeep(cur);
      copyF.next = undefined;
      FunctionMap.get(cur.name).push({
        f: copyF,
        returnType: cur.return_type,
        formalsType: cur.formal_list,
      });
    }
    cur = cur.next as Function_Class;
  }
  checkMain();
}

function checkMain() {
  const isExisted = FunctionMap.get("main");
  if (!isExisted) {
    throw new Error("no main function has been implemented!");
  }
  FunctionMap.set("print", [
    {
      f: new Function_Class("void", "print", new Formal_Class("x", "int")),
      returnType: "void",
      formalsType: [{ type: "int", id: "x" }],
    },
    {
      f: new Function_Class("void", "print", new Formal_Class("x", "bool")),
      returnType: "void",
      formalsType: [{ type: "bool", id: "x" }],
    },
  ]);
  for (const [_fname, funcs] of FunctionMap) {
    for (const func of funcs) {
      checkFunc(func.f);
    }
  }
}

function checkMeta(
  expr: Expression_Class,
  scope: Scope,
  formal_list: { type: string; id: string }[]
): string {
  if (expr instanceof Indentifier_Class) {
    let cur = scope;
    let target;
    while (cur) {
      target = cur.scope.find((item) => item.name === expr.token);
      if (!target) {
        cur = cur.parent;
      } else {
        break;
      }
    }
    if (!target) {
      target = formal_list.find((formal) => formal.id === expr.token);
    }
    if (!target) {
      throw new Error(`作用域链中没找到该变量: ${expr.token}`);
    }
    return target.type;
  } else if (expr instanceof Int_Contant_Class) {
    return "int";
  } else if (
    expr instanceof Add_Class ||
    expr instanceof Sub_Class ||
    expr instanceof Mul_Class ||
    expr instanceof Div_Class
  ) {
    const { lvalue, rvalue } = expr;
    return checkArigthm(expr, lvalue, rvalue, scope, formal_list);
  } else if (expr instanceof Bool_Class) {
    return "bool";
  }
}

function checkArigthm(
  expr: Sub_Class | Add_Class,
  e1: Expression_Class,
  e2: Expression_Class,
  scope: Scope,
  formal_list: { type: string; id: string }[]
): string {
  const t1 = checkMeta(e1, scope, formal_list);
  const t2 = checkMeta(e2, scope, formal_list);
  if (t1 !== t2) {
    throw new Error(
      `Type '${t1}' is incompatible with type '${t2}', both should are int type`
    );
  }
  return t1;
}

function checkCond(
  expr: Cond_Class,
  e1: Expression_Class,
  e2: Expression_Class,
  scope: Scope,
  formal_list: { type: string; id: string }[]
) {
  const t1 = checkMeta(e1, scope, formal_list);
  const t2 = checkMeta(e2, scope, formal_list);
  if (t1 !== t2) {
    throw new Error(
      `Type '${t1}' is incompatible with type '${t2}', both should are int type`
    );
  }
  return "bool";
}

function checkCaller(
  expr: Caller_Class,
  scope: Scope,
  formal_list: { type: string; id: string }[]
) {
  if (expr.id === 'main') {
    throw new Error("main函数不能被调用");
  }

  // first check params and formals
  const caller = FunctionMap.get(expr.id);
  if (!caller) {
    throw new Error(`${expr.id} has not been implemented`);
  }

  let { params } = expr;
  let i = 0;
  for (const func of caller) {
    i = 0;
    while (params) {
      const type = switchTest(params, scope, formal_list);
      if (type !== func.f?.formal_list?.[i]?.type) {
        break;
      }
      params = params.next;
      i++;
    }
    if (i === func.f.formal_list.length) {
      return func.f.return_type;
    }
  }

  throw new Error(
    `没有合适的函数签名，请检查函数名，参数类型和返回类型`
  );
}

function checkReturn(
  expr: Return_Class,
  scope: Scope,
  formal_list: { type: string; id: string }[],
  return_type: string
) {
  const type = switchTest(expr.expr, scope, formal_list);
  if (return_type !== type) {
    throw new Error(
      `Type '${type}' is not assignable to type '${return_type}'.`
    );
  }
  return type;
}

function checkBranch(
  expr: Branch_Class,
  scope: Scope,
  formal_list: { type: string; id: string }[],
  return_type: string
) {
  let { statementFalse, statementTrue } = expr;
  const { ifCond } = expr;
  checkCond(ifCond, ifCond.lExpr, ifCond.rExpr, scope, formal_list);
  // ifCond里的变量是要声明过的
  const scopeTrue: Scope = {
    scope: [],
    next: [],
    parent: scope,
  };
  const scopeFalse: Scope = {
    scope: [],
    next: [],
    parent: scope,
  };
  scope.next.push(scopeTrue, scopeFalse);
  while (statementTrue) {
    switchTest(statementTrue, scopeTrue, formal_list, return_type);
    statementTrue = statementTrue.next;
  }
  while (statementFalse) {
    switchTest(statementFalse, scopeFalse, formal_list, return_type);
    statementFalse = statementFalse.next;
  }
}

function checkAssign(
  expr: Assign_Class,
  scope: Scope,
  formal_list: { type: string; id: string }[]
) {
  // cur scope,当前作用域
  const { ltype, name, r } = expr;
  const target = scopes.scope.find((item) => item.name === name);
  if (target) {
    throw new Error(`${name} has been declared!`);
  }

  const type = switchTest(r, scope, formal_list);

  if (ltype !== type) {
    throw new Error(`Type '${type}' is not assignable to type '${ltype}'.`);
  }

  scope.scope.push({
    name,
    type: ltype,
  });
}

function switchTest(
  expr: Expression_Class,
  scope: Scope,
  formal_list: { type: string; id: string }[],
  return_type?: string
): any {
  if (expr instanceof Assign_Class) {
    checkAssign(expr, scope, formal_list);
  } else if (expr instanceof Caller_Class) {
    return checkCaller(expr, scope, formal_list);
  } else if (expr instanceof Cond_Class) {
    return checkCond(expr, expr.lExpr, expr.rExpr, scope, formal_list);
  } else if (expr instanceof Add_Class || expr instanceof Sub_Class || expr instanceof Div_Class || expr instanceof Mul_Class) {
    const { lvalue, rvalue } = expr;
    return checkArigthm(expr, lvalue, rvalue, scope, formal_list);
  } else if (
    expr instanceof Indentifier_Class ||
    expr instanceof Int_Contant_Class ||
    expr instanceof Bool_Class
  ) {
    return checkMeta(expr, scope, formal_list);
  } else if (expr instanceof Branch_Class) {
    return checkBranch(expr, scope, formal_list, return_type);
  } else if (expr instanceof Return_Class) {
    return checkReturn(expr, scope, formal_list, return_type);
  }
}

function checkFunc(f: Function_Class) {
  // 生成函数作用域
  const scopeRoot: Scope = {
    scope: [], // 最顶层是函数作用域
    next: [],
  };
  let { expressions } = f;

  const { formal_list, return_type } = f;
  let hasReturn = false;
  while (expressions) {
    if (expressions instanceof Return_Class) {
      // hasReturn = true;
    } else {
      // switchTest(expressions, scopeRoot, formal_list);
    }
    switchTest(expressions, scopeRoot, formal_list, return_type);

    expressions = expressions.next;
  }
  // if (!hasReturn && return_type !== "void" && f.name !== 'main') {
  //   throw new Error(`Type 'void' is not assignable to type '${return_type}'.`);
  // }
}
// Duplicate function implementation1212.
