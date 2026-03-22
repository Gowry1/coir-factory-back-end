import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Employee } from './employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { UserService } from 'src/user/user.service';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    private readonly userService: UserService,
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
      const hashedPassword = await bcryptjs.hash(body.password, 10);

      const user = await this.userService.create(body.email, hashedPassword);

      const employee = this.employeeRepo.create({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        employeeId: body.employeeId,
        phone: body.phone,
        department: body.department,
        position: body.position,
        joinDate: body.joinDate ? new Date(body.joinDate) : undefined,
        address: body.address,
        profilePictureUrl: body.profilePictureUrl,
        isActive: body.isActive ?? true,
        salary: body.salary,
        user,
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
