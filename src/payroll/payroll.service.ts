import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll, PayrollStatus } from './payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { FilterPayrollDto } from './dto/filter-payroll.dto';
import { Employee } from 'src/employee/employee.entity';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(Payroll)
    private readonly payrollRepo: Repository<Payroll>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async create(body: CreatePayrollDto): Promise<Payroll> {
    const employee = await this.employeeRepo.findOne({
      where: { id: body.employeeId },
    });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const existingPayroll = await this.payrollRepo.findOne({
      where: {
        employee: { id: body.employeeId },
        period: body.period,
      },
    });

    if (existingPayroll) {
      throw new ConflictException(
        'Payroll already exists for this employee and period',
      );
    }

    const netSalary =
      Number(body.basicSalary) +
      Number(body.allowances) -
      Number(body.deductions);

    const payroll = this.payrollRepo.create({
      employee,
      period: body.period,
      basicSalary: body.basicSalary,
      allowances: body.allowances,
      deductions: body.deductions,
      netSalary,
      status: body.status ?? PayrollStatus.PENDING,
      paidDate: body.paidDate ? new Date(body.paidDate) : undefined,
    });

    return this.payrollRepo.save(payroll);
  }

  async findAll(filters: FilterPayrollDto): Promise<Payroll[]> {
    const query = this.payrollRepo
      .createQueryBuilder('payroll')
      .leftJoinAndSelect('payroll.employee', 'employee')
      .orderBy('payroll.id', 'DESC');

    if (filters.search) {
      query.andWhere(
        `
          employee.firstName ILIKE :search OR
          employee.lastName ILIKE :search OR
          employee.employeeId ILIKE :search OR
          employee.department ILIKE :search
        `,
        { search: `%${filters.search}%` },
      );
    }

    if (filters.status) {
      query.andWhere('payroll.status = :status', { status: filters.status });
    }

    if (filters.startDate && filters.endDate) {
      query.andWhere('payroll.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Payroll> {
    const payroll = await this.payrollRepo.findOne({
      where: { id },
      relations: ['employee'],
    });

    if (!payroll) {
      throw new NotFoundException('Payroll not found');
    }

    return payroll;
  }

  async update(id: number, body: UpdatePayrollDto): Promise<Payroll> {
    const payroll = await this.findOne(id);

    if (body.employeeId) {
      const employee = await this.employeeRepo.findOne({
        where: { id: body.employeeId },
      });

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      payroll.employee = employee;
    }

    if (body.period !== undefined) payroll.period = body.period;
    if (body.basicSalary !== undefined) payroll.basicSalary = body.basicSalary;
    if (body.allowances !== undefined) payroll.allowances = body.allowances;
    if (body.deductions !== undefined) payroll.deductions = body.deductions;
    if (body.status !== undefined) payroll.status = body.status;
    if (body.paidDate !== undefined) {
      payroll.paidDate = body.paidDate ? new Date(body.paidDate) : undefined;
    }

    payroll.netSalary =
      Number(payroll.basicSalary) +
      Number(payroll.allowances) -
      Number(payroll.deductions);

    return this.payrollRepo.save(payroll);
  }

  async markAsPaid(id: number): Promise<Payroll> {
    const payroll = await this.findOne(id);

    payroll.status = PayrollStatus.PAID;
    payroll.paidDate = new Date();

    return this.payrollRepo.save(payroll);
  }

  async remove(id: number): Promise<void> {
    const payroll = await this.findOne(id);
    await this.payrollRepo.remove(payroll);
  }
}
