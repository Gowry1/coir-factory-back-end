import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { BaseResponse } from 'src/common/response/base-response';
import { ContentResponse } from 'src/common/response/content-response';
import { StatusCodes } from 'src/common/constants/status-codes';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { DepartmentRoutes } from '../routes/department.routes';
import { Department } from './department.entity';

@Controller({
  path: DepartmentRoutes.BASE,
  version: '1',
})
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  // ✅ CREATE DEPARTMENT
  @Post(DepartmentRoutes.CREATE)
  async create(@Body() body: CreateDepartmentDto): Promise<BaseResponse> {
    await this.departmentService.create(body);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.CREATED,
      ResponseMessages.DEPARTMENT.CREATED,
    );
  }

  // ✅ GET ALL DEPARTMENTS
  @Get(DepartmentRoutes.FIND_ALL)
  async findAll(): Promise<ContentResponse<Department[]>> {
    const data = await this.departmentService.findAll();

    return new ContentResponse<Department[]>(
      'departments',
      data,
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.DEPARTMENT.FETCHED,
    );
  }

  // ✅ GET ONE DEPARTMENT
  @Get(DepartmentRoutes.FIND_ONE)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContentResponse<Department>> {
    const data = await this.departmentService.findOne(id);

    return new ContentResponse<Department>(
      'department',
      data,
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.DEPARTMENT.FETCHED,
    );
  }

  // ✅ UPDATE DEPARTMENT
  @Put(DepartmentRoutes.UPDATE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDepartmentDto,
  ): Promise<BaseResponse> {
    await this.departmentService.update(id, body);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.DEPARTMENT.UPDATED,
    );
  }

  // ✅ DELETE DEPARTMENT
  @Delete(DepartmentRoutes.DELETE)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse> {
    await this.departmentService.remove(id);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.DEPARTMENT.DELETED,
    );
  }
}
