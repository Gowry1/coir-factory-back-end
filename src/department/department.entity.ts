import { DateAudit } from 'src/common/date/date-audit.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Employee } from 'src/employee/employee.entity';

@Entity()
export class Department extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  departmentName: string;

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
