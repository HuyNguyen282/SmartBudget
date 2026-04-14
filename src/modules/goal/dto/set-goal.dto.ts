import { IsNotEmpty, IsNumber, Min, IsString, IsOptional, IsBoolean } from 'class-validator';

export class SetGoalDto {
  @IsNotEmpty({ message: 'Vui lòng chọn danh mục chi tiêu' }) 
  @IsNumber({}, { message: 'Danh mục không hợp lệ' })
  categoryId: number;

  @IsNotEmpty({ message: 'Số tiền không được để trống' })
  @IsNumber({}, { message: 'Số tiền phải là một số' })
  @Min(1, { message: 'Số tiền mục tiêu phải lớn hơn 0' }) 
  amount: number;

  @IsNotEmpty({ message: 'Vui lòng chọn chu kỳ áp dụng' })
  @IsString()
  cycle: string;

  // Ngoại lệ 4.2 (Ghi đè dữ liệu)
  @IsOptional()
  @IsBoolean()
  forceOverwrite?: boolean; 
}