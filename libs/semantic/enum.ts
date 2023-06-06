import { TOKEN } from "../type";

const transformRFH = (s: (string | TOKEN)[]) => {
  return s.join(' ');
}

// export const testEnum = {
//   ["E" + "->" + transformRFH(['P', '$'])]: 0,
//   ["P" + "->" + transformRFH(['L', '+', 'P'])]: 1,
//   ["P" + "->" + transformRFH(['L'])]: 2,
//   ["L" + "->" + transformRFH([TOKEN.ID])]: 3,
//   // ["L" + "->" + transformRFH(['L', ',', 'P'])]: 4,
// }

// export const testEnum2 = {
//   ["E" + "->" + transformRFH(['P', 'S'])]: 0,
//   ["S" + "->" + transformRFH(['+', 'P', 'S'])]: 1,
//   ["P" + "->" + transformRFH(['F', 'L'])]: 2,
//   ["L" + "->" + transformRFH(['*', 'F', 'L'])]: 3,
//   ["F" + "->" + transformRFH(['(', 'E', ')'])]: 4,
//   ["F" + "->" + transformRFH(['x'])]: 5,
//   ["S" + "->" + transformRFH([EMPTY])]: 6,
//   ["L" + "->" + transformRFH([EMPTY])]: 7,
// }

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
*/

export const ex = [
  'E: Program $',
  'Program: Function',
  'Program: Program Function',
  `Function: ${TOKEN.TYPE} ${TOKEN.ID} ( Formals ) Blocks`,
  `Formals: ${TOKEN.TYPE} ${TOKEN.ID}`,
  `Formals: Formals , ${TOKEN.TYPE} ${TOKEN.ID}`,
  'Expression: Assign',
  'Expression: Arigthm',
  'Expression: Condition',
  'Expression: Return',
  `Return: ${TOKEN.KEYWORD} Expression`,
  `Assign: ${TOKEN.TYPE} ${TOKEN.ID} ${TOKEN.ASSIGN} Expression`,
  'Arigthm: Arigthm + Token',
  'Arigthm: Token',
  `Factor: ${TOKEN.BOOL}`,
  `Factor: ${TOKEN.ID}`,
  `Factor: ${TOKEN.NUM}`,
  `Condition: Expression ${TOKEN.COND} Expression`,
  `Caller: ${TOKEN.ID} ( )`,
  `Caller: ${TOKEN.ID} ( Params )`,
  'Params: Params , Expression',
  'Params: Expression',
  'Statement: Branch',
  'Blocks: { Statements }',
  `Branch: ${TOKEN.IF} ( Condition ) Blocks ${TOKEN.ELSE} Blocks`,
  `Function: ${TOKEN.TYPE} ${TOKEN.ID} ( ) Blocks`,
  'Statements: Statements Statement',
  'Statements: Statement',
  'Statement: Expression ;',
  'Arigthm: Arigthm - Token',
  'Token: Token * Factor',
  'Token: Token / Factor',
  'Token: Factor',
  `Expression: ${TOKEN.ID} ${TOKEN.ASSIGN} Expression`,
  'Factor: ( Arigthm )',
  'Factor: Caller',
  `Branch: ${TOKEN.IF} ( Condition ) Blocks`
]

export const test = {
  ["E" + "->" + transformRFH(['Program', '$'])]: 0,
  ['Program' + "->" + 'Function']: 1,
  ['Program' + "->" + transformRFH(['Program', 'Function'])]:2,
  ['Function' + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID, '(', 'Formals', ')', 'Blocks'])]:3,
  ["Formals" + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID])]: 4,
  ["Formals" + "->" + transformRFH(["Formals", ",", TOKEN.TYPE, TOKEN.ID])]: 5,
  ['Expression' + "->" + transformRFH(['Assign'])]: 7,
  ['Expression' + "->" + transformRFH(['Arigthm'])]: 8,
  ['Expression' + "->" + transformRFH(['Condition'])]: 9,
  ['Expression' + "->" + transformRFH(['Return'])]: 10,
  ['Return' + "->" + transformRFH([TOKEN.KEYWORD, 'Expression'])]:11,
  ['Assign' + "->" + transformRFH([TOKEN.TYPE, TOKEN.ID, TOKEN.ASSIGN, 'Expression'])]: 12,
  ['Arigthm' + "->" + transformRFH(['Arigthm', '+', 'Token'])]: 13,
  ['Arigthm' + "->" +'Token']: 14,
  // ['Token' + "->" + TOKEN.ID]:15,
  // ['Token' + "->" + TOKEN.NUM]: 16,
    // ['Arigthm' + '->' + 'Token']: 33,
  // ['Token' + "->" +'Factor']: 33,
  ['Factor' + "->" + TOKEN.BOOL]: 32,
  ['Factor' + "->" + TOKEN.ID]:15,
  ['Factor' + "->" + TOKEN.NUM]: 16,
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
  ['Token' + "->" + transformRFH(['Token', '*', 'Factor'])]: 30,
  ['Token' + "->" + transformRFH(['Token', '/', 'Factor'])]: 31,
  ['Token' + "->" +'Factor']: 33,
  ["Expression" + "->" + transformRFH([TOKEN.ID, TOKEN.ASSIGN, "Expression"])]: 34,
  ['Factor' + "->" + transformRFH(['(', 'Arigthm', ')'])]: 35,
  ['Factor' + "->" + 'Caller']: 36,
  // ['Blocks' + "->" + transformRFH(['{', 'Statements', '}', 'ElseBlock'])]: 37,
  ["Branch" + "->" + transformRFH([TOKEN.IF,  "(", "Condition", ")", "Blocks"])]: 37,
}

// export const testExample2 = {
//   ["E" + "->" + transformRFH(['Program', '$'])]: 0, // E
//   ['Program' + "->" + transformRFH(['Assign', TOKEN.COND, 'Assign'])]: 1,
//   ['Assign' + "->" + transformRFH(['Assign', '+', 'Token'])]: 2,
//   ['Assign' + "->" + transformRFH(['Token'])]: 3,
//   ['Token' + "->" + transformRFH(['x'])]: 4,
// }

export const key2production = invertKeyValues(test)
