import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BaseResponse } from 'src/common/response/base-response';
import { ContentResponse } from 'src/common/response/content-response';
import { StatusCodes } from 'src/common/constants/status-codes';
import { ResponseMessages } from 'src/common/constants/response-messages';
import { CategoryRoutes } from '../routes/category.routes';
import { Category } from './category.entity';

@Controller({
  path: CategoryRoutes.BASE,
  version: '1',
})
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // CREATE CATEGORY
  @Post(CategoryRoutes.CREATE)
  async create(@Body() body: CreateCategoryDto): Promise<BaseResponse> {
    await this.categoryService.create(body);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.CREATED,
      ResponseMessages.CATEGORY.CREATED,
    );
  }

  // GET ALL CATEGORIES
  @Get(CategoryRoutes.FIND_ALL)
  async findAll(): Promise<ContentResponse<Category[]>> {
    const data = await this.categoryService.findAll();

    return new ContentResponse<Category[]>(
      'categories',
      data,
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.CATEGORY.FETCHED,
    );
  }

  // GET ONE CATEGORY
  @Get(CategoryRoutes.FIND_ONE)
  async findOne(@Param('id') id: number): Promise<ContentResponse<any>> {
    const data = await this.categoryService.findOne(id);

    return new ContentResponse(
      'category',
      data,
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.CATEGORY.FETCHED,
    );
  }

  // UPDATE CATEGORY
  @Put(CategoryRoutes.UPDATE)
  async update(
    @Param('id') id: number,
    @Body() body: UpdateCategoryDto,
  ): Promise<BaseResponse> {
    await this.categoryService.update(id, body);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.CATEGORY.UPDATED,
    );
  }

  // DELETE CATEGORY
  @Delete(CategoryRoutes.DELETE)
  async delete(@Param('id') id: number): Promise<BaseResponse> {
    await this.categoryService.remove(id);

    return new BaseResponse(
      'SUCCESS',
      StatusCodes.SUCCESS,
      ResponseMessages.CATEGORY.DELETED,
    );
  }
}
