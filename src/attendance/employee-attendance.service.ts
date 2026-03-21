import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeAttendance } from './employee-attendance.entity';
import { Employee } from '../employee/employee.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class EmployeeAttendanceService {
  constructor(
    @InjectRepository(EmployeeAttendance)
    private attendanceRepo: Repository<EmployeeAttendance>,

    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}

  // EMPLOYEE CHECK-IN
  async checkIn(body: CreateAttendanceDto): Promise<any> {
    const employee = await this.employeeRepo.findOne({
      where: { id: body.employeeId },
    });

    if (!employee) throw new NotFoundException('Employee not found');

    const today = new Date().toISOString().split('T')[0];

    // if record exists, prevent multiple check-ins
    const exists = await this.attendanceRepo.findOne({
      where: { employee: { id: employee.id }, date: today },
    });

    if (exists) {
      return { message: 'Employee already checked in today', record: exists };
    }

    const record = this.attendanceRepo.create({
      employee,
      date: today,
      checkIn: new Date(),
    });

    return this.attendanceRepo.save(record);
  }

  // EMPLOYEE CHECK-OUT
  async checkOut(employeeId: number): Promise<any> {
    const today = new Date().toISOString().split('T')[0];

    const record = await this.attendanceRepo.findOne({
      where: { employee: { id: employeeId }, date: today },
    });

    if (!record) {
      throw new NotFoundException('No attendance record found for today');
    }

    record.checkOut = new Date();
    return this.attendanceRepo.save(record);
  }

  // Fetch all attendance
  async findAll() {
    return this.attendanceRepo.find({
      relations: ['employee'],
      order: { date: 'DESC' },
    });
  }

  // Fetch attendance for single employee
  async findByEmployee(employeeId: number) {
    return this.attendanceRepo.find({
      where: { employee: { id: employeeId } },
      relations: ['employee'],
      order: { date: 'DESC' },
    });
  }
}
