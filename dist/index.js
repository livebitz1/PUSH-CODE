var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import dotenv from "dotenv";
import express2 from "express";
import session from "express-session";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  appointments: () => appointments,
  appointmentsRelations: () => appointmentsRelations,
  dentists: () => dentists,
  dentistsRelations: () => dentistsRelations,
  insertAppointmentSchema: () => insertAppointmentSchema,
  insertDentistSchema: () => insertDentistSchema,
  insertOrderItemSchema: () => insertOrderItemSchema,
  insertOrderSchema: () => insertOrderSchema,
  insertProductReviewSchema: () => insertProductReviewSchema,
  insertProductSchema: () => insertProductSchema,
  insertTimeSlotSchema: () => insertTimeSlotSchema,
  insertUserSchema: () => insertUserSchema,
  orderItems: () => orderItems,
  orderItemsRelations: () => orderItemsRelations,
  orders: () => orders,
  ordersRelations: () => ordersRelations,
  productReviews: () => productReviews,
  productReviewsRelations: () => productReviewsRelations,
  products: () => products,
  productsRelations: () => productsRelations,
  sessions: () => sessions,
  timeSlots: () => timeSlots,
  timeSlotsRelations: () => timeSlotsRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  numeric,
  time,
  date,
  decimal
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phone_number").unique(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var dentists = pgTable("dentists", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  specialty: varchar("specialty").notNull(),
  education: varchar("education"),
  location: varchar("location"),
  avatar: varchar("avatar"),
  rating: numeric("rating", { precision: 2, scale: 1 }),
  reviewCount: integer("review_count").default(0),
  priceFrom: integer("price_from"),
  // price in cents
  offersVideo: boolean("offers_video").default(true),
  offersClinic: boolean("offers_clinic").default(true),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow()
});
var timeSlots = pgTable("time_slots", {
  id: serial("id").primaryKey(),
  dentistId: integer("dentist_id").references(() => dentists.id),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  dentistId: integer("dentist_id").references(() => dentists.id),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  consultationType: varchar("consultation_type").notNull(),
  // 'video' or 'clinic'
  reason: text("reason"),
  status: varchar("status").default("pending"),
  // 'pending', 'confirmed', 'cancelled', 'completed'
  price: integer("price"),
  // price in cents
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  // 'toothbrush', 'toothpaste', 'mouthwash', 'dental_floss', 'whitening', 'accessories'
  brand: varchar("brand"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  // price in USD
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  // for discounts
  currency: varchar("currency").default("USD"),
  stockQuantity: integer("stock_quantity").default(0),
  images: text("images").array(),
  // array of image URLs
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  isRecommended: boolean("is_recommended").default(false),
  // recommended by doctors
  specifications: jsonb("specifications"),
  // JSON object for product specs
  tags: text("tags").array(),
  // search tags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  orderNumber: varchar("order_number").unique().notNull(),
  status: varchar("status").default("pending"),
  // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  paymentMethod: varchar("payment_method"),
  // 'stripe', 'paypal', 'bank_transfer'
  paymentStatus: varchar("payment_status").default("pending"),
  // 'pending', 'paid', 'failed', 'refunded'
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  shippingAddress: jsonb("shipping_address"),
  // JSON object with address details
  billingAddress: jsonb("billing_address"),
  // JSON object with address details
  notes: text("notes"),
  estimatedDelivery: date("estimated_delivery"),
  trackingNumber: varchar("tracking_number"),
  shippingProvider: varchar("shipping_provider"),
  // 'fedex', 'dhl', 'ups', 'local_delivery'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  userId: integer("user_id").references(() => users.id),
  rating: integer("rating").notNull(),
  // 1-5 stars
  title: varchar("title"),
  comment: text("comment"),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
  orders: many(orders),
  productReviews: many(productReviews)
}));
var dentistsRelations = relations(dentists, ({ many }) => ({
  appointments: many(appointments),
  timeSlots: many(timeSlots)
}));
var appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id]
  }),
  dentist: one(dentists, {
    fields: [appointments.dentistId],
    references: [dentists.id]
  })
}));
var timeSlotsRelations = relations(timeSlots, ({ one }) => ({
  dentist: one(dentists, {
    fields: [timeSlots.dentistId],
    references: [dentists.id]
  })
}));
var productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  reviews: many(productReviews)
}));
var ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  items: many(orderItems)
}));
var orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));
var productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id]
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id]
  })
}));
var insertUserSchema = createInsertSchema(users).pick({
  phoneNumber: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true
});
var insertDentistSchema = createInsertSchema(dentists).omit({
  id: true,
  createdAt: true
});
var insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertTimeSlotSchema = createInsertSchema(timeSlots).omit({
  id: true,
  createdAt: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true
});
var insertProductReviewSchema = createInsertSchema(productReviews).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
var pool = null;
var db = null;
if (!process.env.DATABASE_URL) {
  console.warn("Warning: DATABASE_URL is not set. Database functionality will be disabled, but the website will still load.");
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema: schema_exports });
}

