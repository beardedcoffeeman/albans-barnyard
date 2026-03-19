import { NextRequest, NextResponse } from "next/server";
import {
  getAvailability,
  addAvailableDates,
  removeAvailableDates,
} from "@/lib/bookingStore";

// GET - Public: fetch available dates
export async function GET() {
  const dates = getAvailability();
  // Only return future dates
  const today = new Date().toISOString().split("T")[0];
  const futureDates = dates.filter((d) => d.date >= today);
  return NextResponse.json(futureDates);
}

// POST - Admin: add available dates
export async function POST(request: NextRequest) {
  const { dates, action } = await request.json();

  if (action === "remove") {
    removeAvailableDates(dates);
    return NextResponse.json({ success: true, message: "Dates removed" });
  }

  addAvailableDates(dates);
  return NextResponse.json({ success: true, message: "Dates added" });
}
