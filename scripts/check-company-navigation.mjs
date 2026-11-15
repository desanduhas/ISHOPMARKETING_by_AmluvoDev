// Company hero and floating navigation QA with the installed Chrome.
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import net from 'node:net';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message, state) => { if (!condition) throw new Error(`${message}: ${JSON.stringify(state)}`); };
let socket;
let chrome;
const timeout = setTimeout(() => { console.error('Company navigation QA exceeded 60 seconds'); process.exitCode = 1; socket?.close(); chrome?.kill(); }, 60000);
const profile = await mkdtemp(join(tmpdir(), 'ism-company-nav-check-'));
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
    } catch { /* Chrome is starting. */ }
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
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: name, code: name, modifiers, windowsVirtualKeyCode: name === 'Enter' ? 13 : name === 'Escape' ? 27 : name === 'Tab' ? 9 : undefined });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: name, code: name, modifiers });
    await delay(100);
  };
  const viewport = (width, height, mobile) => send('Emulation.setDeviceMetricsOverride', { width, height, mobile, deviceScaleFactor: 1 });
  const navigate = async () => {
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    for (let attempt = 0; attempt < 60; attempt++) {
      if (await evaluate('document.readyState === "complete" && !!document.querySelector(".company-site")')) break;
      await delay(100);
    }
    await evaluate('document.fonts.ready');
    await delay(1800);
  };
  const scroll = async (y) => { await evaluate(`window.scrollTo({ top: ${Math.round(y)}, behavior: 'instant' })`); await delay(1100); };
  const screenshot = async (name) => {
    const data = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const path = join(tmpdir(), `ism-company-nav-${name}.png`);
    await writeFile(path, Buffer.from(data.data, 'base64'));
    screenshots[name] = path;
  };
  const navState = () => evaluate(`(() => {
    const nav = document.querySelector('.floating-nav');
    if (!nav) return { exists: false, visible: false };
    const style = getComputedStyle(nav), rect = nav.getBoundingClientRect();
    return { exists: true, visible: nav.getAttribute('aria-hidden') !== 'true' && style.visibility !== 'hidden' && Number(style.opacity) > .99,
      ariaLabel: nav.getAttribute('aria-label'), ariaHidden: nav.getAttribute('aria-hidden'), inert: nav.inert,
      links: Array.from(nav.querySelectorAll('a'), link => ({ href: link.getAttribute('href'), name: link.getAttribute('aria-label') || link.textContent.trim(), current: link.getAttribute('aria-current'), tabIndex: link.tabIndex, targetExists: !!document.querySelector(link.getAttribute('href')) })),
      active: nav.querySelector('[aria-current="location"]')?.getAttribute('href'), left: rect.left, right: rect.right, bottom: rect.bottom,
      width: innerWidth, height: innerHeight, pageWidth: document.documentElement.scrollWidth };
  })()`);
  const assertFits = (state, label) => assert(state.visible && state.left >= 0 && state.right <= state.width + 1 && state.bottom <= state.height + 1 && state.pageWidth <= state.width, label, state);
  await send('Page.enable');
  await send('Runtime.enable');
  await viewport(1440, 1000, false);
  await navigate();
  const hero = await evaluate(`({ title: document.querySelector('.hero h1').getAttribute('aria-label') || document.querySelector('.hero h1').innerText, copy: document.querySelector('.hero-copy').innerText, clientImages: Array.from(document.querySelectorAll('.hero img'), image => image.getAttribute('src')).filter(source => source.includes('/res/projects/')) })`);
  assert(/Big ambition/i.test(hero.title) && /I\s*Shop\s*Marketing/i.test(hero.copy) && hero.clientImages.length === 3, 'Hero should lead with the agency message and verified client work', hero);
  const top = await navState();
  assert(!top.visible && (!top.exists || top.inert || top.links.every((link) => link.tabIndex < 0)), 'Floating navigation should stay hidden and unfocusable at the top', top);
  await screenshot('desktop-hero');
  await scroll(430);
  const desktop = await navState();
  assertFits(desktop, 'Desktop floating navigation overflow or visibility');
  assert(desktop.ariaLabel && desktop.links.length === 9 && desktop.links.every((link) => link.name && link.targetExists && link.tabIndex >= 0), 'Floating navigation needs nine accessible working links', desktop);
  await screenshot('desktop-dock');

  await evaluate(`document.querySelector('.floating-nav a[href="#about"]').click()`);
  await delay(1500);
  const about = await evaluate(`({ top: document.querySelector('#about').getBoundingClientRect().top, active: document.querySelector('.floating-nav [aria-current="location"]')?.getAttribute('href') })`);
  assert(about.top > -10 && about.top <= 200 && about.active === '#about', 'About link/active state failed', about);
  await evaluate(`document.querySelector('.floating-nav a[href="#services"]').focus()`);
  await key('Enter');
  await delay(1500);
  const keyboard = await evaluate(`({ top: document.querySelector('#services').getBoundingClientRect().top, active: document.querySelector('.floating-nav [aria-current="location"]')?.getAttribute('href'), focused: document.activeElement?.getAttribute('href') })`);
  assert(keyboard.top > -10 && keyboard.top <= 200 && keyboard.active === '#services', 'Keyboard navigation failed', keyboard);
  await evaluate(`document.querySelector('.project-card').click()`);
  await delay(350);
  const overlay = await navState();
  assert(!overlay.visible && overlay.inert, 'Floating navigation must hide during a gallery overlay', overlay);
  await key('Escape');
  await delay(350);
  assert((await navState()).visible, 'Floating navigation should return after closing a gallery');

  const mobiles = [];
  for (const width of [390, 320]) {
    await viewport(width, 844, true);
    await navigate();
    assert(!(await navState()).visible, 'Mobile floating navigation should start hidden', width);
    await scroll(500);
    const mobile = await navState();
    assertFits(mobile, `Floating navigation does not fit ${width}px mobile`);
    assert(mobile.links.length === 9 && mobile.links.every((link) => link.name && link.targetExists), 'Mobile links are inaccessible', mobile);
    mobiles.push(mobile);
    await screenshot(`mobile-${width}`);
    await evaluate(`document.querySelector('.menu-toggle').click()`);
    await delay(300);
    const menuHidden = await navState();
    assert(!menuHidden.visible && menuHidden.inert, 'Floating navigation should hide while the mobile menu is open', { width, menuHidden });
    await evaluate(`document.querySelector('.menu-toggle').click()`);
    await delay(300);
    assert((await navState()).visible, 'Floating navigation should return after closing mobile menu', width);
  }
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await viewport(1440, 1000, false);
  await navigate();
  await scroll(430);
  const reduced = await evaluate(`(() => { const nav = document.querySelector('.floating-nav'); const style = getComputedStyle(nav); return { matches: matchMedia('(prefers-reduced-motion: reduce)').matches, animationName: style.animationName, transitionDuration: style.transitionDuration, animations: nav.getAnimations({ subtree: true }).map(animation => animation.effect.getComputedTiming().duration) }; })()`);
  assert(reduced.matches && reduced.animations.every((duration) => duration <= 1) && reduced.transitionDuration.split(',').every((value) => parseFloat(value) <= .001), 'Reduced-motion floating navigation should be static', reduced);
  assert(runtimeErrors.length === 0, 'Runtime exceptions detected', runtimeErrors);
  console.log(JSON.stringify({ hero, top, desktop, about, keyboard, overlay, mobiles, reduced, runtimeErrors, screenshots }, null, 2));
} finally {
  clearTimeout(timeout);
  socket?.close();
  chrome.kill();
}
