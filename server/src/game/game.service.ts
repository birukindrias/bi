import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateGameDto } from './dto/create-game.dto';
import { SettingsService } from '../settings/settings.service';
import { CompanyService } from '../company/company.service';
import { join } from 'path';
import { rmdir, rmSync } from 'fs';

type CreateGameWithLoginCode = CreateGameDto & {
  code: string;
};

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly settingService: SettingsService,
    private readonly companyService: CompanyService,
  ) {}

  /**
   *
   * @param createUpdateGameData
   * @returns created game
   */
  async create(createGameData: CreateGameWithLoginCode): Promise<Game> {
    try {
      const newGame = this.gameRepository.create(createGameData);
      const url = `${this.configService.get('HUNTED_API_URL')}/company/${
        createGameData.companyId
      }`;

      const result = await firstValueFrom(this.httpService.get(url));
      this.logger.log('Company Data loaded from Hunted Server');
      newGame.company = result.data;

      const createdGame = this.gameRepository.create(newGame);
      this.logger.log('New Game created');
      const settings = await this.settingService.create();
      this.logger.log('New settings created');
      createdGame.setting = settings;
      await this.gameRepository.save(createdGame);
      this.logger.log('Game saved');
      delete createdGame.company;
      return createdGame;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error while creating new game',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getGameByGameCode(gameCode: string) {
    try {
      // const game = await this.gameRepository.find();
      const game = await this.gameRepository.findOne({
        where: { code: gameCode },
      });
      if (game) {
        return game;
      }
      throw new HttpException(
        'No Game with this id could be found',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getGameById(id: string) {
    try {
      const game = await this.gameRepository.findOne({
        where: { id },
        relations: ['company'],
      });
      if ('game') {
        return game;
      }
      throw new HttpException(
        'No Game with this id could be found',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async findGameByCompanyId(companyId: string) {
    return this.gameRepository.find({ where: { company: { id: companyId } } });
  }

  async findAll(): Promise<Game[]> {
    return this.gameRepository.find({
      relations: ['company'],
    });
  }

  async delete(id: string) {
    try {
      const game = await this.gameRepository.findOne({
        where: { id },
      });
      const imagesPath = join(
        __dirname,
        '..',
        '..',
        'uploads',
        game.setting.id,
      );

      const textPath = join(__dirname, '..', '..', 'texts', game.setting.id);

      rmSync(imagesPath, { recursive: true, force: true });
      rmSync(textPath, { recursive: true, force: true });
    } catch (error) {
      this.logger.error(error);
      throw error;
    } finally {
      return this.gameRepository.delete({ id });
    }
  }
}
