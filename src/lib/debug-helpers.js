// Debug helper functions for AliMatrix form

/**
 * Logs the current child cycle state in a formatted way
 * @param {Object} formData - The current form data
 */
export function logChildCycleState(formData) {
  if (!formData) {
    console.log("❌ No form data available");
    return;
  }

  console.log("---------------------------------------------");
  console.log("📊 CHILDREN CYCLE STATE:");
  console.log(`Total children: ${formData.dzieci?.length || 0}`);
  console.log(`Current child index: ${formData.aktualneDzieckoIndex || 0}`);
  console.log(
    `Completed children indexes: ${JSON.stringify(
      formData.zakonczoneIndeksyDzieci || []
    )}`
  );

  // Display each child with completion status
  if (formData.dzieci && formData.dzieci.length > 0) {
    console.log("\nChildren details:");
    formData.dzieci.forEach((child, idx) => {
      const status = (formData.zakonczoneIndeksyDzieci || []).includes(idx)
        ? "✅ COMPLETE"
        : idx === formData.aktualneDzieckoIndex
        ? "🔄 CURRENT"
        : "⏳ PENDING";

      console.log(`Child #${idx + 1} (ID: ${child.id}): ${status}`);
    });
  }
  console.log("---------------------------------------------");
}
