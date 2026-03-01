import { NextRequest, NextResponse } from "next/server";
import { paymentService } from "@/container";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payment = await paymentService.processPayment(body);
    return NextResponse.json(payment, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
