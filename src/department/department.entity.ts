import { DateAudit } from 'src/common/date/date-audit.entity';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Department extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  departmentName: string;
}
