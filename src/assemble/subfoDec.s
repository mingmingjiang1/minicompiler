.data
y:		.word	100
z:		.word	200
msg1 : .asciiz "A is bigger than B\n" 

.text            # text section
	
main:

		li $a0, 18
		li $t0, 14

		bgt $a0,$t0,printBigger
	
		la $a0,msg1
		li $v0,4
		syscall
printBigger:
		la $a0,msg1
		li $v0,4
		syscall



