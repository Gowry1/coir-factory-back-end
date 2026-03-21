import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  productName: string;

  @Type(() => Number)
  @IsNumber()
  stock: number;

  @Type(() => Boolean)
  @IsBoolean()
  status: boolean;

  @IsNumber()
  price: number;

  @IsNumber()
  categoryId: number;

  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  image?: string | null;
}
