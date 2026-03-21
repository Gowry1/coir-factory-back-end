import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(body: CreateCategoryDto): Promise<Category> {
    return this.categoryRepo.save(body);
  }

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    Object.assign(category, data);
    return this.categoryRepo.save(category);
  }

  async remove(id: number): Promise<string> {
    const category = await this.findOne(id);
    await this.categoryRepo.remove(category);
    return 'Category deleted successfully';
  }
}
