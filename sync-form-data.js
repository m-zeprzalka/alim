// Script to synchronize data from formData JSON to related tables
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function syncFormDataToRelations() {
  console.log("============================================");
  console.log("FORM DATA SYNCHRONIZATION SCRIPT");
  console.log("============================================");
  console.log(
    "This script will synchronize data from formData JSON to related tables"
  );
  console.log(
    "Processing will update child and income data from formData where missing"
  );
  console.log("============================================\n");

  try {
    // Get all form submissions that have formData
    const submissions = await prisma.formSubmission.findMany({
      where: {
        formData: {
          not: null,
        },
      },
      select: {
        id: true,
        formData: true,
        emailSubscription: {
          select: {
            email: true,
          },
        },
        dzieci: {
          select: {
            id: true,
          },
        },
        dochodyRodzicow: {
          select: {
            id: true,
          },
        },
      },
    });

    console.log(`Found ${submissions.length} form submissions to process`);

    let childrenCreated = 0;
    let incomeRecordsCreated = 0;

    // Process each submission
    for (const submission of submissions) {
      const formData = submission.formData;
      const email = submission.emailSubscription?.email;
      console.log(`\nProcessing submission ${submission.id} (${email})`);

      // Process children data if it exists in formData
      if (
        formData.dzieci &&
        Array.isArray(formData.dzieci) &&
        formData.dzieci.length > 0
      ) {
        // Check if children records already exist
        if (submission.dzieci.length === 0) {
          console.log(
            `  - Found ${formData.dzieci.length} children in formData but 0 in relation`
          );

          // Create children records
          for (let i = 0; i < formData.dzieci.length; i++) {
            const dziecko = formData.dzieci[i];

            try {
              await prisma.child.create({
                data: {
                  formSubmission: {
                    connect: { id: submission.id },
                  },
                  childId: i + 1,
                  wiek: dziecko.wiek,
                  plec: dziecko.plec,
                  specjalnePotrzeby: dziecko.specjalnePotrzeby,
                  opisSpecjalnychPotrzeb: dziecko.opisSpecjalnychPotrzeb,
                  uczeszczeDoPlacowki: dziecko.uczeszczeDoPlacowki,
                  typPlacowki: dziecko.typPlacowki,
                  opiekaInnejOsoby: dziecko.opiekaInnejOsoby,
                  modelOpieki: dziecko.modelOpieki,
                  cyklOpieki: dziecko.cyklOpieki,
                  procentCzasuOpieki: dziecko.procentCzasuOpieki,
                  kwotaAlimentow: dziecko.kwotaAlimentow,
                  twojeMiesieczneWydatki: dziecko.twojeMiesieczneWydatki,
                  wydatkiDrugiegoRodzica: dziecko.wydatkiDrugiegoRodzica,
                  kosztyUznanePrzezSad: dziecko.kosztyUznanePrzezSad,
                  rentaRodzinna: dziecko.rentaRodzinna,
                  rentaRodzinnaKwota: dziecko.rentaRodzinnaKwota,
                  swiadczeniePielegnacyjne: dziecko.swiadczeniePielegnacyjne,
                  swiadczeniePielegnacyjneKwota:
                    dziecko.swiadczeniePielegnacyjneKwota,
                  inneZrodla: dziecko.inneZrodla,
                  inneZrodlaOpis: dziecko.inneZrodlaOpis,
                  inneZrodlaKwota: dziecko.inneZrodlaKwota,
                  brakDodatkowychZrodel: dziecko.brakDodatkowychZrodel,
                  tabelaCzasu: dziecko.tabelaCzasu,
                  wskaznikiCzasuOpieki: dziecko.wskaznikiCzasuOpieki,
                  wakacjeProcentCzasu: dziecko.wakacjeProcentCzasu,
                  wakacjeSzczegolowyPlan: dziecko.wakacjeSzczegolowyPlan,
                  wakacjeOpisPlan: dziecko.wakacjeOpisPlan,
                },
              });

              childrenCreated++;
              console.log(`    - Created child record #${i + 1}`);
            } catch (error) {
              console.error(
                `    - Error creating child record #${i + 1}:`,
                error
              );
            }
          }
        } else {
          console.log(
            `  - Children records already exist (${submission.dzieci.length})`
          );
        }
      } else {
        console.log(`  - No children data in formData`);
      }

      // Process income data if it exists in formData
      if (formData.dochodyRodzicow && !submission.dochodyRodzicow) {
        console.log(
          `  - Found dochodyRodzicow in formData but not in relation`
        );

        try {
          await prisma.dochody.create({
            data: {
              formSubmission: {
                connect: { id: submission.id },
              },
              wlasneDochodyNetto: formData.dochodyRodzicow.wlasneDochodyNetto,
              wlasnePotencjalDochodowy:
                formData.dochodyRodzicow.wlasnePotencjalDochodowy,
              wlasneKosztyUtrzymania:
                formData.dochodyRodzicow.wlasneKosztyUtrzymania,
              wlasneKosztyInni: formData.dochodyRodzicow.wlasneKosztyInni,
              wlasneDodatkoweZobowiazania:
                formData.dochodyRodzicow.wlasneDodatkoweZobowiazania,
              drugiRodzicDochody: formData.dochodyRodzicow.drugiRodzicDochody,
              drugiRodzicPotencjal:
                formData.dochodyRodzicow.drugiRodzicPotencjal,
              drugiRodzicKoszty: formData.dochodyRodzicow.drugiRodzicKoszty,
              drugiRodzicKosztyInni:
                formData.dochodyRodzicow.drugiRodzicKosztyInni,
              drugiRodzicDodatkowe:
                formData.dochodyRodzicow.drugiRodzicDodatkowe,
            },
          });

          incomeRecordsCreated++;
          console.log(`    - Created dochodyRodzicow record`);
        } catch (error) {
          console.error(`    - Error creating dochodyRodzicow record:`, error);
        }
      } else if (submission.dochodyRodzicow) {
        console.log(`  - Dochody record already exists`);
      } else {
        console.log(`  - No dochodyRodzicow data in formData`);
      }
    }

    console.log("\n============================================");
    console.log("SYNCHRONIZATION COMPLETE");
    console.log(`Created ${childrenCreated} child records`);
    console.log(`Created ${incomeRecordsCreated} dochodyRodzicow records`);
    console.log("============================================");
  } catch (error) {
    console.error("Error during synchronization:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the synchronization
syncFormDataToRelations();
