import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "./users/users.module";
import { MealsModule } from "./meals/meals.module";
import { OrdersModule } from "./orders/orders.module";
import { SubscriptionsModule } from "./subscriptions/subscriptions.module";
import { VendorsModule } from "./vendors/vendors.module";
import { DeliveryModule } from "./delivery/delivery.module";
import { PaymentsModule } from "./payments/payments.module";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { DataSource } from "typeorm";
import { SeedModule } from "./seeds/seed.module";
import { SeedService } from "./seeds/seed.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService
      ): Promise<TypeOrmModuleOptions> => {
        const isProduction =
          configService.get<string>("NODE_ENV") === "production";
        const shouldSync = !isProduction;

        const baseConfig: TypeOrmModuleOptions = {
          type: "postgres",
          entities: [__dirname + "/**/*.entity{.ts,.js}"],
          synchronize: shouldSync,
          logging: !isProduction,
          migrations: [__dirname + "/migrations/*{.ts,.js}"],
          migrationsRun: isProduction,
        };

        // Check for DATABASE_URL first (used by Render and other cloud providers)
        const databaseUrl = configService.get<string>("DATABASE_URL");

        if (databaseUrl) {
          return {
            ...baseConfig,
            url: databaseUrl,
            ssl: isProduction ? { rejectUnauthorized: false } : false,
          };
        }

        // Fallback to individual connection parameters
        return {
          ...baseConfig,
          host: configService.get<string>("DATABASE_HOST", "localhost"),
          port: configService.get<number>("DATABASE_PORT", 5434),
          username: configService.get<string>("DATABASE_USER", "postgres"),
          password: configService.get<string>("DATABASE_PASSWORD", "postgres"),
          database: configService.get<string>("DATABASE_NAME", "food_delivery"),
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        };
      },
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error("No DataSource options provided");
        }
        const dataSource = new DataSource(options);
        await dataSource.initialize();
        return dataSource;
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
    SeedModule,
  ],
})
export class AppModule {
  constructor(private seedService: SeedService) {
    // Auto-seed in development
    if (process.env.NODE_ENV !== "production") {
      this.seedService.seedDatabase().catch((err) => {
        console.error("Error seeding database:", err);
      });
    }
  }
}
