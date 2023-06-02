import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { GameModule } from './game/game.module';
import { CompanyModule } from './company/company.module';
import { UserModule } from './user/user.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { ResultModule } from './result/result.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    DatabaseModule,
    GameModule,
    CompanyModule,
    UserModule,
    AuthorizationModule,
    AuthModule,
    TeamModule,
    ResultModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
