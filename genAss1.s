
.data
value:  .word 10
msg1:  .asciiz "result= "

.text                       # text section  
.globl main                 # call main by SPIM  

main:
    sw $30, 0($29)
    addiu $29, $29, -4
    li $a0, 100 # 形参
    sw $a0, 0($29)
    addiu $29, $29, -4
    jal test
    # 打印
    
    li $v0, 1          
    syscall

    li	$v0, 10
    syscall


test:
    move $30, $29
    sw $31, 0($29)      # 保存返回地址
    addiu $29, $29, -4

    # sub expression
    li $a0, 10       #读取第二个常量
    lw $t1, 8($29)      #get first number from stack top
    sub $a0, $t1, $a0   #求两个整数之差

    # 打印

  
    lw $31, 4($29)
    addiu $29, $29, 12

    lw $30, 0($29)
    sw $a0, 0($29)
    jr $31
