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
,jal test2
sw $a0, 0($29)
addiu $29, $29, -4
sw $30, 0($29)
addiu $29, $29, -4
,jal test1
sw $a0, 0($29)
addiu $29, $29, -4
sw $30, 0($29)
addiu $29, $29, -4
,jal test3
sw $a0, 0($29)
addiu $29, $29, -4
sw $30, 0($29)
addiu $29, $29, -4
,jal test4
sw $a0, 0($29)
addiu $29, $29, -4
sw $30, 0($29)
addiu $29, $29, -4
lw $a0, -4($30)
sw $a0, 0($29)
addiu $29, $29, -4
,jal print
sw $30, 0($29)
addiu $29, $29, -4
lw $a0, -8($30)
sw $a0, 0($29)
addiu $29, $29, -4
,jal print
sw $30, 0($29)
addiu $29, $29, -4
lw $a0, -12($30)
sw $a0, 0($29)
addiu $29, $29, -4
,jal print
sw $30, 0($29)
addiu $29, $29, -4
lw $a0, -16($30)
sw $a0, 0($29)
addiu $29, $29, -4
,jal print
lw $a0, -4($30)
move $v0, $a0
addiu $29, $29, 16
lw $31, 4($29)
addiu $29, $29, 8
lw $30, 0($29)
jr $31
li $v0, 10
syscall
test1:
move $30, $29
sw $31, 0($29)
addiu $29, $29, -4
li $a0, 2
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 2
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 3
lw $t0, 4($29)
addiu $29, $29, 4
mul $a0, $t0, $a0
lw $t0, 4($29)
addiu $29, $29, 4
add $a0, $t0, $a0
move $v0, $a0
addiu $29, $29, 0
lw $31, 4($29)
addiu $29, $29, 8
lw $30, 0($29)
jr $31
test2:
move $30, $29
sw $31, 0($29)
addiu $29, $29, -4
li $a0, 2
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 2
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 3
lw $t0, 4($29)
addiu $29, $29, 4
mul $a0, $t0, $a0
lw $t0, 4($29)
addiu $29, $29, 4
add $a0, $t0, $a0
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 5
lw $t0, 4($29)
addiu $29, $29, 4
add $a0, $t0, $a0
move $v0, $a0
addiu $29, $29, 0
lw $31, 4($29)
addiu $29, $29, 8
lw $30, 0($29)
jr $31
test3:
move $30, $29
sw $31, 0($29)
addiu $29, $29, -4
li $a0, 2
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 2
lw $t0, 4($29)
addiu $29, $29, 4
mul $a0, $t0, $a0
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 3
lw $t0, 4($29)
addiu $29, $29, 4
add $a0, $t0, $a0
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 8
lw $t0, 4($29)
addiu $29, $29, 4
add $a0, $t0, $a0
move $v0, $a0
addiu $29, $29, 0
lw $31, 4($29)
addiu $29, $29, 8
lw $30, 0($29)
jr $31
test4:
move $30, $29
sw $31, 0($29)
addiu $29, $29, -4
li $a0, 2
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 2
lw $t0, 4($29)
addiu $29, $29, 4
div $a0, $t0, $a0
sw $a0, 0($29)
addiu $29, $29, -4
li $a0, 3
lw $t0, 4($29)
addiu $29, $29, 4
mul $a0, $t0, $a0
move $v0, $a0
addiu $29, $29, 0
lw $31, 4($29)
addiu $29, $29, 8
lw $30, 0($29)
jr $31
