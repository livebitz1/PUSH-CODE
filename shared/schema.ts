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
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  phoneNumber: varchar("phone_number").unique(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dentists table
export const dentists = pgTable("dentists", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  specialty: varchar("specialty").notNull(),
  education: varchar("education"),
  location: varchar("location"),
  avatar: varchar("avatar"),
  rating: numeric("rating", { precision: 2, scale: 1 }),
  reviewCount: integer("review_count").default(0),
  priceFrom: integer("price_from"), // price in cents
  offersVideo: boolean("offers_video").default(true),
  offersClinic: boolean("offers_clinic").default(true),
  bio: text("bio"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Available time slots for dentists
export const timeSlots = pgTable("time_slots", {
  id: serial("id").primaryKey(),
  dentistId: integer("dentist_id").references(() => dentists.id),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isAvailable: boolean("is_available").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  dentistId: integer("dentist_id").references(() => dentists.id),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  consultationType: varchar("consultation_type").notNull(), // 'video' or 'clinic'
  reason: text("reason"),
  status: varchar("status").default("pending"), // 'pending', 'confirmed', 'cancelled', 'completed'
  price: integer("price"), // price in cents
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Dental Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // 'toothbrush', 'toothpaste', 'mouthwash', 'dental_floss', 'whitening', 'accessories'
  brand: varchar("brand"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(), // price in USD
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }), // for discounts
  currency: varchar("currency").default("USD"),
  stockQuantity: integer("stock_quantity").default(0),
  images: text("images").array(), // array of image URLs
  isActive: boolean("is_active").default(true),
  isFeatured: boolean("is_featured").default(false),
  isRecommended: boolean("is_recommended").default(false), // recommended by doctors
  specifications: jsonb("specifications"), // JSON object for product specs
  tags: text("tags").array(), // search tags
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  orderNumber: varchar("order_number").unique().notNull(),
  status: varchar("status").default("pending"), // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingFee: decimal("shipping_fee", { precision: 10, scale: 2 }).default("0"),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  paymentMethod: varchar("payment_method"), // 'stripe', 'paypal', 'bank_transfer'
  paymentStatus: varchar("payment_status").default("pending"), // 'pending', 'paid', 'failed', 'refunded'
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  shippingAddress: jsonb("shipping_address"), // JSON object with address details
  billingAddress: jsonb("billing_address"), // JSON object with address details
  notes: text("notes"),
  estimatedDelivery: date("estimated_delivery"),
  trackingNumber: varchar("tracking_number"),
  shippingProvider: varchar("shipping_provider"), // 'fedex', 'dhl', 'ups', 'local_delivery'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Order Items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id),
  productId: integer("product_id").references(() => products.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Product Reviews table
export const productReviews = pgTable("product_reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  userId: integer("user_id").references(() => users.id),
  rating: integer("rating").notNull(), // 1-5 stars
  title: varchar("title"),
  comment: text("comment"),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  appointments: many(appointments),
  orders: many(orders),
  productReviews: many(productReviews),
}));

export const dentistsRelations = relations(dentists, ({ many }) => ({
  appointments: many(appointments),
  timeSlots: many(timeSlots),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  dentist: one(dentists, {
    fields: [appointments.dentistId],
    references: [dentists.id],
  }),
}));

export const timeSlotsRelations = relations(timeSlots, ({ one }) => ({
  dentist: one(dentists, {
    fields: [timeSlots.dentistId],
    references: [dentists.id],
  }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  reviews: many(productReviews),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const productReviewsRelations = relations(productReviews, ({ one }) => ({
  product: one(products, {
    fields: [productReviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [productReviews.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).pick({
  phoneNumber: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertDentistSchema = createInsertSchema(dentists).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTimeSlotSchema = createInsertSchema(timeSlots).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertProductReviewSchema = createInsertSchema(productReviews).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Dentist = typeof dentists.$inferSelect;
export type InsertDentist = z.infer<typeof insertDentistSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type TimeSlot = typeof timeSlots.$inferSelect;
export type InsertTimeSlot = z.infer<typeof insertTimeSlotSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type ProductReview = typeof productReviews.$inferSelect;
export type InsertProductReview = z.infer<typeof insertProductReviewSchema>;

// Extended types for API responses
export type AppointmentWithDentist = Appointment & {
  dentist: Dentist;
};

export type DentistWithTimeSlots = Dentist & {
  timeSlots: TimeSlot[];
};
