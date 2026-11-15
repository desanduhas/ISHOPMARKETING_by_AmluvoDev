// Focused gallery browser QA using the installed Chrome and the local dev server.
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import net from 'node:net';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message, state) => { if (!condition) throw new Error(`${message}: ${JSON.stringify(state)}`); };
let socket;
let chrome;
const timeout = setTimeout(() => { console.error('Gallery QA exceeded 60 seconds'); process.exitCode = 1; socket?.close(); chrome?.kill(); }, 60000);
const profile = await mkdtemp(join(tmpdir(), 'ism-gallery-check-'));
const port = await new Promise((resolve, reject) => {
  const server = net.createServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => { const address = server.address(); server.close(() => resolve(address.port)); });
});
chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--remote-allow-origins=*',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
const screenshots = {};
try {
  let target;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('http://localhost:5173/')}`, { method: 'PUT', signal: AbortSignal.timeout(2000) });
      if (response.ok) { target = await response.json(); break; }
    } catch { /* Chrome is still starting. */ }
    await delay(150);
  }
  assert(target, 'Chrome did not start');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  const pending = new Map();
  const runtimeErrors = [];
  let id = 0;
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === 'Runtime.exceptionThrown') runtimeErrors.push(message.params.exceptionDetails);
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    clearTimeout(request.timer);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message)); else request.resolve(message.result);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`CDP timed out: ${method}`)); }, 12000);
    pending.set(requestId, { resolve, reject, timer });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const key = async (name, modifiers = 0) => {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code: name, modifiers });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code: name, modifiers });
    await delay(80);
  };
  const viewport = (width, height, mobile) => send('Emulation.setDeviceMetricsOverride', { width, height, mobile, deviceScaleFactor: 1 });
  const navigate = async () => {
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    for (let attempt = 0; attempt < 60; attempt++) {
      if (await evaluate('document.readyState === "complete" && !!document.querySelector(".project-card")')) break;
      await delay(100);
    }
    await evaluate('document.fonts.ready');
    await delay(1700);
  };
  const screenshot = async (name) => {
    const data = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const path = join(tmpdir(), `ism-gallery-${name}.png`);
    await writeFile(path, Buffer.from(data.data, 'base64'));
    screenshots[name] = path;
  };
  const loaded = async () => {
    for (let attempt = 0; attempt < 60; attempt++) {
      if (await evaluate(`!!document.querySelector('.viewer-image')?.complete && document.querySelector('.viewer-image').naturalWidth > 0`)) break;
      await delay(100);
    }
    await delay(450);
  };
  const open = async (title) => {
    const index = await evaluate(`Array.from(document.querySelectorAll('.project-card')).findIndex(card => card.querySelector('h3').textContent === ${JSON.stringify(title)})`);
    assert(index >= 0, 'Requested project card not found', title);
    await evaluate(`window.__galleryTrigger = document.querySelectorAll('.project-card')[${index}]; window.scrollTo({ top: window.__galleryTrigger.getBoundingClientRect().top + scrollY - 130, behavior: 'instant' })`);
    await delay(1000);
    await evaluate('window.__galleryTrigger.click()');
    await loaded();
    const state = await evaluate(`({ index: ${index}, title: document.querySelector('#project-modal-title')?.textContent, naturalWidth: document.querySelector('.viewer-image')?.naturalWidth, focus: document.activeElement?.className })`);
    assert(state.title === title && state.naturalWidth > 0 && state.focus.includes('viewer-close'), 'Gallery did not open, load or focus correctly', state);
    return state;
  };
  const state = () => evaluate(`(() => { const image = document.querySelector('.viewer-image'); const dialog = document.querySelector('.gallery-modal'); const rect = dialog.getBoundingClientRect(); return { source: image.getAttribute('src'), naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, count: document.querySelector('.viewer-count').innerText, selected: Array.from(document.querySelectorAll('.viewer-thumbnail')).findIndex(item => item.getAttribute('aria-pressed') === 'true'), expanded: dialog.classList.contains('is-expanded'), dialogLeft: rect.left, dialogRight: rect.right, dialogTop: rect.top, dialogBottom: rect.bottom, dialogWidth: dialog.clientWidth, contentWidth: dialog.scrollWidth, viewport: innerWidth, pageWidth: document.documentElement.scrollWidth, objectFit: getComputedStyle(image).objectFit }; })()`);
  const click = async (selector) => { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); await loaded(); };
  await send('Page.enable');
  await send('Runtime.enable');
  await viewport(1440, 1000, false);
  await navigate();
  const desktopOpen = await open('BuyGenuine LK');
  assert(desktopOpen.index === 2, 'BuyGenuine should be the actual third portfolio card', desktopOpen);
  const desktopPrimary = await state();
  assert(desktopPrimary.source.endsWith('buygenuine-primary.png') && desktopPrimary.objectFit === 'contain', 'Primary artwork does not fit correctly', desktopPrimary);
  await screenshot('desktop-buygenuine-primary');
  const lock = await evaluate(`({ y: scrollY, body: document.body.style.overflow, stopped: document.documentElement.classList.contains('lenis-stopped') })`);
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 4, y: 500, deltaX: 0, deltaY: 180 });
  await delay(250);
  assert(lock.body === 'hidden' && lock.stopped && Math.abs(await evaluate('scrollY') - lock.y) < 2, 'Gallery background scroll is not locked', lock);
  await click('[aria-label="Next artwork"]');
  const desktopStacked = await state();
  assert(desktopStacked.source.endsWith('buygenuine-stacked.png') && desktopStacked.selected === 1, 'Next control failed', desktopStacked);
  await screenshot('desktop-buygenuine-stacked');
  await click('[aria-label="Previous artwork"]');
  assert((await state()).selected === 0, 'Previous control failed');
  await click('.viewer-thumbnail:nth-child(2)');
  assert((await state()).selected === 1, 'Thumbnail selection failed');
  await key('ArrowLeft');
  assert((await state()).selected === 0, 'Left arrow key failed');
  await key('ArrowRight');
  assert((await state()).selected === 1, 'Right arrow key failed');
  await key('ArrowLeft');
  await key('ArrowLeft');
  assert((await state()).selected === 3, 'Left arrow key wraparound failed');
  await key('ArrowRight');
  assert((await state()).selected === 0, 'Arrow key wraparound failed');
  await evaluate(`document.querySelector('.viewer-close').focus()`);
  await key('Tab', 8);
  const backwardsTrap = await evaluate(`(() => { const controls = [...document.querySelector('.gallery-modal').querySelectorAll('a[href],button:not([disabled])')].filter(item => item.getClientRects().length); return document.activeElement === controls[controls.length - 1]; })()`);
  // CDP modifier 8 is Shift; 1 is Alt.
  assert(backwardsTrap, 'Shift-Tab did not wrap to the last dialog control');
  await key('Tab');
  assert(await evaluate(`document.activeElement === document.querySelector('.viewer-close')`), 'Tab did not wrap back to the first dialog control');
  await click('.viewer-zoom');
  assert((await state()).expanded, 'Enlarge control failed');
  await screenshot('desktop-expanded');
  await key('Escape');
  assert(await evaluate(`!!document.querySelector('[role=dialog]') && !document.querySelector('.gallery-modal').classList.contains('is-expanded')`), 'First Escape should collapse the enlarged artwork');
  await key('Escape');
  const close = await evaluate(`({ closed: !document.querySelector('[role=dialog]'), returnedFocus: document.activeElement === window.__galleryTrigger, locked: document.body.style.overflow === 'hidden', stopped: document.documentElement.classList.contains('lenis-stopped') })`);
  assert(close.closed && close.returnedFocus && !close.locked && !close.stopped, 'Second Escape/focus restore/unlock failed', close);
  const resumeY = await evaluate('scrollY');
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 500, deltaX: 0, deltaY: 180 });
  await delay(1000);
  assert(await evaluate('scrollY') > resumeY + 60, 'Smooth scroll did not resume after closing');
  await open('DEVII Ayurvedic Products');
  const desktopPortrait = await state();
  assert(desktopPortrait.naturalHeight > desktopPortrait.naturalWidth && desktopPortrait.objectFit === 'contain', 'Portrait artwork fit failed', desktopPortrait);
  await screenshot('desktop-portrait');
  await key('Escape');

  await viewport(390, 844, true);
  await navigate();
  await open('BuyGenuine LK');
  const mobileLandscape = await state();
  assert(mobileLandscape.pageWidth <= 390 && mobileLandscape.contentWidth <= mobileLandscape.dialogWidth + 1 && mobileLandscape.dialogLeft >= 0 && mobileLandscape.dialogRight <= 391, 'Mobile landscape artwork overflow', mobileLandscape);
  await screenshot('mobile-buygenuine');
  await click('[aria-label="Next artwork"]');
  assert((await state()).selected === 1, 'Mobile next control failed');
  await key('Escape');
  await open('DEVII Ayurvedic Products');
  const mobilePortrait = await state();
  assert(mobilePortrait.pageWidth <= 390 && mobilePortrait.contentWidth <= mobilePortrait.dialogWidth + 1 && mobilePortrait.dialogLeft >= 0 && mobilePortrait.dialogRight <= 391, 'Mobile portrait artwork overflow', mobilePortrait);
  await screenshot('mobile-portrait');
  await click('.viewer-thumbnail:nth-child(2)');
  assert((await state()).selected === 1, 'Mobile thumbnail selection failed');
  const stage = await evaluate(`(() => { const rect = document.querySelector('.viewer-stage').getBoundingClientRect(); return { x: rect.left + rect.width * .75, y: rect.top + rect.height / 2, endX: rect.left + rect.width * .25 }; })()`);
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: stage.x, y: stage.y }] });
  await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: stage.endX, y: stage.y }] });
  await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await loaded();
  assert((await state()).selected === 2, 'Horizontal swipe did not advance the artwork');
  await key('Escape');
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await viewport(1440, 1000, false);
  await navigate();
  await open('DEVII Ayurvedic Products');
  const reduced = await evaluate(`({ matches: matchMedia('(prefers-reduced-motion: reduce)').matches, animationName: getComputedStyle(document.querySelector('.viewer-image')).animationName, animations: document.querySelector('.viewer-image').getAnimations().map(animation => animation.effect.getComputedTiming().duration), opacity: getComputedStyle(document.querySelector('.viewer-image')).opacity })`);
  assert(reduced.matches && reduced.animations.every((duration) => duration <= 1) && Number(reduced.opacity) > .99, 'Reduced-motion image entry should be static', reduced);
  await screenshot('reduced-motion');
  assert(runtimeErrors.length === 0, 'Runtime exceptions in browser', runtimeErrors);
  console.log(JSON.stringify({ desktopOpen, desktopPrimary, desktopStacked, close, desktopPortrait, mobileLandscape, mobilePortrait, reduced, runtimeErrors, screenshots }, null, 2));
} finally {
  clearTimeout(timeout);
  socket?.close();
  chrome.kill();
}
