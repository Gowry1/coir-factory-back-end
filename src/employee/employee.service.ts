import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { hash } from 'bcryptjs';

import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Department } from 'src/department/department.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    private readonly dataSource: DataSource,
  ) {}

  async create(body: CreateEmployeeDto): Promise<Employee> {
    const existingEmployee = await this.employeeRepo.findOne({
      where: [
        { email: body.email },
        ...(body.employeeId ? [{ employeeId: body.employeeId }] : []),
      ],
    });

    if (existingEmployee) {
      throw new ConflictException(
        'Employee email or employee ID already exists',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let department: Department | undefined;

      if (body.departmentId) {
        const foundDepartment = await queryRunner.manager.findOne(Department, {
          where: { id: body.departmentId },
        });

        if (!foundDepartment) {
          throw new NotFoundException('Department not found');
        }

        department = foundDepartment;
      }
      const plainPassword = generateRandomPassword(10);
      const hashedPassword = await hash(plainPassword, 10);

      const user = queryRunner.manager.create(User, {
        email: body.email,
        password: hashedPassword,
      });

      const savedUser = await queryRunner.manager.save(User, user);

      const employee = queryRunner.manager.create(Employee, {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        employeeId: body.employeeId,
        phone: body.phone,
        department: department,
        position: body.position,
        joinDate: body.joinDate ? new Date(body.joinDate) : undefined,
        address: body.address,
        profilePictureUrl: body.profilePictureUrl,
        isActive: body.isActive ?? true,
        salary: body.salary,
        user: savedUser,
      });

      const savedEmployee = await queryRunner.manager.save(Employee, employee);

      await queryRunner.commitTransaction();
      return savedEmployee;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async update(id: number, data: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);

    Object.assign(employee, {
      ...data,
      joinDate: data.joinDate ? new Date(data.joinDate) : employee.joinDate,
    });

    return this.employeeRepo.save(employee);
  }

  async remove(id: number): Promise<{ message: string }> {
    const employee = await this.findOne(id);
    await this.employeeRepo.remove(employee);

    return { message: 'Employee deleted successfully' };
  }
}

function generateRandomPassword(length = 10): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}
