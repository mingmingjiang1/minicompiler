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
if  {return TOKEN.IF;}
else  {return TOKEN.ELSE;}
int|bool|void  {return TOKEN.TYPE;}
return  {return TOKEN.KEYWORD;}
[a-z][a-z0-9]*  {return TOKEN.ID;}
[0-9]+  {return TOKEN.NUM;}
[\s\t\n]  {return TOKEN.WHITE;}
{  {return '{';}
}  {return '}';}
(  {return '(';}
)  {return ')';}
;  {return ';';}
,  {return ',';}
==  {return TOKEN.COND;}
>=  {return TOKEN.COND;}
<=  {return TOKEN.COND;}
>  {return TOKEN.COND;}
<  {return TOKEN.COND;}
!=  {return TOKEN.COND;}
>=  {return TOKEN.COND;}
<=  {return TOKEN.COND;}
>  {return TOKEN.COND;}
<  {return TOKEN.COND;}
=  {return TOKEN.ASSIGN;}
-  {return '-';}
\+  {return '+';}
\*  {return '*';}
/  {return '/';}
//  {return TOKEN.COMMENT;}
[:-`]   {return TOKEN.ERROR;}
%%
