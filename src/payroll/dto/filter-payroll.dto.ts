import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PayrollStatus } from '../payroll.entity';

export class FilterPayrollDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsEnum(PayrollStatus)
  status?: PayrollStatus;
}
