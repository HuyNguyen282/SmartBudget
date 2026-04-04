import { IsNumber, Min, IsArray, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class InitializeWalletDto {
  @ApiProperty({ description: 'Tên ví'})
  @IsString()
  name: string;

  @IsNumber({}, { message: 'Số dư phải là một số' })
  @Min(0, { message: 'Số dư ban đầu không được âm' })
  balance: number;

  @ApiProperty({ description: 'Loại ví' })
  @IsString()
  type: string;

  @IsArray({})
  @IsString({ each: true})
  @IsOptional()
  categories?: string[]; 
}