// Route handler for CSRF token registration
import { NextRequest, NextResponse } from "next/server";
import { registerCSRFToken } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { token } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Register the token for later verification
    registerCSRFToken(token);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error registering CSRF token:", error);
    return NextResponse.json(
      { error: "Failed to register CSRF token" },
      { status: 500 }
    );
  }
}
