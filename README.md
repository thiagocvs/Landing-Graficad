# GrafiCAD — Landing

Sitio de una sola página en **Astro 5 + Tailwind CSS v4**. Salida estática, sin backend.

## Puesta en marcha

Requiere Node 20 o superior (verificado sobre v24).

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/ listo para subir
npm run preview  # sirve dist/ localmente
```

> **OneDrive y el build.** El proyecto vive dentro de una carpeta sincronizada, y
> OneDrive a veces bloquea `dist/_astro` mientras sincroniza: `astro build` falla con
> `EPERM`. Pausá la sincronización o borrá `dist/` a mano. Lo definitivo es mover el
> proyecto fuera de OneDrive.

## Formulario

El formulario postea a **Formspree**. Creá un formulario en <https://formspree.io>, copiá
tu endpoint y ponelo en un archivo `.env` en la raíz:

```
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/TU_ID
```

El envío es por `fetch`, así que el visitante no sale de la página: ve el estado de éxito
en el mismo lugar. Si Formspree falla, el error aparece en el resumen del formulario con
el mail de contacto como salida alternativa. El campo `_gotcha` es la trampa de spam.

## Qué falta completar

Todo lo que Graficad debe cargar está en **un solo archivo**: [`src/data/site.ts`](src/data/site.ts).
Buscá los valores entre corchetes:

| Dato | Dónde |
| --- | --- |
| Años de experiencia | `empresa.anios` |
| Teléfono, email, dirección, ciudad | `empresa.*` |
| URLs de LinkedIn e Instagram | `empresa.linkedin`, `empresa.instagram` |
| Nombres de los seis clientes | `obra[].cliente` |
| Dominio real | `site` en `astro.config.mjs` |

### Fondo del hero

`hailuo-2_3_anima_las_luces-0.mp4` (891 KB, 1376×768, 5,88 s) es el fondo del logotipo
con las luces animadas. Va con `autoplay muted loop playsinline` y `preload="metadata"`.

`fondo-hero-poster.jpg` (44 KB) es el fotograma más oscuro del loop, generado a partir
del propio video: sirve de `poster` para que no haya un destello mientras carga.

El hero incluye un botón **Pausar fondo**. No es un adorno: la WCAG 2.2.2 exige poder
detener cualquier movimiento que arranque solo y dure más de cinco segundos, y este loop
dura 5,88 s y se repite sin fin. Con `prefers-reduced-motion` el video arranca pausado.

### Fotos de carteles

Ocho fotos en `public/obra/`, cada una en **WebP + JPEG de respaldo** (`<picture>`),
`loading="lazy"` y con `width`/`height` reales para que nada salte al cargar. Un
navegador moderno baja solo los WebP: **~970 KB** en total.

| Archivo | Origen | Dónde |
| --- | --- | --- |
| `valla-nocturna` | [unsplash/uRZmsGmhFO8](https://unsplash.com/photos/uRZmsGmhFO8) | Servicio 01 · Obra 01 |
| `obra-construccion` | [unsplash/9cnzCy4YsNE](https://unsplash.com/photos/9cnzCy4YsNE) | Servicio 02 · Obra 02 |
| `vallas-ciudad` | [unsplash/UhYa_SXkUJY](https://unsplash.com/photos/UhYa_SXkUJY) | Servicio 03 · Obra 06 |
| `flota-camion` | [unsplash/mVqTumQH-c0](https://unsplash.com/photos/mVqTumQH-c0) | Servicio 04 · Obra 03 |
| `senaletica-urbana` | [unsplash/T32G9zARSr4](https://unsplash.com/photos/T32G9zARSr4) | Obra 04 |
| `edificio-atardecer` | [unsplash/5GBvm1lhrFM](https://unsplash.com/photos/5GBvm1lhrFM) | Obra 05 |
| `stand-publicitario` | [unsplash/aakxlmdt4vc](https://unsplash.com/photos/aakxlmdt4vc) | Servicio 05 |
| `taller-impresora` | [unsplash/CYrYxz-uvE4](https://unsplash.com/photos/CYrYxz-uvE4) | Hoja 04 · Taller |

Todas son de **Unsplash**, con [licencia](https://unsplash.com/license) de uso comercial
libre y sin atribución obligatoria. Se anota igual la URL de origen: identifica al autor
y permite verificar la licencia sin buscar.

> **Criterio al elegirlas: sin caras reconocibles.** La licencia de Unsplash cubre el
> derecho de autor de la foto, no el derecho de imagen de las personas que aparecen en
> ella; para un sitio comercial eso puede exigir permiso aparte. Se descartaron tres
> fotos de stands por ese motivo, y la elegida muestra la estructura y la gráfica
> impresa —que es el producto— con la única cara presente formando parte del propio
> gráfico del cliente.

> **Son imágenes de referencia del rubro, no obra de GrafiCAD.** La página lo dice
> explícitamente al pie de las dos secciones. Reemplazalas por fotos propias en cuanto
> las tengas: cambiá el archivo en `public/obra/` y el campo `archivo`/`foto` en
> `src/data/site.ts`. Dentro de una misma sección no puede repetirse ninguna — una
> descarga inicial traía dos encuadres de la misma esquina y se notaba.

### Logotipo

En `public/` hay cuatro archivos, tres derivados del original:

| Archivo | Qué es | Dónde se usa |
| --- | --- | --- |
| `logo graficad.jpeg` | **el original que entregaste** | fuente de los demás; podés sacarlo de `public/` |
| `logo-graficad-marca.png` | solo el logotipo, fondo transparente | header |
| `logo-graficad.png` | lockup completo con la bajada, transparente | pie |
| `valla-graficad.jpg` | el banner entero con su fondo | sin uso hoy; queda por si vuelve una pieza montada |

Las versiones transparentes se generaron recortando el fondo por diferencia de canal:
el oro tiene R−B ≈ 140 y el navy del fondo ≈ −26, así que un umbral sobre esa resta
separa limpio sin tocar los biseles. La del header además borra la banda de la bajada
(x < 745, y > 352), que a 36 px de alto quedaba ilegible.

Si cambia el logotipo, reemplazá los cuatro y ajustá `logoAncho`/`logoAlto` y
`logoMarcaAncho`/`logoMarcaAlto` en `src/data/site.ts` — son los `width`/`height`
reales y evitan el salto de layout.

### Fotografías

Dos lugares esperan imagen real. Ambos funcionan sin ella: el hueco está resuelto con
color y trama, no con un cartel de "falta la foto". El hero ya no espera foto: usa el video.

1. **Portafolio** — en `src/components/Obra.astro`, reemplazá el `<span>` de trama por un
   `<img>` con `loading="lazy"` y `width`/`height` explícitos para no mover el layout.
2. **Open Graph** — agregá `public/og.jpg` (1200×630) y su `<meta property="og:image">` en
   `src/layouts/Base.astro`.

## Estructura

```
src/
├─ data/site.ts          Todo el contenido, en un solo lugar
├─ styles/global.css     Tokens OKLCH + escala tipográfica + utilidades
├─ layouts/Base.astro    <head>, fuentes, skip link, observer de revelado
├─ components/
│  ├─ Header.astro       Nav + contador de hoja + menú móvil
│  ├─ Hero.astro         01 · Inicio
│  ├─ Enfoque.astro      02 · Problema y solución
│  ├─ Servicios.astro    03 · Cuatro líneas de producción
│  ├─ Taller.astro       04 · Diferenciadores
│  ├─ Obra.astro         05 · Portafolio
│  ├─ Cotizacion.astro   06 · Formulario
│  └─ Pie.astro          07 · Footer
└─ pages/index.astro
```

## Decisiones de diseño

Están documentadas en [`.impeccable.md`](.impeccable.md). En resumen:

- **Dos familias, trabajos distintos.** Archivo variable (eje `wdth` 62–125) para
  titulares y cuerpo; JetBrains Mono para cotas, coordenadas y estado. El ancho de la
  tipografía sigue al ancho del contenedor: expandido solo a toda la hoja.
- **Paleta leída del logotipo.** Oro `#F5A92D` para la acción (CTA, foco, sección
  activa), 9,94:1 sobre el fondo. Azul eléctrico `#007BFE` para el ambiente: la textura
  y los indicadores de estado. Regla 60‑30‑10: el oro ocupa ~1 % del área.
