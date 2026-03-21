import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeRoutes } from '../routes/employee.routes';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { BaseResponse } from 'src/common/response/base-response';
import { StatusCodes } from 'src/common/constants/status-codes';
import { ResponseMessages } from 'src/common/constants/response-messages';

@Controller({
  path: EmployeeRoutes.BASE,
  version: '1',
})
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post(EmployeeRoutes.CREATE)
  async create(@Body() body: CreateEmployeeDto): Promise<BaseResponse> {
    await this.employeeService.create(body);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.CREATED,
      ResponseMessages.EMPLOYEE.CREATED,
    );
  }

  @Get(EmployeeRoutes.FIND_ALL)
  async findAll() {
    return this.employeeService.findAll();
  }

  @Get(EmployeeRoutes.FIND_ONE)
  async findOne(@Param('id') id: number) {
    return this.employeeService.findOne(id);
  }

  @Put(EmployeeRoutes.UPDATE)
  async update(@Param('id') id: number, @Body() body: UpdateEmployeeDto) {
    return this.employeeService.update(id, body);
  }

  @Delete(EmployeeRoutes.DELETE)
  async remove(@Param('id') id: number) {
    return this.employeeService.remove(id);
  }
}
