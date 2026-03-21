import { DateAudit } from 'src/common/date/date-audit.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Employee extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  salary: number;
}
