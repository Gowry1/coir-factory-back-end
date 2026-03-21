import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepo: Repository<Employee>,
  ) {}

  async create(body: CreateEmployeeDto): Promise<Employee> {
    return this.employeeRepo.save(body);
  }

  // Get all employees
  async findAll(): Promise<Employee[]> {
    return this.employeeRepo.find();
  }

  // Get single employee
  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({ where: { id } });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  // Update employee
  async update(id: number, data: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    Object.assign(employee, data);
    return this.employeeRepo.save(employee);
  }

  // Delete employee
  async remove(id: number): Promise<string> {
    const employee = await this.findOne(id);
    await this.employeeRepo.remove(employee);
    return 'Employee deleted successfully';
  }
}
