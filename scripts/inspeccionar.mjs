/**
 * Inspección visual y técnica de la landing con Playwright.
 *
 *   node scripts/inspeccionar.mjs [url] [carpeta-salida]
 *
 * Requiere el servidor corriendo (`npm run dev`). Genera capturas por viewport
 * y por sección, y vuelca un informe de diagnóstico por consola.
 */
import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';

const URL_BASE = process.argv[2] ?? 'http://localhost:4321/';
const SALIDA = process.argv[3] ?? 'capturas';

const VIEWPORTS = [
  { nombre: 'escritorio', width: 1440, height: 900 },
  { nombre: 'tablet', width: 768, height: 1024 },
  { nombre: 'movil', width: 375, height: 812 },
];

const SECCIONES = ['inicio', 'enfoque', 'servicios', 'taller', 'obra', 'cotizacion', 'contacto'];

const log = (...a) => console.log(...a);
const titulo = (t) => log(`\n${'─'.repeat(74)}\n${t}\n${'─'.repeat(74)}`);

await mkdir(SALIDA, { recursive: true });
const navegador = await chromium.launch();

// ───────────────────────────────────────────────────────────────────────────
// 1. Capturas por viewport. reducedMotion revela todo el contenido de una vez,
//    que es lo que queremos para juzgar composición y ritmo.
// ───────────────────────────────────────────────────────────────────────────
titulo('CAPTURAS');

for (const vp of VIEWPORTS) {
  const ctx = await navegador.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: 'reduce',
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(URL_BASE, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  await page.screenshot({ path: `${SALIDA}/${vp.nombre}-completa.png`, fullPage: true });
  log(`  ${vp.nombre.padEnd(12)} ${vp.width}×${vp.height}  → ${vp.nombre}-completa.png`);

  // Una captura por sección, al alto del viewport, solo en escritorio y móvil.
  if (vp.nombre !== 'tablet') {
    for (const id of SECCIONES) {
      const el = page.locator(`#${id}`);
      if ((await el.count()) === 0) continue;
      await el.screenshot({ path: `${SALIDA}/${vp.nombre}-${id}.png` }).catch(() => {});
    }
    log(`  ${''.padEnd(12)} ${SECCIONES.length} secciones capturadas`);
  }
  await ctx.close();
}

// ───────────────────────────────────────────────────────────────────────────
// 2. Diagnóstico
// ───────────────────────────────────────────────────────────────────────────
const ctx = await navegador.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const errores = [];
page.on('console', (m) => m.type() === 'error' && errores.push(m.text()));
page.on('pageerror', (e) => errores.push(String(e)));

await page.goto(URL_BASE, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

titulo('TIPOGRAFÍA APLICADA');
const tipo = await page.evaluate(() => {
  const leer = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      sel: sel.length > 15 ? sel.slice(0, 15) : sel,
      familia: cs.fontFamily.split(',')[0].replace(/["']/g, ''),
      tam: Math.round(parseFloat(cs.fontSize)) + 'px',
      peso: cs.fontWeight,
      ancho: cs.fontStretch,
      interlineado: (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2),
    };
  };
  return {
    cargada: document.fonts.check('700 16px Archivo'),
    filas: [
      leer('h1'),
      leer('#enfoque h2'),
      leer('#enfoque h3'),
      // Texto de cuerpo real: el primer <p> de #enfoque es la etiqueta del
      // cajetín, no el cuerpo. Medir ese daba una lectura falsa.
      leer('#enfoque li p'),
      leer('.type-label'),
    ],
  };
});
log(`  ¿Archivo cargada?  ${tipo.cargada ? 'sí' : 'NO — está usando el fallback'}`);
log(`  ${'elemento'.padEnd(16)}${'familia'.padEnd(11)}${'tam'.padEnd(8)}${'peso'.padEnd(7)}${'ancho'.padEnd(9)}interl.`);
for (const f of tipo.filas.filter(Boolean)) {
  log(`  ${f.sel.padEnd(16)}${f.familia.padEnd(11)}${f.tam.padEnd(8)}${f.peso.padEnd(7)}${f.ancho.padEnd(9)}${f.interlineado}`);
}

titulo('PRESUPUESTO DE COLOR (regla 60-30-10)');
const color = await page.evaluate(() => {
  // El color de marca se lee del token, así la prueba sobrevive a un cambio
  // de paleta. Se compara el tono en oklch con tolerancia.
  const marca = getComputedStyle(document.documentElement)
    .getPropertyValue('--color-signal')
    .trim();
  // oklch(79.0% 0.155 74) → [79, 0.155, 74]; el tono es el tercer número.
  const tonoMarca = (marca.match(/-?\d*\.?\d+/g) ?? []).map(Number)[2] ?? 0;
  const esMarca = (c) => {
    const n = (c.match(/-?\d*\.?\d+/g) ?? []).map(Number);
    if (c.startsWith('oklch')) return Math.abs(n[2] - tonoMarca) < 12 && n[1] > 0.08;
    if (c.startsWith('oklab')) {
      const h = ((Math.atan2(n[2], n[1]) * 180) / Math.PI + 360) % 360;
      return Math.abs(h - tonoMarca) < 12 && Math.hypot(n[1], n[2]) > 0.08;
    }
    return false;
  };
  let areaCian = 0;
  let areaTotal = 0;
  const usos = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    const cs = getComputedStyle(el);
    const area = r.width * r.height;
    areaTotal = Math.max(areaTotal, area);
    const fondoCian = esMarca(cs.backgroundColor);
    const textoCian = esMarca(cs.color) && el.textContent.trim().length > 0;
    if (fondoCian || textoCian) {
      areaCian += fondoCian ? area : area * 0.35;
      usos.push(`${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} — ${(el.textContent || '').trim().slice(0, 34)}`);
    }
  }
  return { pct: ((areaCian / areaTotal) * 100).toFixed(1), usos: [...new Set(usos)] };
});
log(`  Superficie con el color de marca en el primer viewport: ~${color.pct}% del área`);
log(`  Elementos que lo usan (${color.usos.length}):`);
color.usos.slice(0, 12).forEach((u) => log(`    · ${u}`));

titulo('IDENTIFICADORES DUPLICADOS');
const ids = await page.evaluate(() => {
  const cuenta = new Map();
  for (const el of document.querySelectorAll('[id]')) {
    cuenta.set(el.id, (cuenta.get(el.id) ?? 0) + 1);
  }
  return [...cuenta].filter(([, n]) => n > 1).map(([id, n]) => `${id} (x${n})`);
});
log(ids.length === 0 ? '  Ninguno.' : `  ${ids.length} repetidos: ${ids.join(', ')}`);

titulo('DESBORDE HORIZONTAL');
for (const vp of VIEWPORTS) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.waitForTimeout(150);
  const d = await page.evaluate(() => {
    const culpables = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.right > document.documentElement.clientWidth + 1 || r.left < -1) {
        culpables.push(
          `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} (${Math.round(r.left)}→${Math.round(r.right)})`,
        );
      }
    }
    return {
      scroll: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ancho: document.documentElement.scrollWidth,
      ventana: document.documentElement.clientWidth,
      culpables: [...new Set(culpables)].slice(0, 5),
    };
  });
  const estado = d.scroll ? `DESBORDA (${d.ancho} > ${d.ventana})` : 'ok';
  log(`  ${vp.nombre.padEnd(12)} ${String(vp.width).padStart(4)}px  ${estado}`);
  d.culpables.forEach((c) => log(`      ↳ ${c}`));
}

