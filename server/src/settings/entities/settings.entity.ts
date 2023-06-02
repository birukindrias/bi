import { Game } from 'src/game/entities/game.entity';
import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ransom_settings' }) //
export class Settings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Game, (game) => game.setting, { onDelete: 'CASCADE' })
  game: Game;
}
