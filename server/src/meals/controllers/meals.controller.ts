import { Controller, Get, Post, Body, Put, Patch, Param, Delete, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { MealsService } from '../services/meals.service';
import { CreateMealDto, UpdateMealDto, MealFilterDto } from '../dto/meal.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserRole } from '../../users/entities/user.entity';

@ApiTags('Meals')
@Controller('meals')
export class MealsController {
  constructor(private readonly mealsService: MealsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all meals with optional filtering' })
  @ApiResponse({ status: 200, description: 'Return all meals with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'vendorId', required: false, type: Number })
  @ApiQuery({ name: 'isAvailable', required: false, type: Boolean })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query() filterDto: MealFilterDto,
  ) {
    return this.mealsService.findAll(page, limit, filterDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all meal categories' })
  @ApiResponse({ status: 200, description: 'Return all meal categories' })
  async getCategories() {
    return this.mealsService.getCategories();
  }

  @Get('vendor/:id')
  @ApiOperation({ summary: 'Get all meals by vendor ID' })
  @ApiResponse({ status: 200, description: 'Return all meals for a specific vendor' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMealsByVendor(
    @Param('id', ParseIntPipe) vendorId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.mealsService.getMealsByVendor(vendorId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get meal by ID' })
  @ApiResponse({ status: 200, description: 'Return the meal with the given ID' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mealsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new meal (Vendor or Admin only)' })
  @ApiResponse({ status: 201, description: 'Meal has been created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createMealDto: CreateMealDto) {
    return this.mealsService.create(createMealDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a meal (Vendor or Admin only)' })
  @ApiResponse({ status: 200, description: 'Meal has been updated' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMealDto: UpdateMealDto,
  ) {
    return this.mealsService.update(id, updateMealDto);
  }

  @Patch(':id/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set meal availability (Vendor or Admin only)' })
  @ApiResponse({ status: 200, description: 'Meal availability has been updated' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  async setAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isAvailable: boolean },
  ) {
    return this.mealsService.setAvailability(id, body.isAvailable);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a meal (Vendor or Admin only)' })
  @ApiResponse({ status: 200, description: 'Meal has been deleted' })
  @ApiResponse({ status: 404, description: 'Meal not found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.mealsService.remove(id);
  }
}
