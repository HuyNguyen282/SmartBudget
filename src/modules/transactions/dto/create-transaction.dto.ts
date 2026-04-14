import { IsNumber, IsNotEmpty, Min, IsOptional, IsString, IsDateString } from 'class-validator';
export class CreateTransactionDto {
  @IsNotEmpty({ message: 'Số tiền không được để trống' })
  @IsNumber({}, { message: 'Số tiền phải là một số' })
  @Min(1, { message: 'Số tiền phải phải là số dương' })
  amount: number;

  @IsOptional()
  @IsString()
  categoryName: string;

  @IsDateString({}, { message: 'Định dạng thời gian không hợp lệ' })
  @IsNotEmpty({ message: 'Vui lòng chọn thời gian giao dịch' })
  transactionDate: string;

  @IsOptional()
  @IsString()
  note?: string;
}


