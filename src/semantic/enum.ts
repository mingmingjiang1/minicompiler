import { TOKEN } from "../type";
import { EMPTY } from "./setUtil";

const transformRFH = (s: (string | TOKEN)[]) => {
  return s.join(' ');
}

export const production2key = {
  ["E" + "->" + transformRFH(['Program', '$'])]: 0,
  ["Program" + "->" + "Function"]: 1, // 一个表达式
  ["Program" + "->" + transformRFH(['Program', 'Function'])]: 2, // 多个表达式
  ["Function" + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID, "(", "Formals", ")", "Statement"])]: 3,
  ["Function" + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID, "(", ")", "Statement"])]: 4,
  ["Statement" + "->" + transformRFH(["{", "Expressions", "}"])]: 5,
  ["Expressions" + "->" + "Expression"]: 6,
  ["Expressions" + "->" + transformRFH(["Expressions", "Expression"])]: 7,
  ["Expression" + "->" + transformRFH([TOKEN.IF,  "(", "Condition", ")", "Statement", TOKEN.ELSE, "Statement"])]: 8, // if-else
  ["Condition" + "->" + transformRFH(['A', TOKEN.COND, 'A'])]: 9, // 条件判断
  ["Formals" + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID])]: 13,
  ["Formals" + "->" + transformRFH(["Formals", ",", TOKEN.TYPE, TOKEN.ID])]: 14,
  ["Expression" + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID, TOKEN.ASSIGN, "A", ";"])]: 15, // 声明式加减乘除 语句
  ["Expression" + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID, TOKEN.ASSIGN, "Caller"])]: 16, // 声明式加减乘除 语句
  ["A->" + transformRFH(['A', '+', 'C'])]: 17,
  ["A->" + transformRFH(['A', '/', 'C'])]: 18,
  ["A->" + transformRFH(['A', '*', 'C'])]: 19,
  ["A->" + transformRFH(['A', '-', 'C'])]: 20,
  ["A->C"]: 21,
  ["C" + "->" + TOKEN.ID]: 22,
  ["C" + "->" + TOKEN.NUM]: 23,
  ["Params" + "->" + 'C']: 24,
  ["Params" + "->" + transformRFH(["Params", ",", 'C'])]: 25,
  ["Caller" + "->" + transformRFH([TOKEN.ID, '(', ')', ';'])]: 26, //
  ["Caller" + "->" + transformRFH([TOKEN.ID, '(', 'Params', ')', ';'])]: 27,
  // ["Caller" + "->" + transformRFH([TOKEN.ID, '(', 'A', ')', ';'])]: 34,
  ["Expression" + "->" + transformRFH([TOKEN.KEYWORD, 'Caller'])]: 28, // 返回判断
  // // ["B" + "->" + transformRFH([TOKEN.KEYWORD, TOKEN.CALL, 'Caller'])]: 30, // 返回调用
  // ["Expression" + "->" + "F"]: 29,
  // // ["Expression" + "->" + "B"]: 33,
  ["Expression" + "->" + transformRFH([TOKEN.KEYWORD, "A", ";"])]: 30, // 返回constant
  // ["B" + "->" + 'Caller']: 31, // 调用
};

export const testEnum = {
  ["E" + "->" + transformRFH(['P', '$'])]: 0,
  ["P" + "->" + transformRFH(['L', '+', 'P'])]: 1,
  ["P" + "->" + transformRFH(['L'])]: 2,
  ["L" + "->" + transformRFH([TOKEN.ID])]: 3,
  // ["L" + "->" + transformRFH(['L', ',', 'P'])]: 4,
}

export const testEnum2 = {
  ["E" + "->" + transformRFH(['P', 'S'])]: 0,
  ["S" + "->" + transformRFH(['+', 'P', 'S'])]: 1,
  ["P" + "->" + transformRFH(['F', 'L'])]: 2,
  ["L" + "->" + transformRFH(['*', 'F', 'L'])]: 3,
  ["F" + "->" + transformRFH(['(', 'E', ')'])]: 4,
  ["F" + "->" + transformRFH(['x'])]: 5,
  ["S" + "->" + transformRFH([EMPTY])]: 6,
  ["L" + "->" + transformRFH([EMPTY])]: 7,
}

const invertKeyValues = (obj: any) =>
  Object.keys(obj).reduce(
    (acc, key) => {
      acc[obj[key as any]] = key;
      return acc;
    },
    {} as {
      [key: number]: string;
    }
  );

