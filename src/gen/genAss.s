.data

.text            # text section

.globl main                 # call main by SPIM
main:
sw $30, 0($29)
addiu $29, $29, -4
li $a0, 1000000
sw $a0, 0($29)
addiu $29, $29, -4
jal sub1
li $v0, 10
syscall

sub1:
move $30, $29
sw $31, 0($29)
addiu $29, $29, -4
lw $a0, 4($30)
sw $a0, 0($29) #保存参数1到stack
addiu $29, $29, -4

li $a0, 77 #手动指定声明的变量
sw $a0, 0($29) #保存声明变量到stack
addiu $29, $29, -4

lw $t0, 4($29) #加载声明变量到t0
lw $a0, 4($30) #加载参数



addiu $29, $29, 4
sub $a0, $a0, $t0
li $v0, 1
syscall

#return语句上面一句
addiu $29, $29, 4 #把return后面的局部变量全部pop(Yes)

lw $31, 4($29) #读取返回地址
addiu $29, $29, -4 #stack pop
lw $30, 0($29) # ？？？，最后应该根据old fp重新更新fp寄存器？并且清空参数和return addr(直接重置sp => )
jr $31


int test(int y) {
  int x = 3
  return x - y;
}
