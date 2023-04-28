
.data
value:  .word 0, 0, 0
msg1:  .asciiz "result= "

.text                       # text section  
.globl main                 # call main by SPIM  

main:
test:
    li $a0, 1
    sw $a0, 0($29)
    addiu $29, $29, -4
    li $a0, 10
    lw $t0, 4($29)
    addiu $29, $29, 4
    add $a0, $t0, $a0
    li $v0, 1
    syscall
    li $v0, 10
    syscall
    li $a0, 1
    sw $a0, 0($29)
    addiu $29, $29, -4
    li $a0, 10
    lw $t0, 4($29)
    addiu $29, $29, 4
    sub $a0, $t0, $a0
    li $v0, 1
    syscall
    li $v0, 10
    syscall
  
  j test