import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const AVAILABILITY_FILE = join(DATA_DIR, "availability.json");
const BOOKINGS_FILE = join(DATA_DIR, "bookings.json");

// Types
export interface AvailableDate {
  date: string; // YYYY-MM-DD
  pricePerNight?: number;
  notes?: string;
}

export interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  message: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
}

// Helpers
function readJSON<T>(file: string, fallback: T): T {
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, "utf-8"));
  } catch {
    return fallback;
  }
}

function writeJSON<T>(file: string, data: T): void {
  writeFileSync(file, JSON.stringify(data, null, 2), "utf-8");
}

// Availability
export function getAvailability(): AvailableDate[] {
  return readJSON<AvailableDate[]>(AVAILABILITY_FILE, []);
}

export function setAvailability(dates: AvailableDate[]): void {
  writeJSON(AVAILABILITY_FILE, dates);
}

export function addAvailableDates(dates: AvailableDate[]): void {
  const existing = getAvailability();
  const existingSet = new Set(existing.map((d) => d.date));
  const newDates = dates.filter((d) => !existingSet.has(d.date));
  writeJSON(AVAILABILITY_FILE, [...existing, ...newDates]);
}

export function removeAvailableDates(datesToRemove: string[]): void {
  const existing = getAvailability();
  const removeSet = new Set(datesToRemove);
  writeJSON(
    AVAILABILITY_FILE,
    existing.filter((d) => !removeSet.has(d.date))
  );
}

// Bookings
export function getBookings(): BookingRequest[] {
  return readJSON<BookingRequest[]>(BOOKINGS_FILE, []);
}

export function createBooking(
  booking: Omit<BookingRequest, "id" | "status" | "createdAt">
): BookingRequest {
  const bookings = getBookings();
  const newBooking: BookingRequest = {
    ...booking,
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  writeJSON(BOOKINGS_FILE, bookings);
  return newBooking;
}

export function updateBookingStatus(
  id: string,
  status: "approved" | "declined"
): BookingRequest | null {
  const bookings = getBookings();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return null;
  booking.status = status;
  writeJSON(BOOKINGS_FILE, bookings);
  return booking;
}

// Check if requested dates are all available
export function areDatesAvailable(
  checkIn: string,
  checkOut: string
): boolean {
  const available = new Set(getAvailability().map((d) => d.date));
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    if (!available.has(dateStr)) return false;
  }
  return true;
}
