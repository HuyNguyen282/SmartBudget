import { PartialType } from '@nestjs/swagger';
import { SetGoalDto } from './set-goal.dto';

export class UpdateGoalDto extends PartialType(SetGoalDto) {}
