import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamModule } from '../team/team.module';
import { CompanyModule } from '../company/company.module';
import { GameModule } from '../game/game.module';
import { Result } from './entities/result.entity';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Result]),
    TeamModule,
    CompanyModule,
    GameModule,
  ],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule {}
