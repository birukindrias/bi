import { Game } from 'src/game/entities/game.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ransom_result' })
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float4' })
  score: number;

  @Column()
  objectives: number;

  @Column()
  timePlayedInSeconds: number;

  @Column()
  moneySpent: number;

  @Column()
  riskAssessment: string;

  //Add date column to Result entity with default value set to current date
  @Column({ nullable: true })
  date: Date;
}
