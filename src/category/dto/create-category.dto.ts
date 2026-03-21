import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  categoryName: string;

  @IsString()
  discription: string;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
