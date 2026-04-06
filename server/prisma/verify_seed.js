import "dotenv/config";
import prisma from '../src/config/db.js';

async function verify() {
  const products = await prisma.product.findMany({
    take: 5,
    include: {
      category: true
    }
  });

  console.log('--- Verification: First 5 Products ---');
  products.forEach((p, index) => {
    console.log(`Product ${index + 1}: ${p.name}`);
    console.log(`- Category: ${p.category.name}`);
    console.log(`- Price: ${p.price} ${p.currency}`);
    console.log(`- Discount: ${p.discount}%`);
    console.log(`- Seller: ${p.seller}`);
    console.log(`- Image URL: ${p.image}`);
    console.log(`- Specification Count: ${Array.isArray(p.specifications) ? p.specifications.length : 'N/A'}`);
    console.log('-----------------------------------');
  });
}

verify()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
