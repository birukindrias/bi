import { forwardRef, Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Settings } from './entities/settings.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from 'src/game/game.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Settings]), forwardRef(() => GameModule)],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
