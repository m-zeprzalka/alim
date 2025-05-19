// Test form submission API
// This script tests the secure-submit API endpoint with proper CSRF token
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");

// Generate a mock CSRF token (this would normally come from the server)
// In a real app, you'd need to get this from the server's CSRF endpoint
const mockCsrfToken = uuidv4();

async function testFormSubmission() {
  console.log("Testing form submission API");
  console.log("============================");

  const testFormData = {
    contactEmail: "test@example.com",
    zgodaPrzetwarzanie: true,
    zgodaKontakt: true,
    sadRejonowyNazwa: "Sąd Rejonowy w Warszawie",
    sadOkregowyNazwa: "Sąd Okręgowy w Warszawie",
    apelacjaNazwa: "Apelacja Warszawska",
    sadRejonowyId: "sr-warszawa",
    sadOkregowyId: "so-warszawa",
    apelacjaId: "ap-warszawa",
    rokDecyzjiSad: "2025",
    // Empty honeypot field (should be empty for legitimate requests)
    notHuman: "",
    submissionDate: new Date().toISOString(),
  };

  console.log("Sending test form data:", JSON.stringify(testFormData, null, 2));

  try {
    const response = await fetch("http://localhost:3000/api/secure-submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": mockCsrfToken,
      },
      body: JSON.stringify(testFormData),
    });

    const result = await response.json();

    console.log(`Response status: ${response.status}`);
    console.log("Response data:", JSON.stringify(result, null, 2));

    if (response.ok) {
      console.log("✓ Form submission successful");
      if (result.isOffline) {
        console.log("⚠ Note: Form was processed in offline mode");
      }
    } else {
      console.log("✗ Form submission failed");
    }
  } catch (error) {
    console.error("Error during form submission:", error);
  }
}

testFormSubmission().catch(console.error);
