.data
y:		.word	100
z:		.word	200

.text            # text section

.globl main      # call main by SPIM

#int sub1(int x = 20, int y = 100) {
  #int z = x - y;
  #return z;
#}

main:
sw $30, 0($29)      #save fp[30, ]
addiu $29, $29, -4  #amplify

li $a0, 100         #save param1[30, 100, ]
sw $a0, 0($29)      #amplify
addiu $29, $29, -4  #amplify

li $a0, 20          #save param2[30, 100, 20, ]
sw $a0, 0($29)      #amplify
addiu $29, $29, -4  #amplify

jal sub1            #jump to target

move $a0, $2
li $v0, 1          #exit register
syscall             #exit system call

li $v0, 10          #exit register
syscall             #exit system call


sub1:
move $30, $29       #reassign fp, fp = sp
sw $31, 0($29)      #save return addr[30, 100, 20, return], fp point to return postion
addiu $29, $29, -4  #amplify[30, 100, 20, return, ]


lw $a0, 8($30)      #load x, fp+8, 如果是id，则从param(fp+, formals)或者局部变量(fp-, exp)里找
sw $a0, 0($29)
addiu $29, $29, -4

lw $a0, 4($30)      #load y, fp+4, 如果是id，则从param(fp+)或者局部变量(fp-)里找
lw $t0, 4($29)      #load y, fp+4, 如果是id，则从param(fp+)或者局部变量(fp-)里找
addiu $29, $29, 4
sub $a0, $t0, $a0   #x - y

sw $a0, 0($29)       #[30, 100, 20, return, z]
addiu $29, $29, -4   #[30, 100, 20, return, z, ]

addiu $29, $29, 4  #[30, 100, 20, return, z]
lw $2, 0($29)      #save return value, Return_Class

addiu $29, $29, 4   #[30, 100, 20, return] #pop local variable, while () {一直pop}
lw $31, 0($29)      #load return addr
addiu $29, $29, 16   #pop [, ]
lw $30, 0($29)      #reassign sp to return addr
jr $31              #jump to source

