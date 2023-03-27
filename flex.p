// 具有优先级，优先级自上而下，得用
%%
if  {return IF;}
[a-z][a-z-0-9]*  {return ID;}
[0-9]+  {return NUM;}
%%