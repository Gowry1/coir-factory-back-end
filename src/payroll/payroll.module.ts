import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { Payroll } from './payroll.entity';
import { Employee } from 'src/employee/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payroll, Employee])],
  controllers: [PayrollController],
  providers: [PayrollService],
})
export class PayrollModule {}
