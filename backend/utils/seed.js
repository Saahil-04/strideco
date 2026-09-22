import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";
import Admin from "../models/Admin.js";
import Order from "../models/Order.js";

dotenv.config();

const products = [
  {
    name: "Ember Runner",
    slug: "ember-runner",
    description:
      "A lightweight daily trainer with responsive foam cushioning, built for road miles and easy recovery runs.",
    price: 999,
    category: "running",
    sizes: [7, 8, 9, 10, 11],
    colors: ["Black/Red", "White/Grey"],
    stock: 42,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    featured: true,
  },
  {
    name: "Cirrus Glide",
    slug: "cirrus-glide",
    description: "Max-cushioned running shoe designed for long distances without sacrificing ground feel.",
    price: 899,
    category: "running",
    sizes: [6, 7, 8, 9, 10],
    colors: ["Sky Blue", "Charcoal"],
    stock: 30,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    featured: true,
  },
  {
    name: "Court Classic 88",
    slug: "court-classic-88",
    description: "A retro-inspired leather sneaker that goes from the street to the office without missing a beat.",
    price: 799,
    category: "lifestyle",
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ["White", "Off-White/Green"],
    stock: 55,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
    featured: true,
  },
  {
    name: "Urban Drift",
    slug: "urban-drift",
    description: "Chunky-sole lifestyle sneaker with a knit upper for all-day comfort in the city.",
    price: 1999,
    category: "lifestyle",
    sizes: [6, 7, 8, 9, 10],
    colors: ["Cream", "Black"],
    stock: 18,
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800",
    featured: false,
  },
  {
    name: "Apex High",
    slug: "apex-high",
    description: "High-top basketball shoe with reinforced ankle support and a responsive cushioned midsole.",
    price: 3999,
    category: "basketball",
    sizes: [8, 9, 10, 11, 12, 13],
    colors: ["Red/Black", "Navy/White"],
    stock: 25,
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
    featured: true,
  },
  {
    name: "Crossover Low",
    slug: "crossover-low",
    description: "Low-top basketball sneaker built for quick cuts and court traction.",
    price: 1099,
    category: "basketball",
    sizes: [7, 8, 9, 10, 11],
    colors: ["White/Blue"],
    stock: 8,
    image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800",
    featured: false,
  },
  {
    name: "Forge Trainer",
    slug: "forge-trainer",
    description: "Stable, grippy cross-trainer built for lifting days and HIIT sessions alike.",
    price: 1299,
    category: "training",
    sizes: [7, 8, 9, 10, 11],
    colors: ["Black", "Grey/Orange"],
    stock: 33,
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800",
    featured: false,
  },
  {
    name: "Trail Ridge",
    slug: "trail-ridge",
    description: "Rugged outdoor trainer with an aggressive outsole for mixed-terrain training.",
    price: 1199,
    category: "training",
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ["Olive/Black"],
    stock: 6,
    image: "https://images.unsplash.com/photo-1608379743498-0c1017c1cfb2?w=800",
    featured: false,
  },
  {
    name: "Coastal Slide",
    slug: "coastal-slide",
    description: "Soft, quick-dry slide sandal for the pool, beach, or post-run recovery.",
    price: 2999,
    category: "sandals",
    sizes: [7, 8, 9, 10, 11],
    colors: ["Navy", "Black", "Sand"],
    stock: 60,
    image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=800",
    featured: false,
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected. Seeding...");

  await Product.deleteMany({});
  await Order.deleteMany({});
  await Admin.deleteMany({});

  const createdProducts = await Product.insertMany(products);
  console.log(`Inserted ${createdProducts.length} products`);

  await Admin.create({
    email: process.env.ADMIN_EMAIL || "admin@strideco.com",
    password: process.env.ADMIN_PASSWORD || "changeme123",
    name: "Store Admin",
  });
  console.log("Admin account created");

  // Generate ~60 fake orders across the last 30 days so the dashboard charts have data
  const names = ["Aarav Shah", "Riya Mehta", "Kabir Nair", "Isha Rao", "Vivaan Iyer", "Ananya Kapoor"];
  const orders = [];
  for (let i = 0; i < 60; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);

    const itemCount = 1 + Math.floor(Math.random() * 3);
    const items = [];
    let total = 0;
    for (let j = 0; j < itemCount; j++) {
      const p = createdProducts[Math.floor(Math.random() * createdProducts.length)];
      const quantity = 1 + Math.floor(Math.random() * 2);
      items.push({
        product: p._id,
        name: p.name,
        price: p.price,
        size: p.sizes[Math.floor(Math.random() * p.sizes.length)],
        quantity,
      });
      total += p.price * quantity;
      await Product.findByIdAndUpdate(p._id, { $inc: { sold: quantity } });
    }

    orders.push({
      customerName: names[Math.floor(Math.random() * names.length)],
      customerEmail: "customer@example.com",
      items,
      total: Math.round(total * 100) / 100,
      status: "paid",
      createdAt,
      updatedAt: createdAt,
    });
  }

  await Order.insertMany(orders);
  console.log(`Inserted ${orders.length} orders`);

  console.log("Seed complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
