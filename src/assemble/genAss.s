.data

.text            # text section

.globl main                 # call main by SPIM
main:
sw $30, 0($29)
addiu $29, $29, -4
li $a0, 100
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 200
sw $a0, 0($29)
addiu $29, $29, -4
jal sub1
li $v0, 10
syscall


sub1:
move $30, $29
sw $31, 0($29)
addiu $29, $29, -4

lw $a0, 8($30)
sw $a0, 0($29)
addiu $29, $29, -4
lw $a0, 4($30)
lw $t0, 4($29)

addiu $29, $29, 4
sub $a0, $a0, $t0
li $v0, 1
syscall
sw $a0, 0($29)
addiu $29, $29, -4
lw $a0, 4($29)
move $2, $a0
addiu $29, $29, 8
lw $31, 0($29)
addiu $29, $29, 16
lw $30, 0($29)
jr $31
