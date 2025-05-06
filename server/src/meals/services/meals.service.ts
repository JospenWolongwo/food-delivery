import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Meal } from '../entities/meal.entity';
import { Vendor } from '../../vendors/entities/vendor.entity';
import { CreateMealDto, UpdateMealDto, MealFilterDto } from '../dto/meal.dto';

@Injectable()
export class MealsService {
  constructor(
    @InjectRepository(Meal)
    private mealsRepository: Repository<Meal>,
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
  ) {}

  async findAll(page = 1, limit = 10, filterDto?: MealFilterDto) {
    const queryBuilder = this.mealsRepository.createQueryBuilder('meal')
      .leftJoinAndSelect('meal.vendor', 'vendor')
      .select([
        'meal',
        'vendor.id',
        'vendor.name',
      ]);
    
    // Apply filters if provided
    if (filterDto) {
      if (filterDto.search) {
        queryBuilder.andWhere(
          '(meal.name LIKE :search OR meal.description LIKE :search)',
          { search: `%${filterDto.search}%` },
        );
      }
      
      if (filterDto.category) {
        queryBuilder.andWhere('meal.category = :category', {
          category: filterDto.category,
        });
      }
      
      if (filterDto.vendorId) {
        queryBuilder.andWhere('vendor.id = :vendorId', {
          vendorId: filterDto.vendorId,
        });
      }
      
      if (filterDto.isAvailable !== undefined) {
        queryBuilder.andWhere('meal.isAvailable = :isAvailable', {
          isAvailable: filterDto.isAvailable,
        });
      }
      
      if (filterDto.minPrice) {
        queryBuilder.andWhere('meal.price >= :minPrice', {
          minPrice: filterDto.minPrice,
        });
      }
      
      if (filterDto.maxPrice) {
        queryBuilder.andWhere('meal.price <= :maxPrice', {
          maxPrice: filterDto.maxPrice,
        });
      }
    }
    
    // Add pagination
    queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('meal.createdAt', 'DESC');
    
    const [meals, total] = await queryBuilder.getManyAndCount();
    
    return {
      data: meals,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const meal = await this.mealsRepository.findOne({
      where: { id },
      relations: ['vendor'],
    });
    
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    
    return meal;
  }

  async create(createMealDto: CreateMealDto) {
    const vendor = await this.vendorsRepository.findOne({
      where: { id: createMealDto.vendorId },
    });
    
    if (!vendor) {
      throw new BadRequestException(`Vendor with ID ${createMealDto.vendorId} not found`);
    }
    
    const newMeal = this.mealsRepository.create({
      ...createMealDto,
      vendor,
    });
    
    return this.mealsRepository.save(newMeal);
  }

  async update(id: number, updateMealDto: UpdateMealDto) {
    const meal = await this.mealsRepository.findOne({
      where: { id },
      relations: ['vendor'],
    });
    
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    
    // Update meal properties
    Object.assign(meal, updateMealDto);
    
    return this.mealsRepository.save(meal);
  }

  async remove(id: number) {
    const meal = await this.mealsRepository.findOne({
      where: { id },
    });
    
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    
    await this.mealsRepository.remove(meal);
    
    return { message: `Meal with ID ${id} has been removed` };
  }

  async getCategories() {
    const categories = await this.mealsRepository
      .createQueryBuilder('meal')
      .select('meal.category', 'category')
      .distinct(true)
      .getRawMany();
    
    return categories.map(item => item.category);
  }

  async setAvailability(id: number, isAvailable: boolean) {
    const meal = await this.mealsRepository.findOne({
      where: { id },
    });
    
    if (!meal) {
      throw new NotFoundException(`Meal with ID ${id} not found`);
    }
    
    meal.isAvailable = isAvailable;
    
    return this.mealsRepository.save(meal);
  }

  async getMealsByVendor(vendorId: number, page = 1, limit = 10) {
    const queryBuilder = this.mealsRepository.createQueryBuilder('meal')
      .leftJoin('meal.vendor', 'vendor')
      .where('vendor.id = :vendorId', { vendorId })
      .select([
        'meal.id',
        'meal.name',
        'meal.description',
        'meal.price',
        'meal.category',
        'meal.imageUrl',
        'meal.isAvailable',
        'meal.createdAt',
        'meal.updatedAt',
      ])
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('meal.createdAt', 'DESC');
    
    const [meals, total] = await queryBuilder.getManyAndCount();
    
    return {
      data: meals,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
