import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import session from "express-session";
import { db } from "./db";
import { products, orders, orderItems } from "@shared/schema";
import { eq, ilike, asc, desc } from "drizzle-orm";
import { insertAppointmentSchema } from "@shared/schema";

// Custom authentication middleware
const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.session?.user) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {

  // Custom Auth Routes
  const sendOtpSchema = z.object({
    phoneNumber: z.string().min(1, "Phone number is required"),
  });

  const verifyOtpSchema = z.object({
    phoneNumber: z.string().min(1, "Phone number is required"),
    otp: z.string().length(6, "OTP must be 6 digits"),
    mode: z.enum(["signin", "signup"]),
  });

  const completeSignupSchema = z.object({
    phoneNumber: z.string().min(1, "Phone number is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Valid email is required"),
  });

  // Store OTP temporarily in memory (in production, use Redis or database)
  const otpStore = new Map<string, { otp: string; expires: number }>();

  app.post('/api/auth/send-otp', async (req, res) => {
    try {
      const { phoneNumber } = sendOtpSchema.parse(req.body);
      
      // Generate OTP (for demo, always use 123456)
      const otp = "123456";
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
      
      // Store OTP
      otpStore.set(phoneNumber, { otp, expires });
      
      // In production, send SMS here
      console.log(`OTP for ${phoneNumber}: ${otp}`);
      
      res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(400).json({ message: "Failed to send OTP" });
    }
  });

  app.post('/api/auth/verify-otp', async (req, res) => {
    try {
      const { phoneNumber, otp, mode } = verifyOtpSchema.parse(req.body);
      
      // Check OTP
      const storedOtp = otpStore.get(phoneNumber);
      if (!storedOtp || storedOtp.otp !== otp || storedOtp.expires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      
      // Remove used OTP
      otpStore.delete(phoneNumber);
      
      if (mode === "signin") {
        // Check if user exists
        const user = await storage.getUserByPhone(phoneNumber);
        if (!user) {
          return res.status(400).json({ message: "No account found with this phone number" });
        }
        
        // Create session
        (req.session as any).user = { id: user.id, phoneNumber: user.phoneNumber };
        res.json({ success: true, user });
      } else {
        // Sign up mode - check if user already exists
        const existingUser = await storage.getUserByPhone(phoneNumber);
        if (existingUser) {
          return res.status(400).json({ message: "Account already exists with this phone number" });
        }
        
        // Store phone in session for completing signup
        (req.session as any).pendingSignup = { phoneNumber };
        res.json({ success: true, needsDetails: true });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(400).json({ message: "Failed to verify OTP" });
    }
  });

  app.post('/api/auth/complete-signup', async (req, res) => {
    try {
      const { phoneNumber, firstName, lastName, email } = completeSignupSchema.parse(req.body);
      
      // Check if there's a pending signup
      const pendingSignup = (req.session as any).pendingSignup;
      if (!pendingSignup || pendingSignup.phoneNumber !== phoneNumber) {
        return res.status(400).json({ message: "Invalid signup session" });
      }
      
      // Create user
      const user = await storage.createUser({
        phoneNumber,
        firstName,
        lastName,
        email,
      });
      
      // Create session
      (req.session as any).user = { id: user.id, phoneNumber: user.phoneNumber };
      delete (req.session as any).pendingSignup;
      
      res.json({ success: true, user });
    } catch (error) {
      console.error("Error completing signup:", error);
      res.status(400).json({ message: "Failed to complete signup" });
    }
  });



  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/auth/logout', (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  // Dentist routes
  app.get("/api/dentists", async (req, res) => {
    try {
      const dentists = await storage.getDentists();
      res.json(dentists);
    } catch (error) {
      console.error("Error fetching dentists:", error);
      res.status(500).json({ message: "Failed to fetch dentists" });
    }
  });

  app.get("/api/dentists/:id", async (req, res) => {
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

  // Time slots routes
  app.get("/api/dentists/:id/timeslots", async (req, res) => {
    try {
      const dentistId = parseInt(req.params.id);
      const date = req.query.date as string;
      
      if (!date) {
        return res.status(400).json({ message: "Date parameter is required" });
      }

      const timeSlots = await storage.getDentistTimeSlots(dentistId, date);
      res.json(timeSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      res.status(500).json({ message: "Failed to fetch time slots" });
    }
  });

  // Appointment routes
  app.post("/api/appointments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user.id;
      const appointmentData = insertAppointmentSchema.parse(req.body);
      
      const appointment = await storage.createAppointment({
        ...appointmentData,
        userId,
      });

      // Mark the time slot as unavailable
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

  app.get("/api/appointments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user.id;
      const appointments = await storage.getUserAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.patch("/api/appointments/:id/status", isAuthenticated, async (req: any, res) => {
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

  app.delete("/api/appointments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const userId = (req.session as any).user.id;
      
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

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search, sort } = req.query;
      
      let query = db.select().from(products).where(eq(products.isActive, true));
      
      if (category && category !== "all") {
        query = query.where(eq(products.category, category as string));
      }
      
      if (search) {
        query = query.where(ilike(products.name, `%${search}%`));
      }
      
      // Apply sorting
      if (sort === "price_asc") {
        query = query.orderBy(asc(products.price));
      } else if (sort === "price_desc") {
        query = query.orderBy(desc(products.price));
      } else if (sort === "popular") {
        query = query.orderBy(desc(products.isFeatured));
      } else {
        query = query.orderBy(asc(products.name));
      }
      
      const productList = await query;
      res.json(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const [product] = await db.select().from(products).where(eq(products.id, productId));
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Orders routes
  app.post("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user.id;
      const { items, shippingAddress, billingAddress } = req.body;
      
      // Calculate order totals
      let subtotal = 0;
      const orderItemsData = [];
      
      for (const item of items) {
        const [product] = await db.select().from(products).where(eq(products.id, item.productId));
        if (!product) {
          return res.status(400).json({ message: `Product ${item.productId} not found` });
        }
        
        const itemTotal = parseFloat(product.price) * item.quantity;
        subtotal += itemTotal;
        
        orderItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
          totalPrice: itemTotal.toFixed(2),
        });
      }
      
      const shippingFee = 5.99; // Fixed shipping fee
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + shippingFee + tax;
      
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create order
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
        paymentStatus: "pending",
      }).returning();
      
      // Create order items
      const orderItemsWithOrderId = orderItemsData.map(item => ({
        ...item,
        orderId: order.id,
      }));
      
      await db.insert(orderItems).values(orderItemsWithOrderId);
      
      res.json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.get("/api/orders", isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req.session as any).user.id;
      const userOrders = await db.select().from(orders).where(eq(orders.userId, userId));
      res.json(userOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
