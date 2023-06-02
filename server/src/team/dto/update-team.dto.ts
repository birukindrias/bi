import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTeamDto } from './create-team.dto';
import { Result } from '../../result/entities/result.entity';

export class UpdateTeamDto extends PartialType(CreateTeamDto) {
  @ApiProperty({ required: false })
  name?: string;
  players?: string[];
  department?: string;
  result?: Result;
  email?: string;
}
