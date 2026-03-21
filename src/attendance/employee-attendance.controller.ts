import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { EmployeeAttendanceService } from './employee-attendance.service';
import { AttendanceRoutes } from '../routes/attendance.routes';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { BaseResponse } from 'src/common/response/base-response';
import { StatusCodes } from 'src/common/constants/status-codes';
import { ResponseMessages } from 'src/common/constants/response-messages';

@Controller({
  path: AttendanceRoutes.BASE,
  version: '1',
})
export class EmployeeAttendanceController {
  constructor(private attendanceService: EmployeeAttendanceService) {}

  @Post(AttendanceRoutes.CHECK_IN)
  async checkIn(@Body() body: CreateAttendanceDto): Promise<BaseResponse> {
    await this.attendanceService.checkIn(body);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.CREATED,
      ResponseMessages.ATTENDANCE.CHECKED_IN,
    );
  }

  @Post(AttendanceRoutes.CHECK_OUT)
  async checkOut(
    @Param('employeeId') employeeId: number,
  ): Promise<BaseResponse> {
    await this.attendanceService.checkOut(employeeId);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.ATTENDANCE.CHECKED_OUT,
    );
  }

  @Get(AttendanceRoutes.FIND_ALL)
  async findAll() {
    return this.attendanceService.findAll();
  }

  @Get(AttendanceRoutes.FIND_BY_EMPLOYEE)
  async findByEmployee(@Param('id') id: number) {
    return this.attendanceService.findByEmployee(id);
  }
}
