// Script to check database contents and relations
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log("======== DATABASE CHECK ========");
    console.log("Connecting to database...");

    // Get DB schema info
    console.log("\n=== Schema Information ===");
    try {
      const tableInfo = await prisma.$queryRaw`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'FormSubmission'
      `;

      console.log("FormSubmission columns:");
      console.log((tableInfo || []).map((col) => col.column_name).join(", "));
    } catch (error) {
      console.error("Error checking schema:", error.message);
    }

    // Check EmailSubscription counts
    console.log("\n=== Email Subscriptions ===");
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
    console.log("\n=== Form Submissions ===");
    const formCount = await prisma.formSubmission.count();
    console.log(`Total form submissions: ${formCount}`);

    // Get the most recent 5 form submissions with basic fields
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
        emailSubscription: {
          select: {
            email: true,
          },
        },
      },
    });

    console.log("\nMost recent form submissions:");
    recentForms.forEach((form) => {
      console.log(`- ID: ${form.id}`);
      console.log(`  Email: ${form.emailSubscription?.email}`);
      console.log(`  Submitted: ${form.submittedAt}`);
      console.log(`  Status: ${form.status}`);
      console.log(`  Has FormData: ${form.formData ? "Yes" : "No"}`);

      if (form.formData) {
        // Check for children data in formData
        const dzieci = form.formData.dzieci || [];
        console.log(`  Children in formData: ${dzieci.length}`);

        // Log form data keys
        console.log(
          `  Form data keys: ${Object.keys(form.formData).join(", ")}`
        );
      }
      console.log("");
    });

    // Check for subscriptions without form submissions
    const subscriptionsWithoutForms = await prisma.emailSubscription.findMany({
      where: {
        formSubmissions: {
          none: {},
        },
      },
      take: 5,
    });

    console.log(`\n=== Data Relationship Analysis ===`);
    console.log(
      `Subscriptions without form submissions: ${subscriptionsWithoutForms.length}`
    );
    console.log(
      "Sample emails:",
      subscriptionsWithoutForms.map((s) => s.email).join(", ")
    );

    // Check if the submittedAt field is being correctly set for submissions
    const nullSubmittedAtForms = await prisma.formSubmission.count({
      where: {
        submittedAt: null,
      },
    });

    console.log(
      `\nForm submissions with null submittedAt: ${nullSubmittedAtForms}`
    );

    // Count the children in the database
    const childCount = await prisma.child.count();
    console.log(`\nTotal children records in the database: ${childCount}`);

    if (childCount > 0) {
      // Check distribution of children records
      const formIdsWithChildren = await prisma.child.groupBy({
        by: ["formSubmissionId"],
        _count: {
          _all: true,
        },
      });

      console.log(
        `\nForms with children records: ${formIdsWithChildren.length}`
      );
      console.log("Sample child distribution:");
      formIdsWithChildren.slice(0, 3).forEach((group) => {
        console.log(
          `  Form ${group.formSubmissionId}: ${group._count._all} children`
        );
      });
    }

    // Check for recent form submissions by status
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

    console.log("\n=== Recent pending form submissions ===");
    submittedForms.forEach((form) => {
      console.log(
        `- ID: ${form.id}, Submitted: ${form.submittedAt}, Email: ${form.emailSubscription?.email}`
      );
    });

    console.log("\n======== END OF DATABASE CHECK ========");
  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
