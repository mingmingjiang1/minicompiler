// 具有优先级，优先级自上而下，得用
%%
if  {return IF;}
int  {return IF;}
return  {return IF;}
[a-z][a-z0-9]*  {return IDENTIFIER;}
[0-9]+  {return NUM;}
[:-`]   {return 'ERROR';},
\s  {return 'WHITE';},
{  {return IF;}
}  {return IF;}
(  {return IF;}
)  {return IF;}
;  {return IF;}
,  {return IF;}
%%
