import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsService } from './goal.service';
import { GoalsController } from './goal.controller';
import { Goal } from './entities/goal.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Goal])],
  controllers: [GoalsController],
  providers: [GoalsService],
})
export class GoalModule {}
