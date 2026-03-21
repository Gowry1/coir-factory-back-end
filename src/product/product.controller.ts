import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductRoutes } from '../routes/product.routes';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseResponse } from 'src/common/response/base-response';
import { StatusCodes } from 'src/common/constants/status-codes';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadToCloudinary } from 'src/cloudinary/cloudinary.helper';

@Controller({
  path: ProductRoutes.BASE,
  version: '1',
})
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // CREATE PRODUCT
  @Post(ProductRoutes.CREATE)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: CreateProductDto,
  ) {
    let imageUrl: string | null = null;

    if (file) {
      const uploaded = await uploadToCloudinary(file);
      imageUrl = uploaded.secure_url;
    }

    await this.productService.create({
      ...body,
      image: imageUrl,
    });

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.CREATED,
      ResponseMessages.PRODUCT.CREATED,
    );
  }

  // GET ALL PRODUCTS
  @Get(ProductRoutes.FIND_ALL)
  async findAll() {
    return this.productService.findAll();
  }

  // GET ONE PRODUCT
  @Get(ProductRoutes.FIND_ONE)
  async findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  // UPDATE PRODUCT
  @Put(ProductRoutes.UPDATE)
  async update(@Param('id') id: number, @Body() body: UpdateProductDto) {
    await this.productService.update(id, body);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.PRODUCT.UPDATED,
    );
  }

  // DELETE PRODUCT
  @Delete(ProductRoutes.DELETE)
  async delete(@Param('id') id: number) {
    await this.productService.remove(id);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.PRODUCT.DELETED,
    );
  }
}
