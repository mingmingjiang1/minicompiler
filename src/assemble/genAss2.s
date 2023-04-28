.data

.text            # text section

.globl main                 # call main by SPIM
print:
move $30, $29
sw $31, 0($29)
addiu $29, $29, -4
lw $a0, 8($29)
li $v0, 1
syscall
lw $31, 4($29)
addiu $29, $29, 12
lw $30, 0($29)
jr $31
main:
move $30, $29
sw $31, 0($29)
addiu $29, $29, -4
sw $30, 0($29)
addiu $29, $29, -4
li $a0, 5
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 5
sw $a0, 0($29)
addiu $29, $29, -4
jal multibranch
sw $a0, 0($29)
addiu $29, $29, -4
sw $30, 0($29)
addiu $29, $29, -4
lw $a0, -4($30)
sw $a0, 0($29)
addiu $29, $29, -4
jal print
li $v0, 10
syscall
statement1:
li $a0, 2222
sw $a0, 0($29)
addiu $29, $29, -4
sw $a0, 0($29)
addiu $29, $29, -4
lw $a0, 4($30)
lw $t0, 4($29)
addiu $29, $29, 4
add $a0, $t0, $a0
move $v0, $a0
addiu $29, $29, 4
lw $31, 4($29)
addiu $29, $29, 16
lw $30, 0($29)
jr $31
statement2:
li $a0, 100
move $v0, $a0
addiu $29, $29, 0
lw $31, 4($29)
addiu $29, $29, 16
lw $30, 0($29)
jr $31
multibranch:
move $30, $29
sw $31, 0($29)
addiu $29, $29, -4
sw $30, 0($29)
addiu $29, $29, -4
lw $a0, 8($30)
sw $a0, 0($29)
addiu $29, $29, -4
jal print
sw $30, 0($29)
addiu $29, $29, -4
lw $a0, 4($30)
sw $a0, 0($29)
addiu $29, $29, -4
jal print
sw $a0, 0($29)
addiu $29, $29, -4
lw $a0, 4($30)
lw $t0, 4($29)
addiu $29, $29, 4
add $a0, $t0, $a0
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 10
lw $t0, 4($29)
addiu $29, $29, 4
beq	$a0, $t0, statement1
b statement2
