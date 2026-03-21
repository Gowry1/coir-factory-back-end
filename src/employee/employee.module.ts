import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
