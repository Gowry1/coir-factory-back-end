import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
  ) {}

  async create(body: CreateDepartmentDto): Promise<Department> {
    const existing = await this.departmentRepo.findOne({
      where: { departmentName: body.departmentName },
    });

    if (existing) {
      throw new ConflictException('Department already exists');
    }

    const department = this.departmentRepo.create(body);
    return this.departmentRepo.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepo.find();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepo.findOne({
      where: { id },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return department;
  }

  async update(id: number, body: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);

    Object.assign(department, body);

    return this.departmentRepo.save(department);
  }

  async remove(id: number) {
    const department = await this.findOne(id);
    await this.departmentRepo.remove(department);

    return { message: 'Department deleted successfully' };
  }
}
