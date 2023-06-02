import { Game } from 'src/game/entities/game.entity';

import { Result } from 'src/result/entities/result.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { Player } from './player.entity';

@Entity({ name: 'ransom_team' })
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  department: string;

  @OneToMany(() => Player, (player) => player.team, {
    eager: true,
    cascade: ['insert'],
  })
  players: Player[];

  @OneToOne(() => Result, { cascade: true, eager: true, onUpdate: 'CASCADE' })
  @JoinColumn()
  result: Result;

  @ManyToOne(() => Game, (game) => game.teams, {
    onDelete: 'CASCADE',
    cascade: ['remove'],
  })
  game: Game;
}
