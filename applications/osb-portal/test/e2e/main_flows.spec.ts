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

    test("Log in", async () => {
      console.log("Attempting login on", page.url());

      await page.evaluate(() => {
        let map = document.getElementsByClassName(
          "MuiButton-label"
        ) as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < map.length; i++) {
          map[i].innerText == "Sign in" && map[i].click();
        }
      });

      await page.waitForSelector(selectors.USERNAME_SELECTOR);
      await page.waitForSelector(selectors.PASSWORD_SELECTOR);
      expect(page.url()).toContain("accounts.");
      await page.type(
        selectors.USERNAME_SELECTOR,
        process.env.USERNAME || "simao_user_osb" 
      );
      await page.type(
        selectors.PASSWORD_SELECTOR,
        process.env.PASSWORD || "metacell" 
      );
      await page.click(selectors.LOGIN_BUTTON_SELECTOR);
      await page.waitForSelector(selectors.ALL_YOUR_WORKSPACES_TAB_SELECTOR);
  
      await page.waitForSelector(selectors.YOUR_WORKSPACES_SELECTOR);
      const privateWorkspaces_beforeadding = await page.evaluate(
        () =>
          document.querySelectorAll(
            'div[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-4 MuiGrid-grid-md-6 MuiGrid-grid-lg-4 MuiGrid-grid-xl-3"]'
          ).length
      );
      expect(privateWorkspaces_beforeadding).toBe(0);
    });



    
  } else {
    test("Skip Smoke test", async () => {});
  }
});
