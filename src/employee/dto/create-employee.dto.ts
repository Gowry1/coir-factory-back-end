import { IsString, IsEmail, IsBoolean, IsNumber } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  salary: number;
}
