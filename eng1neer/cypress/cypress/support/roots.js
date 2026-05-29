// ---------------------------------------------------------------
// XPath & Selectors - for finding objects and elements
// ---------------------------------------------------------------

// MAIN roots <--------
export const dialogRoot = "//div[@role='dialog']";
export const trademarkRoot = "//span[contains(@class, 'styles_trademark')]";
export const clientRoot = "//div[contains(@class, 'layout-client')]";

// TABLE roots <--------
export const checkedRoot = 'tbody input[type="checkbox"]:checked';
export const uncheckedRoot = 'tbody input[type="checkbox"]:unchecked';

// MESSAGE roots <--------
export const totalRoot = "input[@name='amount']"; //input[contains(@class, 'MuiInputBase-input')]
export const warningRoot = "//p[contains(@class, 'MuiFormHelperText-root')]";

// BUTTON roots <--------
export const submitRoot = "//button[@type='submit']";

// DOCUMENTS roots <--------
export const downloadRoot = "//a[@aria-label='Download document']";
