import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/infra/db/prisma";

/**
 * 📥 WhatsApp Webhook Handler (Evolution API)
 * Receives real-time updates: messages, connection status, etc.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.event;
    const data = body.data;

    console.log(`📩 WhatsApp Event Received: ${event}`);

    // 1. Handle Incoming Messages
    if (event === "messages.upsert") {
      const message = data.message;
      const remoteJid = data.key.remoteJid;
      const text = message.conversation || message.extendedTextMessage?.text || "";
      const senderName = data.pushName || "Unknown";

      console.log(`💬 New Message from ${senderName}: ${text}`);

      // 🛡️ Logic to save message to Database (Phase 5) will go here
    }

    // 2. Handle Connection Status
    if (event === "connection.update") {
      console.log(`🔗 Connection Update: ${data.state}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Webhook Failed" }, { status: 500 });
  }
}
