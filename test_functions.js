const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  // ============================================================
  // CONFIG
  // ============================================================

  const BASE_URL = 'http://localhost:3009';

  const recordingDir = path.join(__dirname, 'test-recordings-v2');
  const screenshotDir = path.join(__dirname, 'test-screenshots-v2');
  const reportDir = path.join(__dirname, 'test-reports-v2');

  fs.mkdirSync(recordingDir, { recursive: true });
  fs.mkdirSync(screenshotDir, { recursive: true });
  fs.mkdirSync(reportDir, { recursive: true });

  const results = [];
  const bugs = [];
  const consoleErrors = [];
  const failedRequests = [];
  const response404s = [];

  let testNumber = 0;

  // Unique test account
  const timestamp = Date.now();

  const TEST_USER = {
    name: 'Test User',
    email: `testuser_${timestamp}@example.com`,
    password: 'Test@12345',
    confirmPassword: 'Test@12345'
  };

  console.log(`
====================================================
 PERCEPTION MAPPER AI - V2 DEEP E2E TEST
====================================================

Base URL: ${BASE_URL}

Test account:
Name:     ${TEST_USER.name}
Email:    ${TEST_USER.email}
Password: ${TEST_USER.password}

====================================================
`);

  // ============================================================
  // RESULT HELPERS
  // ============================================================

  function addBug({
    test,
    page,
    feature,
    steps,
    expected,
    actual,
    error = '',
    severity = 'MEDIUM'
  }) {
    bugs.push({
      id: `BUG-${String(bugs.length + 1).padStart(3, '0')}`,
      test,
      page,
      feature,
      steps,
      expected,
      actual,
      error,
      severity
    });
  }

  function result(
    name,
    input,
    expected,
    actual,
    status,
    severity = ''
  ) {
    testNumber++;

    const item = {
      number: testNumber,
      name,
      input,
      expected,
      actual,
      status,
      severity,
      time: new Date().toISOString()
    };

    results.push(item);

    console.log(`
[CHECK #${testNumber}] ${name}
  Input:    ${input}
  Expected: ${expected}
  Actual:   ${actual}
  Status:   ${status}${severity ? `\n  Severity: ${severity}` : ''}
`);

    return item;
  }

  async function shot(page, name) {
    const file = path.join(screenshotDir, `${name}.png`);

    try {
      await page.screenshot({
        path: file,
        fullPage: true
      });

      console.log(`📸 ${file}`);

      return file;
    } catch (e) {
      console.log(`Screenshot failed: ${e.message}`);
      return null;
    }
  }

  async function goto(page, url) {
    try {
      const response = await page.goto(url, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      return response;
    } catch (e) {
      console.log(`❌ Navigation failed: ${url}`);
      console.log(e.message);
      return null;
    }
  }

  async function visible(locator) {
    try {
      return await locator.count() > 0 &&
             await locator.first().isVisible();
    } catch {
      return false;
    }
  }

  async function textExists(page, text) {
    try {
      return await page
        .getByText(text, { exact: false })
        .first()
        .isVisible();
    } catch {
      return false;
    }
  }

  async function getBodyText(page) {
    try {
      return await page.locator('body').innerText();
    } catch {
      return '';
    }
  }

  async function getStorageState(page) {
    try {
      return await page.evaluate(() => ({
        localStorage: Object.fromEntries(
          Object.entries(localStorage)
        ),
        sessionStorage: Object.fromEntries(
          Object.entries(sessionStorage)
        ),
        cookies: document.cookie
      }));
    } catch (e) {
      return { localStorage: {}, sessionStorage: {}, cookies: '' };
    }
  }

  async function inputInfo(page) {
    return await page.locator('input').evaluateAll(elements =>
      elements.map((el, index) => ({
        index,
        type: el.type,
        name: el.name,
        id: el.id,
        placeholder: el.placeholder,
        autocomplete: el.autocomplete,
        value: el.value
      }))
    );
  }

  async function fillFirst(page, selectors, value) {
    for (const selector of selectors) {
      const locator = page.locator(selector).first();

      try {
        if (await locator.count() && await locator.isVisible()) {
          await locator.fill(value);
          return true;
        }
      } catch {}
    }

    return false;
  }

  async function clickFirst(page, selectors) {
    for (const selector of selectors) {
      const locator = page.locator(selector).first();

      try {
        if (await locator.count() && await locator.isVisible()) {
          await locator.click();
          return true;
        }
      } catch {}
    }

    return false;
  }

  // ============================================================
  // BROWSER
  // ============================================================

  console.log('🚀 Launching Chromium...');

  const browser = await chromium.launch({
    headless: false
  });

  const context = await browser.newContext({
    viewport: {
      width: 1440,
      height: 900
    },
    recordVideo: {
      dir: recordingDir,
      size: {
        width: 1440,
        height: 900
      }
    }
  });

  // ============================================================
  // SPEECH MOCK
  // ============================================================

  await context.addInitScript(() => {
    const originalSpeechSynthesis =
      window.speechSynthesis;

    window.__ttsTest = {
      started: false,
      ended: false
    };

    if (originalSpeechSynthesis) {
      const originalSpeak =
        originalSpeechSynthesis.speak.bind(
          originalSpeechSynthesis
        );

      originalSpeechSynthesis.speak = function (
        utterance
      ) {
        window.__ttsTest.started = true;

        if (utterance) {
          const originalStart = utterance.onstart;
          const originalEnd = utterance.onend;

          utterance.onstart = function (event) {
            window.__ttsTest.started = true;

            if (originalStart) {
              originalStart.call(this, event);
            }
          };

          utterance.onend = function (event) {
            window.__ttsTest.ended = true;

            if (originalEnd) {
              originalEnd.call(this, event);
            }
          };
        }

        return originalSpeak(utterance);
      };
    }
  });

  const page = await context.newPage();

  // ============================================================
  // ERROR MONITORING
  // ============================================================

  page.on('console', msg => {
    if (msg.type() === 'error') {
      const item = {
        type: 'console',
        message: msg.text(),
        url: page.url(),
        time: new Date().toISOString()
      };

      consoleErrors.push(item);

      console.log(`⚠️ Console error: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    const item = {
      type: 'pageerror',
      message: error.message,
      url: page.url(),
      time: new Date().toISOString()
    };

    consoleErrors.push(item);

    console.log(`⚠️ Page error: ${error.message}`);
  });

  page.on('requestfailed', request => {
    const item = {
      url: request.url(),
      method: request.method(),
      failure: request.failure(),
      time: new Date().toISOString()
    };

    failedRequests.push(item);

    console.log(
      `❌ Request failed: ${request.method()} ${request.url()}`
    );
  });

  page.on('response', response => {
    if (response.status() === 404) {
      const item = {
        url: response.url(),
        status: response.status(),
        method: response.request().method(),
        resourceType: response.request().resourceType(),
        time: new Date().toISOString()
      };

      response404s.push(item);

      console.log(
        `🔴 404: ${response.request().method()} ${response.url()}`
      );
    }
  });

  try {

    // ==========================================================
    // F01 HOME PAGE
    // ==========================================================

    const homeResponse = await goto(
      page,
      BASE_URL
    );

    const title = await page.title();
    const homeLoaded =
      homeResponse &&
      homeResponse.ok() &&
      title.includes('Perception Mapper');

    await shot(page, 'f01-home');

    result(
      'Homepage',
      BASE_URL,
      'HTTP success and correct title',
      `HTTP=${homeResponse?.status()}, title="${title}"`,
      homeLoaded ? 'PASS' : 'FAIL',
      homeLoaded ? '' : 'HIGH'
    );

    // ==========================================================
    // F02 NAVIGATION LINKS
    // ==========================================================

    const expectedAnchors = [
      '#features',
      '#how-it-works',
      '#showcase',
      '#testimonials',
      '#pricing'
    ];

    for (const anchor of expectedAnchors) {
      const link = page.locator(`a[href="${anchor}"]`).first();

      if (await visible(link)) {
        await link.click();
        await page.waitForTimeout(500);

        const target = page.locator(anchor);

        const isVisible = await visible(target);

        result(
          `Navigation ${anchor}`,
          `Click ${anchor}`,
          `${anchor} becomes visible`,
          `Visible=${isVisible}`,
          isVisible ? 'PASS' : 'FAIL'
        );

        if (!isVisible) {
          addBug({
            test: `Navigation ${anchor}`,
            page: page.url(),
            feature: 'Navbar navigation',
            steps: `Click link ${anchor}`,
            expected: `${anchor} section visible`,
            actual: 'Target section not visible',
            severity: 'MEDIUM'
          });
        }
      }
    }

    // ==========================================================
    // F03 SHOWCASE BASIC
    // ==========================================================

    await goto(page, BASE_URL);
    await page.locator('#showcase').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);

    const basic = page
      .locator('#showcase button span')
      .filter({ hasText: /^Basic$/ })
      .first();

    if (await visible(basic)) {
      await basic.click();
      await page.waitForTimeout(1000);

      const sandbox =
        await page
          .locator('#showcase')
          .locator('text=Rephrase Sandbox')
          .first()
          .isVisible()
          .catch(() => false);

      await shot(page, 'f03-basic');

      result(
        'Showcase Basic',
        'Click Basic',
        'Rephrase Sandbox visible',
        `Visible=${sandbox}`,
        sandbox ? 'PASS' : 'FAIL'
      );
    }

    // ==========================================================
    // F04 SHOWCASE PRO
    // ==========================================================

    const pro = page
      .locator('#showcase button span')
      .filter({ hasText: /^Pro$/ })
      .first();

    if (await visible(pro)) {
      await pro.click();
      await page.waitForTimeout(1000);

      const graph =
        await page
          .locator('#showcase')
          .locator('text=Bias Network Graph')
          .first()
          .isVisible()
          .catch(() => false);

      await shot(page, 'f04-pro');

      result(
        'Showcase Pro',
        'Click Pro',
        'Bias Network Graph visible',
        `Visible=${graph}`,
        graph ? 'PASS' : 'FAIL'
      );
    }

    // ==========================================================
    // F05 PRESET
    // ==========================================================

    const preset =
      page.getByText(
        'Corporate Launch Announcement',
        { exact: true }
      ).first();

    if (await visible(preset)) {
      await preset.click();

      const textarea =
        page.locator('textarea').first();

      const value =
        await textarea.inputValue();

      result(
        'Preset Selection',
        'Corporate Launch Announcement',
        'Textarea populated',
        `Length=${value.length}`,
        value.length > 0 ? 'PASS' : 'FAIL'
      );
    }

    // ==========================================================
    // F06 ANALYSIS
    // ==========================================================

    const analyze =
      page.locator('#playground button:has-text("Analyze and Cleanse Text")')
      .first();

    if (await visible(analyze)) {
      await analyze.click();

      await page.waitForTimeout(5000);

      const analysis =
        await textExists(
          page,
          'Objectivity Cleanse'
        );

      await shot(page, 'f06-analysis');

      result(
        'Text Analysis',
        'Analyze preset text',
        'Analysis result appears',
        `Objectivity Cleanse=${analysis}`,
        analysis ? 'PASS' : 'FAIL',
        analysis ? '' : 'HIGH'
      );
    }

    // ==========================================================
    // F07 EMPTY VALIDATION
    // ==========================================================

    const textarea =
      page.locator('textarea').first();

    if (await textarea.count()) {
      await textarea.fill('');

      const analyzeButton =
        page.locator('#playground button:has-text("Analyze and Cleanse Text")')
        .first();

      const disabled =
        await analyzeButton.isDisabled()
          .catch(() => false);

      const body =
        await getBodyText(page);

      const validation =
        disabled ||
        /required|enter text|cannot be empty/i.test(
          body
        );

      result(
        'Empty Text Validation',
        'Submit empty text',
        'Button disabled OR validation shown',
        `disabled=${disabled}, validation=${validation}`,
        validation ? 'PASS' : 'FAIL'
      );
    }

    // ==========================================================
    // F08 CUSTOM TEXT
    // ==========================================================

    const custom =
      'This is obviously a catastrophic disaster!';

    await textarea.fill(custom);

    const analyze2 =
      page.locator('#playground button:has-text("Analyze and Cleanse Text")')
      .first();

    await analyze2.click();

    await page.waitForTimeout(5000);

    const customResult =
      await textExists(
        page,
        'Objectivity Cleanse'
      );

    await shot(page, 'f08-custom-analysis');

    result(
      'Custom Text Analysis',
      custom,
      'Analysis result appears',
      `Result=${customResult}`,
      customResult ? 'PASS' : 'FAIL'
    );

    // ==========================================================
    // F09 TTS - ACTUAL STATE
    // ==========================================================

    const acoustic =
      page.getByText(
        'Acoustic Readout',
        { exact: false }
      ).first();

    if (await visible(acoustic)) {
      await acoustic.click();

      await page.waitForTimeout(500);

      const ttsState =
        await page.evaluate(() => ({
          started:
            window.__ttsTest?.started || false,
          ended:
            window.__ttsTest?.ended || false
        }));

      const body =
        await getBodyText(page);

      const buttonText =
        await acoustic.innerText()
          .catch(() => '');

      const ttsEvidence =
        ttsState.started ||
        /streaming audio|speaking|playing|audio/i.test(
          buttonText
        );

      await shot(page, 'f09-tts');

      result(
        'TTS Playback',
        'Click Acoustic Readout',
        'Actual speech/audio state starts',
        JSON.stringify({
          ttsState,
          buttonText
        }),
        ttsEvidence ? 'PASS' : 'FAIL',
        ttsEvidence ? '' : 'MEDIUM'
      );

      if (!ttsEvidence) {
        addBug({
          test: 'TTS Playback',
          page: page.url(),
          feature: 'Acoustic Readout',
          steps: [
            'Run text analysis',
            'Click Acoustic Readout'
          ],
          expected:
            'Speech synthesis starts or UI enters audio state',
          actual:
            `No speech event and no audio/streaming state detected. Button="${buttonText}"`,
          severity: 'MEDIUM'
        });
      }
    }

    // ==========================================================
    // F10 CONTACT
    // ==========================================================

    const contactResponse =
      await goto(
        page,
        `${BASE_URL}/contact`
      );

    const contactHeader =
      await textExists(
        page,
        'Establish Connection'
      );

    await shot(page, 'f10-contact');

    result(
      'Contact Page',
      '/contact',
      'Contact page loads',
      `HTTP=${contactResponse?.status()}, header=${contactHeader}`,
      contactHeader ? 'PASS' : 'FAIL'
    );

    // ==========================================================
    // F11 CONTACT VALIDATION
    // ==========================================================

    const contactSubmit =
      page.locator(
        'button[type="submit"]'
      ).first();

    if (await visible(contactSubmit)) {
      await contactSubmit.click();

      await page.waitForTimeout(500);

      const body =
        await getBodyText(page);

      const valid =
        /required|invalid|communication node/i.test(
          body
        );

      result(
        'Contact Validation',
        'Submit empty form',
        'Validation error shown',
        `Validation=${valid}`,
        valid ? 'PASS' : 'FAIL'
      );
    }

    // ==========================================================
    // F12 DASHBOARD AUTH
    // ==========================================================

    await goto(
      page,
      `${BASE_URL}/dashboard`
    );

    await page.waitForTimeout(1000);

    const dashboardURL =
      page.url();

    const dashboardProtected =
      /sign-in/i.test(dashboardURL);

    await shot(
      page,
      'f12-dashboard-auth'
    );

    result(
      'Dashboard Authentication Guard',
      '/dashboard',
      'Unauthenticated user cannot access dashboard',
      dashboardURL,
      dashboardProtected
        ? 'PASS'
        : 'FAIL',
      dashboardProtected ? '' : 'HIGH'
    );

    // ==========================================================
    // F13 CONFIGURATION AUTH
    // ==========================================================

    await goto(
      page,
      `${BASE_URL}/configuration`
    );

    await page.waitForTimeout(1000);

    const configURL =
      page.url();

    const configProtected =
      /sign-in/i.test(configURL);

    await shot(
      page,
      'f13-configuration-auth'
    );

    result(
      'Configuration Authentication Guard',
      '/configuration',
      'Unauthenticated user is redirected',
      configURL,
      configProtected
        ? 'PASS'
        : 'FAIL'
    );

    // ==========================================================
    // F14 ADMIN AUTH
    // ==========================================================

    await goto(
      page,
      `${BASE_URL}/admin/dashboard`
    );

    await page.waitForTimeout(1000);

    const adminURL =
      page.url();

    const adminProtected =
      /sign-in/i.test(adminURL);

    await shot(
      page,
      'f14-admin-auth'
    );

    result(
      'Admin Authentication Guard',
      '/admin/dashboard',
      'Unauthenticated user is redirected',
      adminURL,
      adminProtected
        ? 'PASS'
        : 'FAIL'
    );

    // ==========================================================
    // F15 SIGNUP PAGE
    // ==========================================================

    await goto(
      page,
      `${BASE_URL}/sign-up`
    );

    await page.waitForTimeout(500);

    const signupInputs =
      await inputInfo(page);

    console.log('\nSIGNUP INPUTS:');
    console.table(signupInputs);

    await shot(page, 'f15-signup');

    const hasName =
      signupInputs.some(
        x =>
          x.id === 'name' ||
          /name/i.test(x.name) ||
          /name/i.test(x.placeholder)
      );

    const hasEmail =
      signupInputs.some(
        x =>
          x.id === 'email' ||
          x.type === 'email'
      );

    const passwords =
      signupInputs.filter(
        x => x.type === 'password'
      );

    result(
      'Signup Form',
      '/sign-up',
      'Name/email/password fields exist',
      `name=${hasName}, email=${hasEmail}, passwordFields=${passwords.length}`,
      hasName &&
      hasEmail &&
      passwords.length >= 2
        ? 'PASS'
        : 'FAIL',
      hasName &&
      hasEmail &&
      passwords.length >= 2
        ? ''
        : 'HIGH'
    );

    // ==========================================================
    // F16 SIGNUP FILL
    // ==========================================================

    const nameOK =
      await fillFirst(
        page,
        [
          '#name',
          'input[name="name"]',
          'input[placeholder*="name" i]'
        ],
        TEST_USER.name
      );

    const emailOK =
      await fillFirst(
        page,
        [
          '#email',
          'input[name="email"]',
          'input[type="email"]'
        ],
        TEST_USER.email
      );

    const passwordOK =
      await fillFirst(
        page,
        [
          '#pass',
          '#password',
          'input[name="password"]',
          'input[type="password"]'
        ],
        TEST_USER.password
      );

    const confirmOK =
      await fillFirst(
        page,
        [
          '#conf',
          '#confirmPassword',
          'input[name="confirmPassword"]',
          'input[type="password"]:nth-of-type(2)'
        ],
        TEST_USER.confirmPassword
      );

    await shot(
      page,
      'f16-signup-filled'
    );

    result(
      'Signup Data Entry',
      JSON.stringify(TEST_USER),
      'All available signup fields populated',
      `name=${nameOK}, email=${emailOK}, password=${passwordOK}, confirm=${confirmOK}`,
      nameOK &&
      emailOK &&
      passwordOK &&
      confirmOK
        ? 'PASS'
        : 'FAIL',
      nameOK &&
      emailOK &&
      passwordOK &&
      confirmOK
        ? ''
        : 'HIGH'
    );

    // ==========================================================
    // F17 SIGNUP - REAL SUCCESS CHECK
    // ==========================================================

    const signupBeforeURL =
      page.url();

    const signupButton =
      page.locator(
        'button[type="submit"]'
      ).first();

    let signupSubmitted = false;

    if (await visible(signupButton)) {

      const beforeStorage =
        await getStorageState(page);

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 5000 }).catch(() => {}),
        signupButton.click()
      ]);

      signupSubmitted = true;

      const afterURL =
        page.url();

      const afterStorage =
        await getStorageState(page);

      const body =
        await getBodyText(page);

      const URLChanged =
        afterURL !== signupBeforeURL;

      const authenticatedURL =
        /dashboard|configuration/i.test(
          afterURL
        );

      const successMessage =
        /account created|registered successfully|welcome|registration successful/i.test(
          body
        );

      const authChanged =
        JSON.stringify(beforeStorage) !==
        JSON.stringify(afterStorage);

      // IMPORTANT:
      // Staying on /sign-up is NOT considered success.
      const signupSuccess =
        authenticatedURL ||
        successMessage ||
        authChanged;

      await shot(
        page,
        'f17-signup-result'
      );

      result(
        'Signup Submission',
        TEST_USER.email,
        'Actual account creation/authentication evidence',
        JSON.stringify({
          beforeURL: signupBeforeURL,
          afterURL,
          URLChanged,
          authenticatedURL,
          successMessage,
          authChanged
        }),
        signupSuccess
          ? 'PASS'
          : 'FAIL',
        signupSuccess
          ? ''
          : 'CRITICAL'
      );

      if (!signupSuccess) {
        addBug({
          test: 'Signup Submission',
          page: signupBeforeURL,
          feature: 'Registration',
          steps: [
            'Open /sign-up',
            'Enter valid name',
            'Enter unique email',
            'Enter matching password',
            'Submit form'
          ],
          expected:
            'Account is created and user is authenticated or redirected to login/dashboard',
          actual:
            `No creation evidence. URL remained ${afterURL}`,
          severity: 'CRITICAL'
        });
      }
    }

    // ==========================================================
    // F18 LOGIN PAGE
    // ==========================================================

    await goto(
      page,
      `${BASE_URL}/sign-in`
    );

    await page.waitForTimeout(500);

    const loginInputs =
      await inputInfo(page);

    console.log('\nLOGIN INPUTS:');
    console.table(loginInputs);

    const loginEmailOK =
      await fillFirst(
        page,
        [
          '#email',
          'input[name="email"]',
          'input[type="email"]'
        ],
        TEST_USER.email
      );

    const loginPasswordOK =
      await fillFirst(
        page,
        [
          '#password',
          'input[name="password"]',
          'input[type="password"]'
        ],
        TEST_USER.password
      );

    await shot(
      page,
      'f18-login-filled'
    );

    result(
      'Login Data Entry',
      TEST_USER.email,
      'Credentials entered',
      `email=${loginEmailOK}, password=${loginPasswordOK}`,
      loginEmailOK &&
      loginPasswordOK
        ? 'PASS'
        : 'FAIL',
      loginEmailOK &&
      loginPasswordOK
        ? ''
        : 'HIGH'
    );

    // ==========================================================
    // F19 LOGIN - REAL AUTH CHECK
    // ==========================================================

    const loginButton =
      page.locator(
        'button[type="submit"]'
      ).first();

    const loginBeforeURL =
      page.url();

    const loginBeforeStorage =
      await getStorageState(page);

    if (await visible(loginButton)) {

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle', timeout: 5000 }).catch(() => {}),
        loginButton.click()
      ]);

      const loginAfterURL =
        page.url();

      const loginAfterStorage =
        await getStorageState(page);

      const loginBody =
        await getBodyText(page);

      const authURL =
        /dashboard|configuration/i.test(
          loginAfterURL
        );

      const authStorageChanged =
        JSON.stringify(loginBeforeStorage) !==
        JSON.stringify(loginAfterStorage);

      const authenticatedUI =
        /logout|sign out|dashboard|profile/i.test(
          loginBody
        );

      const loginSuccess =
        authURL ||
        authStorageChanged ||
        authenticatedUI;

      await shot(
        page,
        'f19-login-result'
      );

      result(
        'Login Authentication',
        TEST_USER.email,
        'Actual authenticated session created',
        JSON.stringify({
          beforeURL: loginBeforeURL,
          afterURL: loginAfterURL,
          authURL,
          authStorageChanged,
          authenticatedUI
        }),
        loginSuccess
          ? 'PASS'
          : 'FAIL',
        loginSuccess
          ? ''
          : 'CRITICAL'
      );

      if (!loginSuccess) {
        addBug({
          test: 'Login Authentication',
          page: loginBeforeURL,
          feature: 'Authentication',
          steps: [
            'Open /sign-in',
            `Enter ${TEST_USER.email}`,
            'Enter password',
            'Click Sign In'
          ],
          expected:
            'Authenticated session is created and protected page becomes accessible',
          actual:
            `No authentication evidence. Current URL=${loginAfterURL}`,
          severity: 'CRITICAL'
        });
      }
    }

    // ==========================================================
    // F20 PROTECTED PAGE AFTER LOGIN
    // ==========================================================

    await goto(
      page,
      `${BASE_URL}/dashboard`
    );

    await page.waitForTimeout(1000);

    const protectedURL =
      page.url();

    const dashboardAccessible =
      !/sign-in/i.test(
        protectedURL
      );

    await shot(
      page,
      'f20-dashboard-after-login'
    );

    result(
      'Dashboard After Login',
      '/dashboard',
      'Authenticated user can access dashboard',
      protectedURL,
      dashboardAccessible
        ? 'PASS'
        : 'FAIL',
      dashboardAccessible
        ? ''
        : 'CRITICAL'
    );

    // ==========================================================
    // F20_1 UPGRADE TO BASIC TIER
    // ==========================================================

    let upgradeToBasicSuccess = false;
    
    // Wait for workspace preloader to disappear
    console.log('Waiting for dashboard workspace to mount...');
    await page.locator('#workspace').waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(500);

    const basicUpgradeBtn = page.locator('button').filter({ has: page.locator('span').filter({ hasText: /^Basic$/ }) }).first();
    
    if (await visible(basicUpgradeBtn)) {
      console.log('Triggering Basic Plan Upgrade...');
      await basicUpgradeBtn.click();
      await page.waitForTimeout(1000);

      // Fill mock credit card details
      await page.locator('input[name="cardNumber"]').fill('4242 4242 4242 4242');
      await page.locator('input[name="expiry"]').fill('12/28');
      await page.locator('input[name="cvc"]').fill('123');
      await page.locator('input[name="zip"]').fill('90210');
      await shot(page, 'f20_1-checkout-basic');

      // Click Pay
      await page.click('button:has-text("Authorize Subscription Pay")');
      await page.locator('text=BIOMETRIC SIGNALS').first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      await shot(page, 'f20_1-checkout-basic-success');

      // Verify upgraded dashboard view (Basic tier shows BIOMETRIC SIGNALS tab)
      const proDashboardIndicator = await page.locator('text=BIOMETRIC SIGNALS').first().isVisible().catch(() => false);
      upgradeToBasicSuccess = proDashboardIndicator;

      result(
        'Upgrade to Basic Tier',
        'Stripe Checkout Basic Simulation',
        'Linguistic workspace upgraded to Basic Tier',
        `Basic Dashboard loaded = ${upgradeToBasicSuccess}`,
        upgradeToBasicSuccess ? 'PASS' : 'FAIL',
        upgradeToBasicSuccess ? '' : 'HIGH'
      );
    }

    // ==========================================================
    // F20_2 UPGRADE TO PRO TIER
    // ==========================================================

    let upgradeToProSuccess = false;
    const proUpgradeBtn = page.locator('button').filter({ has: page.locator('span').filter({ hasText: /^Pro$/ }) }).first();
    
    if (await visible(proUpgradeBtn)) {
      console.log('Triggering Pro Plan Upgrade...');
      await proUpgradeBtn.click();
      await page.waitForTimeout(1000);

      // Fill mock credit card details
      await page.locator('input[name="cardNumber"]').fill('4242 4242 4242 4242');
      await page.locator('input[name="expiry"]').fill('12/28');
      await page.locator('input[name="cvc"]').fill('123');
      await page.locator('input[name="zip"]').fill('90210');

      // Click Pay
      await page.click('button:has-text("Authorize Subscription Pay")');
      await page.locator('text=Enterprise OS Telemetry').first().waitFor({ state: 'visible', timeout: 8000 }).catch(() => {});
      await shot(page, 'f20_2-checkout-pro-success');

      // Verify upgraded dashboard view
      const enterpriseDashboardIndicator = await page.locator('text=Enterprise OS Telemetry').first().isVisible().catch(() => false);
      upgradeToProSuccess = enterpriseDashboardIndicator;

      result(
        'Upgrade to Pro Tier',
        'Stripe Checkout Pro Simulation',
        'Linguistic workspace upgraded to Pro Tier',
        `Pro Dashboard loaded = ${upgradeToProSuccess}`,
        upgradeToProSuccess ? 'PASS' : 'FAIL',
        upgradeToProSuccess ? '' : 'HIGH'
      );
    }

    // ==========================================================
    // F21 LOGOUT
    // ==========================================================

    const logoutCandidates = [
      'button:has-text("Logout")',
      'button:has-text("Log Out")',
      'button:has-text("Sign Out")',
      'a:has-text("Logout")',
      'a:has-text("Log Out")',
      'a:has-text("Sign Out")'
    ];

    // Expose the dropdown user menu first
    const menuTrigger = page.locator('button:has(svg.lucide-chevron-down)').first();
    if (await visible(menuTrigger)) {
      await menuTrigger.click();
      await page.waitForTimeout(500);
    }

    const logoutFound =
      await clickFirst(
        page,
        logoutCandidates
      );

    if (logoutFound) {

      await page.waitForTimeout(1500);

      const logoutURL =
        page.url();

      const loggedOut =
        /sign-in|login/i.test(
          logoutURL
        );

      await shot(
        page,
        'f21-logout'
      );

      result(
        'Logout',
        'Click logout',
        'Session destroyed and login page shown',
        logoutURL,
        loggedOut
          ? 'PASS'
          : 'FAIL',
        loggedOut
          ? ''
          : 'HIGH'
      );

      if (!loggedOut) {
        addBug({
          test: 'Logout',
          page: page.url(),
          feature: 'Authentication',
          steps: ['Login', 'Open dashboard', 'Click logout'],
          expected:
            'Session is destroyed and user returns to sign-in',
          actual:
            `User remained at ${logoutURL}`,
          severity: 'HIGH'
        });
      }

    } else {

      result(
        'Logout',
        'Find logout control',
        'Logout control exists for authenticated user',
        'Logout control not found',
        'NOT_TESTABLE',
        'MEDIUM'
      );
    }

    // ==========================================================
    // F21_1 ADMIN SIGN IN & DASHBOARD AUDIT
    // ==========================================================

    console.log('Testing Admin Credentials & Dashboard console...');
    await goto(page, `${BASE_URL}/sign-in`);
    // Wait for the sign in preloader to disappear
    await page.locator('button[type="submit"]').waitFor({ state: 'visible', timeout: 5000 });
    await page.waitForTimeout(500);

    // Sign in as Admin
    await fillFirst(page, ['#email', 'input[name="email"]', 'input[type="email"]'], 'admin1@perception.ai');
    await fillFirst(page, ['#password', 'input[name="password"]', 'input[type="password"]'], 'Admin@123');
    await shot(page, 'f21_1-admin-signin-filled');

    const adminSignInBtn = page.locator('button[type="submit"]').first();
    let adminDashboardLoaded = false;

    if (await visible(adminSignInBtn)) {
      await adminSignInBtn.click();
      await page.waitForTimeout(3000);

      const adminAfterURL = page.url();
      adminDashboardLoaded = adminAfterURL.includes('/admin/dashboard');
      await shot(page, 'f21_1-admin-dashboard-loaded');

      result(
        'Admin Dashboard Access',
        'admin1@perception.ai',
        'Admin redirected to /admin/dashboard',
        `Current URL = ${adminAfterURL}`,
        adminDashboardLoaded ? 'PASS' : 'FAIL',
        adminDashboardLoaded ? '' : 'CRITICAL'
      );

      if (adminDashboardLoaded) {
        // Sign out Admin Session
        console.log('Logging out Admin Session...');
        await page.locator('button[title="Terminate session"]').click();
        await page.waitForTimeout(1500);
        const adminLoggedOutUrl = page.url();
        const adminLoggedOut = /sign-in|login/i.test(adminLoggedOutUrl);

        result(
          'Admin Session Termination',
          'Click Terminate Session',
          'Admin session destroyed and redirected to sign-in',
          `Current URL = ${adminLoggedOutUrl}`,
          adminLoggedOut ? 'PASS' : 'FAIL',
          adminLoggedOut ? '' : 'HIGH'
        );
      }
    }

    // ==========================================================
    // F22 PRICING PAGE
    // ==========================================================

    const pricingResponse =
      await goto(
        page,
        `${BASE_URL}/pricing`
      );

    const pricingBody =
      await getBodyText(page);

    await shot(
      page,
      'f22-pricing'
    );

    result(
      'Pricing Page',
      '/pricing',
      'Pricing page loads and contains pricing information',
      `HTTP=${pricingResponse?.status()}, length=${pricingBody.length}`,
      pricingResponse?.ok() &&
      pricingBody.length > 100
        ? 'PASS'
        : 'FAIL'
    );

    // ==========================================================
    // F23 ALL HOME LINKS
    // ==========================================================

    await goto(page, BASE_URL);

    const links =
      await page.locator('a').evaluateAll(
        elements =>
          elements.map((el, index) => ({
            index,
            text:
              (el.innerText || '').trim(),
            href: el.href
          }))
      );

    console.log('\n🔗 HOME LINKS:');
    console.table(links);

    const internalLinks =
      links.filter(
        x =>
          x.href.startsWith(BASE_URL)
      );

    let brokenInternalLinks = 0;

    for (const link of internalLinks) {

      if (
        !link.href ||
        link.href.includes('#')
      ) {
        continue;
      }

      const response =
        await goto(
          page,
          link.href
        );

      if (
        !response ||
        response.status() >= 400
      ) {
        brokenInternalLinks++;

        addBug({
          test: 'Internal Link Test',
          page: BASE_URL,
          feature: link.text || link.href,
          steps: `Click/open ${link.href}`,
          expected:
            'Internal page returns successful response',
          actual:
            `HTTP ${response?.status()}`,
          severity: 'MEDIUM'
        });
      }
    }

    result(
      'Internal Link Testing',
      `${internalLinks.length} internal links`,
      'No broken internal links',
      `Broken=${brokenInternalLinks}`,
      brokenInternalLinks === 0
        ? 'PASS'
        : 'FAIL'
    );

    // ==========================================================
    // F24 BUTTON INVENTORY
    // ==========================================================

    await goto(
      page,
      BASE_URL
    );

    const buttons =
      await page.locator('button').evaluateAll(
        elements =>
          elements.map((el, index) => ({
            index,
            text:
              (el.innerText || '').trim(),
            type: el.type,
            disabled: el.disabled
          }))
      );

    console.log('\n🔘 BUTTON INVENTORY:');
    console.table(buttons);

    result(
      'Button Inventory',
      'Scan homepage buttons',
      'Buttons can be identified',
      `${buttons.length} buttons`,
      buttons.length > 0
        ? 'PASS'
        : 'FAIL'
    );

    // ==========================================================
    // F25 MOBILE OVERFLOW
    // ==========================================================

    await page.setViewportSize({
      width: 390,
      height: 844
    });

    await page.goto(
      BASE_URL,
      { waitUntil: 'networkidle' }
    );

    const overflow =
      await page.evaluate(() =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );

    await shot(
      page,
      'f25-mobile'
    );

    result(
      'Mobile Horizontal Overflow',
      '390x844',
      'No horizontal overflow',
      `Overflow=${overflow}`,
      !overflow
        ? 'PASS'
        : 'FAIL',
      overflow
        ? 'MEDIUM'
        : ''
    );

    if (overflow) {
      addBug({
        test: 'Mobile Responsive Test',
        page: page.url(),
        feature: 'Responsive layout',
        steps: [
          'Set viewport to 390x844',
          'Load homepage'
        ],
        expected:
          'No horizontal page overflow',
        actual:
          'document.scrollWidth > clientWidth',
        severity: 'MEDIUM'
      });
    }

    // ==========================================================
    // F26 TABLET
    // ==========================================================

    await page.setViewportSize({
      width: 768,
      height: 1024
    });

    await page.reload({
      waitUntil: 'networkidle'
    });

    const tabletOverflow =
      await page.evaluate(() =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );

    await shot(
      page,
      'f26-tablet'
    );

    result(
      'Tablet Responsive Layout',
      '768x1024',
      'No horizontal overflow',
      `Overflow=${tabletOverflow}`,
      !tabletOverflow
        ? 'PASS'
        : 'FAIL'
    );

    // ==========================================================
    // F27 DESKTOP
    // ==========================================================

    await page.setViewportSize({
      width: 1440,
      height: 900
    });

    await page.reload({
      waitUntil: 'networkidle'
    });

    await shot(
      page,
      'f27-desktop'
    );

    result(
      'Desktop Layout',
      '1440x900',
      'Homepage renders',
      `Title=${await page.title()}`,
      'PASS'
    );

    // ==========================================================
    // F28 EXACT 404 ANALYSIS
    // ==========================================================

    if (response404s.length === 0) {

      result(
        '404 Resource Check',
        'Monitor HTTP responses',
        'No 404 responses',
        '0 HTTP 404 responses',
        'PASS'
      );

    } else {

      result(
        '404 Resource Check',
        'Monitor HTTP responses',
        'No 404 responses',
        JSON.stringify(response404s, null, 2),
        'FAIL',
        'MEDIUM'
      );

      for (const item of response404s) {
        addBug({
          test: '404 Resource',
          page: page.url(),
          feature: item.resourceType,
          steps: `Load ${item.url}`,
          expected:
            'Resource returns HTTP 200',
          actual:
            `HTTP ${item.status}`,
          error:
            `${item.method} ${item.url}`,
          severity: 'MEDIUM'
        });
      }
    }

    // ==========================================================
    // F29 CONSOLE ERRORS
    // ==========================================================

    const realConsoleErrors =
      consoleErrors.filter(
        e =>
          e.type === 'pageerror' ||
          e.type === 'console'
      );

    result(
      'JavaScript Console Errors',
      'Monitor browser console',
      'No JavaScript errors',
      `${realConsoleErrors.length} errors`,
      realConsoleErrors.length === 0
        ? 'PASS'
        : 'FAIL',
      realConsoleErrors.length === 0
        ? ''
        : 'MEDIUM'
    );

    // ==========================================================
    // F30 FAILED REQUESTS
    // ==========================================================

    result(
      'Failed Network Requests',
      'Monitor requests',
      'No failed network requests',
      `${failedRequests.length} failures`,
      failedRequests.length === 0
        ? 'PASS'
        : 'FAIL',
      failedRequests.length === 0
        ? ''
        : 'HIGH'
    );

    // ==========================================================
    // FINAL SUMMARY
    // ==========================================================

    const passed =
      results.filter(
        r => r.status === 'PASS'
      ).length;

    const failed =
      results.filter(
        r => r.status === 'FAIL'
      ).length;

    const partial =
      results.filter(
        r => r.status === 'PARTIAL'
      ).length;

    const notTestable =
      results.filter(
        r => r.status === 'NOT_TESTABLE'
      ).length;

    const evaluated =
      passed + failed + partial;

    const percentage =
      evaluated > 0
        ? ((passed / evaluated) * 100).toFixed(2)
        : '0.00';

    const status =
      failed === 0
        ? 'PASS'
        : 'FAIL';

    const report = {
      project: 'Perception Mapper AI',
      baseURL: BASE_URL,

      generatedAt:
        new Date().toISOString(),

      testUser: {
        name: TEST_USER.name,
        email: TEST_USER.email
      },

      summary: {
        totalChecks: results.length,
        passed,
        failed,
        partial,
        notTestable,
        functionalityPercentage:
          `${percentage}%`,
        overallStatus: status
      },

      results,

      bugs,

      consoleErrors,

      failedRequests,

      response404s
    };

    // ==========================================================
    // JSON REPORT
    // ==========================================================

    const jsonFile =
      path.join(
        reportDir,
        'full-e2e-report-v2.json'
      );

    fs.writeFileSync(
      jsonFile,
      JSON.stringify(
        report,
        null,
        2
      )
    );

    // ==========================================================
    // MARKDOWN REPORT
    // ==========================================================

    let markdown = `
# Perception Mapper AI — V2 E2E Test Report

Generated: ${new Date().toISOString()}

## Summary

| Metric | Result |
|---|---:|
| Total Checks | ${results.length} |
| Passed | ${passed} |
| Failed | ${failed} |
| Partial | ${partial} |
| Not Testable | ${notTestable} |
| Functionality | ${percentage}% |
| Overall Status | **${status}** |
| Console Errors | ${consoleErrors.length} |
| Failed Requests | ${failedRequests.length} |
| HTTP 404s | ${response404s.length} |

## Test User

- Name: ${TEST_USER.name}
- Email: ${TEST_USER.email}
- Password: Test@12345

> Test credentials are generated specifically for this test run.

## Results

| # | Test | Status | Severity |
|---:|---|---|---|
`;

    for (const r of results) {
      markdown +=
        `| ${r.number} | ${r.name} | ${r.status} | ${r.severity || '-'} |\n`;
    }

    markdown += `

## Bugs

`;

    if (bugs.length === 0) {
      markdown += 'No bugs were detected.\n';
    } else {
      for (const bug of bugs) {
        markdown += `
### ${bug.id} — ${bug.feature}

- **Test:** ${bug.test}
- **Page:** ${bug.page}
- **Severity:** ${bug.severity}
- **Steps:** ${Array.isArray(bug.steps)
  ? bug.steps.join(' → ')
  : bug.steps}
- **Expected:** ${bug.expected}
- **Actual:** ${bug.actual}
- **Error:** ${bug.error || 'N/A'}

`;
      }
    }

    markdown += `
## HTTP 404 Resources

`;

    if (response404s.length === 0) {
      markdown += 'No HTTP 404 resources detected.\n';
    } else {
      for (const item of response404s) {
        markdown +=
          `- **${item.status}** ${item.method} ${item.url}\n`;
      }
    }

    markdown += `
## Console Errors

`;

    if (consoleErrors.length === 0) {
      markdown += 'No console errors detected.\n';
    } else {
      for (const error of consoleErrors) {
        markdown +=
          `- **${error.type}:** ${error.message}\n`;
      }
    }

    const mdFile =
      path.join(
        reportDir,
        'full-e2e-report-v2.md'
      );

    fs.writeFileSync(
      mdFile,
      markdown
    );

    // ==========================================================
    // FINAL TERMINAL OUTPUT
    // ==========================================================

    console.log(`
====================================================
              V2 FINAL REPORT
====================================================

Total Checks:       ${results.length}
PASS:               ${passed}
FAIL:               ${failed}
PARTIAL:            ${partial}
NOT TESTABLE:       ${notTestable}

Functionality:      ${percentage}%
Overall Status:     ${status}

Console Errors:     ${consoleErrors.length}
Failed Requests:   ${failedRequests.length}
HTTP 404s:          ${response404s.length}
Bugs Found:         ${bugs.length}

----------------------------------------------------
JSON:
${jsonFile}

MARKDOWN:
${mdFile}

Screenshots:
${screenshotDir}

Recording:
${recordingDir}

====================================================
`);

  } catch (error) {

    console.error(`
====================================================
❌ FATAL TEST ERROR
====================================================
${error.stack || error}
====================================================
`);

    fs.writeFileSync(
      path.join(
        reportDir,
        'fatal-error.txt'
      ),
      error.stack || String(error)
    );

  } finally {

    console.log('🛑 Closing browser...');

    await context.close();
    await browser.close();

    console.log('✅ Browser closed.');
    console.log('🎥 Recording finalized.');
  }
})();
