import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders (public - simulated checkout, no real payment)
router.post("/", async (req, res) => {
  try {
    const { customerName, customerEmail, items } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    let total = 0;
    for (const item of items) {
      total += item.price * item.quantity;
      await Product.findByIdAndUpdate(item.product, {
        $inc: { sold: item.quantity, stock: -item.quantity },
      });
    }

    const order = await Order.create({ customerName, customerEmail, items, total, status: "paid" });
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: "Could not place order", error: err.message });
  }
});

// GET /api/orders (admin only)
router.get("/", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
