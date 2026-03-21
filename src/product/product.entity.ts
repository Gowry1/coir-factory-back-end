import { DateAudit } from 'src/common/date/date-audit.entity';
import { Category } from 'src/category/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Product extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  productName: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'float', default: 0 })
  price: number;

  @Column() categoryId: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ type: 'varchar', length: 100, nullable: true })
  unit: string;

  @Column({ type: 'varchar', nullable: true })
  image: string | null;
}
