/**
 * Fuente única de contenido del sitio.
 * Los valores entre corchetes [ ] son los que Graficad debe completar.
 */

export const empresa = {
  /** Marca comercial, tal como aparece en el logotipo. */
  nombre: 'GrafiCAD',
  /** Razón social, para textos legales y el aviso de copyright. */
  razonSocial: 'Graficad SA',
  lema: 'Arquitectura Publicitaria',
  /**
   * Logotipo recortado y con fondo transparente, derivado del original.
   * Poné null para volver a la reconstrucción tipográfica del componente Marca.
   */
  /** Lockup completo, con la bajada. Para el pie, donde hay tamaño para leerla. */
  logo: '/logo-graficad.png' as string | null,
  logoAncho: 800,
  logoAlto: 187,
  /** Solo el logotipo, sin bajada: a 40 px de alto la bajada era ilegible. */
  logoMarca: '/logo-graficad-marca.png',
  logoMarcaAncho: 700,
  logoMarcaAlto: 163,
  /** El banner completo, con su fondo: la pieza impresa. */
  banner: '/valla-graficad.jpg',
  /** Fondo animado del hero: el fondo del logotipo, con las luces en movimiento. */
  video: '/hailuo-2_3_anima_las_luces-0.mp4',
  /** Fotograma más oscuro del loop. Evita el destello mientras el video carga. */
  videoPoster: '/fondo-hero-poster.jpg',
  /** Foto del taller: impresora de gran formato con una lona en producción. */
  fotoTaller: 'taller-impresora',
  anios: '[XX]',
  telefono: '[+00 000 000 000]',
  telefonoHref: '+00000000000',
  email: 'ventas@graficad.com',
  direccion: '[Dirección física]',
  ciudad: '[Ciudad]',
  horario: 'Lunes a viernes, 08:00 – 18:00',
  linkedin: '#',
  instagram: '#',
} as const;

/** Endpoint de Formspree/Getform. Se define en .env como PUBLIC_FORM_ENDPOINT. */
export const formEndpoint =
  import.meta.env.PUBLIC_FORM_ENDPOINT ?? 'https://formspree.io/f/TU_ID_AQUI';

/** Numeración de hoja del plóter: alimenta el índice del header y las marcas. */
export const hojas = [
  { id: 'inicio', n: '01', titulo: 'Inicio' },
  { id: 'enfoque', n: '02', titulo: 'Enfoque' },
  { id: 'servicios', n: '03', titulo: 'Servicios' },
  { id: 'taller', n: '04', titulo: 'Taller' },
  { id: 'obra', n: '05', titulo: 'Obra' },
  { id: 'cotizacion', n: '06', titulo: 'Cotización' },
  { id: 'contacto', n: '07', titulo: 'Contacto' },
] as const;

/** Barra de estado al pie del hero: lo que el taller puede hacer, ahora. */
export const estado = [
  { clave: 'Formato', valor: 'Gran formato' },
  { clave: 'Soporte', valor: 'Lona, vinilo, mesh' },
  { clave: 'Producción', valor: '24/7' },
] as const;

/**
 * Enlaces legales del pie. Sin uso por ahora: el pie quedó sin listas de
 * enlaces. Se mantienen acá para poder reponerlos sin volver a escribirlos.
 */
export const enlacesPie = [
  { titulo: 'Privacidad', href: '#' },
  { titulo: 'Términos', href: '#' },
  { titulo: 'Soporte técnico', href: '#' },
  { titulo: 'Carreras', href: '#' },
] as const;

/** Ficha técnica del hero. Datos reales, no métricas decorativas. */
export const ficha = [
  { clave: 'Resolución', valor: '1440 dpi' },
  { clave: 'Tintas', valor: 'UV / Látex' },
  { clave: 'Ancho máx.', valor: '5,00 m' },
  { clave: 'Montaje', valor: 'Equipo propio' },
] as const;

export const enfoque = [
  {
    n: '01',
    titulo: '¿Tu marca pasa desapercibida?',
    texto:
      'En un entorno saturado, el formato pequeño no alcanza. Tu empresa necesita impacto visual para destacar.',
  },
  {
    n: '02',
    titulo: 'Gigantografías monumentales',
    texto:
      'Llevamos tus campañas al siguiente nivel con impresiones que capturan la atención al instante.',
  },
  {
    n: '03',
    titulo: 'Reconocimiento inmediato',
    texto:
      'Aumentá la visibilidad, generá recordación y dominá tu mercado con presencia a gran escala.',
  },
] as const;

