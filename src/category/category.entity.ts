import { DateAudit } from 'src/common/date/date-audit.entity';
import { Product } from 'src/product/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Category extends DateAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  categoryName: string;

  @Column({ type: 'varchar', length: 255 })
  discription: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
