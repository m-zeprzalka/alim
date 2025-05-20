// Test endpoint to verify data structure
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get sample data to check structure
    const subscriptionCount = await prisma.emailSubscription.count();
    const formCount = await prisma.formSubmission.count();
    const childCount = await prisma.child.count();

    // Get the database schema for FormSubmission
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'FormSubmission'
    `;
    const columnNames = (tableInfo as any[]).map((col) => col.column_name);

    // Sample data from the first form submission
    const sampleSubmission = await prisma.formSubmission.findFirst({
      where: {
        formData: {
          not: null,
        },
      },
      select: {
        id: true,
        status: true,
        submittedAt: true,
        emailSubscriptionId: true,
        formData: true,
        dzieci: {
          select: {
            id: true,
            wiek: true,
            plec: true,
          },
        },
        emailSubscription: {
          select: {
            email: true,
          },
        },
      },
    });

    // Check for children in formData
    let childrenInFormData = 0;
    let formDataChildren = [];

    if (
      sampleSubmission?.formData &&
      (sampleSubmission.formData as any).dzieci
    ) {
      const dzieci = (sampleSubmission.formData as any).dzieci;
      if (Array.isArray(dzieci)) {
        childrenInFormData = dzieci.length;
        formDataChildren = dzieci.map((d) => ({
          wiek: d.wiek,
          plec: d.plec,
        }));
      }
    }

    // Return the data
    return NextResponse.json({
      status: "success",
      message: "Data structure verification",
      counts: {
        emailSubscriptions: subscriptionCount,
        formSubmissions: formCount,
        childRecords: childCount,
      },
      schema: {
        formSubmissionColumns: columnNames,
      },
      sampleData: {
        submissionId: sampleSubmission?.id,
        email: sampleSubmission?.emailSubscription?.email,
        submittedAt: sampleSubmission?.submittedAt,
        childrenInRelation: sampleSubmission?.dzieci?.length || 0,
        childrenInFormData,
        formDataKeys: sampleSubmission?.formData
          ? Object.keys(sampleSubmission.formData as any)
          : [],
        dzieci: sampleSubmission?.dzieci,
        formDataChildren,
      },
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
