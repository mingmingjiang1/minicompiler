/* 
## 六、语义分析
在语义分析阶段可以做类型检查和基本的校验，这里放置了一些基本的类型检查动作：
1. 必须要有main函数，main函数的返回值必须是整形
2. 其他函数的返回值和实际返回值类型对应
3. 赋值语句左右两侧类型一致
4. 同一个作用域不得出现同名变量
5. 变量必须先声明并初始化才能使用
*/

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
  Params_Class,
  Return_Class,
  Sub_Class,
} from "./tree";

export const FunctionMap = new Map<string, Function_Class>([]);

interface Scope {
  scope: { name: string; type: string }[];
  next?: Scope[];
  parent?: Scope;
}

const scopes: Scope = {
  scope: [], // 最顶层是函数作用域
  next: [],
};

export function checkMain() {
  const isExisted = FunctionMap.get("main");
  if (!isExisted) {
    throw new Error("no main function has been implemented!");
  }
  FunctionMap.set('print', new Function_Class('void', 'print', new Formal_Class('x', 'int')));
  for (const [_fname, f] of FunctionMap) {
    checkFunc(f);
  }
  console.dir(scopes.next[0])
}

function checkMeta(expr: Expression_Class, scope: Scope, formal_list: { type: string; id: string; }[]): string {
  if (expr instanceof Indentifier_Class) {
    let cur = scope; let target;
    while (cur) {
      target = cur.scope.find(item => item.name === expr.token);
      if (!target) {
        console.log(1112, cur.scope, target)
        cur = cur.parent;
      } else {
        break;
      }
    }
    if (!target) {
      target = formal_list.find(formal => formal.id === expr.token);
      console.log(scope, formal_list);
    }
    if (!target) {
      console.log(expr);
      throw new Error(`作用域链中没找到该变量: ${expr.token}`);
    }
    return target.type;
  } else if (expr instanceof Int_Contant_Class) {
    return 'int';
  } else if (expr instanceof Add_Class || expr instanceof Sub_Class || expr instanceof Mul_Class || expr instanceof Div_Class) {
    const { lvalue, rvalue } = expr;
    return checkArigthm(expr, lvalue, rvalue, scope, formal_list);
  } else if (expr instanceof Bool_Class) {
    return 'bool';
  }
}


function checkArigthm(expr: Sub_Class | Add_Class, e1: Expression_Class, e2: Expression_Class, scope: Scope, formal_list: { type: string; id: string; }[]): string {
  console.log(e1, e2)
  const t1 = checkMeta(e1, scope, formal_list);
  const t2 = checkMeta(e2, scope, formal_list);
  if (t1 !== t2) {
    throw new Error(`Type '${t1}' is incompatible with type '${t2}', both should are int type`);
  }
  return t1;
}

function checkCond(expr: Cond_Class, e1: Expression_Class, e2: Expression_Class, scope: Scope, formal_list: { type: string; id: string; }[]) {
  const t1 = checkMeta(e1, scope, formal_list);
  const t2 = checkMeta(e2, scope, formal_list);
  if (t1 !== t2) {
    throw new Error(`Type '${t1}' is incompatible with type '${t2}', both should are int type`);
  }
  return 'bool';
}

function checkCaller(expr: Caller_Class, scope: Scope, formal_list: { type: string; id: string; }[]) {
  // first check params and formals
  const caller = FunctionMap.get(expr.id);
  if (!caller) {
    throw new Error(`${caller.name} has not been implemented`);
  }

  let { params } = expr;
  let i = 0;
  while (params) {
    const type = switchTest(params, scope, formal_list);
    console.log(111, params, caller.formal_list, expr)
    if (type !== caller?.formal_list?.[i]?.type) {
      throw new Error(`参数类型或者数量不一致: 实际类型${type}与期待的类型${caller?.formal_list?.[i]?.type}不兼容`);
    }
    params = params.next;
    i++;
  }

  if (i !== caller.formal_list.length) {
    throw new Error(`参数类型或者数量不一致`);
  }
  return caller.return_type;
}

function checkReturn(expr: Return_Class, scope: Scope, formal_list: { type: string; id: string; }[], return_type: string) {
  const type = switchTest(expr.expr, scope, formal_list);
  if (return_type !== type) {
    throw new Error(`Type '${type}' is not assignable to type '${return_type}'.`);
  }
  return type;
}

function checkBranch(expr: Branch_Class, scope: Scope, formal_list: { type: string; id: string; }[]) {
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
    switchTest(statementTrue, scopeTrue, formal_list);
    statementTrue = statementTrue.next;
  }
  while (statementFalse) {
    switchTest(statementFalse, scopeFalse, formal_list);
    statementFalse = statementFalse.next;
  }
}

function checkAssign(expr: Assign_Class, scope: Scope, formal_list: { type: string; id: string; }[]) { // cur scope,当前作用域
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

function switchTest(expr: Expression_Class, scope: Scope, formal_list: { type: string; id: string; }[], return_type?: string): any {
  console.log(2222, expr)
  if (expr instanceof Assign_Class) {
    checkAssign(expr, scope, formal_list);
  } else if (expr instanceof Caller_Class) {
    return checkCaller(expr, scope, formal_list);
  } else if (expr instanceof Cond_Class) {
    return checkCond(expr, expr.lExpr, expr.rExpr, scope, formal_list);
  } else if (expr instanceof Add_Class || expr instanceof Sub_Class) {
    const { lvalue, rvalue } = expr;
    return checkArigthm(expr, lvalue, rvalue, scope, formal_list);
  } else if (expr instanceof Indentifier_Class || expr instanceof Int_Contant_Class || expr instanceof Bool_Class) {
    return checkMeta(expr, scope, formal_list);
  } else if (expr instanceof Branch_Class) {
    return checkBranch(expr, scope, formal_list);
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
      hasReturn = true;
      switchTest(expressions, scopeRoot, formal_list, return_type);
    } else {
      switchTest(expressions, scopeRoot, formal_list);
    }
    
    expressions = expressions.next;
  }
  if (!hasReturn && return_type !== 'void') {
    throw new Error(`Type 'void' is not assignable to type '${return_type}'.`);
  }
}
// Duplicate function implementation1212.
