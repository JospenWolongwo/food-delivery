import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';

// Import your entities
import { User, UserRole } from '../users/entities/user.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Meal } from '../meals/entities/meal.entity';

async function bootstrap() {
  // Declare app variable outside the try block so it's available in the catch block
  let app;

  try {
    console.log('Starting database seeding...');
    
    // Create a NestJS application instance
    app = await NestFactory.createApplicationContext(AppModule);
    
    // Get the DataSource
    const dataSource = app.get<DataSource>(getDataSourceToken());
    
    // Get repositories
    const userRepository = dataSource.getRepository(User);
    const vendorRepository = dataSource.getRepository(Vendor);
    const mealRepository = dataSource.getRepository(Meal);
    
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = userRepository.create({
      email: 'admin@campusfoods.com',
      password: hashedPassword,
      name: 'Admin User',
      phoneNumber: '237612345678',
      role: UserRole.ADMIN
    });
    await userRepository.save(adminUser);
    
    // Create test user
    console.log('Creating test user...');
    const testUserPassword = await bcrypt.hash('test123', 10);
    const testUser = userRepository.create({
      email: 'test@example.com',
      password: testUserPassword,
      name: 'Test User',
      phoneNumber: '237612345679',
      role: UserRole.CUSTOMER
    });
    await userRepository.save(testUser);
    
    // Create vendors
    console.log('Creating vendors...');
    const vendor1 = vendorRepository.create({
      name: 'Mama Africa Kitchen',
      description: 'Authentic Cameroonian cuisine with a modern twist',
      address: 'University Campus, Building A',
      logoUrl: '/images/vendor-placeholder.svg',
      phoneNumber: '237612345680',
      email: 'contact@mamaafrica.com',
      isActive: true
    });
    await vendorRepository.save(vendor1);
    
    const vendor2 = vendorRepository.create({
      name: 'Chez Pierre',
      description: 'Delicious local food with French influence',
      address: 'University Campus, Building B',
      logoUrl: '/images/vendor-placeholder.svg',
      phoneNumber: '237612345681',
      email: 'contact@chezpierre.com',
      isActive: true
    });
    await vendorRepository.save(vendor2);
    
    // Create meals
    console.log('Creating meals...');
    
    // Meal 1
    const ndole = mealRepository.create({
      name: 'Ndolé',
      description: 'Traditional Cameroonian dish made with stewed nuts, ndolé leaves, and fish or beef.',
      price: 3500,
      imageUrl: '/meals/ndole.jpg',
      isAvailable: true,
      category: 'Traditional',
      vendor: vendor1
    });
    await mealRepository.save(ndole);
    
    // Meal 2
    const pouletDG = mealRepository.create({
      name: 'Poulet DG',
      description: 'Directeur Général chicken - a delicious dish with chicken, plantains, and vegetables in a rich sauce.',
      price: 4200,
      imageUrl: '/meals/grilled-chicken.jpg',
      isAvailable: true,
      category: 'Traditional',
      vendor: vendor2
    });
    await mealRepository.save(pouletDG);
    
    // Meal 3
    const eru = mealRepository.create({
      name: 'Eru',
      description: 'A nutritious vegetable soup made with finely shredded eru leaves, waterleaf, and meat or fish.',
      price: 3000,
      imageUrl: '/meals/eru.jpg',
      isAvailable: true,
      category: 'Traditional',
      vendor: vendor1
    });
    await mealRepository.save(eru);
    
    // Meal 4
    const jollofRice = mealRepository.create({
      name: 'Jollof Rice',
      description: 'Spicy rice dish cooked with tomatoes, peppers, and aromatic spices, served with grilled chicken.',
      price: 3200,
      imageUrl: '/meals/jollof-rice.jpg',
      isAvailable: true,
      category: 'Rice',
      vendor: vendor2
    });
    await mealRepository.save(jollofRice);
    
    // Add more meals from your FeaturedMeals.tsx component
    const bornyFish = mealRepository.create({
      name: 'Borny fish',
      description: 'Borny fish with boboloh, peppers, and aromatic spices.',
      price: 3200,
      imageUrl: '/meals/borny-fish.jpg',
      isAvailable: true,
      category: 'Fish',
      vendor: vendor1
    });
    await mealRepository.save(bornyFish);
    
    const okok = mealRepository.create({
      name: 'Okok',
      description: 'Okok with boboloh, peppers, and aromatic spices.',
      price: 3200,
      imageUrl: '/meals/okok.jpg',
      isAvailable: true,
      category: 'Traditional',
      vendor: vendor1
    });
    await mealRepository.save(okok);
    
    console.log('Database seeding completed successfully!');
    // Close the application when done
    await app.close();
  } catch (error) {
    console.error('Error during database seeding:', error);
    // Make sure to close the app even if there's an error
    if (app) {
      await app.close();
    }
    process.exit(1);
  }
}

bootstrap();