import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Permissions } from './authorization/permissions.decorator';
import { Permission } from './authorization/permissions.enum';
import { PermissionsGuard } from './authorization/permissions.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
