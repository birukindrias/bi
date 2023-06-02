import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { Team } from './entities/team.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GameService } from '../game/game.service';
import { Player } from './entities/player.entity';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    private readonly gameService: GameService,
    @InjectRepository(Player)
    private readonly playerRepostory: Repository<Player>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    try {
      const { gameId } = createTeamDto;
      const team = this.teamRepository.create(createTeamDto);
      const game = await this.gameService.getGameById(gameId);
      team.game = game;
      const createdTeam = await this.teamRepository.save(team);
      this.logger.debug('Team created');
      return createdTeam;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    try {
      const players: Player[] = [];
      const teamToUpdate = await this.teamRepository.findOne({
        where: { id },
      });

      if (teamToUpdate) {
        if (updateTeamDto.players?.length > 0) {
          if (teamToUpdate.players.length > 0) {
            teamToUpdate.players.map(async (player) => {
              await this.playerRepostory.remove(player);
            });
          }
          this.logger.log(players);
          updateTeamDto.players.forEach((player) => {
            this.logger.log(player);
            const temp = this.playerRepostory.create({ name: player, email: player });
            players.push(temp);
          });
        }

        if (updateTeamDto.department) {
          teamToUpdate.department = updateTeamDto.department;
        }

        if (updateTeamDto.name) {
          teamToUpdate.name = updateTeamDto.name;
        }

        if (updateTeamDto.result) {
          teamToUpdate.result = {
            ...teamToUpdate.result,
            timePlayedInSeconds: updateTeamDto.result.timePlayedInSeconds,
            moneySpent: updateTeamDto.result.moneySpent,
            objectives: updateTeamDto.result.objectives,
            score: updateTeamDto.result.score,
            riskAssessment: updateTeamDto.result.riskAssessment,
            date: new Date(),
          };
        }

        teamToUpdate.players = players;

        return this.teamRepository.save(teamToUpdate);
      }

      throw new HttpException('Team not found', HttpStatus.NOT_FOUND);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        'Error while updating team',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getTeamById(id: string): Promise<Team> {
    return this.teamRepository.findOne({ where: { id } });
  }

  findAllByGame(gameId: string): Promise<Team[]> {
    return this.teamRepository.find({
      where: {
        game: { id: gameId },
      },
    });
  }

  remove(id: string) {
    this.teamRepository.delete({ id: id });
  }
}
