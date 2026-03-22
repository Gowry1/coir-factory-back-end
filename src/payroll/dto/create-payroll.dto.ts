import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PayrollStatus } from '../payroll.entity';

export class CreatePayrollDto {
  @Type(() => Number)
  @IsNumber()
  employeeId: number;

  @IsString()
  period: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  basicSalary: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  allowances: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  deductions: number;

  @IsOptional()
  @IsEnum(PayrollStatus)
  status?: PayrollStatus;

  @IsOptional()
  @IsDateString()
  paidDate?: string;
}
