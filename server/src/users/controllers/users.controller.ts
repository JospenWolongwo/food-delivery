import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { User, UserRole } from '../entities/user.entity';

// Define interface for authenticated request
interface AuthRequest extends Request {
  user: User & { id: number; role: UserRole };
}

import { UsersService } from '../services/users.service';
import { UpdateUserDto, UpdateUserRoleDto } from '../dto/user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Req() req: AuthRequest) {
    // Check if user is admin
    if (req.user.role !== UserRole.ADMIN) {
      return {
        message: 'Access denied. Admin privileges required.',
        statusCode: HttpStatus.FORBIDDEN
      };
    }
    
    return this.usersService.findAll(page, limit);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Return the current user' })
  async getProfile(@Req() req: AuthRequest) {
    return this.usersService.findById(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID (Admin or self only)' })
  @ApiResponse({ status: 200, description: 'Return user by ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    // Allow access if user is admin or is requesting their own profile
    if (req.user.role !== UserRole.ADMIN && req.user.id !== id) {
      return {
        message: 'Access denied. You can only access your own profile.',
        statusCode: HttpStatus.FORBIDDEN
      };
    }
    
    return this.usersService.findById(id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'User has been updated' })
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Req() req: AuthRequest) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Put(':id/role')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user role (Admin only)' })
  @ApiResponse({ status: 200, description: 'User role has been updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Req() req: AuthRequest,
  ) {
    // Check if user is admin
    if (req.user.role !== UserRole.ADMIN) {
      return {
        message: 'Access denied. Admin privileges required.',
        statusCode: HttpStatus.FORBIDDEN
      };
    }
    
    return this.usersService.updateRole(id, updateUserRoleDto);
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password has been changed' })
  @ApiResponse({ status: 400, description: 'Current password is incorrect' })
  async changePassword(
    @Body() body: { currentPassword: string; newPassword: string },
    @Req() req: AuthRequest,
  ) {
    return this.usersService.changePassword(
      req.user.id,
      body.currentPassword,
      body.newPassword,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user (Admin only)' })
  @ApiResponse({ status: 200, description: 'User has been deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    // Check if user is admin
    if (req.user.role !== UserRole.ADMIN) {
      return {
        message: 'Access denied. Admin privileges required.',
        statusCode: HttpStatus.FORBIDDEN
      };
    }
    
    return this.usersService.delete(id);
  }
}
