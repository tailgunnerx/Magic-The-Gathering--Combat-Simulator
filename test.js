import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('PAGE LOG ERROR:', msg.text());
        } else {
            console.log('PAGE LOG:', msg.text());
        }
    });

    page.on('pageerror', error => {
        console.log('PAGE ERROR:', error.message);
    });

    // Catch unhandled rejections on the page
    page.on('requestfailed', request => {
        console.log('REQUEST FAILED:', request.url(), request.failure().errorText);
    });

    console.log('Navigating to app...');
    await page.goto('http://localhost:5005');

    // Wait for the New Battle button
    const newBattleSelector = 'button:has-text("New Battle")';
    await page.waitForFunction(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        return buttons.some(b => b.textContent && b.textContent.includes('New Battle'));
    });
    console.log('Clicking New Battle');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const newBattleBtn = buttons.find(b => b.textContent && b.textContent.includes('New Battle'));
        if (newBattleBtn) newBattleBtn.click();
    });

    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

    console.log('Clicking Quiz Mode: OFF to toggle it ON');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const quizBtn = buttons.find(b => b.textContent && b.textContent.includes('Quiz Mode: OFF'));
        if (quizBtn) quizBtn.click();
    });

    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

    console.log('Clicking an attacker');
    // Find absolute positioned card? or attacking button?
    // We just find a card on player 2's side? 
    // Usually clicking the first card on the screen!
    await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div[class*="rounded-[18px]"]'));
        if (cards.length > 0) cards[0].click();
    });

    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

    console.log('Clicking Confirm Combat');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const confirmBtn = buttons.find(b => b.textContent && b.textContent.includes('Confirm Combat'));
        if (confirmBtn) confirmBtn.click();
    });

    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

    console.log('Clicking Move to Blocks');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find(b => b.textContent && b.textContent.includes('Move to Blocks'));
        if (btn) btn.click();
    });

    await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

    console.log('Waiting for Quiz Modal to appear');
    await page.waitForFunction(() => {
        return !!document.body.textContent && document.body.textContent.includes('COMBAT SURVIVAL QUIZ');
    });

    console.log('Quiz Model visible! Filling out guesses.');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const survivesBtns = buttons.filter(b => b.textContent === 'Survives');
        survivesBtns.forEach(btn => btn.click());
    });

    console.log('Clicking SUBMIT PREDICTIONS');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const submitBtn = buttons.find(b => b.textContent && b.textContent.includes('SUBMIT PREDICTIONS'));
        if (submitBtn) submitBtn.click();
    });

    await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));

    console.log('Script end! Closing browser.');
    await browser.close();
})();
