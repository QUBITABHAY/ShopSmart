import prisma from "../src/config/db.js";

async function main() {
  console.log("Seeding initial categories...");

  const categories = [
    {
      name: "Electronics",
      description: "Gadgets, smartphones, and computers",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500&auto=format&fit=crop",
    },
    {
      name: "Fashion",
      description: "Clothing, shoes, and accessories",
      image:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=500&auto=format&fit=crop",
    },
    {
      name: "Home & Kitchen",
      description: "Furniture, appliances, and decor",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=500&auto=format&fit=crop",
    },
    {
      name: "Beauty",
      description: "Skincare, makeup, and health products",
      image:
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=500&auto=format&fit=crop",
    },
  ];

  for (const category of categories) {
    try {
      await prisma.category.create({
        data: category,
      });
      console.log(`Created category: ${category.name}`);
    } catch (_error) {
      console.log(`Category ${category.name} already exists, skipping.`);
    }
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
