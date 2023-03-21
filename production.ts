/* 
production: 产生式：lfh -> rfh
lfh:  产生式的左边;
rfh:  产生式的右边;
ind: number;
*/

export interface ProductionType {
  lfh: string;
  rfh: string;
  ind: number;
}