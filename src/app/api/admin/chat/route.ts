import { NextRequest, NextResponse } from "next/server";
import { isAuthorized, unauthorizedResponse } from "@/lib/adminAuth";
import Anthropic from "@anthropic-ai/sdk";
import {
  getAvailability,
  addAvailableDates,
  removeAvailableDates,
  getBookings,
  updateBookingStatus,
} from "@/lib/bookingStore";
import { getSettings, updateSettings } from "@/lib/settingsStore";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are the admin assistant for Alban's Barnyard, a luxury holiday cottage (Cox Cottage) on a working farm in Pembury, Kent. You help Simon and Lesley manage their holiday letting business.

You have access to tools to manage availability and bookings. When Simon asks you to do something, use the appropriate tool. Be warm, helpful and concise.

Current date: ${new Date().toISOString().split("T")[0]}

IMPORTANT RULES:
- When adding availability, always confirm what dates you're adding and the price
- When approving/declining bookings, always confirm the guest name and dates
- Be proactive - if Simon says "make next week available", calculate the actual dates
- Prices are in GBP (£)
- Default price per night is £150 unless specified
- Always respond in a friendly, conversational tone`;

const tools: Anthropic.Tool[] = [
  {
    name: "get_availability",
    description: "Get all currently available dates for Cox Cottage",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "add_availability",
    description:
      "Mark dates as available for booking. Provide an array of dates in YYYY-MM-DD format.",
    input_schema: {
      type: "object" as const,
      properties: {
        dates: {
          type: "array",
          items: { type: "string" },
          description: "Array of dates in YYYY-MM-DD format",
        },
        pricePerNight: {
          type: "number",
          description: "Price per night in GBP. Defaults to 150.",
        },
      },
      required: ["dates"],
    },
  },
  {
    name: "remove_availability",
    description: "Remove dates from availability",
    input_schema: {
      type: "object" as const,
      properties: {
        dates: {
          type: "array",
          items: { type: "string" },
          description: "Array of dates in YYYY-MM-DD format to remove",
        },
      },
      required: ["dates"],
    },
  },
  {
    name: "get_bookings",
    description:
      "Get all booking requests. Can filter by status: pending, approved, declined",
    input_schema: {
      type: "object" as const,
      properties: {
        status: {
          type: "string",
          enum: ["all", "pending", "approved", "declined"],
          description: "Filter by booking status. Defaults to all.",
        },
      },
      required: [],
    },
  },
  {
    name: "update_booking",
    description: "Approve or decline a booking request",
    input_schema: {
      type: "object" as const,
      properties: {
        bookingId: {
          type: "string",
          description: "The booking ID",
        },
        status: {
          type: "string",
          enum: ["approved", "declined"],
          description: "New status for the booking",
        },
      },
      required: ["bookingId", "status"],
    },
  },
  {
    name: "get_settings",
    description: "Get current site settings (lambcam visibility, seasonal banner text, etc.)",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "update_settings",
    description: "Update site settings. Can toggle lambcam on/off, change seasonal banner text, etc. Available settings: lambcamEnabled (show lambcam section on homepage), lambcamMenuVisible (show in nav menu), seasonalBannerTitle, seasonalBannerSubtitle, seasonalBannerSeason, seasonalBannerCta1Text, seasonalBannerCta1Link, seasonalBannerCta2Text, seasonalBannerCta2Link",
    input_schema: {
      type: "object" as const,
      properties: {
        settings: {
          type: "object",
          description: "Object with setting keys and their new values",
        },
      },
      required: ["settings"],
    },
  },
];

function executeTool(
  name: string,
  input: Record<string, unknown>
): string {
  switch (name) {
    case "get_availability": {
      const dates = getAvailability();
      if (dates.length === 0) return "No dates are currently marked as available.";
      const future = dates.filter(
        (d) => d.date >= new Date().toISOString().split("T")[0]
      );
      return `${future.length} available dates:\n${future
        .map(
          (d) =>
            `${d.date} - £${d.pricePerNight || 150}/night`
        )
        .join("\n")}`;
    }
    case "add_availability": {
      const dates = (input.dates as string[]).map((date) => ({
        date,
        pricePerNight: (input.pricePerNight as number) || 150,
      }));
      addAvailableDates(dates);
      return `Added ${dates.length} dates as available at £${dates[0].pricePerNight}/night: ${dates.map((d) => d.date).join(", ")}`;
    }
    case "remove_availability": {
      removeAvailableDates(input.dates as string[]);
      return `Removed ${(input.dates as string[]).length} dates from availability.`;
    }
    case "get_bookings": {
      const all = getBookings();
      const status = (input.status as string) || "all";
      const filtered =
        status === "all" ? all : all.filter((b) => b.status === status);
      if (filtered.length === 0)
        return `No ${status === "all" ? "" : status + " "}bookings found.`;
      return filtered
        .map(
          (b) =>
            `[${b.id}] ${b.name} (${b.email}) - ${b.checkIn} to ${b.checkOut} - ${b.guests} guests - Status: ${b.status}${b.message ? ` - Message: "${b.message}"` : ""}`
        )
        .join("\n");
    }
    case "update_booking": {
      const booking = updateBookingStatus(
        input.bookingId as string,
        input.status as "approved" | "declined"
      );
      if (!booking) return "Booking not found.";
      return `Booking from ${booking.name} (${booking.checkIn} to ${booking.checkOut}) has been ${booking.status}.`;
    }
    case "get_settings": {
      const settings = getSettings();
      return JSON.stringify(settings, null, 2);
    }
    case "update_settings": {
      const updated = updateSettings(input.settings as Record<string, unknown>);
      return `Settings updated:\n${JSON.stringify(updated, null, 2)}`;
    }
    default:
      return "Unknown tool.";
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return unauthorizedResponse();
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-api-key-here") {
    return NextResponse.json(
      { error: "Anthropic API key not configured. Add it to .env.local" },
      { status: 500 }
    );
  }

  const { messages } = await request.json();

  try {
    let response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    // Handle tool use loop
    while (response.stop_reason === "tool_use") {
      const toolUseBlocks = response.content.filter(
        (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
      );

      const toolResults = toolUseBlocks.map((block) => ({
        type: "tool_result" as const,
        tool_use_id: block.id,
        content: executeTool(block.name, block.input as Record<string, unknown>),
      }));

      response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        tools,
        messages: [
          ...messages,
          { role: "assistant", content: response.content },
          { role: "user", content: toolResults },
        ],
      });
    }

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );

    return NextResponse.json({
      message: textBlock?.text || "Done!",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
