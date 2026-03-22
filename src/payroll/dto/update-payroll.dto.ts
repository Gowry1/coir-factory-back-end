import { PartialType } from '@nestjs/mapped-types';
import { CreatePayrollDto } from '../dto/create-payroll.dto';

export class UpdatePayrollDto extends PartialType(CreatePayrollDto) {}
