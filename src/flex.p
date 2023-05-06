// 具有优先级，优先级自上而下，得用
// 第一部分是token定义

%%
declare enum TOKEN {
  IF = 1,
  ID,
  NUM,
  ERROR,
  WHITE,
  KEYWORD,
  TYPE,
  ELSE,
  DOUBLEEQUAL,
  EQUAL,
  SUB,
}
%%

%%
True|False  {return TOKEN.BOOL;}
return  {return TOKEN.KEYWORD;}
int|bool|void  {return TOKEN.TYPE;}
else  {return TOKEN.ELSE;}
if  {return TOKEN.IF;}
[0-9]+  {return TOKEN.NUM;}
[a-z][a-z0-9]*  {return TOKEN.ID;}
[\s\t\n]  {return TOKEN.WHITE;}
{  {return '{';}
}  {return '}';}
(  {return '(';}
)  {return ')';}
;  {return ';';}
,  {return ',';}
==  {return TOKEN.COND;}
>=  {return TOKEN.COND;}
>  {return TOKEN.COND;}
<  {return TOKEN.COND;}
<=  {return TOKEN.COND;}
!=  {return TOKEN.COND;}
=  {return TOKEN.ASSIGN;}
-  {return '-';}
\+  {return '+';}
\*  {return '*';}
/  {return '/';}
//  {return TOKEN.COMMENT;}
[:-`]  {return TOKEN.ERROR;}
%%
