import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';
import { CreateVendorDto, UpdateVendorDto } from '../dto/vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
  ) {}

  async findAll(page = 1, limit = 10) {
    const [vendors, total] = await this.vendorsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: vendors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const vendor = await this.vendorsRepository.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async create(createVendorDto: CreateVendorDto) {
    // Check if a vendor with the same email exists (if email is provided)
    if (createVendorDto.email) {
      const existingVendor = await this.vendorsRepository.findOne({
        where: { email: createVendorDto.email },
      });

      if (existingVendor) {
        throw new BadRequestException(`Vendor with email ${createVendorDto.email} already exists`);
      }
    }

    const newVendor = this.vendorsRepository.create(createVendorDto);
    return this.vendorsRepository.save(newVendor);
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    const vendor = await this.vendorsRepository.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    // Check if email is being updated and if it's already taken
    if (updateVendorDto.email && updateVendorDto.email !== vendor.email) {
      const existingVendor = await this.vendorsRepository.findOne({
        where: { email: updateVendorDto.email },
      });

      if (existingVendor) {
        throw new BadRequestException(`Vendor with email ${updateVendorDto.email} already exists`);
      }
    }

    // Update vendor properties
    Object.assign(vendor, updateVendorDto);

    return this.vendorsRepository.save(vendor);
  }

  async remove(id: number) {
    const vendor = await this.vendorsRepository.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    await this.vendorsRepository.remove(vendor);

    return { message: `Vendor with ID ${id} has been removed` };
  }

  async setActivation(id: number, isActive: boolean) {
    const vendor = await this.vendorsRepository.findOne({ where: { id } });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    vendor.isActive = isActive;

    return this.vendorsRepository.save(vendor);
  }

  async getVendorWithMeals(id: number) {
    const vendor = await this.vendorsRepository.findOne({
      where: { id },
      relations: ['meals'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async getActiveVendors(page = 1, limit = 10) {
    const [vendors, total] = await this.vendorsRepository.findAndCount({
      where: { isActive: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return {
      data: vendors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async searchVendors(term: string, page = 1, limit = 10) {
    const [vendors, total] = await this.vendorsRepository
      .createQueryBuilder('vendor')
      .where('vendor.name LIKE :term OR vendor.description LIKE :term', {
        term: `%${term}%`,
      })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('vendor.name', 'ASC')
      .getManyAndCount();

    return {
      data: vendors,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
