import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SeedService } from "./seed.service";
import { User } from "../users/entities/user.entity";
import { Vendor } from "../vendors/entities/vendor.entity";
import { Meal } from "../meals/entities/meal.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Vendor, Meal])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
