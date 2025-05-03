import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async createDish(data: { name: string; price: number; type: string }) {
    try {
      const dish = await this.prisma.product.create({
        data: {
          name: data.name,
          price: data.price,
          type: data.type,
        },
      });
      return dish;
    } catch (error) {
      return -1;
    }
  }

  async deleteDish(id: number) {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      return 'success';
    } catch (error) {
      return 'fail';
    }
  }

  async getAllDishes() {
    return this.prisma.product.findMany();
  }
}