titulo('TEXTO QUE NO ENTRA EN SU CAJA');
// Los titulares ya no parten palabras (`overflow-wrap: normal`), así que si uno
// no entra, desborda y se nota. Esta prueba lo caza antes que un usuario: mide
// scrollWidth contra clientWidth en varios anchos, incluidos los intermedios
// donde las columnas quedan más angostas.
for (const w of [1440, 1280, 1100, 1024, 900, 768, 600, 375]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(120);
  const malos = await page.evaluate(() =>
    [...document.querySelectorAll('h1,h2,h3,p,dd,dt,li,label')]
      .filter((e) => {
        // Un recorte deliberado no es un desborde: las fichas del portafolio
        // usan overflow:hidden a propósito, y el enlace de salto es sr-only.
        const cs = getComputedStyle(e);
        if (cs.overflow !== 'visible' || cs.overflowX !== 'visible') return false;
        if (e.clientWidth < 4) return false;
        return e.scrollWidth > e.clientWidth + 1;
      })
      .map((e) => `"${e.textContent.trim().slice(0, 22)}" ${e.scrollWidth}>${e.clientWidth}`),
  );
  log(`  ${String(w).padStart(4)}px  ${malos.length ? 'DESBORDA: ' + malos.slice(0, 3).join(' | ') : 'ok'}`);
}
await page.setViewportSize({ width: 1440, height: 900 });

