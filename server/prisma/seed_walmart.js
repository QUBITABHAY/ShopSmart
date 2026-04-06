import "dotenv/config";
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import prisma from '../src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JSON_FILE_PATH = path.join(__dirname, '../../walmart_products_cleaned.json');

async function seed() {
  console.log('Starting Walmart product seeding...');

  if (!fs.existsSync(JSON_FILE_PATH)) {
    console.error(`Error: File not found at ${JSON_FILE_PATH}`);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(JSON_FILE_PATH);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let count = 0;
  for await (const line of rl) {
    if (!line.trim()) continue;

    try {
      const record = JSON.parse(line);

      // Parse JSON strings in the record
      const categories = JSON.parse(record.categories || '[]');
      const imageUrls = JSON.parse(record.image_urls || '[]');
      const specifications = JSON.parse(record.specifications || '[]');
      const ratingStars = JSON.parse(record.rating_stars || '{}');
      const colors = JSON.parse(record.colors || '[]');
      const customerReviews = JSON.parse(record.customer_reviews || '[]');

      // 1. Handle Category
      // We will take the last category in the hierarchy
      const categoryName = categories[categories.length - 1] || 'Uncategorized';
      let category = await prisma.category.findFirst({
        where: { name: categoryName }
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryName,
            description: `Auto-generated from Walmart data: ${categories.join(' > ')}`
          }
        });
      }

      // 2. Derive Product Name
      let productName = 'Walmart' + (record.seller ? ` ${record.seller}` : '') + ' Product';
      if (imageUrls.length > 0) {
        try {
          const firstUrl = imageUrls[0];
          if (firstUrl.includes('/seo/')) {
            const seoPart = firstUrl.split('/seo/')[1].split('_')[0];
            productName = seoPart.replace(/-/g, ' ');
          }
        } catch (_e) {
          // Fallback to existing productName
        }
      }

      // 3. Create or Update Product
      await prisma.product.create({
        data: {
          name: productName,
          description: specifications.find(s => s.name === 'Features')?.value || `Walmart product from ${categoryName}`,
          price: record.final_price || 0,
          currency: record.currency || 'USD',
          image: imageUrls[0] || null,
          imageUrls: imageUrls,
          specifications: specifications,
          ratingStars: ratingStars,
          colors: colors,
          seller: record.seller,
          customerReviews: customerReviews,
          discount: record.discount || 0,
          stock: Math.floor(Math.random() * 100), // Random stock for demo
          categoryId: category.id
        }
      });

      count++;
      if (count % 100 === 0) {
        console.log(`Seeded ${count} products...`);
      }
    } catch (error) {
      console.error(`Error parsing line ${count + 1}:`, error.message);
    }
  }

  console.log(`Seeding complete. Successfully seeded ${count} products.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
