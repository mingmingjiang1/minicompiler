P -> E
E -> P
P -> D

%%

S   :   S E '\n'        { printf("ans = %lf\n", $2); }
    |   /* empty */     { /* empty */ }
    ;

E   :   E '+' E         { printf("value is %lf.",$$); $$ = $1 + $3;printf("value is %lf.\n",$$); }
    |   E '-' E         { $$ = $1 - $3; }
    |   E '*' E         { $$ = $1 * $3; }
    |   E '/' E         { $$ = $1 / $3; }
    |   T_NUM           { $$ = $1;  printf(" val is %lf.\n",$1);}
    |   '(' E ')'       { $$ = $2; }
    ;

%%

bison提供了一个YYSTYPE类型的全局变量yylval。这个YYSTYPE的类型是个宏，可以自定义。这样，可以在词法分析的时候识别出类型的时候，顺便把这个词素的值也保存下来。
YYSTYPE yylval


输入：3 + 2
输出：
val is 3.000000.
val is 2.000000.
value is 3.000000.value is 5.000000.
ans = 5.000000

/*
E: P$
{

}

P: F
{

}

P: P + ; + F
{

}

F: Token.TypeToken + Token.IdendifierToken + ( + O + ) + { + B + }
{

}

O:  Token.TypeToken + Token.IdendifierToken,
{

}

O: O + , + Token.TypeToken + Token.IdendifierToken
{

}

B: Token.TypeToken + Token.IdendifierToken + = + A + ; + B
{

}

B: Token.KeywordToken + Token.IdendifierToken + ;
{

}

A->A + C | A * C | C
{

}

C: Token.IdendifierToken | Token.ConstantToken
{
  console.log($1)
  if (常量) {
    new Constant();
  } else {
    new identifier();
  }
}

常量/标识符/函数/声明赋值/返回语句/plus/multiply/program
*/
全局变量：yytext匹配的词素, yyval传递给semantic的值
NFA -> DFA -> 借助table，每次到达一个终态，就返回一个Token和赋予对应的词素（eg: yyval = atoi(text)）;这个算是一个action了
然后对应的类型就会有yyval，所以我觉得类的生成应该放在这一步；然后在semantic分析的时候就可以使用这些类了。


## prerequste:
1. spim
2. ts-node


## How to run ?
1. 编译代码文件 => 汇编文件: ` npm run compile 文件名 ` 
2. 执行汇编文件: ` npm run mc 文件名 ` 

会包含的：
1. 实现nfa，以及联合nfa => dfa，进行词法分析
2. 实现dfa，进行语法分析，并基于此构建抽象语法树(AST)
3. 基于ast进行语言义分析(类型检查以及是否符合语言规范)
4. 基于ast生成汇编代码，虽然本文没有显示的终中间代码生成过程，但是也有类似的思想

不会包含的：
本语言比较简单，不会涉及复杂的编译器后端知识：如垃圾回收，寄存器染色，数据流分析等等


minic语法：
1. 运算符：支持+-*/运算
2. 类型：支持自然数(int类型)，字符串，布尔值以及void
3. 语句：支持函数调用，嵌套的if-else语句
4. 和C一样，必须要有main函数
5. 变量必须声明的时候同时赋值

example：
```c

```

parser部分：



ast生成部分：


语义分析部分



代码生成部分
基于ast进行代码生成，一个常规的方法是自上而下进行代码生成，