- **La textura del fondo del logotipo, en CSS.** Facetas angulares, destello azul y
  trama fina, sin una sola imagen. Se gradúa por sección con la variable `--textura`
  (1 en el hero, 0.32 en las secciones de lectura).
- **Neutros teñidos.** Todo el color en OKLCH, con los grises inclinados hacia el matiz 255
  del navy del logotipo. No hay negro puro ni gris puro en el sistema.
- **La grilla del portafolio comunica el formato.** Cada pieza ocupa la proporción real de
  su formato físico: la valla es ancha, la lona de fachada es alta.
- **La portada tiene la compostura de Apple.** Una sola idea en pantalla: logotipo,
  una palabra enorme, una línea, dos enlaces. Todo lo demás bajó a su propia sección.
- **Sistema de movimiento en tokens.** Duraciones, curvas y distancias salen de
  variables (`--dur-*`, `--ease-*`, `--dist-*`), tomadas de la skill `motion-foundations`
  y llevadas a CSS: el proyecto es Astro sin framework y sumar React solo para animar
  contradice la regla de no agregar dependencias por un adorno. Las restricciones sí se
  respetan enteras — solo `transform` y `opacity`, nunca propiedades de layout, y
  `prefers-reduced-motion` manda sobre todo lo demás.
- **Movimiento ligado al scroll donde el navegador lo soporta.** `animation-timeline:
  view()` corre en el compositor, así que no puede trabar el scroll. Donde no existe, el
  contenido simplemente aparece en su estado final.
