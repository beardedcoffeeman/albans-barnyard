import { dbGet, dbSet } from "./db";

export interface AvailableDate {
  date: string;
  pricePerNight?: number;
  notes?: string;
}

export interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
  status: "pending" | "approved" | "declined";
  createdAt: string;
}

// Availability
export async function getAvailability(): Promise<AvailableDate[]> {
  return dbGet<AvailableDate[]>("availability", []);
}

export async function addAvailableDates(dates: AvailableDate[]): Promise<void> {
  const existing = await getAvailability();
  const existingSet = new Set(existing.map((d) => d.date));
  const newDates = dates.filter((d) => !existingSet.has(d.date));
  await dbSet("availability", [...existing, ...newDates]);
}

export async function removeAvailableDates(datesToRemove: string[]): Promise<void> {
  const existing = await getAvailability();
  const removeSet = new Set(datesToRemove);
  await dbSet("availability", existing.filter((d) => !removeSet.has(d.date)));
}

// Bookings
export async function getBookings(): Promise<BookingRequest[]> {
  return dbGet<BookingRequest[]>("bookings", []);
}

export async function createBooking(
  booking: Omit<BookingRequest, "id" | "status" | "createdAt">
): Promise<BookingRequest> {
  const bookings = await getBookings();
  const newBooking: BookingRequest = {
    ...booking,
    id: `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  await dbSet("bookings", bookings);
  return newBooking;
}

export async function updateBookingStatus(
  id: string,
  status: "approved" | "declined"
): Promise<BookingRequest | null> {
  const bookings = await getBookings();
  const booking = bookings.find((b) => b.id === id);
  if (!booking) return null;
  booking.status = status;
  await dbSet("bookings", bookings);
  return booking;
}

export async function areDatesAvailable(
  checkIn: string,
  checkOut: string
): Promise<boolean> {
  const available = new Set((await getAvailability()).map((d) => d.date));
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    if (!available.has(dateStr)) return false;
  }
  return true;
}
