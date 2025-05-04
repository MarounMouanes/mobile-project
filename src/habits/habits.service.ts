import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Habit } from '@prisma/client';
import { CreateHabitDto, UpdateHabitDto } from './dto/habit.dto';

@Injectable()
export class HabitsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      where: { userId },
      include: {
        category: true,
      },
    });
  }

  async findOne(id: number, userId: number): Promise<Habit | null> {
    const habit = await this.prisma.habit.findFirst({
      where: { id, userId },
      include: {
        category: true,
      },
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }

    return habit;
  }

  async findByUser(userId: number): Promise<Habit[]> {
    return this.prisma.habit.findMany({
      where: { userId },
      include: {
        category: true,
      },
    });
  }

  async create(createHabitDto: CreateHabitDto, userId: number): Promise<Habit> {
    return this.prisma.habit.create({
      data: {
        ...createHabitDto,
        userId,
        streak: 0,
        progressPercent: 0,
      },
    });
  }

  async update(id: number, updateHabitDto: UpdateHabitDto, userId: number): Promise<Habit> {
    await this.findOne(id, userId); // Verify habit exists and belongs to user

    return this.prisma.habit.update({
      where: { id },
      data: updateHabitDto,
      include: { category: true },
    });
  }

  async checkin(id: number, userId: number): Promise<Habit> {
    const habit = await this.findOne(id, userId);

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found or does not belong to user`);
    }
    
    // Get the current date and the last check-in date
    const now = new Date();
    const lastCheckinDate = habit.lastCheckinDate ? new Date(habit.lastCheckinDate) : null;
    
    // Check if the user can check in today based on frequency and last check-in
    if (lastCheckinDate) {
      const canCheckin = this.canCheckinToday(habit.frequency, lastCheckinDate, now);
      if (!canCheckin) {
        throw new ForbiddenException(`You've already checked in for your ${habit.frequency.toLowerCase()} habit today!`);
      }
    }
    
    // Calculate new streak
    let newStreak = habit.streak;
    
    // If there was no previous check-in or if the streak should continue
    if (!lastCheckinDate || this.shouldContinueStreak(habit.frequency, lastCheckinDate, now)) {
      newStreak += 1;
    } else {
      // Reset streak if too much time has passed
      newStreak = 1;
    }
    
    // Calculate new progress percentage based on frequency and current progress
    let newProgressPercent = this.calculateProgressPercent(habit, lastCheckinDate, now);
    
    return this.prisma.habit.update({
      where: { id },
      data: {
        streak: newStreak,
        progressPercent: newProgressPercent,
        lastCheckinDate: now,
      },
      include: { category: true },
    });
  }

  // Helper method to check if user can check in today
  private canCheckinToday(frequency: string, lastCheckinDate: Date, now: Date): boolean {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastCheckin = new Date(lastCheckinDate.getFullYear(), lastCheckinDate.getMonth(), lastCheckinDate.getDate());
    
    // If last check-in was today, can't check in again
    if (today.getTime() === lastCheckin.getTime()) {
      return false;
    }
    
    return true;
  }

  // Helper method to determine if streak should continue
  private shouldContinueStreak(frequency: string, lastCheckinDate: Date, now: Date): boolean {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastCheckin = new Date(lastCheckinDate.getFullYear(), lastCheckinDate.getMonth(), lastCheckinDate.getDate());
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    switch (frequency.toLowerCase()) {
      case 'daily':
        // For daily habits, streak continues if last check-in was yesterday
        const yesterday = new Date(today.getTime() - oneDayMs);
        return yesterday.getTime() === lastCheckin.getTime();
        
      case 'weekly':
        // For weekly habits, streak continues if last check-in was within the last 7 days
        const oneWeekAgo = new Date(today.getTime() - (7 * oneDayMs));
        return lastCheckin.getTime() >= oneWeekAgo.getTime();
        
      case 'monthly':
        // For monthly habits, streak continues if last check-in was within the last month
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return lastCheckin.getTime() >= lastMonth.getTime();
        
      case 'weekdays':
        // For weekday habits, streak continues if last check-in was yesterday or last Friday (if today is Monday)
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
        if (dayOfWeek === 1) { // Monday
          const lastFriday = new Date(today.getTime() - (3 * oneDayMs));
          return lastCheckin.getTime() === lastFriday.getTime();
        } else if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not weekend
          const yesterday = new Date(today.getTime() - oneDayMs);
          return lastCheckin.getTime() === yesterday.getTime();
        }
        return false;
        
      case 'weekends':
        // For weekend habits, streak continues if last check-in was yesterday (if today is Sunday) or last Sunday (if today is Saturday)
        const weekendDay = today.getDay();
        if (weekendDay === 0) { // Sunday
          const yesterday = new Date(today.getTime() - oneDayMs);
          return lastCheckin.getTime() === yesterday.getTime();
        } else if (weekendDay === 6) { // Saturday
          const lastSunday = new Date(today.getTime() - (6 * oneDayMs));
          return lastCheckin.getTime() === lastSunday.getTime();
        }
        return false;
        
      default:
        return false;
    }
  }

  // Updated method signature to accept the habit object
  private calculateProgressPercent(habit: Habit, lastCheckinDate: Date | null, now: Date): number {
    const frequency = habit.frequency;
    const currentProgress = habit.progressPercent;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (frequency.toLowerCase()) {
      case 'daily': {
        // For daily habits, check if already completed today
        if (lastCheckinDate) {
          const lastCheckinDay = new Date(lastCheckinDate.getFullYear(), lastCheckinDate.getMonth(), lastCheckinDate.getDate());
          if (lastCheckinDay.getTime() === today.getTime()) {
            return 100; // Already checked in today
          }
        }
        return 100; // Checking in today, so 100%
      }
        
      case 'weekly': {
        // For weekly habits, we need to track how many days in the current week the user has checked in
        
        // First, find the start of the current week (Sunday)
        const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - currentDay);
        
        // If it's a new week, start at 1/7
        if (!lastCheckinDate || lastCheckinDate < startOfWeek) {
          return Math.round((1 / 7) * 100); // About 14%
        }
        
        // If within the same week, increment by 1/7
        // We can estimate the number of days already checked in from the current progress
        const daysCheckedIn = Math.round((currentProgress / 100) * 7);
        const newDaysCheckedIn = Math.min(7, daysCheckedIn + 1);
        
        return Math.round((newDaysCheckedIn / 7) * 100);
      }
        
      case 'monthly': {
        // For monthly habits, we need to track how many days in the current month the user has checked in
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        
        // If it's a new month, start at 1/daysInMonth
        if (!lastCheckinDate || lastCheckinDate < startOfMonth) {
          return Math.round((1 / daysInMonth) * 100);
        }
        
        // If within the same month, increment by 1/daysInMonth
        const daysCheckedIn = Math.round((currentProgress / 100) * daysInMonth);
        const newDaysCheckedIn = Math.min(daysInMonth, daysCheckedIn + 1);
        
        return Math.round((newDaysCheckedIn / daysInMonth) * 100);
      }
        
      case 'weekdays': {
        // For weekday habits, we need to track how many weekdays the user has checked in
        const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
        
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          // It's a weekend, no progress change
          return currentProgress;
        }
        
        // Find the start of the current week (Monday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Monday
        
        // If it's a new week, start at 1/5
        if (!lastCheckinDate || lastCheckinDate < startOfWeek) {
          return Math.round((1 / 5) * 100); // 20%
        }
        
        // If within the same week, increment by 1/5
        const daysCheckedIn = Math.round((currentProgress / 100) * 5);
        const newDaysCheckedIn = Math.min(5, daysCheckedIn + 1);
        
        return Math.round((newDaysCheckedIn / 5) * 100);
      }
        
      case 'weekends': {
        // For weekend habits, we need to track how many weekend days the user has checked in
        const dayOfWeek = today.getDay();
        
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // It's a weekday, no progress change
          return currentProgress;
        }
        
        // Find the start of the current weekend (Saturday)
        const startOfWeekend = new Date(today);
        if (dayOfWeek === 0) { // Sunday
          startOfWeekend.setDate(today.getDate() - 1); // Saturday
        }
        
        // If it's a new weekend, start at 1/2 or 2/2
        if (!lastCheckinDate || lastCheckinDate < startOfWeekend) {
          return dayOfWeek === 6 ? 50 : 100; // Saturday = 50%, Sunday = 100%
        }
        
        // If already checked in on Saturday and now checking in on Sunday
        return 100;
      }
        
      default:
        return 100;
    }
  }

  async remove(id: number, userId: number): Promise<Habit> {
    await this.findOne(id, userId); // Verify habit exists and belongs to user

    return this.prisma.habit.delete({
      where: { id },
    });
  }
}