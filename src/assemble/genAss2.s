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
li $a0, 82
sw $a0, 0($29)
addiu $29, $29, -4
,jal test
sw $a0, 0($29)
addiu $29, $29, -4
sw $30, 0($29)
addiu $29, $29, -4
lw $a0, -4($30)
sw $a0, 0($29)
addiu $29, $29, -4
,jal print
li $v0, 10
syscall
statement1:
li $a0, 20
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 200
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 50
lw $t0, 4($29)
addiu $29, $29, 4
add $a0, $t0, $a0
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 20
lw $t0, 4($29)
addiu $29, $29, 4
mul $a0, $t0, $a0
move $v0, $a0
addiu $29, $29, 8
lw $31, 4($29)
addiu $29, $29, 12
lw $30, 0($29)
jr $31
statement2:
li $a0, 200
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 300
move $v0, $a0
addiu $29, $29, 8
lw $31, 4($29)
addiu $29, $29, 12
lw $30, 0($29)
jr $31
test:
move $30, $29
sw $31, 0($29)
addiu $29, $29, -4
li $a0, 100
sw $a0, 0($29)
addiu $29, $29, -4
lw $a0, 4($30)
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 50
lw $t0, 4($29)
addiu $29, $29, 4
bgt	$t0, $a0, statement1
b statement2
