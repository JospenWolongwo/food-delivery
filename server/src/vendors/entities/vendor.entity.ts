import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Meal } from '../../meals/entities/meal.entity';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  phoneNumber: string;
  
  @Column({ nullable: true })
  email: string;
  
  @Column({ nullable: true })
  description: string;
  
  @Column({ nullable: true })
  logoUrl: string;
  
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Meal, (meal) => meal.vendor)
  meals: Meal[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
