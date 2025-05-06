import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Meal } from '../../meals/entities/meal.entity';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.subscriptions)
  subscriber: User;

  @Column()
  planName: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monthlyFee: number;
  
  @Column('int')
  mealsPerWeek: number;

  @ManyToMany(() => Meal)
  @JoinTable()
  includedMeals: Meal[];
  
  @Column({ default: true })
  isActive: boolean;
  
  @Column()
  startDate: Date;
  
  @Column({ nullable: true })
  endDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
