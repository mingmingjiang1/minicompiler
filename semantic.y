%%
import { Int_Contant_Class, TreeNode, Function_Class, Add_Class, Formal_Class, Mutiply_Class, Indentifier_Class } from "./tree";
let yyval: TreeNode;
%%


%%
E : P {
  yyval = new Int_Contant_Class("constant")
}


P : F  {
  yyval = yyvalsp[0];
} | PF : {
  Root.append_funcs([yyvalsp[1], yyvalsp[0]] as any);
  break;
}

C : TOKEN.ID {
  yyval = new Indentifier_Class("identifier");
  break;
} | TOKEN.NUM  {
  yyval = new Int_Contant_Class("constant")
}
%%
