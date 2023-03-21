/* 
DFA
target：
写一个NFA->DFA,看情况只会写一个DFA也可以
输入: 字符流
eg:
int test() {
  int x = m + n;
  return x;
}

[type \s Identifier ( ) { \n \t Identifier \s Identifier \s + \s Identifier ; \n \t ]

输出：Token流

Token类

[
  {
    value: 原始值
    token: 类型
  }
]
*/