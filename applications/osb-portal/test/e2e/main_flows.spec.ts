const puppeteer = require("puppeteer");
const selectors = require("./selectors");
const {
  ONE_SECOND,
  ONE_MINUTE,
  TWO_MINUTES,
  TEN_MINUTES,
} = require("./time_constants");

let page: any;
let browser: any;
jest.setTimeout(TEN_MINUTES* 4);

const WORKSPACE_LOAD_TIMEOUT = TEN_MINUTES;

const getCurrentWorkpaces: () => Promise<Array<any>> = async () => {
  const pageFrame = page.mainFrame();
  return await pageFrame.$$("#workspaces-list .imageContainer");
};

const testApplication =
  (appName: string, appSelectors: Array<string>, url: string) => async () => {
    console.log("Opening workspace with", appName);

    await page.goto(
      process.env.APP_URL || "https://v2dev.opensourcebrain.org/"
    );

    if (appName == "NetPyNE") {
      //due to the Close page popup that appears when you try and leave NetPyne
      try {
        await page.once("dialog", async function (dialog: any) {
          await dialog.accept();
          // await dialog.dismiss();
        });
      } catch (error) {}
    }

    await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE);

    // Try to open an already existing workspace
    await page.waitForSelector(selectors.FEATURE_WORKSPACES_TAB);
    await page.click(selectors.FEATURE_WORKSPACES_TAB);
    await page.waitForSelector(selectors.WORKSPACES);
    const featuredWorkspaces = await getCurrentWorkpaces();

    // Try to open your already existing workspace to speed up
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
    expect(page.url()).toContain("/workspaces/");

    await page.waitForSelector(selectors.SELECT_APPLICATION);
    await page.click(selectors.SELECT_APPLICATION);

    await page.mainFrame().$$eval(
      "#split-button-menu li",
      (choices: Array<HTMLElement>, appName: string) =>
        choices.forEach((choice: HTMLElement) => {
          if (choice?.innerText?.includes(appName)) {
            console.log("Choosing app", appName);
            choice.click();
          }
        }, appName),
      appName
    );

    console.log("Loading", appName);

    await page.click(selectors.OPEN_WITH_APPLICATION);

    //There's a maximum number of servers per user
    await page.on("response", async (response: any) => {
      if (
        response.status() == "500" &&
        (page.url().endsWith("nwbexplorer") ||
          page.url().endsWith("netpyne") ||
          page.url().endsWith("jupyter"))
      ) {
        
        try {
          console.log("Max number of servers reached, restarting...");
          const elementHandle = await page.waitForSelector(
            selectors.APPLICATION_FRAME
          );
          const server_frame = await elementHandle.contentFrame();
          await server_frame.waitForSelector('a[href="/hub/home"]');
          await server_frame.click('a[href="/hub/home"]');
          await page.waitForTimeout(ONE_SECOND * 3);

          try {
            await server_frame.waitForSelector(".stop-server");
            let stopServer;
            while (
              (stopServer = await server_frame.waitForSelector(".stop-server"))
            ) {
              await stopServer.click();
              await page.waitForTimeout(ONE_SECOND);
            }
          } catch (error) {}

          try {
            await server_frame.waitForSelector(".delete-server");
            let deleteServer;
            while (
              (deleteServer = await server_frame.waitForSelector(
                ".delete-server"
              ))
            ) {
              await deleteServer.click();
              await page.waitForTimeout(ONE_SECOND);
            }
          } catch (error) {}

          try {
            await server_frame.waitForSelector("#stop");
            await server_frame.click("#stop");
            await page.waitForTimeout(ONE_SECOND * 2);
          } catch (error) {}

          try {
            let startServer;
            while (
              (startServer = await server_frame.waitForSelector("#start"))
            ) {
              await startServer.click();
              await page.waitForTimeout(ONE_SECOND);
            }
          } catch (error) {}
        } catch (error) {}
      }
    });

    await page.waitForTimeout(ONE_SECOND);

    await page.waitForSelector(selectors.APPLICATION_FRAME, {
      timeout: ONE_SECOND,
    });
    expect(page.url()).toContain(url);
    const elementHandler = await page.waitForSelector(
      selectors.APPLICATION_FRAME,
      {
        timeout: ONE_SECOND,
      }
    );
    const frame = await elementHandler.contentFrame();
    for (const appSelector of appSelectors) {
      if (!frame.isDetached()) {
        await frame.waitForSelector(appSelector, {
          timeout: WORKSPACE_LOAD_TIMEOUT,
        });
      }
    }

    console.log(appName, "loaded");
    await page.waitForTimeout(ONE_SECOND * 3);
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
        width: 1300,
        height: 768,
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
    await page.type(selectors.USERNAME, process.env.USERNAME || "simao-osb");
    await page.type(selectors.PASSWORD, process.env.PASSWORD || "test1");
    await page.click(selectors.LOGIN_BUTTON);
    await page.waitForSelector(selectors.ALL_YOUR_WORKSPACES_TAB);

    await page.waitForSelector(selectors.YOUR_WORKSPACES);
  });

  test("Create workspace", async () => {
    console.log("Creating workspace");

    const privateWorkspacesBefore = await getCurrentWorkpaces();

    await page.click(selectors.CREATE_WORKSPACE);
    await page.waitForSelector('ul[role = "menu"]');

    await page.evaluate(() => {
      let menuOptions = document.querySelectorAll<HTMLElement>(
        'li[role="menuitem"]'
      );
      for (var i = 0; i < menuOptions.length; i++) {
        menuOptions[i].innerText.includes("Workspace") &&
          menuOptions[i].click();
      }
    });

    await page.waitForTimeout(ONE_SECOND);

    await page.waitForSelector("#computational-modeling");
    await page.click("#data-analysis");

    await page.waitForSelector(selectors.WORKSPACE_CREATION_BOX);
    await page.type(selectors.WORKSPACE_NAME, "Smoke Test Workspace");

    await page.type(
      selectors.WORKSPACE_DESCRIPTION,
      "Workspace created by the Automated Smoke tests"
    );
    await page.waitForSelector(selectors.CREATE_NEW_WORKSPACE, ONE_SECOND);
    await page.click(selectors.CREATE_NEW_WORKSPACE);
    await page.waitForTimeout(ONE_SECOND * 3);
    await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE);
    await page.waitForSelector(selectors.YOUR_WORKSPACES);
    const privateWorkspacesAfter = await getCurrentWorkpaces();
    expect(privateWorkspacesAfter.length).toBeGreaterThan(
      privateWorkspacesBefore.length
    );
  });

  test(
    "Open workspace with NWB Explorer",
    testApplication("NWB Explorer", [selectors.NWB_APP], "/nwbexplorer")
  );

  test(
    "Open workspace with NetPyNE",
    testApplication(
      "NetPyNE",
      [selectors.NETPYNE_CELL_BUTTON, selectors.NETPYNE_MAIN_CONTAINER],
      "/netpyne"
    )
  );

  test(
    "Open workspace with Jupyter Lab",
    testApplication("JupyterLab", [selectors.JUPYTER_CONTENT], "/jupyter")
  );

  test("Delete created workspace", async () => {
    console.log("Deleting created workspace");
    await page.waitForSelector(selectors.OSB_LOGO);
    await page.click(selectors.OSB_LOGO);
    await page.waitForTimeout(ONE_SECOND);
    await page.waitForSelector(selectors.SMOKE_TEST_WORKSPACE);

    let menuBtn;
    while (
      (menuBtn = await page.mainFrame().$(selectors.WORKSPACE_OPTIONS_BTN))
    ) {
      await menuBtn.click();
      await page.waitForTimeout(ONE_SECOND);
      await page.waitForSelector(".delete-workspace", { timeout: ONE_SECOND });
      await page.click(".delete-workspace");
      await page.waitForSelector(".delete-workspace", { hidden: true });
      await page.waitForTimeout(ONE_SECOND);
    }

    const WorkspacesAfterDelete = await getCurrentWorkpaces();
    expect(WorkspacesAfterDelete.length).toBe(0);
  });

  test("Logout", async () => {
    console.log("Logging out");

    await page.waitForSelector(selectors.USER_MENU);
    await page.click(selectors.USER_MENU);
    await page.waitForSelector(selectors.LOGOUT_ACTION, {
      timeout: ONE_SECOND * 4,
    });

    await page.waitForSelector(selectors.WORKSPACES);
  });
});
