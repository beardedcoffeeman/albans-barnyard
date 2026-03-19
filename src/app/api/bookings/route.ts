import { NextRequest, NextResponse } from "next/server";
import {
  getBookings,
  createBooking,
  updateBookingStatus,
  areDatesAvailable,
} from "@/lib/bookingStore";

// GET - Admin: fetch all bookings
export async function GET() {
  const bookings = getBookings();
  // Sort newest first
  bookings.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(bookings);
}

// POST - Public: create a booking request
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, checkIn, checkOut, guests, message } = body;

  // Validate required fields
  if (!name || !email || !checkIn || !checkOut) {
    return NextResponse.json(
      { error: "Name, email, check-in and check-out dates are required" },
      { status: 400 }
    );
  }

  // Check dates are available
  if (!areDatesAvailable(checkIn, checkOut)) {
    return NextResponse.json(
      { error: "Some of the requested dates are not available" },
      { status: 400 }
    );
  }

  const booking = createBooking({
    name,
    email,
    phone: phone || "",
    checkIn,
    checkOut,
    guests: guests || 2,
    message: message || "",
  });

  return NextResponse.json({
    success: true,
    message: "Booking request submitted! We'll be in touch shortly.",
    booking: { id: booking.id, status: booking.status },
  });
}

// PATCH - Admin: approve or decline a booking
export async function PATCH(request: NextRequest) {
  const { id, status } = await request.json();

  if (!id || !["approved", "declined"].includes(status)) {
    return NextResponse.json(
      { error: "Valid booking ID and status (approved/declined) required" },
      { status: 400 }
    );
  }

  const booking = updateBookingStatus(id, status);
  if (!booking) {
    return NextResponse.json(
      { error: "Booking not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, booking });
}
