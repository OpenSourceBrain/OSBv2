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
jest.setTimeout(TEN_MINUTES* 4);

const WORKSPACE_LOAD_TIMEOUT = TEN_MINUTES;

const getCurrentWorkpaces: () => Promise<Array<any>> = async () => {
  const pageFrame = page.mainFrame();
  return await pageFrame.$$(
      "#workspaces-list .workspace-content"
    )
};

const testApplication =
  (appName: string, appSelectors: Array<string>, url: string) => async () => {
    console.log("Opening workspace with", appName);
    await page.waitForSelector(selectors.OSB_LOGO);
    await page.click(selectors.OSB_LOGO);

    await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE);

    // Try to open an already existing workspace
    await page.waitForSelector(selectors.FEATURE_WORKSPACES_TAB);
    await page.click(selectors.FEATURE_WORKSPACES_TAB);

    await page.waitForSelector(selectors.WORKSPACES);
    const featuredWorkspaces = await getCurrentWorkpaces();


    // Try to open an already existing workspace to speed up

    if (featuredWorkspaces.length > 0) {
      await page.click(".workspace-page-link");
    } else {
      await page.waitForTimeout(ONE_SECOND);
      await page.click(selectors.ALL_YOUR_WORKSPACES_TAB);

      await page.waitForSelector(selectors.WORKSPACES, {
        timeout: ONE_SECOND,
      });
      await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE);
      await page.click(selectors.SMOKE_TEST_WORKSPACE);
    }

    await page.waitForSelector(selectors.OPENED_WORKSPACE);
    expect(page.url()).toContain("/workspace/");

    await page.waitForSelector(selectors.SELECT_APPLICATION);
    await page.click(selectors.SELECT_APPLICATION);

    await page.mainFrame().$$eval("#split-button-menu li", (choices: Array<HTMLElement>, appName: string) => choices.forEach((choice: HTMLElement) => {
      
      if (choice?.innerText?.includes(appName)) {
        console.log("Choosing app", appName)
        choice.click();
      }
    }, appName), appName);


    console.log("Loading", appName);

    await page.click(selectors.OPEN_WITH_APPLICATION);
    await page.waitForSelector(selectors.APPLICATION_FRAME, {
      timeout: ONE_SECOND,
    });
    expect(page.url()).toContain(url);
    const elementHandle = await page.waitForSelector(
      selectors.APPLICATION_FRAME,
      {
        timeout: ONE_SECOND,
      }
    );
    const frame = await elementHandle.contentFrame();
    await frame.waitForSelector(selectors.SPAWN, {
      timeout: ONE_MINUTE,
    });
    
    for(const appSelector of appSelectors) {
      if(!frame.isDetached()) {
        await frame.waitForSelector(appSelector, {
          timeout: WORKSPACE_LOAD_TIMEOUT,
        });
      }
    }
    

    console.log(appName, "loaded");
  };

describe("OSB v2 Smoke Tests", () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        `--window-size=1600,1000`,
        "--ignore-certificate-errors"
      ],
      headless: !process.env.PUPPETEER_DISPLAY,
      defaultViewport: {
        width: 1600,
        height: 1000,
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

    console.log("Env", process.env);

    await page.waitForSelector(selectors.WORKSPACES);
  });

  afterAll(() => {
    browser.close();
  });

  test("Home Page", async () => {
    await page.click(selectors.PUBLIC_WORKSPACES);
    await page.waitForSelector(selectors.WORKSPACES);
  });

  test("Log in", async () => {
    console.log("Attempting login on", page.url());
    await page.waitForSelector(selectors.LOGIN_BTN);
    await page.click(selectors.LOGIN_BTN);

    await page.waitForSelector(selectors.USERNAME);
    await page.waitForSelector(selectors.PASSWORD);
    expect(page.url()).toContain("accounts.");
    await page.type(
      selectors.USERNAME,
      process.env.USERNAME || "simao_user_osb"
    );
    await page.type(selectors.PASSWORD, process.env.PASSWORD || "metacell");
    await page.click(selectors.LOGIN_BUTTON);
    await page.waitForSelector(selectors.ALL_YOUR_WORKSPACES_TAB);

    await page.waitForSelector(selectors.YOUR_WORKSPACES);
  });

  test("Create workspace", async () => {
    console.log("Creating workspace");

    await page.click(selectors.CREATE_WORKSPACE);
    await page.waitForSelector(selectors.WORKSPACE_CREATION_BOX);
    const privateWorkspacesBefore = await getCurrentWorkpaces();
    await page.type(selectors.WORKSPACE_NAME, "Smoke Test Workspace");
    await page.type(selectors.WORKSPACE_TAGS, "Test");
    await page.keyboard.press("Enter");
    await page.type(
      selectors.WORKSPACE_DESCRIPTION,
      "Workspace created by the Automated Smoke tests"
    );
    await page.waitForSelector(selectors.CREATE_NEW_WORKSPACE, ONE_SECOND);
    await page.click(selectors.CREATE_NEW_WORKSPACE);
    await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE);
    await page.waitForSelector(selectors.YOUR_WORKSPACES);
    await page.waitForSelector(".workspace-card");
    const privateWorkspacesAfter = await getCurrentWorkpaces();
    expect(privateWorkspacesAfter.length).toBe(
      privateWorkspacesBefore.length + 1
    );
  });

  test(
    "Open workspace with NWB Explorer",
    testApplication("NWB Explorer", [selectors.NWB_APP], "/nwbexplorer")
  );

  test("Open workspace with Jupyter Lab", testApplication("JupyterLab", [
    selectors.JUPYTER_CONTENT], "/jupyter"));

  test("Open workspace with NetPyNE", testApplication("NetPyNE", [
    selectors.NETPYNE_CELL_BUTTON,
    selectors.NETPYNE_MAIN_CONTAINER], "/netpyne"));



  test("Delete created workspace", async () => {
    console.log("Deleting created workspace");

    await page.click(selectors.OSB_LOGO);
    await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE);
    
    let menuBtn;
    while(menuBtn = await page.mainFrame().$(selectors.WORKSPACE_OPTIONS_BTN)) {
      

      await menuBtn.click();
      await page.waitForSelector(".delete-workspace", {timeout: ONE_SECOND});
      await page.evaluate(() => document.querySelector<HTMLElement>(".delete-workspace")?.click()); // page.click does not work on the popover
      await page.waitForSelector(".delete-workspace", {hidden: true});
    }
        
      
    


  });

  test("Logout", async () => {
    console.log("Logging out");
    await page.click(selectors.USER_MENU);
    await page.waitForSelector(selectors.LOGOUT_ACTION, {
      timeout: ONE_SECOND * 4,
    });
    await page.waitForSelector(selectors.WORKSPACES);
  });
});
