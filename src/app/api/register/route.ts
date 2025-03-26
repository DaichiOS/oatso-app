import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const users: any[] = [];

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users.some((user) => user.email === email)) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: `${users.length + 1}`,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    };

    // Store user (in a real app, you'd save to a database)
    users.push(newUser);

    // Return success without exposing sensitive data
    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