/* 
Statement -> Expression;
Expression -> Caller 调用
Expression -> Arithm 算术四则
Expression -> Condition 条件判断
Expression -> Assign 声明语句
Expression -> ID 标识符
Expression -> NUM 整数
Assign -> Arithm
Assign -> ID
Assign -> NUM
Return -> return Statement
Condition -> 
Params -> Params, Expression
Params -> Expression
Caller -> ID (Params)

Program -> Function
Program -> Function + Program
Function -> int ( Formals ) { Expressions }
Expressions -> Expression | Branch
Expressions -> Expression Expressions
Expression -> Caller | Condition | Assign | Agrithm ;
Return -> Expression
Caller
Condition
Assign
Agrithm -> Agrithm + Token
Agrithm -> Token
Token -> ID
Token -> NUM
Assign -> type ID = Expression
Condition -> Expression === Expression
Caller TOKEN.ID ( ) 
Caller TOKEN.ID ( Params )
Params -> Params, Expression
Params -> Expression

  ["A->" + transformRFH(['A', '+', 'C'])]: 17,
  ["A->" + transformRFH(['A', '/', 'C'])]: 18,
  ["A->" + transformRFH(['A', '*', 'C'])]: 19,
  ["A->" + transformRFH(['A', '-', 'C'])]: 20,
*/

export const test = {
  ["E" + "->" + transformRFH(['Program', '$'])]: 0,
  ['Program' + "->" + 'Function']: 1,
  ['Program' + "->" + transformRFH(['Program', 'Function'])]:2,
  ['Function' + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID, '(', 'Formals', ')', 'Blocks'])]:3,
  ["Formals" + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID])]: 4,
  ["Formals" + "->" + transformRFH(["Formals", ",", TOKEN.TYPE, TOKEN.ID])]: 5,
  // ['Expressions' + "->" +'Expression']:5,
  // ['Expressions' + "->" + transformRFH(['Expressions', 'Expression'])]:6,
  ['Expression' + "->" + transformRFH(['Caller'])]:6,
  ['Expression' + "->" + transformRFH(['Assign'])]: 7,
  ['Expression' + "->" + transformRFH(['Arigthm' ])]: 8,
  ['Expression' + "->" + transformRFH(['Condition'])]: 9,
  ['Expression' + "->" + transformRFH(['Return'])]: 10,


  ['Return' + "->" + transformRFH([TOKEN.KEYWORD, 'Expression'])]:11,
  ['Assign' + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID, TOKEN.ASSIGN, 'Expression'])]: 12,
  ['Arigthm' + "->" + transformRFH(['Arigthm', '+', 'Token'])]: 13,
  ['Arigthm' + "->" +'Token']: 14,
  ['Token' + "->" + TOKEN.ID]:15,
  ['Token' + "->" + TOKEN.NUM]: 16,
  ['Condition' + "->" + transformRFH(['Expression', TOKEN.COND, 'Expression'])]: 17,
  ['Caller' + "->" + transformRFH([TOKEN.ID, '(', ')'])]: 18,
  ['Caller' + "->" + transformRFH([TOKEN.ID, '(', 'Params', ')'])]: 19,
  ['Params' + "->" + transformRFH(['Params', ',', 'Expression'])]: 20,
  ['Params' + "->" + 'Expression']: 21,
  // ['Statement' + "->" + 'Expressions']: 22,
  ['Statement' + "->" + 'Branch']: 22,
  ['Blocks' + "->" + transformRFH(['{', 'Statements', '}'])]: 23,
  ["Branch" + "->" + transformRFH([TOKEN.IF,  "(", "Condition", ")", "Blocks", TOKEN.ELSE, "Blocks"])]: 24,
  ["Function" + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID, "(", ")", "Blocks"])]: 25,
  ['Statements' + "->" + transformRFH(['Statements', 'Statement'])]: 26,
  ['Statements' + "->" + transformRFH(['Statement'])]: 27,
  ['Statement' + "->" + transformRFH(['Expression', ';'])]: 28,
  ['Arigthm' + "->" + transformRFH(['Arigthm', '-', 'Token'])]: 29,
  ['Arigthm' + "->" + transformRFH(['Arigthm', '*', 'Token'])]: 30,
  ['Arigthm' + "->" + transformRFH(['Arigthm', '/', 'Token'])]: 31,
}

/* 

  ['Block' + "->" + transformRFH(['{', 'Statements', '}'])]: 25,
  ["Branch" + "->" + transformRFH([TOKEN.IF,  "(", "Condition", ")", "Block", TOKEN.ELSE, "Block"])]: 26,
  ["Function" + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID, "(", ")", "Block"])]: 30,
  
  ['Statement' + "->" + 'Branch']: 23,
  ['Statement' + "->" + transformRFH(['Caller', ';'])]: 31,
  ['Statement' + "->" + transformRFH(['Assign', ';'])]: 32,
  ['Statement' + "->" + transformRFH(['Return'])]: 33,
  ['Statement' + "->" + transformRFH(['Condition', ';'])]: 34,
  ['Statements' + "->" + transformRFH(['Statements', 'Statement'])]: 35,
  ['Statements' + "->" + transformRFH(['Statement'])]: 36,

*/

export const test1 = {
  ["E" + "->" + transformRFH(['Program', '$'])]: 0, // E
  ['Program' + "->" + transformRFH(['Assign', TOKEN.COND, 'Assign'])]: 1,
  ['Assign' + "->" + transformRFH(['Assign', '+', 'Token'])]: 2,
  ['Assign' + "->" + transformRFH(['Token'])]: 3,
  ['Token' + "->" + transformRFH(['x'])]: 4,
}

export const key2production = invertKeyValues(test)