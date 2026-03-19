import { NextRequest, NextResponse } from "next/server";
import { getAvailability, addAvailableDates, removeAvailableDates } from "@/lib/bookingStore";
import { isAuthorized, unauthorizedResponse } from "@/lib/adminAuth";

export async function GET() {
  const dates = await getAvailability();
  const today = new Date().toISOString().split("T")[0];
  const futureDates = dates.filter((d) => d.date >= today);
  return NextResponse.json(futureDates);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse();
  const { dates, action } = await request.json();
  if (action === "remove") {
    await removeAvailableDates(dates);
    return NextResponse.json({ success: true });
  }
  await addAvailableDates(dates);
  return NextResponse.json({ success: true });
}
