import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { VendorsController } from './controllers/vendors.controller';
import { VendorsService } from './services/vendors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor])
  ],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [TypeOrmModule, VendorsService]
})
export class VendorsModule {}
