import {
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Company } from 'src/company/entities/company.entity';
import { Team } from '../../team/entities/team.entity';
import { Settings } from 'src/settings/entities/settings.entity';

@Entity({ name: 'ransom_game' }) //{ name: 'ransom_game' }
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  code: string;

  @OneToOne(() => Settings, (setting) => setting.game, {
    eager: true,
  })
  @JoinColumn()
  setting: Settings;

  @OneToMany(() => Team, (team) => team.game)
  teams: Team[];

  @ManyToOne(() => Company, (company) => company.games)
  company: Company;
}
