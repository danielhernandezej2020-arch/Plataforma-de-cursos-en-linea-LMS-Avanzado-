import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/container";
import { v4 as uuidv4 } from "uuid";
import { User } from "@/domain/entities/User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const user: User = {
      id: uuidv4(),
      email: body.email,
      name: body.name,
      role: body.role || "student",
      createdAt: new Date(),
    };

    const created = await userRepository.save(user);
    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
