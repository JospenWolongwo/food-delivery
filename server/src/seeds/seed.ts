import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Import your entities
// Update these imports based on your actual entity paths
import { User } from '../users/entities/user.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Meal } from '../meals/entities/meal.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  try {
    console.log('Starting database seeding...');
    
    // Get repositories
    const userRepository = getRepository(User);
    const vendorRepository = getRepository(Vendor);
    const mealRepository = getRepository(Meal);
    
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = userRepository.create({
      email: 'admin@campusfoods.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '237612345678',
      role: 'admin'
    });
    await userRepository.save(adminUser);
    
    // Create test user
    console.log('Creating test user...');
    const testUserPassword = await bcrypt.hash('test123', 10);
    const testUser = userRepository.create({
      email: 'test@example.com',
      password: testUserPassword,
      firstName: 'Test',
      lastName: 'User',
      phoneNumber: '237612345679',
      role: 'user'
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
      isActive: true,
      deliveryFee: 500,
      minimumOrderAmount: 2000
    });
    await vendorRepository.save(vendor1);
    
    const vendor2 = vendorRepository.create({
      name: 'Chez Pierre',
      description: 'Delicious local food with French influence',
      address: 'University Campus, Building B',
      logoUrl: '/images/vendor-placeholder.svg',
      phoneNumber: '237612345681',
      email: 'contact@chezpierre.com',
      isActive: true,
      deliveryFee: 500,
      minimumOrderAmount: 2500
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
      preparationTime: 20,
      category: 'Traditional',
      vendor: vendor1,
      nutritionalInfo: {
        calories: 580,
        protein: 25,
        carbohydrates: 40,
        fat: 15
      }
    });
    await mealRepository.save(ndole);
    
    // Meal 2
    const pouletDG = mealRepository.create({
      name: 'Poulet DG',
      description: 'Directeur Général chicken - a delicious dish with chicken, plantains, and vegetables in a rich sauce.',
      price: 4200,
      imageUrl: '/meals/grilled-chicken.jpg',
      isAvailable: true,
      preparationTime: 25,
      category: 'Traditional',
      vendor: vendor2,
      nutritionalInfo: {
        calories: 650,
        protein: 30,
        carbohydrates: 35,
        fat: 18
      }
    });
    await mealRepository.save(pouletDG);
    
    // Meal 3
    const eru = mealRepository.create({
      name: 'Eru',
      description: 'A nutritious vegetable soup made with finely shredded eru leaves, waterleaf, and meat or fish.',
      price: 3000,
      imageUrl: '/meals/eru.jpg',
      isAvailable: true,
      preparationTime: 20,
      category: 'Traditional',
      vendor: vendor1,
      nutritionalInfo: {
        calories: 450,
        protein: 20,
        carbohydrates: 30,
        fat: 10
      }
    });
    await mealRepository.save(eru);
    
    // Meal 4
    const jollofRice = mealRepository.create({
      name: 'Jollof Rice',
      description: 'Spicy rice dish cooked with tomatoes, peppers, and aromatic spices, served with grilled chicken.',
      price: 3200,
      imageUrl: '/meals/jollof-rice.jpg',
      isAvailable: true,
      preparationTime: 15,
      category: 'Rice',
      vendor: vendor2,
      nutritionalInfo: {
        calories: 520,
        protein: 22,
        carbohydrates: 45,
        fat: 12
      }
    });
    await mealRepository.save(jollofRice);
    
    // Add more meals from your FeaturedMeals.tsx component
    const bornyFish = mealRepository.create({
      name: 'Borny fish',
      description: 'Borny fish with boboloh, peppers, and aromatic spices.',
      price: 3200,
      imageUrl: '/meals/borny-fish.jpg',
      isAvailable: true,
      preparationTime: 18,
      category: 'Fish',
      vendor: vendor1,
      nutritionalInfo: {
        calories: 520,
        protein: 28,
        carbohydrates: 25,
        fat: 15
      }
    });
    await mealRepository.save(bornyFish);
    
    const okok = mealRepository.create({
      name: 'Okok',
      description: 'Okok with boboloh, peppers, and aromatic spices.',
      price: 3200,
      imageUrl: '/meals/okok.jpg',
      isAvailable: true,
      preparationTime: 22,
      category: 'Traditional',
      vendor: vendor1,
      nutritionalInfo: {
        calories: 520,
        protein: 20,
        carbohydrates: 40,
        fat: 18
      }
    });
    await mealRepository.save(okok);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();