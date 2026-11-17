export const TWO_MINUTES = 60000 * 2;
export const ONE_SECOND = 1000
export const ONE_MINUTE = 60000;
export const TEN_MINUTES = 600000

// page.waitForTimeout was removed in Puppeteer 22
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
