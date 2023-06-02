import { Entity, OneToMany, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Transform } from 'class-transformer';
import { User } from '../../user/entities/user.entity';
import { Game } from '../../game/entities/game.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  @Transform((id) => id.value.toString(), { toPlainOnly: true })
  id: string;

  @Column()
  name: string;

  @OneToMany(() => User, (user) => user.company, {
    cascade: ['remove'],
    eager: true,
  })
  users: User[];

  @OneToMany(() => Game, (game) => game.company, {
    cascade: ['remove'],
    eager: true,
  })
  games: Game[];
}