- **El hero corre sobre el fondo animado del logotipo.** El video ocupa la sección
  entera y el mensaje va sobre un panel propio, montado con sus cotas, fijaciones,
  postes y la figura humana a escala. No es una decisión estética: los trazos azules del
  video llegan a 0,64 de luminancia (percentil 99 medido sobre todo el loop), y texto
  directo encima da **1,38:1**. Velar el video hasta salvarlo pedía 78 % de opacidad y lo
  apagaba entero. Con el panel a 0,92 de opaco el contraste real es **16,9:1** en el
  fotograma más brillante — medido, no estimado.

## Fuentes: qué swapear si compran licencias

El sistema de referencia usa **Monument Extended** (titulares) y **Neue Haas Grotesk**
(cuerpo), ambas comerciales. Están sustituidas por **Archivo variable**, libre y con eje
de ancho, que cumple el mismo rol. **JetBrains Mono** sí es la fuente exacta de la
referencia y es libre. Para cambiar: `--font-sans` en `src/styles/global.css` y el
`<link>` de `src/layouts/Base.astro`.

## Verificación automatizada

```bash
npm run dev            # en una terminal
npm run inspeccionar   # en otra
```

[`scripts/inspeccionar.mjs`](scripts/inspeccionar.mjs) abre la página con Playwright en
1440 / 768 / 375 px, guarda capturas por sección y comprueba: desborde horizontal,
objetivos táctiles de 44 px, anillo de foco con el color de marca en cada parada de
tabulación, identificadores duplicados, validación del formulario, contador de hoja y
errores de consola.

También lleva el video del hero a su fotograma más brillante, **oculta el texto**, mide
el fondo que queda y calcula el contraste real. Si alguien baja la opacidad del panel,
la prueba lo dice antes que un usuario.

Las comprobaciones de color leen el token `--color-signal` en vez de un hex fijo, así que
siguen valiendo si vuelve a cambiar la paleta.

## Accesibilidad

- Contraste verificado: todos los pares de texto superan AA (4.5:1); los titulares llegan
  a 18:1 y el oro a 9,9:1. `ink-400` es solo para bordes decorativos, nunca para texto.
- Bordes de los campos en `ink-500` (5,65:1) para cumplir WCAG 1.4.11, que pide 3:1 en el
  límite de un control. Los tonos más oscuros no llegaban.
- Hover y foco de teclado reciben **el mismo** tratamiento en el portafolio: nadie queda
  afuera por navegar con Tab.
- Errores de formulario: inline con `aria-describedby`, más un resumen con `role="alert"`
  que recibe el foco y enlaza cada campo. Validación al perder el foco, no al teclear.
- `prefers-reduced-motion` desactiva todo el movimiento y el scroll suave.
