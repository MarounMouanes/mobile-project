import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const healthCategory = await prisma.category.create({
    data: {
      name: 'Health',
      color: '#4CAF50',
    },
  });

  const productivityCategory = await prisma.category.create({
    data: {
      name: 'Productivity',
      color: '#2196F3',
    },
  });

  const mindfulnessCategory = await prisma.category.create({
    data: {
      name: 'Mindfulness',
      color: '#9C27B0',
    },
  });

  // Create a user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    },
  });

  // Create habits
  const drinkWaterHabit = await prisma.habit.create({
    data: {
      title: 'Drink Water',
      description: 'Drink 8 glasses of water daily',
      frequency: 'daily',
      userId: user.id,
      categoryId: healthCategory.id,
    },
  });

  const exerciseHabit = await prisma.habit.create({
    data: {
      title: 'Exercise',
      description: 'Exercise for 30 minutes',
      frequency: 'daily',
      userId: user.id,
      categoryId: healthCategory.id,
    },
  });

  const readingHabit = await prisma.habit.create({
    data: {
      title: 'Read a Book',
      description: 'Read for 30 minutes',
      frequency: 'daily',
      userId: user.id,
      categoryId: productivityCategory.id,
    },
  });

  const meditationHabit = await prisma.habit.create({
    data: {
      title: 'Meditate',
      description: 'Meditate for 10 minutes',
      frequency: 'daily',
      userId: user.id,
      categoryId: mindfulnessCategory.id,
    },
  });

  // Create some completions
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await prisma.completion.create({
    data: {
      habitId: drinkWaterHabit.id,
      date: today,
    },
  });

  await prisma.completion.create({
    data: {
      habitId: drinkWaterHabit.id,
      date: yesterday,
    },
  });

  await prisma.completion.create({
    data: {
      habitId: exerciseHabit.id,
      date: today,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
