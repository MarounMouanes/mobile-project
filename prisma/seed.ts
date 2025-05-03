import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: 'Tabbouleh', price: 5.50, type: 'Lebanese' },
    { name: 'Kebbeh', price: 7.00, type: 'Lebanese' },
    { name: 'Couscous Royal', price: 12.00, type: 'Moroccan' },
    { name: 'Tajine de poulet', price: 11.50, type: 'Moroccan' },
    { name: 'Sushi Mix', price: 14.00, type: 'Japanese' },
    { name: 'Ramen', price: 10.00, type: 'Japanese' },
    { name: 'Pizza Margherita', price: 9.00, type: 'Italian' },
    { name: 'Spaghetti Carbonara', price: 10.50, type: 'Italian' },
    { name: 'Quiche Lorraine', price: 8.50, type: 'French' },
    { name: 'Bœuf Bourguignon', price: 13.00, type: 'French' },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 