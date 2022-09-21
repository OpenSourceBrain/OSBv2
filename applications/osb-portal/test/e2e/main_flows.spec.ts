import * as puppeteer from "puppeteer";
import * as selectors from "./selectors";
import {
  ONE_SECOND,
  ONE_MINUTE,
  TWO_MINUTES,
  TEN_MINUTES,
} from "./time_constants";

let page: any;
let browser: any;
jest.setTimeout(TEN_MINUTES);

describe("OSB v2 Smoke Tests", () => {
  if (!process.env.SKIP_SMOKETEST) {
    beforeAll(async () => {
      browser = await puppeteer.launch({
        args: ["--no-sandbox", `--window-size=1600,700`],
        headless: false,
        defaultViewport: {
          width: 1600,
          height: 700,
        },
      });

      page = await browser.newPage();
      console.log(
        "Checking page",
        process.env.APP_URL || "https://v2dev.opensourcebrain.org/"
      );
      await page
        .goto(process.env.APP_URL || "https://v2dev.opensourcebrain.org/", {
          waitUntil: "networkidle0",
        })
        .catch(() => {});

      await page.waitForSelector(selectors.WORKSPACES_SELECTOR);
    });

    afterAll(() => {
        browser.close();
    });

    test("Home Page", async () => {
      await page.click(selectors.PUBLIC_WORKSPACES_SELECTOR);
      await page.waitForSelector(selectors.WORKSPACES_SELECTOR);
      await page.waitForTimeout(ONE_SECOND * 2);
    });


    
  } else {
    test("Skip Smoke test", async () => {});
  }
});
