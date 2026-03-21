import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeAttendance } from './employee-attendance.entity';
import { EmployeeAttendanceService } from './employee-attendance.service';
import { EmployeeAttendanceController } from './employee-attendance.controller';
import { Employee } from '../employee/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeAttendance, Employee])],
  controllers: [EmployeeAttendanceController],
  providers: [EmployeeAttendanceService],
})
export class EmployeeAttendanceModule {}
