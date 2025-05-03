import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { HabitsModule } from './habits/habits.module';
import { CategoriesModule } from './categories/categories.module';
import { CompletionsModule } from './completions/completions.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    HabitsModule,
    CategoriesModule,
    CompletionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
