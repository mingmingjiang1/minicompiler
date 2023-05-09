import { Function_Class } from "./tree";

function test() {
  return {
    "E->P$": {
      action: (yyvalsp: any) => new Function_Class(
        yyvalsp[4][2],
        yyvalsp[3][2],
        undefined,
        yyvalsp[0]
      ),
    },
  }
}

/* 
作用域表：scope
  scope       scope

scope: Linklist {

}

SymbolTabel = {
  parent: ,
  scope: [
    name,
    test,
    // 同一个scope不允许重复声明变量，
    // 当变量使用时，需要去推导其使用路径
  ]
}
*/