window.CONFIG = {
  // harbour_pine_inventory Google Sheet. Create it per SHEET_SETUP.md, then paste
  // the sheet ID (the long token in the sheet's URL) here. This is a LOCATION,
  // not content: every value is fetched live from the sheet on each page load.
  SHEET_ID: "PASTE_YOUR_SHEET_ID_HERE",

  // Optional Formspree form endpoint (e.g. https://formspree.io/f/xxxx). Leave
  // empty ("") to use the built-in mailto fallback so the form still works.
  FORMSPREE_ENDPOINT: "",

  // Business identity shown in the UI and footer.
  BUSINESS: "Harbour & Pine",
  BOX_NAME: "The Rescue Box",
  BOX_DISCOUNT_PERCENT: 40
};
