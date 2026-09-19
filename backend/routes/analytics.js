import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/analytics/summary (admin only)
router.get("/summary", requireAdmin, async (req, res) => {
  try {
    const [totalProducts, totalOrders, revenueAgg, lowStock] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
      Product.countDocuments({ stock: { $lt: 10 } }),
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      lowStockCount: lowStock,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/analytics/revenue-by-day (admin only) - last 30 days
router.get("/revenue-by-day", requireAdmin, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(data.map((d) => ({ date: d._id, revenue: d.revenue, orders: d.orders })));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/analytics/category-breakdown (admin only)
router.get("/category-breakdown", requireAdmin, async (req, res) => {
  try {
    const data = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, unitsSold: { $sum: "$sold" } } },
      { $sort: { unitsSold: -1 } },
    ]);
    res.json(data.map((d) => ({ category: d._id, count: d.count, unitsSold: d.unitsSold })));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/analytics/top-products (admin only)
router.get("/top-products", requireAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ sold: -1 }).limit(5).select("name sold price image");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
