import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Goal } from './entities/goal.entity';
import { SetGoalDto } from './dto/set-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
  ) {}

  async setGoal(userId: number, dto: SetGoalDto) {
    try {
      const existingGoal = await this.goalRepository.findOne({
        where: { 
          userId: userId, 
          categoryId: dto.categoryId, 
          cycle: dto.cycle 
        }
      });

      if (existingGoal) {
        if (!dto.forceOverwrite) {
          throw new ConflictException('Mục tiêu cho danh mục này đã tồn tại. Bạn có muốn ghi đè số tiền mới không?');
        }
        
        // ghi đè
        existingGoal.amount = dto.amount;
        await this.goalRepository.save(existingGoal);
        
        return {
          message: 'Thiết lập mục tiêu thành công',
          goal: existingGoal,
        };
      }

      // nếu chưa tồn tại 
      const newGoal = this.goalRepository.create({
        userId: userId,
        categoryId: dto.categoryId,
        amount: dto.amount,
        cycle: dto.cycle,
      });

      await this.goalRepository.save(newGoal);

      return {
        message: 'Thiết lập mục tiêu thành công',
        goal: newGoal,
      };

    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Lỗi hệ thống. Không thể lưu mục tiêu.');
    }
  }
}