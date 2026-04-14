import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GoalsService } from './goal.service'; 
import { SetGoalDto } from './dto/set-goal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth() 
@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @UseGuards(JwtAuthGuard) 
  @Post()
  async createOrUpdateGoal(
    @Request() req, 
    @Body() dto: SetGoalDto
  ) {
    const userId = req.user.userId;
    return this.goalsService.setGoal(userId, dto);
  }
}