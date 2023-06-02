import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty()
  gameId: string;

  @ApiProperty()
  name: string;
}
