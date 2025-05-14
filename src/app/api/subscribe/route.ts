// Route handler for email subscriptions
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, acceptedTerms } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "Email jest wymagany" },
        { status: 400 }
      );
    }

    if (!acceptedTerms) {
      return NextResponse.json(
        { error: "Wyrażenie zgody na przetwarzanie danych jest wymagane" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscription = await prisma.emailSubscription.findUnique({
      where: { email },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: "Ten adres email jest już zapisany" },
        { status: 400 }
      );
    }

    // Create new subscription
    const subscription = await prisma.emailSubscription.create({
      data: {
        email,
        acceptedTerms,
        status: "pending",
        // Add verification token - simple implementation
        verificationToken: Math.random().toString(36).substring(2, 15),
      },
    });

    // Return success without exposing all data
    return NextResponse.json(
      {
        success: true,
        message: "Zapisano pomyślnie",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Wystąpił błąd podczas zapisywania. Spróbuj ponownie." },
      { status: 500 }
    );
  }
}
