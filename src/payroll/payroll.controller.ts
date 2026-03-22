import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';
import { UpdatePayrollDto } from './dto/update-payroll.dto';
import { FilterPayrollDto } from './dto/filter-payroll.dto';
import { Payroll } from './payroll.entity';
import { PayrollRoutes } from 'src/routes/payroll.routes';
import { BaseResponse } from 'src/common/response/base-response';
import { ContentResponse } from 'src/common/response/content-response';
import { StatusCodes } from 'src/common/constants/status-codes';
import { ResponseMessages } from 'src/common/constants/response-messages';

@Controller({
  path: PayrollRoutes.BASE,
  version: '1',
})
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Post(PayrollRoutes.CREATE)
  async create(@Body() body: CreatePayrollDto): Promise<BaseResponse> {
    await this.payrollService.create(body);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.CREATED,
      ResponseMessages.PAYROLL.CREATED,
    );
  }

  @Get(PayrollRoutes.FIND_ALL)
  async findAll(
    @Query() query: FilterPayrollDto,
  ): Promise<ContentResponse<Payroll[]>> {
    const data = await this.payrollService.findAll(query);

    return new ContentResponse<Payroll[]>(
      'payrolls',
      data,
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.PAYROLL.FETCHED,
    );
  }

  @Get(PayrollRoutes.FIND_ONE)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ContentResponse<Payroll>> {
    const data = await this.payrollService.findOne(id);

    return new ContentResponse<Payroll>(
      'payroll',
      data,
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.PAYROLL.FETCHED,
    );
  }

  @Put(PayrollRoutes.UPDATE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePayrollDto,
  ): Promise<BaseResponse> {
    await this.payrollService.update(id, body);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.PAYROLL.UPDATED,
    );
  }

  @Put(PayrollRoutes.MARK_AS_PAID)
  async markAsPaid(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BaseResponse> {
    await this.payrollService.markAsPaid(id);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.PAYROLL.PAID,
    );
  }

  @Delete(PayrollRoutes.DELETE)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse> {
    await this.payrollService.remove(id);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.PAYROLL.DELETED,
    );
  }
}
