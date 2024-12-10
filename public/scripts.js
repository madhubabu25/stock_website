document.addEventListener("DOMContentLoaded", () => {
    const financeSymbol = document.getElementById("finance-symbol");
    const suggestedLinks = document.getElementById("suggested-links");

    // Show suggested links on hover over the finance symbol
    financeSymbol.addEventListener("mouseenter", () => {
        console.log("Mouse entered finance symbol"); // Test
        suggestedLinks.style.display = "block";
    });

    // Hide suggested links when mouse leaves the finance symbol
    financeSymbol.addEventListener("mouseleave", () => {
        console.log("Mouse left finance symbol"); // Test
        suggestedLinks.style.display = "none";
    });

    // Keep the links visible while hovering over the links themselves
    suggestedLinks.addEventListener("mouseenter", () => {
        suggestedLinks.style.display = "block";
    });

    // Hide links when the mouse leaves the links container
    suggestedLinks.addEventListener("mouseleave", () => {
        suggestedLinks.style.display = "none";
    });
});
