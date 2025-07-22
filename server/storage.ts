import {
  users,
  dentists,
  appointments,
  timeSlots,
  type User,
  type UpsertUser,
  type Dentist,
  type InsertDentist,
  type Appointment,
  type InsertAppointment,
  type TimeSlot,
  type InsertTimeSlot,
  type AppointmentWithDentist,
  type DentistWithTimeSlots,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByPhone(phoneNumber: string): Promise<User | undefined>;
  createUser(user: { phoneNumber: string; firstName: string; lastName: string; email: string }): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Dentist operations
  getDentists(): Promise<Dentist[]>;
  getDentist(id: number): Promise<Dentist | undefined>;
  createDentist(dentist: InsertDentist): Promise<Dentist>;
  
  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getUserAppointments(userId: number): Promise<AppointmentWithDentist[]>;
  updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined>;
  cancelAppointment(id: number, userId: number): Promise<boolean>;
  
  // Time slot operations
  getDentistTimeSlots(dentistId: number, date: string): Promise<TimeSlot[]>;
  createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot>;
  markTimeSlotUnavailable(dentistId: number, date: string, startTime: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByPhone(phoneNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phoneNumber, phoneNumber));
    return user;
  }

  async createUser(userData: { phoneNumber: string; firstName: string; lastName: string; email: string }): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Dentist operations
  async getDentists(): Promise<Dentist[]> {
    return await db.select().from(dentists).orderBy(desc(dentists.rating));
  }

  async getDentist(id: number): Promise<Dentist | undefined> {
    const [dentist] = await db.select().from(dentists).where(eq(dentists.id, id));
    return dentist;
  }

  async createDentist(dentist: InsertDentist): Promise<Dentist> {
    const [newDentist] = await db.insert(dentists).values(dentist).returning();
    return newDentist;
  }

  // Appointment operations
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async getUserAppointments(userId: number): Promise<AppointmentWithDentist[]> {
    return await db
      .select({
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
          createdAt: dentists.createdAt,
        },
      })
      .from(appointments)
      .innerJoin(dentists, eq(appointments.dentistId, dentists.id))
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.date), desc(appointments.startTime));
  }

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment | undefined> {
    const [appointment] = await db
      .update(appointments)
      .set({ status, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return appointment;
  }

  async cancelAppointment(id: number, userId: number): Promise<boolean> {
    const result = await db
      .update(appointments)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(and(eq(appointments.id, id), eq(appointments.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // Time slot operations
  async getDentistTimeSlots(dentistId: number, date: string): Promise<TimeSlot[]> {
    return await db
      .select()
      .from(timeSlots)
      .where(
        and(
          eq(timeSlots.dentistId, dentistId),
          eq(timeSlots.date, date),
          eq(timeSlots.isAvailable, true)
        )
      )
      .orderBy(asc(timeSlots.startTime));
  }

  async createTimeSlot(timeSlot: InsertTimeSlot): Promise<TimeSlot> {
    const [newTimeSlot] = await db.insert(timeSlots).values(timeSlot).returning();
    return newTimeSlot;
  }

  async markTimeSlotUnavailable(dentistId: number, date: string, startTime: string): Promise<void> {
    await db
      .update(timeSlots)
      .set({ isAvailable: false })
      .where(
        and(
          eq(timeSlots.dentistId, dentistId),
          eq(timeSlots.date, date),
          eq(timeSlots.startTime, startTime)
        )
      );
  }
}

export const storage = new DatabaseStorage();
