.data
z:              .word   0
m:              .word   0

.text                       # text section  
.globl main                 # call main by SPIM  

test:
    li $a0, 20
        sw $a0, 0($29)
        addiu $29, $29, -4
    li $a0, 11
        lw $t0, 4($29)
        addiu $29, $29, 4
        sub $a0, $t0, $a0
        li $v0, 1
        syscall
        li $v0, 10
        syscall
        sw $a0, z
        lw $a0, z
        li $v0, 1          
        syscall
test2:
    li $a0, 100
        sw $a0, 0($29)
        addiu $29, $29, -4
    li $a0, 12
        lw $t0, 4($29)
        addiu $29, $29, 4
        sub $a0, $t0, $a0
        li $v0, 1
        syscall
        li $v0, 10
        syscall
        sw $a0, m
        lw $a0, m
        li $v0, 1          
        syscall
main:
  j test2
