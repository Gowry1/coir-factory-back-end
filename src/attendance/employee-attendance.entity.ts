import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity()
export class EmployeeAttendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  employee: Employee;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'timestamp', nullable: true })
  checkIn: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOut: Date;

  @CreateDateColumn()
  createdAt: Date;
}
