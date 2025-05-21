import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MealsModule } from './meals/meals.module';
import { OrdersModule } from './orders/orders.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { VendorsModule } from './vendors/vendors.module';
import { DeliveryModule } from './delivery/delivery.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Check for DATABASE_URL first (used by Render and other cloud providers)
        const databaseUrl = process.env.DATABASE_URL || configService.get('DATABASE_URL');
        
        if (databaseUrl) {
          // If DATABASE_URL is provided, use it
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get('NODE_ENV', 'development') !== 'production',
            logging: configService.get('NODE_ENV', 'development') !== 'production',
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
          };
        } else {
          // Otherwise use individual connection parameters
          const host = process.env.DATABASE_HOST || configService.get('DATABASE_HOST', 'localhost');
          const port = parseInt(process.env.DATABASE_PORT || configService.get('DATABASE_PORT', '5434')); // Match the Docker port mapping
          const username = process.env.DATABASE_USER || configService.get('DATABASE_USER', 'postgres');
          const password = process.env.DATABASE_PASSWORD || configService.get('DATABASE_PASSWORD', 'postgres');
          const database = process.env.DATABASE_NAME || configService.get('DATABASE_NAME', 'food_delivery');
          
          return {
            type: 'postgres',
            host,
            port,
            username,
            password,
            database,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: configService.get('NODE_ENV', 'development') !== 'production',
            logging: configService.get('NODE_ENV', 'development') !== 'production'
          };
        }
      },
    }),
    // Feature modules
    UsersModule,
    MealsModule,
    OrdersModule,
    SubscriptionsModule,
    VendorsModule,
    DeliveryModule,
    PaymentsModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
