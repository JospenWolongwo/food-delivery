import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meal } from './entities/meal.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { MealsController } from './controllers/meals.controller';
import { MealsService } from './services/meals.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Meal, Vendor])
  ],
  controllers: [MealsController],
  providers: [MealsService],
  exports: [TypeOrmModule, MealsService]
})
export class MealsModule {}
