// Simple direct database query
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function queryDatabase() {
  try {
    console.log("Checking schema...");

    // Query database schema
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'FormSubmission'
    `;

    console.log(
      "FormSubmission columns:",
      tableInfo.map((col) => col.column_name)
    );

    // Count records
    const subscriptionCount = await prisma.emailSubscription.count();
    const formCount = await prisma.formSubmission.count();
    const childCount = await prisma.child.count();

    console.log(`Email subscriptions: ${subscriptionCount}`);
    console.log(`Form submissions: ${formCount}`);
    console.log(`Children records: ${childCount}`);

    // Check for missing relationships
    console.log("\nChecking for form data...");

    // Check if form data is being saved in separate tables
    if (childCount === 0) {
      console.log("No children records found in the Child table!");

      // Check if children data is in the formData JSON
      const formsWithChildren = await prisma.formSubmission.findMany({
        where: {
          formData: {
            path: ["dzieci"],
            not: null,
          },
        },
        select: {
          id: true,
          submittedAt: true,
        },
      });

      console.log(
        `Forms with children data in formData JSON: ${formsWithChildren.length}`
      );
    }

    // Check recent submissions
    const recentSubmissions = await prisma.formSubmission.findMany({
      orderBy: {
        submittedAt: "desc",
      },
      take: 3,
      select: {
        id: true,
        submittedAt: true,
        formData: true,
        emailSubscription: {
          select: {
            email: true,
          },
        },
      },
    });

    console.log("\nRecent submissions:");
    recentSubmissions.forEach((sub) => {
      console.log(`ID: ${sub.id}`);
      console.log(`Email: ${sub.emailSubscription?.email}`);
      console.log(`Submitted: ${sub.submittedAt}`);
      console.log(
        `Form data:`,
        typeof sub.formData === "object"
          ? "Object with keys: " + Object.keys(sub.formData).join(", ")
          : sub.formData
      );

      // Check if dzieci is an array in formData
      if (
        sub.formData &&
        sub.formData.dzieci &&
        Array.isArray(sub.formData.dzieci)
      ) {
        console.log(`Children in formData: ${sub.formData.dzieci.length}`);
      }
      console.log("---");
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

queryDatabase();
