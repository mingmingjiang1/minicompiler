##
#####################################################
#    
#       输入两个整数并打印它们的和                  #
#        programed by stevie zou                    #                  
#           10-12-2008                              #      
#####################################################
##

######   data segment####################################，
# 标签，内存(地址)，寄存器
.data
value:  .word 0, 0, 0
msg1:  .asciiz "result= "


.text                       # text section  
.globl main                 # call main by SPIM  

main:  la $t0, value       #$t0 保存初始值的地址
         
       li $, 5           #读取整数值（kernel serice 5）
       syscall
       sw $v0, 0($29)      #读取的值放到stack top
       addiu $29, $29, -4  #stack扩展

       li $v0, 5           #读取第二个整数
       syscall
       sw $v0, ($t0)       #保存第二个📄到t0 register

       lw $t1, 4($29)      #get first number from stack top
       addiu $29, $29, 4   #stack 还原
       lw $a0, ($t0)       #从t0获取值给a0
       add $a0,  $t1, $a0  #求两个整数之和

       #li $v0, 4           
       #la $a0, msg1       #打印字符串（kernel service 4) 
       #syscall

       li $v0, 1           #打印整数（kernel service 1）
       syscall

       li $v0, 10           #exit
       syscall