import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async create(body: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create({
      productName: body.productName,
      stock: body.stock,
      status: body.status,
      price: body.price,
      categoryId: body.categoryId,
      unit: body.unit,
      image: body.image ?? null,
    });

    return await this.productRepo.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, data);
    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<string> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
    return 'Product deleted successfully';
  }
}
