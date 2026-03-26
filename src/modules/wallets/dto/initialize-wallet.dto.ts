import { IsNumber, Min, IsArray, IsString, IsOptional } from 'class-validator';


export class InitializeWalletDto {
  @IsNumber({}, { message: 'Số dư phải là một số' })
  @IsString() name: string;
  @Min(0, { message: 'Số dư ban đầu không được âm' })
  balance: number;

  @IsArray({})
  @IsString({ each: true})
  @IsOptional()
  categories?: string[]; 
}