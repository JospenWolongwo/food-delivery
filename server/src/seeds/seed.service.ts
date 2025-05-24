import { Injectable, OnModuleInit } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Vendor } from "../vendors/entities/vendor.entity";
import { Meal } from "../meals/entities/meal.entity";
import * as bcrypt from "bcrypt";
import { UserRole } from "../users/entities/user.entity";

@Injectable()
export class SeedService {
  constructor(private dataSource: DataSource) {}

  async seedDatabase() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      console.log("Starting database seeding...");
      const userRepository = queryRunner.manager.getRepository(User);
      const vendorRepository = queryRunner.manager.getRepository(Vendor);
      const mealRepository = queryRunner.manager.getRepository(Meal);

      // Check if we already have data
      const existingMeals = await mealRepository.count();
      if (existingMeals > 0) {
        console.log("Database already seeded, skipping...");
        return { message: "Database already seeded" };
      }

      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const adminUser = userRepository.create({
        email: "admin@campusfoods.com",
        password: hashedPassword,
        name: "Admin User",
        phoneNumber: "237612345678",
        role: UserRole.ADMIN,
      });
      await userRepository.save(adminUser);

      // Create test user
      console.log("Creating test user...");
      const testUserPassword = await bcrypt.hash("test123", 10);
      const testUser = userRepository.create({
        email: "test@example.com",
        password: testUserPassword,
        name: "Test User",
        phoneNumber: "237612345679",
        role: UserRole.CUSTOMER,
      });
      await userRepository.save(testUser);

      // Create vendors
      console.log("Creating vendors...");
      const vendor1 = vendorRepository.create({
        name: "Mama Africa Kitchen",
        description: "Authentic Cameroonian cuisine with a modern twist",
        address: "University Campus, Building A",
        logoUrl: "/images/vendor-placeholder.svg",
        phoneNumber: "237612345680",
        email: "contact@mamaafrica.com",
        isActive: true,
      });
      await vendorRepository.save(vendor1);

      const vendor2 = vendorRepository.create({
        name: "Chez Pierre",
        description: "Delicious local food with French influence",
        address: "University Campus, Building B",
        logoUrl: "/images/vendor-placeholder.svg",
        phoneNumber: "237612345681",
        email: "contact@chezpierre.com",
        isActive: true,
      });
      await vendorRepository.save(vendor2);

      // Create meals
      console.log("Creating meals...");

      // Meal 1
      const ndole = mealRepository.create({
        name: "Ndolé",
        description:
          "Traditional Cameroonian dish made with stewed nuts, ndolé leaves, and fish or beef.",
        price: 3500,
        imageUrl: "/meals/ndole.jpg",
        isAvailable: true,
        isFeatured: true,
        category: "Traditional",
        vendor: vendor1,
      });
      await mealRepository.save(ndole);

      // Meal 2
      const pouletDG = mealRepository.create({
        name: "Poulet DG",
        description:
          "Directeur Général chicken - a delicious dish with chicken, plantains, and vegetables in a rich sauce.",
        price: 4200,
        imageUrl: "/meals/grilled-chicken.jpg",
        isAvailable: true,
        isFeatured: true,
        category: "Traditional",
        vendor: vendor2,
      });
      await mealRepository.save(pouletDG);

      // Meal 3
      const egusi = mealRepository.create({
        name: "Egusi",
        description:
          "A nutritious vegetable soup made with finely shredded eru leaves, waterleaf, and meat or fish.",
        price: 3000,
        imageUrl: "/meals/egusi.jpg",
        isAvailable: true,
        isFeatured: true,
        category: "Traditional",
        vendor: vendor1,
      });
      await mealRepository.save(egusi);

      // Meal 4
      const jollofRice = mealRepository.create({
        name: "Jollof Rice",
        description:
          "Spicy rice dish cooked with tomatoes, peppers, and aromatic spices, served with grilled chicken.",
        price: 3200,
        imageUrl: "/meals/jollof-rice.jpg",
        isAvailable: true,
        isFeatured: true,
        category: "Rice",
        vendor: vendor2,
      });
      await mealRepository.save(jollofRice);

      // Add more meals from your FeaturedMeals.tsx component
      const bornyFish = mealRepository.create({
        name: "Borny fish",
        description: "Borny fish with boboloh, peppers, and aromatic spices.",
        price: 3200,
        imageUrl: "/meals/borny-fish.jpg",
        isAvailable: true,
        isFeatured: true,
        category: "Fish",
        vendor: vendor1,
      });
      await mealRepository.save(bornyFish);

      const okok = mealRepository.create({
        name: "Okok",
        description: "Okok with boboloh, peppers, and aromatic spices.",
        price: 3200,
        imageUrl: "/meals/okok.jpg",
        isAvailable: true,
        category: "Traditional",
        vendor: vendor1,
      });
      await mealRepository.save(okok);

      const pile = mealRepository.create({
        name: "Pile",
        description: "Pile with potatoes and beans and peppers.",
        price: 3000,
        imageUrl: "/meals/pile.jpg",
        isAvailable: true,
        isFeatured: true,
        category: "Traditional",
        vendor: vendor1,
      });
      await mealRepository.save(pile);

      const yam = mealRepository.create({
        name: "Yam",
        description: "Yam with bitter leaves and peppers.",
        price: 3200,
        imageUrl: "/meals/yam.jpg",
        isAvailable: true,
        category: "Traditional",
        vendor: vendor2,
      });
      await mealRepository.save(yam);

      await queryRunner.commitTransaction();
      console.log("Database seeded successfully!");
      return { message: "Database seeded successfully" };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Error seeding database:", error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
