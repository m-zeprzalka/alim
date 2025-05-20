// Script to check database contents
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("Connecting to database...");

    // Check EmailSubscription counts
    const subscriptionCount = await prisma.emailSubscription.count();
    console.log(`Total email subscriptions: ${subscriptionCount}`);

    // Get the most recent 5 subscriptions
    const recentSubscriptions = await prisma.emailSubscription.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    console.log("\nMost recent subscriptions:");
    recentSubscriptions.forEach((sub) => {
      console.log(
        `- ID: ${sub.id}, Email: ${sub.email}, Status: ${sub.status}, SubmittedAt: ${sub.submittedAt}`
      );
    });

    // Check FormSubmission counts
    const formCount = await prisma.formSubmission.count();
    console.log(`\nTotal form submissions: ${formCount}`);
    // Get the most recent 5 form submissions with their relationships
    const recentForms = await prisma.formSubmission.findMany({
      orderBy: { submittedAt: "desc" },
      take: 5,
      select: {
        id: true,
        emailSubscriptionId: true,
        formData: true,
        submittedAt: true,
        status: true,
        reportUrl: true,
        sciezkaWybor: true,
        podstawaUstalen: true,
        emailSubscription: true,
        dzieci: true,
        dochodyRodzicow: true,
      },
    });

    console.log("\nMost recent form submissions:");
    recentForms.forEach((form) => {
      console.log(`- ID: ${form.id}`);
      console.log(`  Email: ${form.emailSubscription?.email}`);
      console.log(`  Submitted: ${form.submittedAt}`);
      console.log(`  Status: ${form.status}`);
      console.log(`  Has FormData: ${form.formData ? "Yes" : "No"}`);
      console.log(`  Children count: ${form.dzieci?.length || 0}`);
      console.log(`  Has Income data: ${form.dochodyRodzicow ? "Yes" : "No"}`);
      console.log(
        `  Basic form info: ${form.sciezkaWybor || "N/A"}, ${
          form.podstawaUstalen || "N/A"
        }`
      );
      console.log(
        `  Form data keys: ${
          form.formData ? Object.keys(form.formData).join(", ") : "None"
        }`
      );
      console.log("");
    });
    // Check for orphaned records (form submissions without valid subscription)
    const orphanedForms = await prisma.formSubmission.findMany({
      where: {
        emailSubscriptionId: {
          equals: null,
        },
      },
    });

    console.log(
      `\nOrphaned form submissions (no subscription): ${orphanedForms.length}`
    );

    // Check for subscriptions without form submissions
    const subscriptionsWithoutForms = await prisma.emailSubscription.findMany({
      where: {
        formSubmissions: {
          none: {},
        },
      },
      take: 5,
    });

    console.log(
      `\nSubscriptions without form submissions: ${subscriptionsWithoutForms.length}`
    );
    console.log(
      "Sample emails:",
      subscriptionsWithoutForms.map((s) => s.email).join(", ")
    );

    // Check recent submissions with status
    const submittedForms = await prisma.formSubmission.findMany({
      where: {
        status: "pending",
      },
      orderBy: {
        submittedAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        submittedAt: true,
        emailSubscriptionId: true,
        emailSubscription: {
          select: {
            email: true,
          },
        },
      },
    });

    console.log("\nRecent pending form submissions:");
    submittedForms.forEach((form) => {
      console.log(
        `- ID: ${form.id}, Submitted: ${form.submittedAt}, Email: ${form.emailSubscription?.email}`
      );
    });
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