titulo('CONTRASTE SOBRE EL VIDEO DEL HERO');
// El fondo animado llega a 0,64 de luminancia en sus trazos azules. Se lleva el
// video a su fotograma más brillante, se OCULTA el texto y se mide el fondo que
// queda: medir con el texto puesto confunde píxeles de letra con fondo y da un
// resultado sin sentido. Se compara contra el texto claro real (ink-800).
await page.setViewportSize({ width: 1440, height: 900 });

if ((await page.locator('#video-hero').count()) === 0) {
  log('  No hay video en el hero.');
} else {
  await page.evaluate(async () => {
    const v = document.getElementById('video-hero');
    v.pause();
    v.currentTime = 3.23; // pico de brillo del loop
    await new Promise((r) => v.addEventListener('seeked', r, { once: true }));
  });
  await page.waitForTimeout(400);

  // El token viene en oklch(); leerlo como si fuera rgb() da una luminancia
  // ridícula. Se pinta en un canvas y se lee el píxel ya convertido a sRGB.
  const Ltexto = await page.evaluate(() => {
    const c = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-ink-800')
      .trim();
    const cv = document.createElement('canvas');
    cv.width = cv.height = 1;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    const sRGB = (u) => (u <= 0.04045 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4);
    return 0.2126 * sRGB(r / 255) + 0.7152 * sRGB(g / 255) + 0.0722 * sRGB(b / 255);
  });

  const medir = async (sel, etiqueta) => {
    // Se borra el texto sin cambiar el tamaño de la caja. Ocultar solo los
    // hijos no alcanza: si el texto es un nodo directo del elemento (un <h1>
    // sin <span> adentro) sigue pintándose y se mide la letra como fondo.
    await page.evaluate((s) => {
      const el = document.querySelector(s);
      el.dataset.colorPrevio = el.style.color;
      el.style.color = 'transparent';
      el.style.textShadow = 'none';
      el.querySelectorAll('*').forEach((h) => (h.style.visibility = 'hidden'));
    }, sel);
    const buf = await page.locator(sel).screenshot();
    await page.evaluate((s) => {
      const el = document.querySelector(s);
      el.style.color = el.dataset.colorPrevio ?? '';
      el.style.textShadow = '';
      el.querySelectorAll('*').forEach((h) => (h.style.visibility = ''));
    }, sel);

    const fondo = await page.evaluate(
      async ([b64]) => {
        const img = new Image();
        img.src = 'data:image/png;base64,' + b64;
        await img.decode();
        const c = document.createElement('canvas');
        c.width = img.width; c.height = img.height;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        const sRGB = (u) => (u <= 0.04045 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4);
        const vals = [];
        for (let p = 0; p < d.length; p += 8) {
          vals.push(0.2126 * sRGB(d[p]/255) + 0.7152 * sRGB(d[p+1]/255) + 0.0722 * sRGB(d[p+2]/255));
        }
        vals.sort((x, y) => x - y);
        return vals[Math.floor(vals.length * 0.99)]; // el punto más claro del fondo
      },
      [buf.toString('base64')],
    );
    const ratio = (Ltexto + 0.05) / (fondo + 0.05);
    log(`  ${etiqueta.padEnd(22)} fondo p99 ${fondo.toFixed(4)}  →  ${ratio.toFixed(2)}:1  ${ratio >= 4.5 ? 'OK' : 'INSUFICIENTE'}`);
  };

  // La portada dejó de usar panel opaco: el texto va centrado sobre el video
  // con un velo radial debajo. Se mide el fondo real detrás de cada bloque.
  await medir('#inicio h1', 'titular');
  await medir('#inicio p', 'subtítulo');
  await medir('#inicio a[href="#cotizacion"]', 'enlace de acción');
  await page.evaluate(() => document.getElementById('video-hero')?.play());
}

titulo('OBJETIVOS TÁCTILES (mínimo 44×44)');
await page.setViewportSize({ width: 375, height: 812 });
await page.waitForTimeout(150);
const tactil = await page.evaluate(() => {
  const chicos = [];
  for (const el of document.querySelectorAll('a, button, input, select, textarea')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.height < 44 || r.width < 44) {
      chicos.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.id || '').trim().slice(0, 26)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
  }
  return chicos;
});
log(tactil.length === 0 ? '  Todos cumplen.' : `  ${tactil.length} por debajo del mínimo:`);
tactil.slice(0, 10).forEach((t) => log(`    · ${t}`));

titulo('FOCO DE TECLADO');
await page.setViewportSize({ width: 1440, height: 900 });

