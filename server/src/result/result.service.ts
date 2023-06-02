import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Result } from './entities/result.entity';
import { TeamService } from '../team/team.service';
import { GameService } from '../game/game.service';
import { Team } from 'src/team/entities/team.entity';

@Injectable()
export class ResultService {
  logger = new Logger(ResultService.name);

  constructor(
    @InjectRepository(Result) private readonly result: Result,
    private readonly teamService: TeamService,
    private readonly gameService: GameService,
  ) {}

  async getAllForGame(gameId: string): Promise<Team[]> {
    const teams = await this.teamService.findAllByGame(gameId);
    return teams;
  }

  //get all results for all games for a company
  async getAllForCompany(companyId: string) {
    const gameWithTeams = [];
    try {
      const games = await this.gameService.findGameByCompanyId(companyId);

      for (let i = 0; i < games.length; i++) {
        const teams = await this.getAllForGame(games[i].id);
        const gameObject = {
          id: games[i].id,
          name: games[i].name,
        };
        gameWithTeams.push({ game: gameObject, teams: teams });
      }

      return gameWithTeams;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
