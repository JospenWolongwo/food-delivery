import { Controller, Post, UseGuards } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";

@ApiTags("Database")
@Controller("seed")
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: "Seed the database with initial data" })
  @ApiResponse({ status: 201, description: "Database seeded successfully" })
  @ApiResponse({ status: 403, description: "Forbidden" })
  async seed() {
    return this.seedService.seedDatabase();
  }
}
