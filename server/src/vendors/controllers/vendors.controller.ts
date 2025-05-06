import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { Request } from 'express';
import { User, UserRole } from '../../users/entities/user.entity';

// Define interface for authenticated request
interface AuthRequest extends Request {
  user: User & { id: number; role: UserRole };
}

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

import { VendorsService } from '../services/vendors.service';
import { CreateVendorDto, UpdateVendorDto } from '../dto/vendor.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiResponse({ status: 200, description: 'Return all vendors with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.vendorsService.findAll(page, limit);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active vendors' })
  @ApiResponse({ status: 200, description: 'Return all active vendors with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getActiveVendors(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.vendorsService.getActiveVendors(page, limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search vendors by name or description' })
  @ApiResponse({ status: 200, description: 'Return vendors matching the search term' })
  @ApiQuery({ name: 'term', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchVendors(
    @Query('term') term: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.vendorsService.searchVendors(term, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiResponse({ status: 200, description: 'Return the vendor' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vendorsService.findOne(id);
  }

  @Get(':id/meals')
  @ApiOperation({ summary: 'Get vendor with all their meals' })
  @ApiResponse({ status: 200, description: 'Return the vendor with their meals' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async getVendorWithMeals(@Param('id', ParseIntPipe) id: number) {
    return this.vendorsService.getVendorWithMeals(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new vendor (Admin only)' })
  @ApiResponse({ status: 201, description: 'Vendor has been created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createVendorDto: CreateVendorDto, @Req() req: AuthRequest) {
    // Check if user is admin
    if (req.user.role !== UserRole.ADMIN) {
      return {
        statusCode: 403,
        message: 'Forbidden: Only administrators can create vendors',
      };
    }
    
    return this.vendorsService.create(createVendorDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a vendor (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor has been updated' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVendorDto: UpdateVendorDto,
    @Req() req: AuthRequest,
  ) {
    // Check if user is admin
    if (req.user.role !== UserRole.ADMIN) {
      return {
        statusCode: 403,
        message: 'Forbidden: Only administrators can update vendors',
      };
    }
    
    return this.vendorsService.update(id, updateVendorDto);
  }

  @Patch(':id/activation')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set vendor activation status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor activation status has been updated' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async setActivation(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean },
    @Req() req: AuthRequest,
  ) {
    // Check if user is admin
    if (req.user.role !== UserRole.ADMIN) {
      return {
        statusCode: 403,
        message: 'Forbidden: Only administrators can change vendor activation status',
      };
    }
    
    return this.vendorsService.setActivation(id, body.isActive);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a vendor (Admin only)' })
  @ApiResponse({ status: 200, description: 'Vendor has been deleted' })
  @ApiResponse({ status: 404, description: 'Vendor not found' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    // Check if user is admin
    if (req.user.role !== UserRole.ADMIN) {
      return {
        statusCode: 403,
        message: 'Forbidden: Only administrators can delete vendors',
      };
    }
    
    return this.vendorsService.remove(id);
  }
}
