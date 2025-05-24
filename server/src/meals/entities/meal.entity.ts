import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { Order } from '../../orders/entities/order.entity';

@Entity()
export class Meal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;
  
  @Column({ nullable: true })
  imageUrl: string;
  
  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @ManyToOne(() => Vendor, (vendor) => vendor.meals)
  vendor: Vendor;

  @ManyToMany(() => Order, (order) => order.meals)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
