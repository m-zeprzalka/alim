// Simple test to check if the improved export functionality works correctly
import { prisma } from "@/lib/prisma";
import fs from "fs";
import * as ExcelJS from "exceljs";

async function testFormSubmissionProcessing() {
  try {
    console.log("Starting test...");

    // Check if FormSubmission has the expected columns
    const tableInfo = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'FormSubmission'
    `;

    const columnNames = (tableInfo as any[]).map((col) => col.column_name);
    console.log("FormSubmission columns:", columnNames);

    // Get a sample form submission with its formData
    const submission = await prisma.formSubmission.findFirst({
      where: {
        formData: {
          not: null,
        },
      },
      select: {
        id: true,
        emailSubscriptionId: true,
        formData: true,
        emailSubscription: true,
        dzieci: true,
        dochodyRodzicow: true,
      },
    });

    if (!submission) {
      console.log("No form submission found");
      return;
    }

    console.log("Found submission:", submission.id);
    console.log("Email:", submission.emailSubscription?.email);
    console.log("Has formData:", !!submission.formData);
    console.log("Number of children in relation:", submission.dzieci.length);

    // Check if children data exists in formData
    const formData = submission.formData as any;
    if (formData.dzieci && Array.isArray(formData.dzieci)) {
      console.log("Number of children in formData:", formData.dzieci.length);

      // Create a simple Excel file with the data
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Test Export");

      // Add headers
      sheet.columns = [
        { header: "Field", key: "field", width: 30 },
        { header: "Value", key: "value", width: 50 },
      ];

      // Add rows for the form submission
      sheet.addRow({ field: "ID", value: submission.id });
      sheet.addRow({
        field: "Email",
        value: submission.emailSubscription?.email,
      });
      sheet.addRow({
        field: "Children in Relation",
        value: submission.dzieci.length,
      });
      sheet.addRow({
        field: "Children in formData",
        value: formData.dzieci.length,
      });
      sheet.addRow({
        field: "Has Income Data",
        value: !!submission.dochodyRodzicow,
      });

      // Add some formData fields
      sheet.addRow({ field: "sciezkaWybor", value: formData.sciezkaWybor });
      sheet.addRow({
        field: "podstawaUstalen",
        value: formData.podstawaUstalen,
      });

      // Save the workbook
      await workbook.xlsx.writeFile("test-export.xlsx");
      console.log("Test export created: test-export.xlsx");

      // Create a JSON representation for debugging
      fs.writeFileSync(
        "test-export-data.json",
        JSON.stringify(
          {
            id: submission.id,
            email: submission.emailSubscription?.email,
            childrenInRelation: submission.dzieci.length,
            childrenInFormData: formData.dzieci.length,
            hasIncomeData: !!submission.dochodyRodzicow,
            formDataKeys: Object.keys(formData),
            firstChildFromFormData:
              formData.dzieci.length > 0 ? formData.dzieci[0] : null,
          },
          null,
          2
        )
      );

      console.log("Test data saved to: test-export-data.json");
    } else {
      console.log("No children data in formData");
    }

    console.log("Test complete!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testFormSubmissionProcessing();

export {};
