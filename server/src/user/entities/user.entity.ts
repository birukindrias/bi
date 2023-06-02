import {
  AfterInsert,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Company } from '../../company/entities/company.entity';
import { Permission } from '../../authorization/entities/permissions.entity';
import { hashPassword } from 'src/utils/encryption';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToOne(() => Permission, { cascade: true, eager: true })
  @JoinColumn()
  permissions: Permission;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;

  @BeforeInsert()
  async hashPasswordForDb() {
    const hash = await hashPassword(this.password);
    this.password = hash;
  }
}
