import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from '../../users/entities/user.entity';
import { LoginDto, RegisterDto, ResetPasswordDto, ChangePasswordDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const isPasswordValid = await this.comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Generate JWT token
    const token = this.generateToken(user);
    
    // Remove sensitive data
    const { password: _, ...result } = user;
    
    return {
      user: result,
      token,
    };
  }
  
  async register(registerDto: RegisterDto) {
    const { email, password, name, phoneNumber } = registerDto;
    
    // Check if user already exists
    const existingUser = await this.usersRepository.findOne({ where: { email } });
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await this.hashPassword(password);
    
    // Create new user
    const newUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      role: UserRole.CUSTOMER, // Default role for new users
    });
    
    await this.usersRepository.save(newUser);
    
    // Generate JWT token
    const token = this.generateToken(newUser);
    
    // Remove sensitive data
    const { password: _, ...result } = newUser;
    
    return {
      user: result,
      token,
    };
  }
  
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email } = resetPasswordDto;
    
    const user = await this.usersRepository.findOne({ where: { email } });
    
    if (!user) {
      // For security reasons, don't reveal that the user doesn't exist
      return { message: 'If your email is registered, you will receive a password reset link' };
    }
    
    // In a real application, generate a reset token and send an email
    // For this implementation, we'll just return a success message
    
    return { message: 'If your email is registered, you will receive a password reset link' };
  }
  
  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { token, newPassword } = changePasswordDto;
    
    // In a real application, validate the reset token
    // For this implementation, we'll just return a success message
    
    return { message: 'Password has been changed successfully' };
  }
  
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
  
  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
  
  private generateToken(user: User): string {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };
    
    return this.jwtService.sign(payload);
  }
}
