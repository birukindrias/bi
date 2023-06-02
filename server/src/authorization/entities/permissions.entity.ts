import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ default: false })
  canCreateNewUser: boolean;

  @Column({ default: false })
  canEditPermissions: boolean;

  @Column({ default: false })
  canCreateNewCompany: boolean;
}
