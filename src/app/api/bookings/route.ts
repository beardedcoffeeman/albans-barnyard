import { NextRequest, NextResponse } from "next/server";
import { getBookings, createBooking, updateBookingStatus, areDatesAvailable } from "@/lib/bookingStore";

export async function GET() {
  const bookings = await getBookings();
  bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, phone, checkIn, checkOut, guests, message } = body;

  if (!name || !email || !checkIn || !checkOut) {
    return NextResponse.json({ error: "Name, email, check-in and check-out dates are required" }, { status: 400 });
  }

  if (!(await areDatesAvailable(checkIn, checkOut))) {
    return NextResponse.json({ error: "Some of the requested dates are not available" }, { status: 400 });
  }

  const booking = await createBooking({
    name, email, phone: phone || "", checkIn, checkOut, guests: guests || 2, message: message || "",
  });

  return NextResponse.json({
    success: true,
    message: "Booking request submitted! We'll be in touch shortly.",
    booking: { id: booking.id, status: booking.status },
  });
}

export async function PATCH(request: NextRequest) {
  const { id, status } = await request.json();
  if (!id || !["approved", "declined"].includes(status)) {
    return NextResponse.json({ error: "Valid booking ID and status required" }, { status: 400 });
  }
  const booking = await updateBookingStatus(id, status);
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json({ success: true, booking });
}
