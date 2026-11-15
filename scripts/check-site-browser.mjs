// Browser smoke check against the running local Vite server. Uses installed Chrome.
import { spawn } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import net from 'node:net';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const targetUrl = 'http://localhost:5173/';
const profile = await mkdtemp(join(tmpdir(), 'ism-browser-check-'));
const port = await new Promise((resolve, reject) => {
  const server = net.createServer();
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    server.close(() => resolve(address.port));
  });
});
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--remote-allow-origins=*',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let socket;
try {
  let target;
  for (let i = 0; i < 60; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(targetUrl)}`, { method: 'PUT' });
      if (response.ok) { target = await response.json(); break; }
    } catch { /* Browser may still be starting. */ }
    await delay(200);
  }
  if (!target) throw new Error('Chrome debugging endpoint did not start');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  const pending = new Map();
  let id = 0;
  socket.onmessage = ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await send('Page.navigate', { url: targetUrl });
  for (let i = 0; i < 50; i++) {
    if (await evaluate('document.readyState === "complete" && !!document.querySelector(".company-site")')) break;
    await delay(200);
  }
  await evaluate('document.fonts.ready');
  const mobile = await evaluate(`(() => {
    const menu = document.querySelector('.menu-toggle');
    return { viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
      menuVisible: getComputedStyle(menu).display !== 'none', title: document.querySelector('h1').innerText };
  })()`);
  if (mobile.viewport !== 390 || mobile.documentWidth > 390 || !mobile.menuVisible) throw new Error(`Mobile layout: ${JSON.stringify(mobile)}`);
  const mobileImage = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const mobilePath = join(tmpdir(), 'ism-codex-mobile-emulated.png');
  await writeFile(mobilePath, Buffer.from(mobileImage.data, 'base64'));

  const menu = await evaluate(`(() => {
    document.querySelector('.menu-toggle').click();
    return { expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'),
      links: document.querySelectorAll('#mobile-navigation a').length };
  })()`);
  await delay(100);
  const menuAfter = await evaluate(`({ expanded: document.querySelector('.menu-toggle').getAttribute('aria-expanded'), links: document.querySelectorAll('#mobile-navigation a').length })`);
  if (menuAfter.expanded !== 'true' || menuAfter.links !== 6) throw new Error(`Mobile menu: ${JSON.stringify({ menu, menuAfter })}`);
  await evaluate(`document.querySelector('#mobile-navigation a[href="#work"]').click()`);
  await delay(100);

  await evaluate(`Array.from(document.querySelectorAll('.filter')).find(button => button.textContent === 'Branding').click()`);
  await delay(100);
  const filter = await evaluate(`({ count: document.querySelectorAll('.project-card').length, active: document.querySelector('.filter.active').textContent })`);
  if (filter.count !== 2 || filter.active !== 'Branding') throw new Error(`Portfolio filter: ${JSON.stringify(filter)}`);
  await evaluate(`document.querySelector('.project-card').click()`);
  await delay(100);
  const gallery = await evaluate(`({ title: document.querySelector('[role=dialog] h2')?.textContent,
    images: Array.from(document.querySelectorAll('.modal-gallery img'), image => image.getAttribute('src')),
    scrollLocked: document.body.style.overflow === 'hidden' })`);
  if (gallery.images.length !== 3 || gallery.images.some((url) => !url.startsWith('/res/projects/')) || !gallery.scrollLocked) throw new Error(`Gallery: ${JSON.stringify(gallery)}`);
  const modalImage = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const modalPath = join(tmpdir(), 'ism-codex-gallery-emulated.png');
  await writeFile(modalPath, Buffer.from(modalImage.data, 'base64'));
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await delay(100);
  const closed = await evaluate(`!document.querySelector('[role=dialog]') && document.body.style.overflow !== 'hidden'`);
  if (!closed) throw new Error('Escape did not close the gallery or restore scrolling');
  await evaluate(`document.querySelector('#service-tab-2').click()`);
  await delay(100);
  const service = await evaluate(`document.querySelector('[role=tabpanel] h3').textContent`);
  if (service !== 'Brand & design') throw new Error(`Service tabs: ${service}`);

  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: targetUrl });
  await delay(500);
  const desktop = await evaluate(`({ viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
    projectCount: document.querySelectorAll('.project-card').length,
    brokenImages: Array.from(document.images).filter(image => image.complete && image.naturalWidth === 0).map(image => image.src) })`);
  if (desktop.documentWidth > desktop.viewport || desktop.projectCount !== 8 || desktop.brokenImages.length) throw new Error(`Desktop: ${JSON.stringify(desktop)}`);
  console.log(JSON.stringify({ mobile, mobileMenu: menuAfter, filter, gallery, service, desktop, mobileScreenshot: mobilePath, galleryScreenshot: modalPath }, null, 2));
} finally {
  socket?.close();
  chrome.kill();
}
