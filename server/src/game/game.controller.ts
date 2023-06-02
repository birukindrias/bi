import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';
import { generateLoginCode } from '../utils/code_generator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/authorization/permissions.guard';
import { Permissions } from 'src/authorization/permissions.decorator';
import { Permission } from 'src/authorization/permissions.enum';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Post()
  async createGame(@Body() createUpdateGameData: CreateGameDto): Promise<Game> {
    const loginCode = generateLoginCode();
    return this.gameService.create({
      ...createUpdateGameData,
      code: loginCode,
      companyId: createUpdateGameData.companyId,
    });
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get('/check/:gameCode')
  async findByGameCode(@Param('gameCode') gameCode: string): Promise<Game> {
    return this.gameService.getGameByGameCode(gameCode);
  }

  @Get('/:id')
  async findById(@Param('id') id: string): Promise<Game> {
    return this.gameService.getGameById(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    return this.gameService.delete(id);
  }
}
