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

    test("Create workspace", async () => {
      console.log("Creating workspace");

      await page.click(selectors.CREATE_WORKSPACE_SELECTOR);
      await page.waitForSelector(selectors.WORKSPACE_CREATION_BOX_SELECTOR);
      await page.type(
        selectors.WORKSPACE_NAME_SELECTOR,
        "Smoke Test Workspace"
      );
      await page.type(selectors.WORKSPACE_TAGS_SELECTOR, "Test");
      await page.keyboard.press("Enter");
      await page.type(
        selectors.WORKSPACE_DESCRIPTION_SELECTOR,
        "Workspace created by the Automated Smoke tests"
      );

      await page.waitForTimeout(ONE_SECOND);
      await page.click(selectors.CREATE_NEW_WORKSPACE_SELECTOR)
      await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);
      await page.waitForSelector(selectors.YOUR_WORKSPACES_SELECTOR);

      const privateWorkspaces = await page.evaluate(
        () =>
          document.querySelectorAll(
            'div[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-4 MuiGrid-grid-md-6 MuiGrid-grid-lg-4 MuiGrid-grid-xl-3"]'
          ).length
      );
      expect(privateWorkspaces).toBe(1);
    });

    test("Open workspace with NWB Explorer", async () => {
      console.log("Opening workspace with NWB Explorer");

      await page.waitForTimeout(ONE_SECOND);
      await page.click(selectors.OSB_LOGO_SELECTOR);
      await page.waitForTimeout(ONE_SECOND);
      await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);
      await page.waitForTimeout(ONE_SECOND);
      await page.click(selectors.FEATURE_WORKSPACES_TAB_SELECTOR);
      await page.waitForSelector(selectors.NEURO_ML2_WORKSPACE_SELECTOR);
      await page.waitForTimeout(ONE_SECOND);
      const featuredWorkspaces = await page.evaluate(
        () =>
          document.querySelectorAll(
            'div[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-4 MuiGrid-grid-md-6 MuiGrid-grid-lg-4 MuiGrid-grid-xl-3"]'
          ).length
      );
      await page.click(selectors.OSB_LOGO_SELECTOR);
      await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);

      if (featuredWorkspaces != 0) {
        await page.waitForTimeout(ONE_SECOND);
        await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);
        await page.waitForTimeout(ONE_SECOND);
        await page.click(selectors.FEATURE_WORKSPACES_TAB_SELECTOR);
        await page.waitForSelector(selectors.NEURO_ML2_WORKSPACE_SELECTOR);
        await page.click(selectors.NEURO_ML2_WORKSPACE_SELECTOR);
        await page.waitForSelector(selectors.OPENED_WORKSPACE_SELECTOR);
        expect(page.url()).toContain("/workspace/");
        await page.waitForTimeout(ONE_SECOND);
        await page.click(selectors.SELECT_APPLICATION_SELECTOR);
        await page.waitForTimeout(ONE_SECOND);
        await page.evaluate(() => {
          let map = document.getElementsByClassName(
            "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"
          ) as HTMLCollectionOf<HTMLElement>;
          for (let i = 0; i < map.length; i++) {
            map[i].innerText == "Open with NWB Explorer" && map[i].click();
          }
        });

        console.log("Loading NWB Explorer");

        await page.click(selectors.OPEN_WITH_APPLICATION_SELECTOR);
        await page.waitForSelector(selectors.APPLICATION_FRAME_SELECTOR, {
          timeout: ONE_MINUTE,
        });
        expect(page.url()).toContain("/nwbexplorer");
        const elementHandle = await page.waitForSelector(
          selectors.APPLICATION_FRAME_SELECTOR
        );
        const frame = await elementHandle.contentFrame();
        await frame.waitForSelector(selectors.NWB_INPUT_FIELD_SELECTOR, {
          timeout: TWO_MINUTES * 1.5,
        });

        console.log("NWB Explorer loaded");
      } else {
        await page.click(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);
        await page.waitForSelector(selectors.OPENED_WORKSPACE_SELECTOR);
        expect(page.url()).toContain("/workspace/");
        await page.waitForTimeout(ONE_SECOND);
        await page.click(selectors.SELECT_APPLICATION_SELECTOR);
        await page.waitForTimeout(ONE_SECOND);
        await page.evaluate(() => {
          let map = document.getElementsByClassName(
            "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"
          ) as HTMLCollectionOf<HTMLElement>;
          for (let i = 0; i < map.length; i++) {
            map[i].innerText == "Open with NWB Explorer" && map[i].click();
          }
        });
        await page.click(selectors.OPEN_WITH_APPLICATION_SELECTOR);
        expect(page.url()).toContain("/nwbexplorer");

        console.log("Loading NWB Explorer");

        await page.waitForSelector(selectors.APPLICATION_FRAME_SELECTOR);
        const elementHandle = await page.waitForSelector(
          selectors.APPLICATION_FRAME_SELECTOR
        );
        const frame = await elementHandle.contentFrame();
        await frame.waitForSelector(selectors.NWB_INPUT_FIELD_SELECTOR, {
          timeout: TWO_MINUTES * 1.5,
        });

        console.log("NWB Explorer loaded");
      }
    });

    test("Open workspace with NetPyNE", async () => {
      console.log("Opening workspace with NetPyNE");

      await page.waitForTimeout(ONE_SECOND);
      await page.click(selectors.OSB_LOGO_SELECTOR);
      await page.waitForTimeout(ONE_SECOND);
      await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);
      await page.waitForTimeout(ONE_SECOND);
      await page.click(selectors.FEATURE_WORKSPACES_TAB_SELECTOR);
      await page.waitForSelector(selectors.NEURO_ML2_WORKSPACE_SELECTOR);
      await page.waitForTimeout(ONE_SECOND);

      const featuredWorkspaces = await page.evaluate(
        () =>
          document.querySelectorAll(
            'div[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-4 MuiGrid-grid-md-6 MuiGrid-grid-lg-4 MuiGrid-grid-xl-3"]'
          ).length
      );
      await page.click(selectors.OSB_LOGO_SELECTOR);
      await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);

      if (featuredWorkspaces != 0) {
        await page.waitForTimeout(ONE_SECOND);
        await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);
        await page.waitForTimeout(ONE_SECOND);
        await page.click(selectors.FEATURE_WORKSPACES_TAB_SELECTOR);
        await page.waitForSelector(selectors.NEURO_ML2_WORKSPACE_SELECTOR);
        await page.click(selectors.NEURO_ML2_WORKSPACE_SELECTOR);
        await page.waitForSelector(selectors.OPENED_WORKSPACE_SELECTOR);
        expect(page.url()).toContain("/workspace/");
        await page.waitForTimeout(ONE_SECOND);
        await page.click(selectors.SELECT_APPLICATION_SELECTOR);
        await page.waitForTimeout(ONE_SECOND);
        await page.evaluate(() => {
          let map = document.getElementsByClassName(
            "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"
          ) as HTMLCollectionOf<HTMLElement>;
          for (let i = 0; i < map.length; i++) {
            map[i].innerText == "Open with NetPyNE" && map[i].click();
          }
        });
        console.log("Loading NetPyNE");

        await page.click(selectors.OPEN_WITH_APPLICATION_SELECTOR);
        await page.waitForSelector(selectors.APPLICATION_FRAME_SELECTOR, {
          timeout: ONE_MINUTE,
        });
        expect(page.url()).toContain("/netpyne");
        const elementHandle = await page.waitForSelector(
          selectors.APPLICATION_FRAME_SELECTOR
        );
        const frame = await elementHandle.contentFrame();
        await frame.waitForSelector(selectors.NETPYNE_CELL_BUTTON_SELECTOR, {
          timeout: TWO_MINUTES * 1.5,
        });

        console.log("NetPyNE loaded");
      } else {
        await page.click(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);
        await page.waitForSelector(selectors.OPENED_WORKSPACE_SELECTOR);
        expect(page.url()).toContain("/workspace/");
        await page.waitForTimeout(ONE_SECOND);
        await page.click(selectors.SELECT_APPLICATION_SELECTOR);
        await page.waitForTimeout(ONE_SECOND);
        await page.evaluate(() => {
          let map = document.getElementsByClassName(
            "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"
          ) as HTMLCollectionOf<HTMLElement>;
          for (let i = 0; i < map.length; i++) {
            map[i].innerText == "Open with NetPyNE" && map[i].click();
          }
        });
        await page.click(selectors.OPEN_WITH_APPLICATION_SELECTOR);
        expect(page.url()).toContain("/netpyne");

        console.log("Loading NetPyNE");

        await page.waitForSelector(selectors.APPLICATION_FRAME_SELECTOR);
        const elementHandle = await page.waitForSelector(
          selectors.APPLICATION_FRAME_SELECTOR
        );
        const frame = await elementHandle.contentFrame();
        await frame.waitForSelector(selectors.NETPYNE_CELL_BUTTON_SELECTOR, {
          timeout: TWO_MINUTES * 1.5,
        });

        console.log("NetPyNE loaded");
      }
    });

    test("Open workspace with Jupyter Lab", async () => {
      console.log("Opening workspace with Jupyter Lab");

      await page.waitForTimeout(ONE_SECOND);
      await page.click(selectors.OSB_LOGO_SELECTOR);
      await page.waitForTimeout(ONE_SECOND);
      await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);
      await page.waitForTimeout(ONE_SECOND);
      await page.click(selectors.FEATURE_WORKSPACES_TAB_SELECTOR);
      await page.waitForSelector(selectors.NEURO_ML2_WORKSPACE_SELECTOR);
      await page.waitForTimeout(ONE_SECOND);
      const featuredWorkspaces = await page.evaluate(
        () =>
          document.querySelectorAll(
            'div[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-4 MuiGrid-grid-md-6 MuiGrid-grid-lg-4 MuiGrid-grid-xl-3"]'
          ).length
      );
      await page.click(selectors.OSB_LOGO_SELECTOR);
      await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);

      if (featuredWorkspaces != 0) {
        await page.waitForTimeout(ONE_SECOND);
        await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);
        await page.waitForTimeout(ONE_SECOND);
        await page.click(selectors.FEATURE_WORKSPACES_TAB_SELECTOR);
        await page.waitForSelector(selectors.NEURO_ML2_WORKSPACE_SELECTOR);
        await page.click(selectors.NEURO_ML2_WORKSPACE_SELECTOR);
        await page.waitForSelector(selectors.OPENED_WORKSPACE_SELECTOR);
        expect(page.url()).toContain("/workspace/");
        await page.waitForTimeout(ONE_SECOND);
        await page.click(selectors.SELECT_APPLICATION_SELECTOR);
        await page.waitForTimeout(ONE_SECOND);
        await page.evaluate(() => {
          let map = document.getElementsByClassName(
            "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"
          ) as HTMLCollectionOf<HTMLElement>;
          for (let i = 0; i < map.length; i++) {
            map[i].innerText == "Open with JupyterLab" && map[i].click();
          }
        });

        console.log("Loading Jupyter Lab");

        await page.click(selectors.OPEN_WITH_APPLICATION_SELECTOR);
        await page.waitForSelector(selectors.APPLICATION_FRAME_SELECTOR, {
          timeout: ONE_MINUTE,
        });
        expect(page.url()).toContain("/jupyter");
        const elementHandle = await page.waitForSelector(
          selectors.APPLICATION_FRAME_SELECTOR
        );
        const frame = await elementHandle.contentFrame();
        await frame.waitForSelector(selectors.JUPYTER_CONTENT_SELECTOR, {
          timeout: TWO_MINUTES * 1.5,
        });

        console.log("Jupyter Lab loaded");

      } else {
        
        await page.click(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);
        await page.waitForSelector(selectors.OPENED_WORKSPACE_SELECTOR);
        expect(page.url()).toContain("/workspace/");
        await page.waitForTimeout(ONE_SECOND);
        await page.click(selectors.SELECT_APPLICATION_SELECTOR);
        await page.waitForTimeout(ONE_SECOND);
        await page.evaluate(() => {
          let map = document.getElementsByClassName(
            "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"
          ) as HTMLCollectionOf<HTMLElement>;
          for (let i = 0; i < map.length; i++) {
            map[i].innerText == "Open with JupyterLab" && map[i].click();
          }
        });
        await page.click(selectors.OPEN_WITH_APPLICATION_SELECTOR);
        expect(page.url()).toContain("/jupyter");

        console.log("Loading Jupyter Lab");

        await page.waitForSelector(selectors.APPLICATION_FRAME_SELECTOR);
        const elementHandle = await page.waitForSelector(
          selectors.APPLICATION_FRAME_SELECTOR
        );
        const frame = await elementHandle.contentFrame();
        await frame.waitForSelector(selectors.JUPYTER_CONTENT_SELECTOR, {
          timeout: TWO_MINUTES * 1.5,
        });

        console.log("Jupyter Lab loaded");
      }
    });



    test("Delete created workspace", async () => {
      console.log("Deleting created workspace");

      await page.waitForTimeout(ONE_SECOND);
      await page.click(selectors.OSB_LOGO_SELECTOR);
      await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE_SELECTOR);
      await page.click(selectors.WORKSPACE_OPTIONS_SELECTOR);
      await page.waitForSelector(selectors.WORKSPACE_OPTIONS_LIST_SELECTOR);
      await page.evaluate(() => {
        let map = document.getElementsByClassName(
          "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"
        ) as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < 5; i++) {
          map[i].textContent == "Delete" && map[i].click();
        }
      });
      await page.waitForTimeout(ONE_SECOND);
      await page.waitForSelector(selectors.YOUR_WORKSPACES_SELECTOR);
      const privateWorkspaces = await page.evaluate(
        () =>
          document.querySelectorAll(
            'div[class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-6 MuiGrid-grid-sm-4 MuiGrid-grid-md-6 MuiGrid-grid-lg-4 MuiGrid-grid-xl-3"]'
          ).length
      );
      expect(privateWorkspaces).toBe(0);
    });

    test("Logout", async () => {
      console.log("Logging out");

      await page.click(selectors.USER_MENU_SELECTOR);
      await page.evaluate(() => {
        let map = document.getElementsByClassName(
          "MuiButtonBase-root MuiListItem-root MuiMenuItem-root MuiMenuItem-gutters MuiListItem-gutters MuiListItem-button"
        ) as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < 3; i++) {
          map[i].textContent == "Logout" && map[i].click();
        }
      });
      await page.waitForSelector(selectors.WORKSPACES_SELECTOR);

    });

    
  } else {
    test("Skip Smoke test", async () => {});
  }
});
