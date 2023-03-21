// export const {
// [Token.ConstantToken]
// }

// enum Token {
//   TypeToken = 0,
//   IdendifierToken = 1,
//   ConstantToken = 2,
//   KeywordToken = 3,
// }

enum TypeEnum {
  "Root",
  "Program",
  "Return",
  "Param",
  "Body",
  "Assign",
  "M",
  "G",
  "T",
  "O",
}

/* 
定义语言minic：
类型：int | string
变量名称：和一般语言一样
参数类型，任意，不支持剩余语法(...)
函数体：
  if语句：
  {作用域}
  =
  返回语句
  加和乘
  变量必须初始化
函数调用
int | string test() { 

}
*/

/* 
good example:
file1.minic
int test(int x, inty) {
  int res = x + y
  return res;
}

int test2(int x) {
  if (x == 0) {
    return 0;
  } else {
    return test2(x-1);
  }
}

int test3(int x) {
  {
    int x = 12;
  }
  int y = x + 1;
  retyrn y;
}

A->A+C
A->C
C->C*F
C->F
F->id
F->(A)

全局变量Type

Expr -> AssignExpr | ReturnExpr
CallerExpr -> Idenfifer(参数少了类型);
ReturnExpr -> Return Identifier;
AssignExpr -> Type Idenfifier = RightExpr;
RightExpr -> Identifier | Constant | Agrithemic
Agrithemic-> a+b | (a+b)

case RightExpr: 

case Expr:
        Type = Type;
由于是自底向上的：
如果是assign表达式，则：
从叶子节点开始，考虑最复杂的情况，四则运算：
  case F:
        return idClass
  case C:
        return idClass
  case A:
        两个idClass
  case RightExpr:
        AddOperation(idClass, idClass);
在规约的时候使用stack存储，供给上层节点使用，
*/