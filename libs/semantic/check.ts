import chalk from "chalk";
import _ from "lodash";
import { errorMsg } from "../utils";
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
  Formal_Class,
  Function_Class,
  Indentifier_Class,
  Int_Contant_Class,
  Mul_Class,
  Program_Class,
  Return_Class,
  Sub_Class,
} from "./tree";

const error = chalk.bold.red;

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
    return (
      target.returnType === func.return_type &&
      target.formalsType.every(
        (formal, index) => formal.type === func.formal_list[index].type
      )
    );
  });
  if (isR) {
    throw new Error(errorMsg(`Duplicate function signature: ${func.name}`));
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

export interface Scope {
  scope: { name: string; type: string }[];
  next?: Scope[];
  parent?: Scope;
}

const scopes: Scope = {
  scope: [], // top scope
  next: [],
};

export function semanticCheck(ast: Program_Class) {
  let cur = ast.expr as Function_Class;
  while (cur) {
    if (!funcIsExisted(cur, FunctionMap, cur.name)) {
      if (!FunctionMap.get(cur.name)) {
        FunctionMap.set(cur.name, []);
      }
      // const copyF = _.cloneDeep(cur);
      // copyF.next = undefined;
      FunctionMap.get(cur.name).push({
        f: cur,
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
    throw new Error(errorMsg("No main function has been implemented!"));
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

function checkFormals(
  expr: Formal_Class,
  formal_list: { type: string; id: string }[]
) {
  // check same formals exsisted or not
  if (new Set(formal_list.map(formal => formal.id)).size !== formal_list.length) {
    throw new Error(
      errorMsg(
        `Can't declare same formals`
      )
    );
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
      throw new Error(
        errorMsg(
          `The variable ${expr.token} is not found, please declare it first!`
        )
      );
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
  } else if (expr instanceof Caller_Class) {
    return checkCaller(expr, scope, formal_list);
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
      errorMsg(
        `Type '${t1}' is incompatible with type '${t2}', both should are int type`
      )
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
      errorMsg(
        `Type '${t1}' is incompatible with type '${t2}', both should are int type`
      )
    );
  }
  return "bool";
}

function checkCaller(
  expr: Caller_Class,
  scope: Scope,
  formal_list: { type: string; id: string }[]
) {
  if (expr.id === "main") {
    throw new Error(errorMsg("Main function can't been call"));
  }

  // first check params and formals
  const caller = FunctionMap.get(expr.id);
  if (!caller) {
    throw new Error(errorMsg(`${expr.id} has not been implemented`));
  }

  let { params } = expr;
  if (
    expr.id === "print" &&
    (expr.params_list.length >= 2 || !expr.params_list.length)
  ) {
    throw new Error(errorMsg("There must be only one param in print function"));
  }

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
    errorMsg(
      `There is no suitable function signature for ${expr.id}, check the function name, parameter type, and return type`
    )
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
      errorMsg(`Type '${type}' is not assignable to type '${return_type}'.`)
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
  // const scopeTrue: Scope = {
  //   scope: [],
  //   next: [],
  //   parent: scope,
  // };
  // const scopeFalse: Scope = {
  //   scope: [],
  //   next: [],
  //   parent: scope,
  // };
  // scope.next.push(scopeTrue, scopeFalse);
  let returnFlag1, returnFlag2;

  while (statementTrue) {
    if (statementTrue instanceof Declare_Class) {
      throw new Error(errorMsg("Cant't declare block variable"));
    }
    returnFlag1 = switchTest(statementTrue, scope, formal_list, return_type);
    statementTrue = statementTrue.next;
  }
  while (statementFalse) {
    if (statementFalse instanceof Declare_Class) {
      throw new Error(errorMsg("Cant't declare block variable"));
    }
    returnFlag2 = switchTest(statementFalse, scope, formal_list, return_type);
    statementFalse = statementFalse.next;
  }

  // if (typeof returnFlag1 !== "string" || typeof returnFlag2 !== "string") {
  //   throw new Error("if-else内部必须有return语句");
  // }

  return returnFlag1 && returnFlag2;
}

function checkAssign(
  expr: Assign_Class,
  scope: Scope,
  formal_list: { type: string; id: string }[]
) {
  // current scope
  const { name, r } = expr;
  let target;
  target = formal_list.find((item) => item.id === name.token);
  if (!target) {
    target = scope.scope.find((item) => item.name === name.token);
  }
  if (!target) {
    throw new Error(
      errorMsg(
        `The variable ${name.token} is not found, please declare it first!`
      )
    );
  }
  const actualType = target.type;
  const type = switchTest(r, scope, formal_list);
  if (actualType !== type) {
    throw new Error(
      errorMsg(`Type '${actualType}' is not assignable to type '${type}'.`)
    );
  }
}

function checkDeclare(
  expr: Declare_Class,
  scope: Scope,
  formal_list: { type: string; id: string }[]
) {
  // current scope
  const { ltype, name, r } = expr;
  let target;
  target = formal_list.find((item) => item.id === name);
  if (target) {
    throw new Error(errorMsg(`Cant't declare ${name} duplcated in params!`));
  }

  target = scope.scope.find((item) => item.name === name);
  if (target) {
    throw new Error(errorMsg(`${name} has been declared!`));
  }

  const type = switchTest(r, scope, formal_list);

  if (ltype !== type) {
    throw new Error(
      errorMsg(`Type '${type}' is not assignable to type '${ltype}'.`)
    );
  }

  // push var into cur scope;
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
  if (expr instanceof Declare_Class) {
    checkDeclare(expr, scope, formal_list);
  } else if (expr instanceof Caller_Class) {
    return checkCaller(expr, scope, formal_list);
  } else if (expr instanceof Cond_Class) {
    return checkCond(expr, expr.lExpr, expr.rExpr, scope, formal_list);
  } else if (
    expr instanceof Add_Class ||
    expr instanceof Sub_Class ||
    expr instanceof Div_Class ||
    expr instanceof Mul_Class
  ) {
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
  } else if (expr instanceof Assign_Class) {
    checkAssign(expr, scope, formal_list);
  } 
  // else if (expr instanceof Formal_Class) {
  //   checkFormals(expr, formal_list);
  // }
}

function checkFunc(f: Function_Class) {
  // function scope
  const scopeRoot: Scope = {
    scope: [], // top function scope
    next: [],
  };
  let { expressions } = f;

  const { formal_list, return_type } = f;
  let hasReturn = false;
  while (expressions) {
    if (expressions instanceof Branch_Class) {
    } else if (expressions instanceof Return_Class) {
      hasReturn = true;
    } else {
    }
    switchTest(expressions, scopeRoot, formal_list, return_type);

    expressions = expressions.next;
  }
  if (!hasReturn && return_type !== "void" && f.name !== "main")
    throw new Error(
      errorMsg(`Type 'void' is not assignable to type '${return_type}'.`)
    );
}
// Duplicate function implementation
