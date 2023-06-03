export const STORE = (
  offset: number,
  reg1: string = "$a0",
  reg2: string = "$sp"
) => `       sw ${reg1}, ${offset}(${reg2})\n`;

export const ADDIU = (offset: number) => `       addiu $sp, $sp, ${offset}\n`;

export const LOAD = (offset: number, reg1: string, reg2: string) =>
  `       lw ${reg1}, ${offset}(${reg2})\n`;

export const DIV = `       div $a0, $t0, $a0\n`;

export const MUL = `       mul $a0, $t0, $a0\n`;

export const ADD = `       add $a0, $t0, $a0\n`;

export const SUB = `       sub $a0, $t0, $a0\n`;

export const LOADIM = (token: string) => `       li $a0, ${token}\n`;

export const MOVE = (reg1: string, reg2: string) =>
  `       move ${reg1}, ${reg2}\n`;

export const JAL = (label: string) => `       jal ${label}\n`;

export const JUMP = (label: string) => `       b ${label}\n`;

export const JR = `       jr $ra\n`;

export const SEQ = `       seq $a0, $a0, $zero\n`;

export const SGE = `       sge $a0, $a0, $zero\n`;

export const SGT = `       sgt $a0, $a0, $zero\n`;

export const SLE = `       sle $a0, $a0, $zero\n`;

export const SLT = `       slt $a0, $a0, $zero\n`;

export const SNE = `       sne $a0, $a0, $zero\n`;

export const BEQ = (label: string) => `       beq $t0, $a0, ${label}\n`;

export const BGE = (label: string) => `       bge $t0, $a0, ${label}\n`;

export const BGT = (label: string) => `       bgt $t0, $a0, ${label}\n`;

export const BLE = (label: string) => `       ble $t0, $a0, ${label}\n`;

export const BLT = (label: string) => `       ble $t0, $a0, ${label}\n`;

export const BNE = (label: string) => `       bne $t0, $a0, ${label}\n`;

export const NOP = `       nop\n`;

export const EXIT = `       li $v0, 10
      syscall\n`;

export const PRINTINT = `       li $v0, 1
       syscall\n`;

export const PRINTSTR = `       la $a0, newLine
       li $v0, 4
       syscall\n`;