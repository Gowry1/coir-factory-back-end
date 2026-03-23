import { DateAudit } from 'src/common/date/date-audit.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Department } from 'src/department/department.entity';

@Entity('employees')
export class Employee extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, unique: true })
  employeeId?: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToOne(() => Department, (department) => department.employees, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: true })
  position?: string;

  @Column({ type: 'date', nullable: true })
  joinDate?: Date;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true })
  profilePictureUrl?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  salary: number;

  @OneToOne(() => User, (user) => user.employee, {
    cascade: false,
    eager: true,
  })
  @JoinColumn()
  user: User;
}