// Tabulación real: `:focus-visible` no se activa con element.focus() en
// botones ni enlaces, solo con interacción de teclado. Medirlo por script
// devolvía el anillo del navegador, no el nuestro.
await page.reload({ waitUntil: 'networkidle' });
await page.locator('body').click({ position: { x: 2, y: 2 } });
const anillos = [];
for (let i = 0; i < 14; i++) {
  await page.keyboard.press('Tab');
  // Sin espera a propósito: el anillo de foco debe estar completo en el primer
  // fotograma. Si vuelve a desvanecerse, esta prueba lo delata.
  await page.waitForTimeout(30);
  const r = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    const marca = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-signal')
      .trim();
    const tonoMarca = (marca.match(/-?\d*\.?\d+/g) ?? []).map(Number)[2] ?? 0;
    const esCian = (c) => {
      const n = (c.match(/-?\d*\.?\d+/g) ?? []).map(Number);
      if (c.startsWith('oklch')) return Math.abs(n[2] - tonoMarca) < 12;
      if (c.startsWith('oklab')) {
        const h = ((Math.atan2(n[2], n[1]) * 180) / Math.PI + 360) % 360;
        return Math.abs(h - tonoMarca) < 12 && Math.hypot(n[1], n[2]) > 0.08;
      }
      return false;
    };
    return {
      quien: `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''} "${(el.textContent || '').trim().slice(0, 20)}"`,
      ancho: cs.outlineWidth,
      estilo: cs.outlineStyle,
      cian: esCian(cs.outlineColor),
      color: cs.outlineColor,
    };
  });
  if (r) anillos.push(r);
}
const malos = anillos.filter((a) => !a.cian || parseFloat(a.ancho) < 2 || a.estilo === 'none');
log(`  ${anillos.length} elementos tabulados`);
log(`  Con anillo de marca de 2px: ${anillos.length - malos.length}/${anillos.length}`);
malos.slice(0, 6).forEach((m) => log(`    ✗ ${m.quien} → ${m.ancho} ${m.estilo} ${m.color}`));
if (malos.length === 0) log(`    ✓ ${anillos[0]?.quien} … y el resto, todos iguales`);

titulo('FORMULARIO — envío vacío');
// Recarga obligatoria: la prueba de foco anterior deja un campo enfocado y su
// blur dispara la validación, contaminando este resultado.
await page.reload({ waitUntil: 'networkidle' });
await page.locator('#enviar').scrollIntoViewIfNeeded();
await page.locator('#enviar').click();
await page.waitForTimeout(250);
const form = await page.evaluate(() => ({
  resumenVisible: !document.getElementById('resumen').hidden,
  recibeFoco: document.activeElement?.id === 'resumen',
  enlaces: [...document.querySelectorAll('#resumen-lista a')].map((a) => a.textContent),
  emailInvalido: document.getElementById('email').getAttribute('aria-invalid'),
  errorEmailVisible: !document.getElementById('email-error').hidden,
}));
log(`  Resumen visible ................ ${form.resumenVisible}`);
log(`  Recibe el foco ................. ${form.recibeFoco}`);
log(`  Campos enlazados ............... ${form.enlaces.join(', ') || 'ninguno'}`);
log(`  email aria-invalid ............. ${form.emailInvalido}`);
log(`  Error inline de email visible .. ${form.errorEmailVisible}`);
await page.screenshot({ path: `${SALIDA}/estado-error-formulario.png`, clip: await page.locator('#form-cotizacion').boundingBox() });

titulo('CONTADOR DE HOJA (scroll)');
for (const id of ['servicios', 'obra', 'cotizacion']) {
  await page.locator(`#${id}`).scrollIntoViewIfNeeded();
  await page.waitForTimeout(450);
  const n = await page.locator('#hoja-actual').textContent();
  log(`  #${id.padEnd(12)} → hoja ${n}`);
}

titulo('REVELADO AL SCROLL (sin reduced-motion)');
const revelado = await page.evaluate(() => {
  const todos = document.querySelectorAll('[data-reveal]');
  const visibles = document.querySelectorAll('[data-reveal].is-visible');
  return { total: todos.length, visibles: visibles.length };
});
log(`  ${revelado.visibles}/${revelado.total} elementos revelados tras recorrer la página`);

titulo('ERRORES DE CONSOLA');
log(errores.length === 0 ? '  Ninguno.' : errores.map((e) => '  · ' + e).join('\n'));

await navegador.close();
log(`\nCapturas en ./${SALIDA}/\n`);