export const servicios = [
  {
    n: '01',
    titulo: 'Vallas y espectaculares',
    texto: 'Impresiones para estructuras exteriores de alto impacto.',
    sustrato: 'Lona front / mesh 440 g',
    foto: 'valla-nocturna',
    formato: 'hasta 5,00 × 20,00 m',
  },
  {
    n: '02',
    titulo: 'Lonas para edificios',
    texto: 'Cubrimiento de fachadas y obras en altura.',
    sustrato: 'Mesh microperforado ignífugo',
    foto: 'obra-construccion',
    formato: 'sin límite de alto',
  },
  {
    n: '03',
    titulo: 'Señalética de gran formato',
    texto: 'Soluciones visuales para centros comerciales y plantas industriales.',
    sustrato: 'Rígidos: PVC, aluminio, acrílico',
    foto: 'vallas-ciudad',
    formato: 'hasta 3,20 × 2,00 m por pieza',
  },
  {
    n: '04',
    titulo: 'Decoración de flotas',
    texto: 'Rotulación de camiones y flotas empresariales.',
    sustrato: 'Vinilo fundido + laminado UV',
    foto: 'flota-camion',
    formato: 'unidad completa',
  },
  {
    n: '05',
    titulo: 'Stands publicitarios',
    texto:
      'Stands completos para ferias, eventos y oficinas: pared gráfica, mostrador, iluminación y armado en sitio.',
    sustrato: 'Estructura de aluminio + gráfica tensada',
    foto: 'stand-publicitario',
    formato: 'de 2 × 2 a 6 × 3 m',
  },
] as const;

export const taller = [
  {
    n: '01',
    titulo: 'Tecnología de vanguardia',
    texto:
      'Impresoras de última generación con tintas ecológicas y duraderas, UV y Látex, capaces de sostener la fidelidad visual en condiciones de intemperie.',
    puntos: ['Sistemas de curado UV LED', 'Tintas base agua Látex (Eco-Cert)', 'Cabezales de gota variable (4 pl)'],
  },
  {
    n: '02',
    titulo: 'Definición y colorimetría',
    texto:
      'Perfilado ICC específico por sustrato. Colores vibrantes y detalle nítido, legibles incluso a veinte metros de distancia.',
    puntos: ['Espectrofotometría en línea', 'Gestión de color certificada Fogra', 'Resolución óptica real 1200 dpi'],
  },
  {
    n: '03',
    titulo: 'Logística y montaje',
    texto:
      'Servicio integral: de la impresión a la instalación segura, con personal habilitado para trabajo en altura.',
    puntos: ['Cuadrilla propia habilitada', 'Permisos municipales gestionados', 'Montaje nocturno sin cortes de tránsito'],
  },
  {
    n: '04',
    titulo: 'Experiencia comprobada',
    texto: `Más de ${empresa.anios} años dominando el mercado de gran formato.`,
    puntos: ['Obra documentada y verificable', 'Garantía escrita por pieza', 'Mantenimiento posterior al montaje'],
  },
] as const;

/**
 * Portafolio.
 *
 * Las fotos son de Unsplash, con licencia de uso comercial libre y sin
 * atribución obligatoria (https://unsplash.com/license). Se anota igual la
 * URL de origen de cada una: identifica al autor y permite verificar la
 * licencia sin buscar. Son imágenes de referencia del rubro, NO obra de
 * GrafiCAD — reemplazalas por fotos propias en cuanto las tengas.
 */
export const obra = [
  {
    archivo: 'valla-nocturna',
    cliente: '[Cliente 01]',
    tipo: 'Valla espectacular',
    medida: '12,00 × 4,00 m',
    span: 'ancho',
    fuente: 'https://unsplash.com/photos/uRZmsGmhFO8',
  },
  {
    archivo: 'obra-construccion',
    cliente: '[Cliente 02]',
    tipo: 'Lona de fachada',
    medida: '8,00 × 22,00 m',
    span: 'alto',
    fuente: 'https://unsplash.com/photos/9cnzCy4YsNE',
  },
  {
    archivo: 'flota-camion',
    cliente: '[Cliente 03]',
    tipo: 'Rotulación de flota',
    medida: '14 unidades',
    span: 'normal',
    fuente: 'https://unsplash.com/photos/mVqTumQH-c0',
  },
  {
    archivo: 'senaletica-urbana',
    cliente: '[Cliente 04]',
    tipo: 'Señalética urbana',
    medida: '36 piezas',
    span: 'normal',
    fuente: 'https://unsplash.com/photos/T32G9zARSr4',
  },
  {
    archivo: 'edificio-atardecer',
    cliente: '[Cliente 05]',
    tipo: 'Pantalla de fachada',
    medida: '18,00 × 30,00 m',
    span: 'ancho',
    fuente: 'https://unsplash.com/photos/5GBvm1lhrFM',
  },
  {
    archivo: 'vallas-ciudad',
    cliente: '[Cliente 06]',
    tipo: 'Campaña urbana',
    medida: '9 emplazamientos',
    span: 'normal',
    fuente: 'https://unsplash.com/photos/UhYa_SXkUJY',
  },
] as const;

export const tiposProyecto = [
  { value: 'lona', label: 'Lona' },
  { value: 'valla', label: 'Valla' },
  { value: 'edificio', label: 'Edificio' },
  { value: 'otro', label: 'Otro' },
] as const;