// server/storage.ts
import { eq, and, desc, asc } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByPhone(phoneNumber) {
    const [user] = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber));
    return user;
  }
  async createUser(userData) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Dentist operations
  async getDentists() {
    return await db.select().from(dentists).orderBy(desc(dentists.rating));
  }
  async getDentist(id) {
    const [dentist] = await db.select().from(dentists).where(eq(dentists.id, id));
    return dentist;
  }
  async createDentist(dentist) {
    const [newDentist] = await db.insert(dentists).values(dentist).returning();
    return newDentist;
  }
  // Appointment operations
  async createAppointment(appointment) {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }
  async getUserAppointments(userId) {
    return await db.select({
      id: appointments.id,
      userId: appointments.userId,
      dentistId: appointments.dentistId,
      date: appointments.date,
      startTime: appointments.startTime,
      endTime: appointments.endTime,
      consultationType: appointments.consultationType,
      reason: appointments.reason,
      status: appointments.status,
      price: appointments.price,
      createdAt: appointments.createdAt,
      updatedAt: appointments.updatedAt,
      dentist: {
        id: dentists.id,
        name: dentists.name,
        specialty: dentists.specialty,
        education: dentists.education,
        location: dentists.location,
        avatar: dentists.avatar,
        rating: dentists.rating,
        reviewCount: dentists.reviewCount,
        priceFrom: dentists.priceFrom,
        offersVideo: dentists.offersVideo,
        offersClinic: dentists.offersClinic,
        bio: dentists.bio,
        createdAt: dentists.createdAt
      }
    }).from(appointments).innerJoin(dentists, eq(appointments.dentistId, dentists.id)).where(eq(appointments.userId, userId)).orderBy(desc(appointments.date), desc(appointments.startTime));
  }
  async updateAppointmentStatus(id, status) {
    const [appointment] = await db.update(appointments).set({ status, updatedAt: /* @__PURE__ */ new Date() }).where(eq(appointments.id, id)).returning();
    return appointment;
  }
  async cancelAppointment(id, userId) {
    const result = await db.update(appointments).set({ status: "cancelled", updatedAt: /* @__PURE__ */ new Date() }).where(and(eq(appointments.id, id), eq(appointments.userId, userId))).returning();
    return result.length > 0;
  }
  // Time slot operations
  async getDentistTimeSlots(dentistId, date2) {
    return await db.select().from(timeSlots).where(
      and(
        eq(timeSlots.dentistId, dentistId),
        eq(timeSlots.date, date2),
        eq(timeSlots.isAvailable, true)
      )
    ).orderBy(asc(timeSlots.startTime));
  }
  async createTimeSlot(timeSlot) {
    const [newTimeSlot] = await db.insert(timeSlots).values(timeSlot).returning();
    return newTimeSlot;
  }
  async markTimeSlotUnavailable(dentistId, date2, startTime) {
    await db.update(timeSlots).set({ isAvailable: false }).where(
      and(
        eq(timeSlots.dentistId, dentistId),
        eq(timeSlots.date, date2),
        eq(timeSlots.startTime, startTime)
      )
    );
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import { z } from "zod";
import { eq as eq2, ilike, asc as asc2, desc as desc2 } from "drizzle-orm";
var isAuthenticated = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};
async function registerRoutes(app2) {
  const sendOtpSchema = z.object({
    phoneNumber: z.string().min(1, "Phone number is required")
  });
  const verifyOtpSchema = z.object({
    phoneNumber: z.string().min(1, "Phone number is required"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    mode: z.enum(["signin", "signup"])
  });
  const completeSignupSchema = z.object({
    phoneNumber: z.string().min(1, "Phone number is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required")
  });
  const otpStore = /* @__PURE__ */ new Map();
  app2.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { phoneNumber } = sendOtpSchema.parse(req.body);
      const otp = "123456";
      const expires = Date.now() + 5 * 60 * 1e3;
      otpStore.set(phoneNumber, { otp, expires });
      console.log(`OTP for ${phoneNumber}: ${otp}`);
      res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(400).json({ message: "Failed to send OTP" });
    }
  });
  app2.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phoneNumber, otp, mode } = verifyOtpSchema.parse(req.body);
      const storedOtp = otpStore.get(phoneNumber);
      if (!storedOtp || storedOtp.otp !== otp || storedOtp.expires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      otpStore.delete(phoneNumber);
      if (mode === "signin") {
        const user = await storage.getUserByPhone(phoneNumber);
        if (!user) {
          return res.status(400).json({ message: "No account found with this phone number" });
        }
        req.session.user = { id: user.id, phoneNumber: user.phoneNumber };
        res.json({ success: true, user });
      } else {
        const existingUser = await storage.getUserByPhone(phoneNumber);
        if (existingUser) {
          return res.status(400).json({ message: "Account already exists with this phone number" });
        }
        req.session.pendingSignup = { phoneNumber };
        res.json({ success: true, needsDetails: true });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(400).json({ message: "Failed to verify OTP" });
    }
  });
  app2.post("/api/auth/complete-signup", async (req, res) => {
    try {
      const { phoneNumber, firstName, lastName, email } = completeSignupSchema.parse(req.body);
      const pendingSignup = req.session.pendingSignup;
      if (!pendingSignup || pendingSignup.phoneNumber !== phoneNumber) {
        return res.status(400).json({ message: "Invalid signup session" });
      }
      const user = await storage.createUser({
        phoneNumber,
        firstName,
        lastName,
        email
      });
      req.session.user = { id: user.id, phoneNumber: user.phoneNumber };
      delete req.session.pendingSignup;
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error completing signup:", error);
      res.status(400).json({ message: "Failed to complete signup" });
    }
  });
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });
  app2.get("/api/dentists", async (req, res) => {
    try {
      const dentists2 = await storage.getDentists();
      res.json(dentists2);
    } catch (error) {
      console.error("Error fetching dentists:", error);
      res.status(500).json({ message: "Failed to fetch dentists" });
    }
  });
  app2.get("/api/dentists/:id", async (req, res) => {
    try {
      const dentistId = parseInt(req.params.id);
      const dentist = await storage.getDentist(dentistId);
      if (!dentist) {
        return res.status(404).json({ message: "Dentist not found" });
      }
      res.json(dentist);
    } catch (error) {
      console.error("Error fetching dentist:", error);
      res.status(500).json({ message: "Failed to fetch dentist" });
    }
  });
  app2.get("/api/dentists/:id/timeslots", async (req, res) => {
    try {
      const dentistId = parseInt(req.params.id);
      const date2 = req.query.date;
      if (!date2) {
        return res.status(400).json({ message: "Date parameter is required" });
      }
      const timeSlots2 = await storage.getDentistTimeSlots(dentistId, date2);
      res.json(timeSlots2);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      res.status(500).json({ message: "Failed to fetch time slots" });
    }
  });
  app2.post("/api/appointments", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user.id;
      const appointmentData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment({
        ...appointmentData,
        userId
      });
      if (appointmentData.dentistId) {
        await storage.markTimeSlotUnavailable(
          appointmentData.dentistId,
          appointmentData.date,
          appointmentData.startTime
        );
      }
      res.status(201).json(appointment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid appointment data", errors: error.errors });
      }
      console.error("Error creating appointment:", error);
      res.status(500).json({ message: "Failed to create appointment" });
    }
  });
  app2.get("/api/appointments", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user.id;
      const appointments2 = await storage.getUserAppointments(userId);
      res.json(appointments2);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });
  app2.patch("/api/appointments/:id/status", isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      const appointment = await storage.updateAppointmentStatus(appointmentId, status);
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      res.status(500).json({ message: "Failed to update appointment status" });
    }
  });
  app2.delete("/api/appointments/:id", isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const userId = req.session.user.id;
      const success = await storage.cancelAppointment(appointmentId, userId);
      if (!success) {
        return res.status(404).json({ message: "Appointment not found or unauthorized" });
      }
      res.json({ message: "Appointment cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      res.status(500).json({ message: "Failed to cancel appointment" });
    }
  });
  app2.get("/api/products", async (req, res) => {
    try {
      const { category, search, sort } = req.query;
      let query = db.select().from(products).where(eq2(products.isActive, true));
      if (category && category !== "all") {
        query = query.where(eq2(products.category, category));
      }
      if (search) {
        query = query.where(ilike(products.name, `%${search}%`));
      }
      if (sort === "price_asc") {
        query = query.orderBy(asc2(products.price));
      } else if (sort === "price_desc") {
        query = query.orderBy(desc2(products.price));
      } else if (sort === "popular") {
        query = query.orderBy(desc2(products.isFeatured));
      } else {
        query = query.orderBy(asc2(products.name));
      }
      const productList = await query;
      res.json(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const [product] = await db.select().from(products).where(eq2(products.id, productId));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user.id;
      const { items, shippingAddress, billingAddress } = req.body;
      let subtotal = 0;
      const orderItemsData = [];
      for (const item of items) {
        const [product] = await db.select().from(products).where(eq2(products.id, item.productId));
        if (!product) {
          return res.status(400).json({ message: `Product ${item.productId} not found` });
        }
        const itemTotal = parseFloat(product.price) * item.quantity;
        subtotal += itemTotal;
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: itemTotal.toFixed(2)
        });
      }
      const shippingFee = 5.99;
      const tax = subtotal * 0.1;
      const total = subtotal + shippingFee + tax;
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const [order] = await db.insert(orders).values({
        userId,
        orderNumber,
        subtotal: subtotal.toFixed(2),
        shippingFee: shippingFee.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        shippingAddress,
        billingAddress,
        status: "pending",
        paymentStatus: "pending"
      }).returning();
      const orderItemsWithOrderId = orderItemsData.map((item) => ({
        ...item,
        orderId: order.id
      }));
      await db.insert(orderItems).values(orderItemsWithOrderId);
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  app2.get("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = req.session.user.id;
      const userOrders = await db.select().from(orders).where(eq2(orders.userId, userId));
      res.json(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use(session({
  secret: process.env.SESSION_SECRET || "development-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "localhost"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
