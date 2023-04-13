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


