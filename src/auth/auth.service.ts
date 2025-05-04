import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    
    // Generate token
    const token = this.generateToken();
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 30); // 30 days expiry
    
    // Update user with token
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        token,
        tokenExpiry,
      },
    });
    
    return {
      userId: user.id,
      username: user.name,
      email: user.email,
      token,
    };
  }

  async register(name: string, email: string, password: string) {
    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { name },
          { email },
        ],
      },
    });

    if (existingUser) {
      throw new UnauthorizedException('Username or email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate token
    const token = this.generateToken();
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 30); // 30 days expiry
    
    // Create user
    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        token,
        tokenExpiry,
      },
    });
    
    // Create seed data for the new user
    await this.createSeedDataForUser(user.id);
    
    return {
      userId: user.id,
      username: user.name,
      email: user.email,
      token,
    };
  }

  async validateToken(token: string) {
    console.log('Validating token:', token ? `${token.substring(0, 10)}...` : 'null');
    
    const user = await this.prisma.user.findFirst({
      where: { token },
    });
    
    console.log('User found:', user ? `ID: ${user.id}, Name: ${user.name}` : 'null');
    
    if (!user || !user.tokenExpiry || new Date() > user.tokenExpiry) {
      console.log('Token validation failed:', 
        !user ? 'No user found' : 
        !user.tokenExpiry ? 'No token expiry' : 
        'Token expired');
      return null;
    }
    
    console.log('Token validated successfully');
    return user;
  }

  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
  
  // New method to create seed data for a user
  private async createSeedDataForUser(userId: number) {
    try {
      // Create categories
      const healthCategory = await this.prisma.category.create({
        data: {
          name: 'Health',
          color: '#4CAF50',
        },
      });

      const productivityCategory = await this.prisma.category.create({
        data: {
          name: 'Productivity',
          color: '#2196F3',
        },
      });

      const mindfulnessCategory = await this.prisma.category.create({
        data: {
          name: 'Mindfulness',
          color: '#9C27B0',
        },
      });

      // Create habits
      const drinkWaterHabit = await this.prisma.habit.create({
        data: {
          title: 'Drink Water',
          description: 'Drink 8 glasses of water daily',
          frequency: 'daily',
          userId: userId,
          categoryId: healthCategory.id,
        },
      });

      const exerciseHabit = await this.prisma.habit.create({
        data: {
          title: 'Exercise',
          description: 'Exercise for 30 minutes',
          frequency: 'daily',
          userId: userId,
          categoryId: healthCategory.id,
        },
      });

      const readingHabit = await this.prisma.habit.create({
        data: {
          title: 'Read a Book',
          description: 'Read for 30 minutes',
          frequency: 'daily',
          userId: userId,
          categoryId: productivityCategory.id,
        },
      });

      const meditationHabit = await this.prisma.habit.create({
        data: {
          title: 'Meditate',
          description: 'Meditate for 10 minutes',
          frequency: 'daily',
          userId: userId,
          categoryId: mindfulnessCategory.id,
        },
      });

      // Create some completions
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      await this.prisma.completion.create({
        data: {
          habitId: drinkWaterHabit.id,
          date: today,
        },
      });

      await this.prisma.completion.create({
        data: {
          habitId: drinkWaterHabit.id,
          date: yesterday,
        },
      });

      await this.prisma.completion.create({
        data: {
          habitId: exerciseHabit.id,
          date: today,
        },
      });
      
      console.log(`Seed data created successfully for user ${userId}`);
    } catch (error) {
      console.error('Error creating seed data for user:', error);
      // Don't throw the error - we don't want to prevent user registration if seed data fails
    }
  }
} 