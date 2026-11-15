// Scroll-motion QA against the running local site. No browser packages required.
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import net from 'node:net';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message, state) => { if (!condition) throw new Error(`${message}: ${JSON.stringify(state)}`); };
const timeout = setTimeout(() => { console.error('Browser check exceeded 60 seconds'); process.exitCode = 1; chrome?.kill(); socket?.close(); }, 60000);
const profile = await mkdtemp(join(tmpdir(), 'ism-motion-check-'));
const port = await new Promise((resolve, reject) => {
  const server = net.createServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => { const address = server.address(); server.close(() => resolve(address.port)); });
});
const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--remote-allow-origins=*',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });
let socket;
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
  const navigate = async () => {
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    for (let attempt = 0; attempt < 60; attempt++) {
      if (await evaluate('document.readyState === "complete" && !!document.querySelector(".company-site")')) break;
      await delay(100);
    }
    await evaluate('document.fonts.ready');
    await delay(1500);
  };
  const scroll = async (y) => { await evaluate(`window.scrollTo({ top: ${Math.round(y)}, behavior: 'instant' })`); await delay(1150); };
  const screenshot = async (name) => {
    const data = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const path = join(tmpdir(), `ism-motion-${name}.png`);
    await writeFile(path, Buffer.from(data.data, 'base64'));
    screenshots[name] = path;
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate();
  const heroStart = await evaluate(`({ frame: getComputedStyle(document.querySelector('.visual-frame')).transform, stamp: getComputedStyle(document.querySelector('.visual-stamp')).transform, progress: getComputedStyle(document.querySelector('.scroll-progress-fill')).transform })`);
  await screenshot('desktop-top');
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 600, deltaX: 0, deltaY: 220 });
  await delay(1150);
  const wheelY = await evaluate('scrollY');
  assert(wheelY > 100, 'Desktop mouse-wheel scrolling did not move the page', wheelY);
  await scroll(430);
  const heroScrolled = await evaluate(`({ y: scrollY, frame: getComputedStyle(document.querySelector('.visual-frame')).transform, stamp: getComputedStyle(document.querySelector('.visual-stamp')).transform, progress: getComputedStyle(document.querySelector('.scroll-progress-fill')).transform, headerY: document.querySelector('.site-header').getBoundingClientRect().top })`);
  assert(heroStart.frame !== heroScrolled.frame && heroStart.stamp !== heroScrolled.stamp, 'Hero parallax and stamp did not change', { heroStart, heroScrolled });
  assert(heroStart.progress !== heroScrolled.progress, 'Scroll progress did not advance', { heroStart, heroScrolled });
  assert(heroScrolled.headerY < -30, 'Header did not hide on downward scroll', heroScrolled);
  await screenshot('desktop-scroll');
  await scroll(260);
  const headerUp = await evaluate(`document.querySelector('.site-header').getBoundingClientRect().top`);
  assert(headerUp > -2, 'Header did not return on upward scroll', headerUp);
  const aboutY = await evaluate(`document.querySelector('#about').getBoundingClientRect().top + scrollY - 150`);
  await scroll(aboutY);
  const about = await evaluate(`({ opacity: getComputedStyle(document.querySelector('#about h2')).opacity, width: document.documentElement.scrollWidth, viewport: innerWidth })`);
  assert(Number(about.opacity) > .99 && about.width <= about.viewport, 'About reveal or desktop overflow failed', about);

  const storyBounds = await evaluate(`(() => { const section = document.querySelector('.scroll-story'); return section ? { top: section.getBoundingClientRect().top + scrollY, height: section.offsetHeight, viewport: innerHeight, ready: section.classList.contains('story-motion-ready') } : null; })()`);
  const storyStates = [];
  let reverseStory;
  if (storyBounds) {
    assert(storyBounds.ready, 'Desktop story motion did not initialise', storyBounds);
    for (const progress of [.1, .5, .9]) {
      await scroll(storyBounds.top + (storyBounds.height - storyBounds.viewport) * progress);
      storyStates.push(await evaluate(`({ step: document.querySelector('.scroll-story').dataset.storyStep, panelOpacities: Array.from(document.querySelectorAll('.story-chapter'), item => Number(getComputedStyle(item).opacity)), copyOpacities: Array.from(document.querySelectorAll('.story-chapter'), item => Number(getComputedStyle(item).opacity) * Number(getComputedStyle(item.querySelector('.story-copy')).opacity)), artOpacities: Array.from(document.querySelectorAll('.story-chapter'), item => Number(getComputedStyle(item).opacity) * Number(getComputedStyle(item.querySelector('.story-art')).opacity)), pinTop: document.querySelector('.scroll-story-pin').getBoundingClientRect().top })`));
      await screenshot(`story-${Math.round(progress * 100)}`);
    }
    assert(storyStates[0].step === '0' && storyStates[2].step === '2', 'Story chapters did not advance', storyStates);
    assert(storyStates.every((state) => state.panelOpacities.some((opacity) => opacity > .8)), 'A story position had no readable chapter', storyStates);
    assert(storyStates.every((state) => Math.max(...state.copyOpacities) > .55 && Math.max(...state.artOpacities) > .55), 'A story position had invisible copy or artwork', storyStates);
    assert(storyStates.every((state) => Number(state.step) === state.copyOpacities.indexOf(Math.max(...state.copyOpacities))), 'Story index did not match the visible chapter', storyStates);
    assert(storyStates.every((state) => Math.abs(state.pinTop) < 2), 'Story scene did not stay pinned at the viewport top', storyStates);
    await scroll(storyBounds.top + (storyBounds.height - storyBounds.viewport) * .1);
    reverseStory = await evaluate(`({ step: document.querySelector('.scroll-story').dataset.storyStep, panel: getComputedStyle(document.querySelector('.story-chapter')).opacity, copy: getComputedStyle(document.querySelector('.story-copy')).opacity, art: getComputedStyle(document.querySelector('.story-art')).opacity })`);
    assert(reverseStory.step === '0' && Number(reverseStory.panel) > .99 && Number(reverseStory.copy) > .99 && Number(reverseStory.art) > .99, 'Reverse scrolling did not restore the first story chapter', reverseStory);
    await scroll(storyBounds.top + storyBounds.height - 100);
    const storyExit = await evaluate(`({ workVisible: document.querySelector('#work').getBoundingClientRect().top < innerHeight, workOpacity: getComputedStyle(document.querySelector('#work h2')).opacity })`);
    assert(storyExit.workVisible && Number(storyExit.workOpacity) > .99, 'Story did not hand off to the portfolio', storyExit);
  }

  await evaluate(`document.querySelector('.project-card').click()`);
  await delay(200);
  const desktopModalBefore = await evaluate(`({ y: scrollY, stopped: document.documentElement.classList.contains('lenis-stopped'), locked: document.body.style.overflow === 'hidden' })`);
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 50, y: 600, deltaX: 0, deltaY: 180 });
  await delay(350);
  const desktopModalAfter = await evaluate('scrollY');
  assert(desktopModalBefore.stopped && desktopModalBefore.locked && Math.abs(desktopModalAfter - desktopModalBefore.y) < 2, 'Gallery did not stop background smooth scrolling', { desktopModalBefore, desktopModalAfter });
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await delay(200);
  const desktopResumeBefore = await evaluate('scrollY');
  await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 600, deltaX: 0, deltaY: 180 });
  await delay(1150);
  const desktopResume = await evaluate(`({ y: scrollY, stopped: document.documentElement.classList.contains('lenis-stopped'), locked: document.body.style.overflow === 'hidden' })`);
  assert(!desktopResume.stopped && !desktopResume.locked && desktopResume.y > desktopResumeBefore + 80, 'Smooth scrolling did not resume after closing the gallery', { desktopResumeBefore, desktopResume });

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await navigate();
  const mobile = await evaluate(`({ viewport: innerWidth, width: document.documentElement.scrollWidth, menuVisible: getComputedStyle(document.querySelector('.menu-toggle')).display !== 'none', storyReady: document.querySelector('.scroll-story')?.classList.contains('story-motion-ready') || false, chapterOpacities: Array.from(document.querySelectorAll('.story-chapter'), item => getComputedStyle(item).opacity) })`);
  assert(mobile.viewport === 390 && mobile.width <= 390 && mobile.menuVisible, 'Mobile layout failed', mobile);
  assert(!mobile.storyReady && mobile.chapterOpacities.every((opacity) => Number(opacity) > .99), 'Mobile should have native sequential story content', mobile);
  await screenshot('mobile-top');
  await evaluate(`document.querySelector('.menu-toggle').click()`);
  await delay(100);
  const menu = await evaluate(`({ open: document.querySelector('.menu-toggle').getAttribute('aria-expanded'), links: document.querySelectorAll('#mobile-navigation a').length })`);
  assert(menu.open === 'true' && menu.links === 6, 'Mobile menu failed', menu);
  await evaluate(`document.querySelector('#mobile-navigation a[href="#work"]').click()`);
  await delay(150);
  await evaluate(`document.querySelector('.project-card').click()`);
  await delay(200);
  const gallery = await evaluate(`({ open: !!document.querySelector('[role=dialog]'), locked: document.body.style.overflow === 'hidden', images: document.querySelectorAll('.modal-gallery img').length })`);
  assert(gallery.open && gallery.locked && gallery.images === 3, 'Mobile gallery failed', gallery);
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await delay(100);
  assert(await evaluate(`!document.querySelector('[role=dialog]') && document.body.style.overflow !== 'hidden'`), 'Gallery Escape/scroll restore failed');

  await send('Emulation.setDeviceMetricsOverride', { width: 1024, height: 600, deviceScaleFactor: 1, mobile: false });
  await navigate();
  const landscape = await evaluate(`({ storyReady: document.querySelector('.scroll-story')?.classList.contains('story-motion-ready') || false, chapterPositions: Array.from(document.querySelectorAll('.story-chapter'), item => getComputedStyle(item).position), width: document.documentElement.scrollWidth, viewport: innerWidth })`);
  assert(!landscape.storyReady && landscape.chapterPositions.every((position) => position !== 'absolute') && landscape.width <= landscape.viewport, 'Short landscape viewport should use sequential story content', landscape);

  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await navigate();
  const reduced = await evaluate(`({ reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, hiddenContent: Array.from(document.querySelectorAll('.hero-letter, .section-pad h2, .project-card, .story-chapter')).filter(item => Number(getComputedStyle(item).opacity) < .99).length, storyReady: document.querySelector('.scroll-story')?.classList.contains('story-motion-ready') || false, lenis: document.documentElement.classList.contains('lenis'), width: document.documentElement.scrollWidth, viewport: innerWidth })`);
  assert(reduced.reduced && reduced.hiddenContent === 0 && !reduced.storyReady && !reduced.lenis && reduced.width <= reduced.viewport, 'Reduced-motion fallback failed', reduced);
  await screenshot('reduced-motion');
  assert(runtimeErrors.length === 0, 'Browser runtime errors detected', runtimeErrors);
  console.log(JSON.stringify({ heroStart, wheelY, heroScrolled, headerUp, about, storyBounds, storyStates, reverseStory, desktopModalBefore, desktopResume, mobile, menu, gallery, landscape, reduced, runtimeErrors, screenshots }, null, 2));
} finally {
  clearTimeout(timeout);
  socket?.close();
  chrome.kill();
}
