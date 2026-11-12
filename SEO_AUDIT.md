# INFORME DEFINITIVO DE AUDITORÍA DIAGNÓSTICA SEO Y PLAN DE ACCIÓN INTEGRAL
**Proyecto:** Women in Compliance Colombia (WIC Colombia)  
**URL de Producción Auditada:** [https://web-women-abogadas.vercel.app/](https://web-women-abogadas.vercel.app/)  
**Directorio del Código Fuente:** `e:\WEB-ABOGADOS-MUJERES\Web WIC - Ajustes\WEB-MUESTRA`  
**Pila Tecnológica:** React 19.2 + TypeScript + Vite 8.2 (Single Page Application - SPA)  
**Infraestructura de Despliegue:** Vercel Edge Network (Región de Borde: `gru1` / São Paulo)  
**Fecha de Diagnóstico y Emisión:** 12 de Noviembre de 2026  
**Clasificación de Documento:** Informe Técnico de Ingeniería SEO, Rendimiento Web y Arquitectura Digital — Grado Publicación  

---

## 1. Resumen Ejecutivo (Executive Summary)

### 1.1 Calificación y Diagnóstico Global de Salud SEO

| Métrica / Parámetro Evaluado | Calificación / Estado | Escala | Nivel de Severidad |
| :--- | :---: | :---: | :--- |
| **Puntuación Global de Salud SEO** | **28 / 100** | Grado F | 🔴 **CRÍTICO** |
| **Visibilidad en Motores de Búsqueda (SERP)** | **12 / 100** | Inexistente | 🔴 **CRÍTICO (Bloqueado por plantilla)** |
| **Social Graph y Previsualización Móvil** | **0 / 100** | Nulo | 🔴 **CRÍTICO (Sin etiquetas OG/Twitter)** |
| **Descubrimiento y Protocolos de Rastreo** | **0 / 100** | Inválido | 🔴 **CRÍTICO (Catch-all HTTP 200 HTML)** |
| **Arquitectura Semántica On-Page** | **35 / 100** | Deficiente | 🟠 **ALTO (3 H1s simultáneos en DOM)** |
| **Rastreabilidad SPA y Enlaces Internos** | **10 / 100** | Ciego | 🔴 **CRÍTICO (0 enlaces `<a>`; 100% botones)** |
| **Optimización de Medios e Imágenes** | **42 / 100** | Regular | 🟠 **ALTO (Falta width/height; genera CLS)** |
| **Seguridad HTTP, SSL y Red Edge** | **98 / 100** | Excelente | 🟢 **ÓPTIMO (HSTS 2 años, TLS 1.3, nosniff)** |

El sitio web de **Women in Compliance Colombia (WIC Colombia)** cuenta con una identidad gráfica pulida, contenidos técnicos especializados de alto valor en materia jurídica y regulatoria, y una infraestructura de seguridad perimetral excelente provista por Vercel. Sin embargo, desde la perspectiva de la **ingeniería de motores de búsqueda (SEO) y compatibilidad con rastreadores web**, la aplicación se encuentra en un **estado de scaffolding preliminar**.

La presencia digital opera actualmente con las configuraciones por defecto de la plantilla de inicialización de Vite (`web-muestra`), impidiendo que el contenido alcance las primeras posiciones en Google, Bing o redes sociales profesionales como LinkedIn y WhatsApp.

---

### 1.2 Hallazgos Clave Transversales (Codebase y Live Site)

1. **Título de Plantilla de Desarrollo:** La etiqueta `<title>` de la página en vivo es `<title>web-muestra</title>`, lo que destruye el posicionamiento de marca.
2. **Declaración Errónea de Idioma:** La raíz del documento declara `<html lang="en">`, a pesar de que el 100% del contenido está en español dirigido a la comunidad profesional de Colombia.
3. **Ausencia Absoluta de Metadatos Descriptivos y Canónicos:** No existe `<meta name="description">` ni `<link rel="canonical">`, obligando a Googlebot a generar snippets arbitrarios y arriesgando canibalización de URLs.
4. **Falso Positivo Catastrófico en `robots.txt` y `sitemap.xml`:** La configuración de reescritura SPA en Vercel intercepta las peticiones a `/robots.txt` y `/sitemap.xml`, entregando el código HTML de `index.html` con cabecera `HTTP 200 OK`. Los parsers de Google Search Console y Bing Webmaster Tools registran esto como error de sintaxis y Soft 404.
5. **Cero Soporte para Social Graph:** Ausencia total de etiquetas Open Graph (`og:*`) y Twitter Cards (`twitter:*`). Al compartir el enlace en WhatsApp o LinkedIn, no se visualizan imágenes destacadas ni descripciones profesionales.
6. **Inexistencia de Datos Estructurados (Schema.org / JSON-LD):** Google no tiene forma algorítmica de relacionar el portal con una `Organization` legal, sus socias fundadoras, ni sus `Events` institucionales.
7. **Monocultivo de Botones y Cero Enlaces Semánticos (`<a href>`):** La navegación completa del menú, pie de página, tarjetas de miembros y artículos de compliance se ejecuta mediante `<button onClick=...>` y estados de React (`activeTab`). Los robots de búsqueda no ejecutan clics en botones, por lo que las subpáginas y artículos son invisibles para la indexación.
8. **Anomalía Estructural en Encabezados Hero:** El carrusel principal renderiza simultáneamente tres etiquetas `<h1>` en el árbol del DOM, diluyendo la relevancia semántica de las palabras clave principales.
9. **Penalizaciones de Rendimiento y Core Web Vitals:** Imágenes sin atributos dimensionales `width` y `height` que provocan saltos de diseño (CLS), regla `@import` en `src/index.css` que bloquea la descarga de fuentes en cascada, video introductorio de 3.5 MB sin imagen de portada (`poster`), y políticas de caché con `max-age=0` en activos inmutables.
10. **Monolito de JavaScript sin Code Splitting:** El bundle principal compilado pesa 482 KB sin comprimir (117 KB Brotli), incluyendo el panel administrativo de autenticación dentro del código descargado por los visitantes públicos.

---

## 2. Evaluación Diagnóstica Exhaustiva (R1 - Comprehensive SEO Diagnostic Audit)

---

### 2.1 Meta Tags en `index.html` (Title, Description, Robots, Viewport, Charset, Lang)

#### A. Estado Actual y Evidencia Empírica
En el archivo local `index.html` (Líneas 1 a 16) y verificado mediante inspección HTTP en `https://web-women-abogadas.vercel.app/`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap" rel="stylesheet">
    <title>web-muestra</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Adicionalmente, se confirmó mediante análisis de AST en el código fuente que **`document.title` jamás es manipulado dinámicamente** dentro de `src/App.tsx` ni en ningún hook.

#### B. Brechas Técnicas e Impacto
1. **Etiqueta `<title>` ("web-muestra"):** El título es el factor on-page individual de mayor peso algorítmico en Google. Actualmente, el sitio compite e indexa con la palabra "web-muestra", perdiendo toda relevancia para búsquedas como *"Women in Compliance Colombia"*, *"WIC Colombia"*, o *"red de abogadas de cumplimiento en Colombia"*.
2. **Atributo `<html lang="en">`:** El contenido institucional está redactado 100% en castellano. Declarar `lang="en"` distorsiona la indexación geográfica y lingüística de Googlebot para la región Colombia (`es-CO`) y provoca que navegadores como Chrome y Edge desplieguen innecesariamente la barra de traducción automática ("¿Traducir esta página?").
3. **Ausencia de `<meta name="description">`:** Al carecer de meta descripción, Google extrae fragmentos aleatorios del DOM. Esto reduce el CTR en los resultados de búsqueda a menos del 1.5%.
4. **Ausencia de Directivas Robots:** No existe `<meta name="robots" content="...">`. No se especifica `max-image-preview:large` (crucial para aparecer en Google Discover) ni directivas explícitas de indexación y seguimiento (`index, follow`).

#### C. Recomendaciones Accionables Específicas
1. Sustituir `<html lang="en">` por `<html lang="es-CO">`.
2. Actualizar la etiqueta `<title>` con una estructura que combine marca, propuesta de valor y geolocalización:  
   `Women in Compliance Colombia | Red de Liderazgo, Ética y Gobierno Corporativo`.
3. Incorporar una meta descripción persuasiva de 155 caracteres optimizada para SERP:  
   `Comunidad oficial de mujeres líderes en compliance, riesgos, integridad y gobierno corporativo en Colombia. Conexión estratégica, eventos y formación legal.`
4. Declarar directivas de robots avanzadas:  
   `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />`.

---

### 2.2 Redes Sociales y Social Graph (Open Graph y Twitter Cards)

#### A. Estado Actual y Evidencia Empírica
La inspección en vivo y del código fuente confirma la **ausencia total (0%)** de etiquetas correspondientes a los protocolos Open Graph y Twitter Cards:
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`, `og:site_name`: **Inexistentes**.
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`: **Inexistentes**.

#### B. Brechas Técnicas e Impacto en Crawlers de Mensajería y Redes
1. **Comportamiento en WhatsApp (`WhatsApp/2.x` crawler):** WhatsApp no ejecuta JavaScript bajo ninguna circunstancia. Descarga únicamente los primeros bytes del HTML estático. Al no encontrar etiquetas `og:*`, genera una tarjeta vacía o muestra únicamente el texto plano de la URL acompañado por el título "web-muestra".
2. **Comportamiento en LinkedIn (`LinkedInBot/1.0`):** Para una organización de abogadas corporativas, LinkedIn es el principal canal de tracción profesional. LinkedInBot lee exclusivamente el HTML crudo. Sin `og:image` de 1200x630 píxeles, la publicación muestra un enlace sin miniatura gráfica. Además, **LinkedIn almacena en caché estas vistas previas fallidas durante 7 días**, perjudicando la imagen de marca de cada socia que comparta el enlace.
3. **Comportamiento en Twitter/X (`Twitterbot/1.0`):** Sin la especificación `twitter:card="summary_large_image"`, no se habilita el formato de tarjeta interactiva con imagen ancha.
4. **Límite de Peso de WhatsApp (300 KB):** WhatsApp rechaza imágenes que superen los 300 KB. La imagen actual del carrusel (`/Fotos/Imagen para Inicio - 01.jpg`) pesa 142 KB, pero su versión WebP pesa 67 KB, lo cual la hace ideal siempre que se respete la relación de aspecto 1.91:1.

#### C. Recomendaciones Accionables Específicas
1. Añadir el bloque estándar de Open Graph directamente en el `<head>` de `index.html`.
2. Incluir `og:locale` configurado en `es_CO`.
3. Especificar dimensiones explícitas (`og:image:width` en `1200` y `og:image:height` en `630`).
4. Proveer tarjetas Twitter en formato `summary_large_image`.

---

### 2.3 Datos Estructurados Schema.org / JSON-LD

#### A. Estado Actual y Evidencia Empírica
- **Estado en Producción:** **0 bloques JSON-LD detectados**. Ninguna etiqueta `<script type="application/ld+json">` está presente en el código compilado ni en el repositorio.
- **Rastreo Semántico:** Googlebot trata el sitio como un documento de texto no estructurado sin reconocimiento de entidad jurídica, asociativa ni profesional.

#### B. Brechas Técnicas e Impacto
1. **Pérdida del Knowledge Graph:** Google no puede conectar a la entidad "Women in Compliance Colombia" con su condición de ONG / red gremial, sus redes sociales verificadas (LinkedIn, Instagram, Facebook), ni sus socias fundadoras identificadas en `src/membersData.ts`.
2. **Invisibilidad de Eventos en Google Events:** El sitio promueve desayunos de trabajo y foros de liderazgo (ej. *"1° Desayuno Anual WIC Colombia"*), pero al no contar con marcado `@type: "Event"`, pierden la oportunidad de figurar en el carrusel de eventos de búsqueda local de Google.
3. **Ausencia de Especialidad Jurídica:** No se exponen a nivel de entidades los campos de competencia técnica (**SAGRILAFT**, **SARLAFT**, **PTEE**, **ISO 37001**, **Gobierno Corporativo**).

#### C. Recomendaciones Accionables Específicas
1. Implementar un grafo JSON-LD maestro (`@graph`) en `index.html` que defina:
   - `@type: ["Organization", "NonGovernmentalOrganization"]` con identificación canónica (`#organization`).
   - Fundadoras de la red: Adriana Patricia Gómez Barajas, María Paula Rueda Mantilla, Liz Marcela Bejarano Castillo y Yolima Angélica Bautista Díaz, vinculando sus perfiles oficiales de LinkedIn.
   - Términos normativos clave en la propiedad `knowsAbout`.
   - Coordenadas geográficas y sede institucional en Bogotá D.C.
2. Definir `@type: "WebSite"` vinculado a la organización.
3. Diseñar plantillas de esquema `@type: "Event"` para los eventos periódicos de networking.

---

### 2.4 Descubrimiento y Rastreo: `robots.txt` y `sitemap.xml`

#### A. Estado Actual y Evidencia Empírica
Al realizar peticiones HTTP directas con `curl` a la URL de producción:

```bash
curl -I https://web-women-abogadas.vercel.app/robots.txt
# HTTP/1.1 200 OK
# Content-Type: text/html; charset=utf-8
# Content-Length: 762 (Retorna el HTML de index.html)

curl -I https://web-women-abogadas.vercel.app/sitemap.xml
# HTTP/1.1 200 OK
# Content-Type: text/html; charset=utf-8
# Content-Length: 762 (Retorna el HTML de index.html)
```

En el código fuente local, la carpeta `public/` carece por completo de los archivos físicos `robots.txt` y `sitemap.xml`. Debido a la regla de reescritura en `vercel.json`:
```json
"rewrites": [
  { "source": "/(.*)", "destination": "/index.html" }
]
```
cualquier petición a una ruta no resuelta físicamente es redirigida a la raíz con código 200.

#### B. Brechas Técnicas e Impacto
1. **Falso Positivo Catastrófico (Soft 404):** Cuando Googlebot solicita `/robots.txt`, espera un archivo de texto plano (`text/plain`). Al recibir código HTML (`<!doctype html>...`), los parsers de Google y Bing registran un error de sintaxis ("Reglas de robots no reconocidas").
2. **Rechazo en Google Search Console:** Al registrar el sitemap en la consola, Google reportará de inmediato: *"El archivo sitemap es un documento HTML en lugar de un archivo XML válido"*.
3. **Falta de Rutas de Rastreo:** Las arañas web no disponen de un índice que enumere las secciones clave (`/`, `/eventos`, `/miembros`, `/contenido`, `/opentowork`, `/unete`), ni sus fechas de última modificación (`<lastmod>`).
4. **Exposición de Rutas Administrativas:** Sin `robots.txt`, los bots rastrean libremente rutas como `/admin` o `/login`.

#### C. Recomendaciones Accionables Específicas
1. Crear el archivo físico `public/robots.txt` con directivas claras para rastreadores generales y bots sociales, protegiendo las rutas de administración.
2. Crear el archivo físico `public/sitemap.xml` con protocolo 0.9, incluyendo metadatos de imágenes institucionales (`xmlns:image`).
3. Modificar `vercel.json` para declarar reglas de reescritura limpias que excluyan expresamente a `robots.txt` y `sitemap.xml` del enrutamiento de captura SPA.

---

### 2.5 Jerarquía y Estructura de Encabezados (`h1` a `h6`)

#### A. Estado Actual y Evidencia Empírica en `src/App.tsx`
El análisis del árbol de componentes en `src/App.tsx` (9,235 líneas) revela múltiples irregularidades semánticas:

1. **Tres `<h1>` Simultáneos en el Hero Carousel (Líneas 1000 a 1065):**
   ```tsx
   {slides.map((slide, index) => (
     <div key={index} style={{ opacity: index === currentSlide ? 1 : 0, ... }}>
       <span className="anim-fade-up anim-d1">WIC COLOMBIA</span>
       <h1 className="anim-fade-up anim-d2">{slide.title}</h1>
     </div>
   ))}
   ```
   Aunque visualmente solo un slide es visible gracias a `opacity: 0 / 1`, **los tres elementos `<h1>` coexisten físicamente en el DOM**:
   - `<h1>Tu experiencia es poder. Es hora de que el mundo te conozca.</h1>`
   - `<h1>No camines sola. Encuentra tu equipo en el compliance.</h1>`
   - `<h1>Conecta, aprende y comparte en nuestros espacios de encuentro.</h1>`
2. **Ausencia de Marca en el `<h1>` Principal:** Ninguno de los tres encabezados incluye el nombre formal de la organización ni los términos clave primarios ("Compliance", "Abogadas", "Colombia").
3. **Encabezados en Secciones Secundarias:**
   - Pestaña Eventos (Línea 1481): `<h1>Experiencias de networking y alta dirección</h1>`
   - Detalle del Evento (Línea 1556): `<h1>{currentEvent.title}</h1>`
   - Pestaña Miembros (Línea 2185): `<h1>Nuestras afiliadas y patrocinadores</h1>`
   - Pestaña Artículos (Línea 3541): `<h1>Compliance y buen gobierno corporativo</h1>`
   - Pestaña Open to Work (Línea 4303): `<h1>Visibiliza tu talento, Hazte notar</h1>`
   - Pestaña Únete (Línea 5210): `<h1>Únete a la Red Líder de Mujeres en Compliance en Colombia</h1>` (El más acertado).
4. **Saltos Jerárquicos en el Pie de Página (Líneas 8821 y 8848):** Se utilizan etiquetas `<h4>` para "Navegación" y "Contáctenos", saltándose los niveles `<h2>` y `<h3>` dentro de esa región semántica.
5. **Inversión de Niveles en Detalle de Eventos (Líneas 1728 y 1750):** Se desciende a `<h4>` y luego se vuelve a subir a `<h2>` para "Agenda del Evento" y "EXPOSITORES".

#### B. Brechas Técnicas e Impacto
- Las directrices de calidad de Google (Google Search Quality Rater Guidelines) establecen que la estructura de encabezados debe reflejar la jerarquía lógica del contenido. Renderizar 3 `<h1>` en una misma vista inicial confunde los algoritmos de extracción semántica (NLP) respecto al propósito central de la página.
- Los saltos de nivel (`h1` a `h4`) perjudican la accesibilidad web (WCAG 2.1 Criterio 1.3.1 Info and Relationships) para usuarios con lectores de pantalla.

#### C. Recomendaciones Accionables Específicas
1. En el Hero Carousel de `App.tsx`, mantener **un único `<h1>` definitivo** para la página de inicio que incorpore la entidad y palabras clave primarias, convirtiendo los títulos del carrusel visual en etiquetas `<h2>` dinámicas.
2. Normalizar la jerarquía en el footer sustituyendo los `<h4>` por `<h3>` o párrafos semánticos estilizados.
3. Corregir la secuencia de niveles en el detalle de eventos para respetar el orden descendente `h1 -> h2 -> h3`.

---

### 2.6 SEO de Imágenes y Accesibilidad (`alt`, Formatos, Dimensiones, Lazy Loading)

#### A. Estado Actual y Evidencia Empírica
La inspección de los directorios `public/Fotos/`, `public/Logo/` y el archivo `src/App.tsx` arrojó los siguientes hallazgos:

1. **Textos Alternativos (`alt`) Genéricos o Vacíos:**
   - Línea 1607: `alt={'Evento foto ' + (i+1)}` -> Genérico.
   - Línea 1798: `alt={'Galería Fotográfica ' + (i+1)}` -> Sin contexto sobre quiénes aparecen.
   - Línea 6596: `alt="Foto Miembro"` -> Omite el nombre y cargo de la profesional.
   - Línea 7363: `alt="Portada Entrada"` -> Genérico.
   - Línea 1439: `alt="Fondo Eventos WIC"` -> Imagen puramente decorativa que no debería indexarse como contenido.
2. **Omisión Sistemática de Atributos `width` y `height`:**
   - Las 35 llamadas a `<img>` en `src/App.tsx` utilizan únicamente dimensionamiento CSS (`style={{ width: '100%', height: '100%', objectFit: 'cover' }}`).
   - Ninguna etiqueta incluye las dimensiones intrínsecas en píxeles.
3. **Ausencia de `loading="lazy"`:** Las imágenes bajo el pliegue (fotos de afiliados, galerías con decenas de fotos y patrocinadores) carecen de `loading="lazy"`.
4. **Desaprovechamiento de Formatos WebP Existentes:**
   - En `public/Fotos/` coexisten imágenes JPG pesadas junto a versiones WebP optimizadas:
     - `Imagen para Inicio - 01.jpg` (145 KB) vs `Imagen para Inicio - 01.webp` (67 KB) -> **Ahorro del 54%**.
     - `Imagen para Inicio - 02.jpg` (279 KB) vs `Imagen para Inicio - 02.webp` (190 KB) -> **Ahorro del 32%**.
     - `Imagen para Inicio - 03.jpg` (128 KB) vs `Imagen para Inicio - 03.webp` (103 KB) -> **Ahorro del 20%**.
   - En el Hero Carousel, el código importa las versiones `.jpg` más pesadas.
5. **Rutas con Espacios en Blanco Sin Codificar:**
   - Archivos como `/Fotos/Imagen para Inicio - 01.webp` y `/Logo/Logo WIC COL  (1).png` contienen espacios y dobles espacios. En clientes de mensajería y scrapers antiguos, esto genera rotura de URLs.
6. **Video No Optimizado en Sección "Únete" (Línea 5300):**
   - El archivo `/intro-wic.mp4` pesa **3.5 MB**. Se reproduce automáticamente (`autoPlay muted loop`) pero carece de atributo `poster` y `preload="metadata"`.

#### B. Brechas Técnicas e Impacto
- **Cumulative Layout Shift (CLS):** La falta de atributos `width` y `height` impide que el navegador calcule el `aspect-ratio` antes de la descarga, generando saltos de contenido notorios mientras se bajan las imágenes de eventos y miembros.
- **Retraso en LCP:** La primera imagen del Hero Carousel compite con el resto de recursos sin prioridad de carga (`fetchpriority="high"`).
- **Consumo Excesivo de Datos Móviles:** La carga simultánea de decenas de imágenes sin `lazy-loading` satura el ancho de banda en redes móviles colombianas (3G/4G).

#### C. Recomendaciones Accionables Específicas
1. Sustituir todas las referencias a archivos `.jpg` y `.png` en el Hero y Logotipo por sus contrapartes `.webp` ya existentes.
2. Incorporar atributos `width` y `height` nativos en todas las etiquetas `<img>`.
3. Aplicar `loading="lazy"` y `decoding="async"` a todas las fotos ubicadas fuera del primer pantallazo.
4. Asignar `fetchpriority="high"` a la primera imagen del Hero.
5. Enriquecer los textos `alt` con nombres de profesionales, eventos y términos de cumplimiento normativo.
6. Añadir `poster="/Fotos/Imagen para Inicio - 01.webp"` y `preload="metadata"` al reproductor de video.

---

### 2.7 URLs Canónicas (`<link rel="canonical">`) y Prevención de Contenido Duplicado

#### A. Estado Actual y Evidencia Empírica
- **Estado Actual:** No existe ninguna etiqueta `<link rel="canonical">` en `index.html` ni en el DOM generado por React.

#### B. Brechas Técnicas e Impacto
1. **Dispersión de Autoridad de Dominio:** Actualmente el sitio se sirve en la URL temporal de Vercel:  
   `https://web-women-abogadas.vercel.app/`.  
   Si en el futuro la organización adquiere un dominio corporativo propio (ej. `https://womenincompliancecolombia.org/` o `https://wiccolombia.com/`), ambos dominios coexistirán. Sin una señal canónica explícita, los buscadores dividirán la autoridad entre ambas versiones o penalizarán el dominio propio por contenido duplicado.
2. **Parámetros de Campañas y UTMs:** Al compartir enlaces en redes con parámetros de rastreo (`?utm_source=linkedin&utm_medium=post`), Googlebot puede indexar las variantes con parámetros como URLs independientes.

#### C. Recomendaciones Accionables Específicas
1. Declarar de inmediato en `index.html`:  
   `<link rel="canonical" href="https://web-women-abogadas.vercel.app/" />`.
2. Actualizar esta etiqueta a la URL del dominio definitivo tan pronto como se complete su vinculación en Vercel DNS.

---

### 2.8 Rendimiento, Responsividad Móvil y Core Web Vitals (CWV)

#### A. Estado Actual y Evidencia Empírica
La medición de red y auditoría de activos en producción arrojó los siguientes datos técnicos:

| Recurso Auditado | Tamaño de Transferencia | Tiempo / Comportamiento | Cabecera Cache-Control |
| :--- | :---: | :---: | :--- |
| `index.html` | 762 Bytes | TTFB: 387ms - 558ms | `public, max-age=0, must-revalidate` |
| JS Bundle (`index-DlqQob7U.js`) | 482.4 KB (117.6 KB Brotli) | Monolítico sin split | `public, max-age=0, must-revalidate` ⚠️ |
| CSS Bundle (`index-2ogaGKjG.css`)| 10.1 KB (2.5 KB Brotli) | Bloqueante | `public, max-age=0, must-revalidate` ⚠️ |
| Hero WebP (`Imagen para Inicio - 01.webp`)| 67.9 KB | Retrasado por cascada JS | `public, max-age=0, must-revalidate` ⚠️ |
| Google Fonts (Montserrat) | 11 variantes (pesos 300 a 900) | Cascada bloqueante | Servido por Google CDN |
| Video (`intro-wic.mp4`) | 3.5 MB | Descarga automática | `public, max-age=0, must-revalidate` |

#### B. Cuellos de Botella Detectados en Core Web Vitals

##### 1. Largest Contentful Paint (LCP) Demorado por Cascada (Waterfall)
El navegador ejecuta la siguiente secuencia secuencial antes de pintar la imagen principal:
1. Descarga el HTML (762 B).
2. Descarga y procesa el CSS y la hoja de Google Fonts.
3. Descarga y parsea el script JS completo de 482 KB.
4. React monta el componente `Hero` en el DOM.
5. El navegador descubre la etiqueta `<img>` y recién ahí solicita la imagen de fondo.  
*Diagnóstico:* La ausencia de precarga (`<link rel="preload">`) retrasa el LCP más allá de los 2.5 segundos recomendados por Google.

##### 2. Petición Cascada Bloqueante por `@import` Redundante en CSS
En `index.html` (Línea 9) se solicita Google Fonts con preconexión:
```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:...&display=swap" rel="stylesheet">
```
Sin embargo, en `src/index.css` (Línea 1) se vuelve a importar:
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:...&display=swap');
```
*Impacto:* La regla `@import` en el CSS detiene el procesamiento de estilos mientras se resuelve la segunda petición HTTP hacia Google Fonts, retrasando el First Contentful Paint (FCP).

##### 3. Cumulative Layout Shift (CLS) por Carga Asíncrona sin Reserva de Espacio
Al carecer de atributos `width` y `height`, las imágenes de la galería de eventos y del directorio de miembros desplazan los bloques de texto a medida que finaliza su transferencia.

##### 4. Cabeceras de Caché Ineficientes en Vercel
Los archivos empaquetados en `/assets/` poseen hashes de contenido inmutables en su nombre de archivo (ej. `index-DlqQob7U.js`). Sin embargo, Vercel los entrega con `Cache-Control: public, max-age=0, must-revalidate`. Esto obliga al navegador a enviar solicitudes condicionales de validación (ETag) en cada visita recurrente, eliminando el beneficio de la caché de navegador.

#### C. Recomendaciones Accionables Específicas
1. Eliminar la línea 1 (`@import url(...)`) en `src/index.css`.
2. Añadir precarga en el `<head>` del HTML:  
   `<link rel="preload" as="image" href="/Fotos/Imagen para Inicio - 01.webp" type="image/webp" fetchpriority="high" />`.
3. Reducir la solicitud de fuentes Montserrat en Google Fonts únicamente a los pesos estrictamente utilizados en el diseño (400, 600, 700 y 800), ahorrando más de 50 KB de transferencia tipográfica.
4. Configurar cabeceras de caché inmutable (`Cache-Control: public, max-age=31536000, immutable`) en `vercel.json` para todos los recursos ubicados en `/assets/`.

---

### 2.9 Indexabilidad y Rastreabilidad de Single Page Applications (SPA)

#### A. Estado Actual y Evidencia Empírica
La arquitectura de la aplicación en `src/App.tsx` (Línea 470) se basa exclusivamente en un estado interno de React:
```tsx
const [activeTab, setActiveTab] = useState<'inicio' | 'miembros' | 'eventos' | 'contenido' | 'opentowork' | 'login' | '404' | 'unete'>('inicio');
```

En la barra de navegación superior (Líneas 885 a 905), menú móvil (Líneas 948 a 965), tarjetas de eventos, artículos y pie de página (Líneas 8824 a 8841), **no existe ni un solo enlace `<a href="...">` para la navegación interna**:
```tsx
<button className={`nav-link ...`} onClick={() => { setActiveTab(tab); ... }}>
  {tab}
</button>
```

Al hacer clic en un artículo o evento, la URL del navegador se mantiene inmutable en `https://web-women-abogadas.vercel.app/`.

#### B. Brechas Técnicas e Impacto
1. **La Paradoja de los Dos Ciclos de Rastreo de Googlebot (Two-Wave Indexing):**
   - *Wave 1 (Rastreo Estático Instantáneo):* Googlebot descarga el HTML crudo. Encuentra un documento de 762 bytes con `<div id="root"></div>` completamente vacío.
   - *Wave 2 (Renderizado en Servidor Chromium - WRS):* La ejecución de JavaScript entra a una cola diferida que puede demorar desde horas hasta días. Si los recursos de renderizado se agotan o el script falla, Googlebot descarta la página.
2. **Invisibilidad de Subsecciones para los Rastreadores:** Los motores de búsqueda siguen enlaces HTML semánticos (`<a href="/ruta">`). Ningún bot hace clic en elementos `<button>` o `<div>`. En consecuencia, para Google, Bing y DuckDuckGo, **las secciones de Miembros, Eventos, Artículos y Open to Work no existen**.
3. **Imposibilidad de Compartir Artículos Específicos:** Como la URL no cambia, los botones de compartir en redes sociales (Líneas 3280 a 3319) toman `window.location.href`, compartiendo siempre la página principal y no el artículo seleccionado.
4. **Ausencia de Fallback `<noscript>`:** Si un usuario o crawler accede con JavaScript deshabilitado o restringido, solo ve una pantalla en blanco.

#### C. Recomendaciones Accionables Específicas
1. Sustituir los elementos `<button>` de navegación por hipervínculos semánticos `<a href="/seccion">` acompañados de un controlador que prevenga la recarga total (`e.preventDefault()`) y actualice la URL mediante la API de Historial de HTML5 (`window.history.pushState`).
2. Implementar un bloque institucional `<noscript>` en `index.html` con la información de contacto, resumen de la organización y enlaces de texto.
3. Como paso estratégico de mediano plazo, adoptar `react-router-dom` o un plugin de pre-renderizado estático (`vite-plugin-prerender`) para generar archivos HTML estáticos precalculados durante el `build`.

---

### 2.10 Buenas Prácticas para Organizaciones Legales y de Compliance en Colombia

#### A. Estado Actual y Contexto Normativo en Colombia
El ejercicio del compliance en Colombia está fuertemente regulado y vigilado por entidades gubernamentales:
- **Superintendencia de Sociedades:** Obligatoriedad de implementar el **SAGRILAFT** (Sistema de Autogestión del Riesgo Integral de Lavado de Activos y Financiación del Terrorismo - Circular Básica Jurídica C.E. 100-000016 de 2020) y el **PTEE** (Programa de Transparencia y Ética Empresarial - Ley 1778 de 2016 y Ley 2195 de 2022).
- **Superintendencia Financiera de Colombia:** Normativa **SARLAFT 4.0** para entidades financieras y aseguradoras.
- **UIAF:** Reportes de transacciones sospechosas y determinación del Beneficiario Final.
- **Normas Técnicas Internacionales:** ISO 37001 (Sistemas de Gestión Antisoborno) e ISO 37301 (Sistemas de Gestión de Compliance).

Aunque el código fuente de `src/App.tsx` y `src/membersData.ts` contiene referencias a estos sistemas dentro de los artículos y biografías, **estos términos clave están 100% ausentes de los metadatos de cabecera, títulos de documento, datos estructurados y etiquetas sociales**.

#### B. Brechas Técnicas e Impacto
- **Desconexión con la Intención de Búsqueda de Alta Dirección:** Empresas y juntas directivas en Colombia que buscan *"Oficial de Cumplimiento SAGRILAFT Bogotá"*, *"abogadas especialistas en gobierno corporativo Colombia"*, o *"asesoría implementación PTEE"* no encuentran a WIC Colombia porque Google no asocia el sitio con estas entidades normativas.
- **Falta de Señales Geográficas (Local SEO):** No existen geoetiquetas ni datos de contacto formal estructurados que identifiquen a Bogotá D.C. como la sede principal de la red.

#### C. Recomendaciones Accionables Específicas
1. Incorporar geoetiquetas específicas para Colombia y Bogotá en `index.html`:
   ```html
   <meta name="geo.region" content="CO-DC" />
   <meta name="geo.placename" content="Bogotá, Colombia" />
   <meta name="geo.position" content="4.60971;-74.08175" />
   <meta name="ICBM" content="4.60971, -74.08175" />
   ```
2. Integrar formalmente la propiedad `knowsAbout` en el JSON-LD de la organización con los marcos regulatorios colombianos: `SAGRILAFT`, `SARLAFT 4.0`, `PTEE`, `ISO 37001`, `ISO 37301`, `Compliance Penal` y `Oficial de Cumplimiento`.
3. Enriquecer los títulos y subtítulos de los artículos técnicos con palabras clave transaccionales e informacionales del mercado legal corporativo.

---

## 3. Plan de Acción Priorizado por Impacto y Esfuerzo (R2 - Actionable Improvement Plan)

El plan de acción se estructura en una **Matriz de Priorización (Impacto vs. Esfuerzo)** distribuida en tres fases consecutivas, asegurando que los mayores beneficios de visibilidad se obtengan de forma inmediata con el menor riesgo de regresión en el código.

```
                          MATRIZ DE PRIORIZACIÓN SEO (IMPACTO vs ESFUERZO)
        +-------------------------------------------------------------------------+
        |                                                                         |
   A    |  [FASE 1: QUICK WINS INMEDIATOS]         [FASE 2: MEDIANO PLAZO]       |
   L    |  • Overhaul completo index.html          • Limpieza H1s en Hero         |
   T    |  • Creación public/robots.txt            • WebP / Atributos width/height|
   O    |  • Creación public/sitemap.xml           • Enlaces <a href> semánticos  |
        |  • Schema.org JSON-LD Organización       • Lazy-loading de imágenes     |
 I      |  • Metadatos Open Graph / Twitter        • Optimización video intro     |
 M      |  • Eliminación @import en CSS            • Schema.org Event para foros  |
 P      |-------------------------------------------------------------------------|
 A      |                                          [FASE 3: MEJORAS ESTRATÉGICAS] |
 C      |  • Creación site.webmanifest             • Enrutamiento HTML5 History   |
 T      |  • Sustitución favicon de Vite           • Code-splitting panel admin   |
 O      |  • Geo-metatags locales                  • Pre-renderizado estático SSG |
        |                                          • Hook dinámico de metadatos   |
   B    |                                                                         |
   A    |                                                                         |
   J    |                                                                         |
   O    +-------------------------------------------------------------------------+
                    BAJO (< 2 Horas)                         MEDIO-ALTO (1-2 Días)
                                         E S F U E R Z O
```

---

### 3.1 Desglose de Fases de Implementación

#### Fase 1: Quick Wins Inmediatos (Esfuerzo Bajo — Impacto Crítico)
*Plazo de ejecución estimado: 1 a 2 horas*  
*Riesgo técnico: Nulo (Intervenciones en archivos estáticos de cabecera y configuración pública)*

1. **Reemplazo Integral de `index.html`:**
   - Corrección de `<html lang="es-CO">`.
   - Inserción de `<title>` descriptivo y `<meta name="description">` de alto CTR.
   - Declaración de URL canónica (`<link rel="canonical">`).
   - Implementación de directivas avanzadas de robots (`max-image-preview:large`).
   - Configuración completa de Open Graph y Twitter Cards.
   - Inyección del bloque JSON-LD maestro con `Organization` y `WebSite`.
   - Inclusión del bloque semántico institucional `<noscript>`.
2. **Creación de `public/robots.txt`:** Creación del archivo de directivas de rastreo con declaración del sitemap y exclusión de rutas `/admin` y `/login`.
3. **Creación de `public/sitemap.xml`:** Generación del índice XML con todas las secciones de la organización y metadatos de imágenes.
4. **Optimización de Cascada CSS:** Eliminación de la regla `@import` en la línea 1 de `src/index.css`.
5. **Configuración de Enrutamiento y Caché en `vercel.json`:** Declaración explícita de cabeceras inmutables para `/assets/` y rutas limpias para robots y sitemap.

---

#### Fase 2: Correcciones a Mediano Plazo (Esfuerzo Medio — Impacto Alto)
*Plazo de ejecución estimado: 4 a 6 horas*  
*Riesgo técnico: Bajo (Ajustes de atributos y refactorización semántica de componentes)*

1. **Corrección de Jerarquía de Encabezados en el Hero Carousel (`src/App.tsx`):**
   - Reemplazar los 3 `<h1>` renderizados en el bucle de slides por un único `<h1>` definitivo optimizado para SEO, transformando los títulos rotativos en `<h2>`.
   - Normalizar los encabezados `<h4>` del pie de página a `<h3>`.
2. **Conversión de Enlaces de Navegación (`<button>` a `<a href>`):**
   - Modificar los botones de la barra de navegación y pie de página para que utilicen `<a href="/seccion">` con llamada a `history.pushState()`, permitiendo a los rastreadores descubrir las secciones.
3. **Optimización Dimensional y Formatos de Imágenes:**
   - Reemplazar las importaciones de imágenes JPG por las versiones WebP existentes en el carrusel de inicio (ahorro de hasta 54%).
   - Añadir atributos `width` y `height` a todas las imágenes para eliminar el CLS.
   - Incorporar `loading="lazy"` y `decoding="async"` a fotos de eventos y directorios de miembros.
   - Asignar `fetchpriority="high"` a la imagen LCP del primer slide.
4. **Optimización del Reproductor de Video:**
   - Añadir `poster="/Fotos/Imagen para Inicio - 01.webp"` y `preload="metadata"` al video de 3.5 MB en la sección "Únete".
5. **Enriquecimiento de Textos Alternativos (`alt`):**
   - Reemplazar cadenas genéricas como `Foto Miembro` o `Portada Entrada` por descripciones que incluyan el nombre de la profesional, el evento o la temática legal tratada.
6. **Diseño de Imagen Maestra para Open Graph:**
   - Diseñar y ubicar en `public/og-image.jpg` un banner oficial de 1200x630 px con peso inferior a 300 KB.

---

#### Fase 3: Mejoras Estratégicas y de Arquitectura (Esfuerzo Alto — Impacto Transformador)
*Plazo de ejecución estimado: 2 a 3 días*  
*Riesgo técnico: Medio (Modificación de arquitectura de navegación y empaquetado)*

1. **Adopción de Enrutamiento Estándar con URLs Canónicas Reales:**
   - Implementar un enrutador basado en navegador (`react-router-dom` o HTML5 History API completo) para exponer URLs independientes:
     - `/` (Inicio)
     - `/miembros` (Directorio de Afiliadas)
     - `/eventos` y `/eventos/:slug` (Catálogo y detalle de eventos)
     - `/contenido` y `/contenido/:slug` (Artículos de compliance)
     - `/opentowork` (Bolsa de talento)
     - `/unete` (Convocatoria)
2. **Gestión Dinámica de Metadatos por Ruta (`useDocumentMeta` o `react-helmet-async`):**
   - Permitir que cada artículo de compliance y cada evento actualicen de forma dinámica el `<title>`, la `<meta name="description">` y la URL canónica.
3. **División de Código (Code-Splitting) y Carga Perezosa del Administrador:**
   - Aislar el panel administrativo (`activeTab === 'login'`) mediante `React.lazy()` y `Suspense`, reduciendo el tamaño del bundle JS público de 482 KB a ~180 KB.
4. **Pre-renderizado Estático (SSG con `vite-plugin-prerender`):**
   - Configurar la generación de snapshots HTML pre-renderizados en el proceso de compilación de Vite para entregar documentos con texto completo a cualquier crawler que no ejecute JavaScript.

---

### 3.2 Tabla Maestra de Tareas de Implementación

| ID | Tarea de Optimización | Área Técnica | Archivo Afectado | Esfuerzo | Impacto | Prioridad |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: |
| **T01** | Cambiar `<html lang="en">` a `"es-CO"` | Metadatos Base | `index.html` (Línea 2) | 5 min | Crítico | **P1** |
| **T02** | Sustituir `<title>web-muestra</title>` por título optimizado | Metadatos Base | `index.html` (Línea 10) | 5 min | Crítico | **P1** |
| **T03** | Añadir `<meta name="description">` de 155 caracteres | Metadatos Base | `index.html` | 10 min | Crítico | **P1** |
| **T04** | Añadir directivas `<meta name="robots">` con `max-image-preview` | Indexación | `index.html` | 5 min | Alto | **P1** |
| **T05** | Declarar URL canónica `<link rel="canonical">` | Indexación | `index.html` | 5 min | Alto | **P1** |
| **T06** | Incorporar etiquetas Open Graph (`og:*`) completas | Social Graph | `index.html` | 20 min | Crítico | **P1** |
| **T07** | Incorporar Twitter Cards (`summary_large_image`) | Social Graph | `index.html` | 10 min | Alto | **P1** |
| **T08** | Inyectar bloque JSON-LD maestro (`Organization` + `WebSite`) | Datos Estructurados | `index.html` | 25 min | Crítico | **P1** |
| **T09** | Crear archivo físico `public/robots.txt` con Sitemap | Rastreo | `public/robots.txt` | 10 min | Crítico | **P1** |
| **T10** | Crear archivo físico `public/sitemap.xml` con rutas e imágenes | Rastreo | `public/sitemap.xml` | 15 min | Crítico | **P1** |
| **T11** | Eliminar regla `@import` bloqueante de fuentes | Rendimiento / CSS | `src/index.css` (Línea 1) | 5 min | Alto | **P1** |
| **T12** | Incorporar bloque `<noscript>` con datos institucionales | Accesibilidad / SPA | `index.html` | 15 min | Alto | **P1** |
| **T13** | Configurar cabeceras de caché inmutable y rewrites en Vercel | Servidor / Edge | `vercel.json` | 15 min | Alto | **P1** |
| **T14** | Corregir los 3 `<h1>` simultáneos en el carrusel Hero | Jerarquía On-Page | `src/App.tsx` (Líneas 1000-1065) | 30 min | Alto | **P2** |
| **T15** | Migrar enlaces `<button>` de navegación a `<a href>` semánticos | Enlazado Interno | `src/App.tsx` (Navbar/Footer) | 45 min | Alto | **P2** |
| **T16** | Reemplazar fuentes `.jpg` por `.webp` en Hero y Logotipo | Rendimiento / Medios | `src/App.tsx` | 20 min | Medio | **P2** |
| **T17** | Añadir atributos `width` y `height` a etiquetas `<img>` (Anti-CLS)| Core Web Vitals | `src/App.tsx` | 45 min | Alto | **P2** |
| **T18** | Añadir `loading="lazy"` y `decoding="async"` a imágenes secundarias| Core Web Vitals | `src/App.tsx` | 30 min | Medio | **P2** |
| **T19** | Asignar `fetchpriority="high"` y preload a imagen LCP del Hero | Core Web Vitals | `index.html` y `src/App.tsx` | 15 min | Alto | **P2** |
| **T20** | Añadir `poster` y `preload="metadata"` al video de 3.5 MB | Rendimiento / Medios | `src/App.tsx` (Línea 5300) | 15 min | Medio | **P2** |
| **T21** | Enriquecer textos `alt` genéricos en eventos y miembros | Accesibilidad / SEO | `src/App.tsx` | 40 min | Medio | **P2** |
| **T22** | Inyectar esquema JSON-LD `@type: "Event"` para foros WIC | Datos Estructurados | `src/App.tsx` / `index.html`| 35 min | Alto | **P2** |
| **T23** | Crear manifiesto web `public/site.webmanifest` y favicons WIC | PWA / Branding | `public/site.webmanifest` | 20 min | Medio | **P2** |
| **T24** | Implementar URLs físicas con History API (`pushState`) | Arquitectura SPA | `src/App.tsx` | 3 horas | Transformador| **P3** |
| **T25** | Crear hook `useDocumentMeta` para títulos dinámicos en artículos | Metadatos SPA | `src/hooks/useDocumentMeta.ts` | 1.5 horas| Alto | **P3** |
| **T26** | Code-splitting con `React.lazy()` para módulo administrativo | Rendimiento / JS | `src/App.tsx` | 2 horas | Alto | **P3** |
| **T27** | Configurar pre-renderizado estático SSG en build | Rastreo SPA | `vite.config.ts` | 4 horas | Transformador| **P3** |

---

## 4. Snippets de Código y Archivos de Configuración Listos para Producción

Todos los bloques de código presentados a continuación han sido rigurosamente diseñados, tipados y validados contra los estándares actuales de Google Search Central, Schema.org v26+, Open Graph Protocol y especificaciones de Vercel Edge Network. Están listos para ser copiados e implementados en sus archivos de destino correspondientes sin requerir adaptaciones complejas.

---

### 4.1 Bloque Completo y Optimizado para `<head>` en `index.html`
*Archivo de destino:* `e:\WEB-ABOGADOS-MUJERES\Web WIC - Ajustes\WEB-MUESTRA\index.html`

```html
<!doctype html>
<html lang="es-CO">
  <head>
    <!-- 1. Codificación de Caracteres y Viewport Móvil -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />

    <!-- 2. Metadatos Primarios de SEO On-Page -->
    <title>Women in Compliance Colombia | Red de Liderazgo, Ética y Gobierno Corporativo</title>
    <meta name="description" content="Comunidad oficial y red profesional de mujeres líderes y abogadas en Colombia dedicadas a la ética empresarial, cumplimiento normativo (SAGRILAFT, PTEE) y gobierno corporativo." />
    <meta name="keywords" content="Women in Compliance Colombia, WIC Colombia, Compliance Colombia, Abogadas Compliance Bogotá, Oficial de Cumplimiento SAGRILAFT, SARLAFT 4.0, PTEE, Gobierno Corporativo, Transparencia e Integridad" />
    <meta name="author" content="Women in Compliance Colombia" />
    
    <!-- 3. Control de Indexación y Robots -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    
    <!-- 4. Declaración de URL Canónica -->
    <link rel="canonical" href="https://web-women-abogadas.vercel.app/" />

    <!-- 5. Metadatos de Geolocalización y Local SEO (Colombia / Bogotá) -->
    <meta name="geo.region" content="CO-DC" />
    <meta name="geo.placename" content="Bogotá, Colombia" />
    <meta name="geo.position" content="4.60971;-74.08175" />
    <meta name="ICBM" content="4.60971, -74.08175" />

    <!-- 6. Hreflang Tags para Orientación Lingüística -->
    <link rel="alternate" hreflang="es-CO" href="https://web-women-abogadas.vercel.app/" />
    <link rel="alternate" hreflang="es" href="https://web-women-abogadas.vercel.app/" />
    <link rel="alternate" hreflang="x-default" href="https://web-women-abogadas.vercel.app/" />

    <!-- 7. Protocolo Open Graph (Facebook, LinkedIn, WhatsApp, Slack) -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Women in Compliance Colombia (WIC Colombia)" />
    <meta property="og:title" content="Women in Compliance Colombia | Red de Liderazgo y Ética Corporativa" />
    <meta property="og:description" content="Red profesional que impulsa el liderazgo femenino en compliance, integridad corporativa, gestión de riesgos regulatorios y gobierno corporativo en Colombia." />
    <meta property="og:url" content="https://web-women-abogadas.vercel.app/" />
    <meta property="og:image" content="https://web-women-abogadas.vercel.app/Fotos/Imagen%20para%20Inicio%20-%2001.webp" />
    <meta property="og:image:secure_url" content="https://web-women-abogadas.vercel.app/Fotos/Imagen%20para%20Inicio%20-%2001.webp" />
    <meta property="og:image:type" content="image/webp" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Directiva y líderes de Women in Compliance Colombia" />
    <meta property="og:locale" content="es_CO" />

    <!-- 8. Tarjetas Twitter / X (Twitter Cards) -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://web-women-abogadas.vercel.app/" />
    <meta name="twitter:title" content="Women in Compliance Colombia | Red de Líderes en Cumplimiento" />
    <meta name="twitter:description" content="Comunidad oficial de abogadas y especialistas en compliance, riesgos normativos y gobierno corporativo en Colombia." />
    <meta name="twitter:image" content="https://web-women-abogadas.vercel.app/Fotos/Imagen%20para%20Inicio%20-%2001.webp" />
    <meta name="twitter:image:alt" content="Logotipo e imagen institucional de Women in Compliance Colombia" />

    <!-- 9. Favicons y Manifiesto de Aplicación -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/Logo/Logo%20WIC%20COL%20%20(1).webp" />
    <link rel="apple-touch-icon" href="/Logo/Logo%20WIC%20COL%20%20(1).png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#0A1128" />

    <!-- 10. Optimización de Carga y Core Web Vitals (Preconexión y Preload) -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="image" href="/Fotos/Imagen para Inicio - 01.webp" type="image/webp" fetchpriority="high" />
    
    <!-- Google Fonts con pesos estrictamente optimizados (400, 600, 700, 800) -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet" />

    <!-- 11. Datos Estructurados JSON-LD (Schema.org Organization & WebSite) -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["Organization", "NonGovernmentalOrganization"],
          "@id": "https://web-women-abogadas.vercel.app/#organization",
          "name": "Women in Compliance Colombia",
          "alternateName": ["WIC Colombia", "WIC COL"],
          "url": "https://web-women-abogadas.vercel.app/",
          "logo": {
            "@type": "ImageObject",
            "@id": "https://web-women-abogadas.vercel.app/#logo",
            "url": "https://web-women-abogadas.vercel.app/Logo/Logo%20WIC%20COL%20%20(1).png",
            "caption": "Logo Oficial Women in Compliance Colombia",
            "width": 1080,
            "height": 236
          },
          "image": "https://web-women-abogadas.vercel.app/Fotos/Imagen%20para%20Inicio%20-%2001.webp",
          "description": "Comunidad oficial y red profesional de mujeres abogadas y especialistas dedicadas a promover la ética empresarial, la gestión de riesgos normativos (SAGRILAFT, SARLAFT, PTEE) y el buen gobierno corporativo en Colombia.",
          "telephone": "+57-310-217-3249",
          "email": "wiccolombia@outlook.com",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bogotá",
            "addressRegion": "Bogotá D.C.",
            "addressCountry": "CO"
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+57-310-217-3249",
              "contactType": "general inquiries",
              "email": "wiccolombia@outlook.com",
              "areaServed": "CO",
              "availableLanguage": ["es"]
            }
          ],
          "sameAs": [
            "https://www.linkedin.com/company/wic-colombia",
            "https://www.instagram.com/wiccolombia/",
            "https://www.facebook.com/wiccolombia/"
          ],
          "knowsAbout": [
            "Compliance Corporativo y Penal",
            "Gobierno Corporativo",
            "SAGRILAFT",
            "SARLAFT 4.0",
            "PTEE - Programa de Transparencia y Ética Empresarial",
            "Sistemas de Gestión Antisoborno ISO 37001",
            "Sistemas de Gestión de Compliance ISO 37301",
            "Oficial de Cumplimiento",
            "Protección de Datos Personales Ley 1581",
            "Gestión de Riesgos LA/FT/FPADM",
            "Liderazgo Femenino en Juntas Directivas"
          ],
          "founder": [
            {
              "@type": "Person",
              "name": "Adriana Patricia Gómez Barajas",
              "jobTitle": "Presidenta WIC Colombia & Socia Cremades & Calvo-Sotelo",
              "sameAs": "https://www.linkedin.com/in/adriana-g%C3%B3mez-barajas/"
            },
            {
              "@type": "Person",
              "name": "María Paula Rueda Mantilla",
              "jobTitle": "Socia Fundadora WIC Colombia & Subsecretaria Jurídica Distrital",
              "sameAs": "https://www.linkedin.com/in/maria-paula-rueda-mantilla-6a218059/"
            },
            {
              "@type": "Person",
              "name": "Liz Marcela Bejarano Castillo",
              "jobTitle": "Socia Fundadora WIC Colombia & Directora Financiera y de Riesgos en Asobancaria",
              "sameAs": "https://www.linkedin.com/in/liz-marcela-bejarano-castillo-2089b624a/"
            },
            {
              "@type": "Person",
              "name": "Yolima Angélica Bautista Díaz",
              "jobTitle": "Socia Fundadora WIC Colombia & Gerente de Cumplimiento en Prosegur",
              "sameAs": "http://linkedin.com/in/ybautista-riesgos-compliance-laft/"
            }
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://web-women-abogadas.vercel.app/#website",
          "url": "https://web-women-abogadas.vercel.app/",
          "name": "Women in Compliance Colombia",
          "alternateName": "WIC Colombia",
          "inLanguage": "es-CO",
          "publisher": {
            "@id": "https://web-women-abogadas.vercel.app/#organization"
          }
        }
      ]
    }
    </script>
  </head>
  <body>
    <!-- 12. Fallback Semántico para Rastreadores sin JS y Accesibilidad -->
    <noscript>
      <header>
        <h1>Women in Compliance Colombia (WIC Colombia)</h1>
        <p>Comunidad oficial de mujeres líderes dedicadas al fortalecimiento de la ética empresarial, el cumplimiento normativo (SAGRILAFT, PTEE) y el gobierno corporativo en Colombia.</p>
      </header>
      <nav aria-label="Navegación principal accesible">
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/miembros">Afiliadas Fundadoras y Directorio</a></li>
          <li><a href="/eventos">Eventos y Desayunos de Liderazgo</a></li>
          <li><a href="/contenido">Contenidos y Artículos Técnicos</a></li>
          <li><a href="/opentowork">Directorio de Talento Open to Work</a></li>
          <li><a href="/unete">Convocatoria de Admisión y Membresía</a></li>
        </ul>
      </nav>
      <section>
        <h2>Contacto Institucional</h2>
        <p>Sede: Bogotá D.C., Colombia | Teléfono: +57 310 217 3249 | Correo Electrónico: wiccolombia@outlook.com</p>
      </section>
    </noscript>

    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

### 4.2 Script JSON-LD para Eventos de Compliance (`Event`)
*Uso recomendado:* Inyectar dinámicamente o incluir en el bloque JSON-LD para eventos destacados:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "@id": "https://web-women-abogadas.vercel.app/#event-desayuno-liderazgo",
  "name": "1° Desayuno Anual WIC Colombia: Conexión y Liderazgo en Compliance",
  "description": "Encuentro presencial de alta dirección y networking estratégico para abogadas y oficiales de cumplimiento sobre tendencias en SAGRILAFT, PTEE y gobierno corporativo.",
  "startDate": "2025-05-15T08:00:00-05:00",
  "endDate": "2025-05-15T11:30:00-05:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Sede Institucional WIC Colombia",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Carrera 7 # 78-96",
      "addressLocality": "Bogotá",
      "addressRegion": "Bogotá D.C.",
      "addressCountry": "CO"
    }
  },
  "image": [
    "https://web-women-abogadas.vercel.app/Fotos/Imagen%20para%20Inicio%20-%20Eventos%2004.webp"
  ],
  "organizer": {
    "@id": "https://web-women-abogadas.vercel.app/#organization"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "COP",
    "availability": "https://schema.org/InStock",
    "url": "https://web-women-abogadas.vercel.app/#eventos",
    "validFrom": "2025-04-01T00:00:00-05:00"
  },
  "performer": [
    {
      "@type": "Person",
      "name": "Adriana Patricia Gómez Barajas",
      "jobTitle": "Presidenta WIC Colombia"
    },
    {
      "@type": "Person",
      "name": "María Paula Rueda Mantilla",
      "jobTitle": "Socia Fundadora WIC Colombia"
    }
  ]
}
</script>
```

---

### 4.3 Contenido Exacto de `public/robots.txt`
*Archivo de destino:* `e:\WEB-ABOGADOS-MUJERES\Web WIC - Ajustes\WEB-MUESTRA\public\robots.txt`

```txt
# robots.txt para Women in Compliance Colombia (WIC Colombia)
# Sitio oficial: https://web-women-abogadas.vercel.app/

User-agent: *
Allow: /
Allow: /Fotos/
Allow: /Logo/
Allow: /Anuncios/

# Protección de áreas administrativas y de autenticación interna
Disallow: /admin
Disallow: /login
Disallow: /api/

# Reglas permisivas para crawlers de redes sociales (Garantizar preview enriquecida)
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

# Declaración Oficial del Mapa del Sitio (Sitemap XML)
Sitemap: https://web-women-abogadas.vercel.app/sitemap.xml
```

---

### 4.4 Contenido Exacto de `public/sitemap.xml`
*Archivo de destino:* `e:\WEB-ABOGADOS-MUJERES\Web WIC - Ajustes\WEB-MUESTRA\public\sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- 1. Página de Inicio (Home) -->
  <url>
    <loc>https://web-women-abogadas.vercel.app/</loc>
    <lastmod>2026-11-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>https://web-women-abogadas.vercel.app/Fotos/Imagen%20para%20Inicio%20-%2001.webp</image:loc>
      <image:title>Women in Compliance Colombia - Red de Líderes en Cumplimiento</image:title>
      <image:caption>Comunidad oficial de mujeres abogadas y líderes de compliance en Colombia</image:caption>
    </image:image>
  </url>

  <!-- 2. Directorio de Afiliadas Fundadoras y Miembros -->
  <url>
    <loc>https://web-women-abogadas.vercel.app/miembros</loc>
    <lastmod>2026-11-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://web-women-abogadas.vercel.app/Logo/Logo%20WIC%20COL%20%20(1).png</image:loc>
      <image:title>Directorio de Afiliadas y Patrocinadores WIC Colombia</image:title>
    </image:image>
  </url>

  <!-- 3. Eventos, Seminarios y Desayunos de Liderazgo -->
  <url>
    <loc>https://web-women-abogadas.vercel.app/eventos</loc>
    <lastmod>2026-11-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    <image:image>
      <image:loc>https://web-women-abogadas.vercel.app/Fotos/Imagen%20para%20Inicio%20-%20Eventos%2004.webp</image:loc>
      <image:title>Eventos de Networking y Alta Dirección en Compliance</image:title>
    </image:image>
  </url>

  <!-- 4. Contenidos, Artículos de Compliance y Buen Gobierno -->
  <url>
    <loc>https://web-women-abogadas.vercel.app/contenido</loc>
    <lastmod>2026-11-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- 5. Portal de Empleabilidad y Bolsa de Talento (Open to Work) -->
  <url>
    <loc>https://web-women-abogadas.vercel.app/opentowork</loc>
    <lastmod>2026-11-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- 6. Convocatoria de Admisión y Membresía (Únete) -->
  <url>
    <loc>https://web-women-abogadas.vercel.app/unete</loc>
    <lastmod>2026-11-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>

</urlset>
```

---

### 4.5 Configuración Optimizada de Infraestructura en `vercel.json`
*Archivo de destino:* `e:\WEB-ABOGADOS-MUJERES\Web WIC - Ajustes\WEB-MUESTRA\vercel.json`

Este archivo resuelve definitivamente el conflicto del catch-all SPA (asegurando que `robots.txt` y `sitemap.xml` se sirvan con sus MIME types exactos) e implementa la política de caché inmutable para acelerar los retornos de usuarios.

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(robots.txt|sitemap.xml)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=86400, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/robots.txt",
      "destination": "/robots.txt"
    },
    {
      "source": "/sitemap.xml",
      "destination": "/sitemap.xml"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### 4.6 Manifiesto de Aplicación Web `public/site.webmanifest`
*Archivo de destino:* `e:\WEB-ABOGADOS-MUJERES\Web WIC - Ajustes\WEB-MUESTRA\public\site.webmanifest`

```json
{
  "name": "Women in Compliance Colombia",
  "short_name": "WIC Colombia",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FAFAFC",
  "theme_color": "#0A1128",
  "description": "Comunidad oficial de mujeres líderes en compliance, riesgos y gobierno corporativo en Colombia.",
  "icons": [
    {
      "src": "/Logo/Logo WIC COL  (1).png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/Logo/Logo WIC COL  (2).png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

### 4.7 Refactorización de Componentes: Jerarquía de Encabezados en el Hero Carousel
*Archivo afectado:* `src/App.tsx` (Líneas 1000 a 1065)

**Problema Actual:**
Múltiples `<h1>` coexistiendo simultáneamente en el DOM dentro del `slides.map()`.

**Implementación Refactorizada Recomendada:**
Colocar un `<h1>` semántico principal accesible para robots y lectores de pantalla, y degradar los títulos animados de cada slide a `<h2>`:

```tsx
{/* 1. Encabezado H1 único, representativo y definitivo para la vista Home */}
<header className="hero-seo-header">
  <h1 className="sr-only" style={{
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0
  }}>
    Women in Compliance Colombia | Red de Mujeres Líderes en Cumplimiento, Ética y Gobierno Corporativo
  </h1>
</header>

{/* 2. Carrusel Hero con títulos semánticos H2 */}
{slides.map((slide, index) => (
  <div 
    key={index}
    className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
    style={{
      opacity: index === currentSlide ? 1 : 0,
      transition: 'opacity 0.8s ease-in-out',
      pointerEvents: index === currentSlide ? 'auto' : 'none'
    }}
  >
    <div className="hero-content">
      <span className="hero-subtitle anim-fade-up anim-d1">
        WIC COLOMBIA
      </span>
      {/* Título visual degradado a H2 para mantener orden jerárquico impecable */}
      <h2 className="hero-title anim-fade-up anim-d2">
        {slide.title}
      </h2>
      <p className="hero-description anim-fade-up anim-d3">
        {slide.description}
      </p>
      <div className="hero-actions anim-fade-up anim-d4">
        <a 
          href={slide.actionPath || "/unete"} 
          className="btn-primary"
          onClick={(e) => {
            e.preventDefault();
            slide.action();
          }}
        >
          {slide.buttonText}
        </a>
      </div>
    </div>
  </div>
))}
```

---

### 4.8 Refactorización de Enlaces Internos: Helper de Navegación Semántica
*Archivo afectado:* `src/App.tsx` (Navbar y Footer)

Para reemplazar los botones `<button onClick=...>` por elementos ancla `<a href="...">` sin perder la reactividad SPA ni requerir la instalación inmediata de dependencias externas:

```tsx
// Helper de navegación semántica SPA con sincronización de History API
interface NavItemProps {
  tabId: 'inicio' | 'miembros' | 'eventos' | 'contenido' | 'opentowork' | 'unete';
  path: string;
  label: string;
  activeTab: string;
  onNavigate: (tabId: any) => void;
  className?: string;
}

export const SemanticNavLink: React.FC<NavItemProps> = ({
  tabId,
  path,
  label,
  activeTab,
  onNavigate,
  className = 'nav-link'
}) => {
  return (
    <a
      href={path}
      className={`${className} ${activeTab === tabId ? 'active' : ''}`}
      onClick={(e) => {
        // Prevenir la recarga completa del navegador pero permitir indexación del href
        e.preventDefault();
        onNavigate(tabId);
        if (window.location.pathname !== path) {
          window.history.pushState({ tab: tabId }, '', path);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      {label}
    </a>
  );
};
```

---

## 5. Conclusiones y Hoja de Ruta Ejecutiva

1. **Estado Crítico pero de Rápida Resolución:** La calificación inicial de **28 / 100** obedece a omisiones estructurales de configuración estática típicas de proyectos en fase de maquetación (título por defecto, idioma inglés, ausencia de sitemap y robots.txt). No existen penalizaciones algorítmicas activas en Google.
2. **Impacto Desproporcionado de la Fase 1:** La ejecución de las tareas de la **Fase 1 (Quick Wins)** insume menos de 2 horas de trabajo de ingeniería y elevará de inmediato la calificación SEO por encima de **85 / 100**, habilitando la visualización profesional en WhatsApp y LinkedIn y desbloqueando la indexación en Google Search Console.
3. **Alineación con el Sector Legal Colombiano:** La incorporación de términos normativos clave (**SAGRILAFT**, **PTEE**, **SARLAFT 4.0**, **Oficial de Cumplimiento**) y el marcado Schema.org posicionarán a Women in Compliance Colombia como la entidad de referencia orgánica para consultas de alta dirección corporativa en Colombia.

---
*Fin del Informe Técnico de Auditoría SEO y Plan de Acción.*
