# Trampas del stack — Portfolio Gotya

Bugs que **no dan error**: el build pasa, el linter no avisa, y el síntoma es
"no cambió nada". Leer antes de debuggear cualquier cosa que parezca no aplicarse.

---

## Tailwind v4 + CSS Cascade Layers

El bug más caro del proyecto.

Las utilities (`px-*`, `mt-*`) viven dentro de `@layer utilities`. Una regla
**fuera** de cualquier `@layer` gana siempre, sin importar la especificidad.
Una sola línea `* { padding: 0 }` unlayered mata todas las utilities de padding
del proyecto.

- ❌ Nunca `padding`/`margin` en una regla universal `* { }` sin layer.
- ✅ El preflight de Tailwind ya resetea los elementos correctos (h1-h6, p, ul, ol).
- ✅ Reset custom → dentro de `@layer base { }`.
- ✅ Los inline styles siempre ganan (1,0,0,0): son el escape hatch, pero
  indican un bug abajo.

🔍 **Si algo "no cambia nada", revisar `globals.css` buscando reglas universales
antes de seguir debuggeando.** Costó 3 iteraciones descubrirlo.

### Corolario del hover (mordió 14 veces)

Si una propiedad cambia en `hover:`, su valor base **NO** puede venir de `style`
inline: el hover no se ve nunca y el build no lo detecta. El valor base va como
utility (`text-(--ink-secondary)`, `border-(--border-default)`, `bg-transparent`)
para que la variante `hover:` pueda ganarle. Las props que NO cambian en hover
pueden seguir en `style`.

🔍 Para auditarlo: buscar etiquetas JSX con una utility `hover:text-*` /
`hover:border-*` / `hover:bg-*` **y a la vez** un `style` inline con `color` /
`borderColor` / `backgroundColor`. Ojo con parsear la etiqueta hasta el primer
`>`: los `=>` de los handlers la cortan al medio y se escapan casos.

### Inline styles de spacing

Son síntoma, no prolijidad rota. Antes de sacarlos, verificar que las utilities
funcionen: si están muertas por el bug de arriba, al sacarlos quedás con cero padding.

---

## Next.js 16 — no es el Next que conocés

- El middleware se llama **`proxy.ts`** (en `src/`), no `middleware.ts`, y
  exporta `proxy`.
- `params` es una **Promise**: siempre `const { locale } = await params`.
- Ante cualquier duda de API, leer `node_modules/next/dist/docs/` antes de
  escribir código.

### Sacar un slug de `generateStaticParams` NO lo despublica

Por defecto `dynamicParams` es `true`: un slug que no está en la lista **se
genera a pedido** la primera vez que alguien entra. Si los datos del proyecto
siguen en el repo, la página se ve igual, y el build ni lo menciona: la lista
de rutas sale más corta y parece que funcionó.

Lo que da el 404 es **`export const dynamicParams = false`** en la page.
Pasó al despublicar Multibrand, Recuérdalo y Cabify (`CLAUDE.md` §8). Como
segunda red, la page busca el proyecto en `publishedProjects` y llama a
`notFound()` si no está.

⚠️ `dynamicParams` **no existe si se activa Cache Components** en
`next.config` (lo dice `node_modules/next/dist/docs/`). Si algún día se
activa, el 404 depende solo de esa segunda red.

🔍 Se verifica en el build: que `.next/server/app/{es,en}/projects/` tenga
solo los `.html` de los publicados.

### Ocultar una página no saca su contenido del código fuente

Dos caminos por los que un dato que no se muestra igual llega al navegador,
sin que se vea nada en pantalla ni lo avise el build:

1. **`NextIntlClientProvider` serializa en el HTML todos los mensajes que
   recibe.** Si el layout le pasa `getMessages()` entero, cada página lleva
   el copy de todas las demás. Se le pasan solo los namespaces que usan los
   componentes del cliente (hoy: todo menos `case_study_*`, filtrado en
   `layout.tsx`). ⚠️ Si un componente del cliente empieza a usar un
   namespace que el filtro corta, el texto no aparece y el build no avisa.
2. **Todo lo que importa un componente `'use client'` viaja entero en un
   JS.** Si importa un archivo de datos, el navegador recibe el archivo
   completo, no solo lo que se muestra. Los datos se eligen en un componente
   del servidor y se pasan como prop (el home le pasa los proyectos a
   `Projects.tsx`).

🔍 Se verifica buscando el texto en `.next/server/app/**/*.html` (el archivo
**entero**, no solo lo visible), en los `.rsc` y en `.next/static/**/*.js`.

### `params` en `opengraph-image.tsx`

También es Promise ahí, no solo en las pages. Si no lo leés, **la imagen sale
igual para todos los locales y nadie se entera**: el build pasa y las dos quedan
idénticas byte a byte. Se detecta comparando hashes de
`.next/server/app/{es,en}/opengraph-image.body`.

### `next/image`

- **Sin `sizes`, migrar no sirve de nada.** El browser asume `100vw` y baja la
  variante más grande del `srcset`, justo lo que la migración venía a resolver.
  Obligatorio en todo `fill` y en toda imagen que CSS haga responsive. El valor
  sale del layout real, no a ojo.
- Emite el atributo como **`srcSet` (camelCase)** en el HTML estático. Un
  `grep srcset` case-sensitive da cero resultados y parece que falló. Usar `grep -i`.
- **`motion.create(Image)` va a nivel de módulo, nunca adentro del componente.**
  Si queda en el render, React ve un tipo distinto en cada pasada, desmonta el
  `<img>` y la imagen se recarga entera en cada re-render.

---

## Framer Motion

- **`staggerChildren` solo llega a hijos motion DIRECTOS.** Con wrappers
  intermedios no propaga: calcular el delay a mano (`base + i * stagger`).
- **Ignora la regla CSS de `prefers-reduced-motion`** porque anima por JS. Lo
  que lo arregla es `<MotionConfig reducedMotion="user">` global.
- **SplitText**: los chars con `display: inline-block` permiten line break entre
  cualquier par de letras y parten palabras al medio. El patrón correcto es
  **wrapper por palabra con `whitespace-nowrap`**.
- **`mix-blend-difference` falla con fondos tema-mid** (sobre el beige daba un
  cursor invisible). Usar colores sólidos theme-aware.

---

## Lenis

- **Pelea con `scroll-behavior: smooth`** → sacar la regla CSS del `html`.
- **No resetea el scroll entre rutas**: forzar
  `lenis.scrollTo(0, { immediate: true })` en cada cambio de `pathname`.
- Monta con `anchors: true`, así que intercepta las anclas y hace el scroll
  suave él. **Nunca `window.scrollTo`**: pelearía contra su animación.

## Contextos "sticky" tras navegar

Si un componente setea estado en `mouseEnter` y confía en `mouseLeave` para
limpiarlo, al navegar nunca se limpia. Resetear en el provider por `pathname`.

---

## Silencios de HTML y accesibilidad

Todos estos pasan el build sin una sola advertencia.

### Un ancla rota es silenciosa

`<a href="#top">` sin un `id="top"` en la página no tira error, no rompe el
build, no loguea nada: simplemente no pasa nada al clickear. Al reusar un
componente con anclas internas en una página nueva, verificar el destino en el
HTML generado:

```bash
grep -o 'id="top"' .next/server/app/**/*.html
```

### Un `<footer>` dentro de `<main>` NO es landmark `contentinfo`

El rol se pierde si es descendiente de `article`, `aside`, `main`, `nav` o
`section`, sin warning de build ni de linter. Cuidado con "arreglarlo" un nivel
y darlo por hecho: el wrapper del home ya era un `div` a propósito, pero el
`<main>` de `layout.tsx` lo anulaba igual.

**Un `role` explícito le gana siempre al mapeo implícito**, así que
`role="contentinfo"` lo resuelve sin reestructurar el DOM. Si se saca, el
landmark desaparece y nadie avisa. Vale para todos los landmarks.

### `sr-only` es invisible pero SIGUE siendo seleccionable

Duplica el copiado. `SplitText` deja el texto dos veces en el DOM y al copiar el
lema salía cada línea repetida.

Se arregla con **`select-none` en la copia `sr-only`**: la saca de la selección
sin sacarla del árbol de accesibilidad. **Ningún build, linter ni auditoría de
a11y lo detecta**: solo se ve copiando y pegando.

### Auto-placement de grid con 2 columnas y 3 hijos

Si el orden del DOM no coincide con el visual, poner `col-start`/`row-start`
explícitos y resetearlos en el breakpoint de arriba (`sm:col-start-auto`).

Preferir dejar el elemento primario **primero en el DOM** y cruzar con `order`
en desktop: así el apilado mobile sale gratis y el orden de tabulación arranca
por el CTA principal.

---

## Satori / `ImageResponse`

- **Exige `display: flex` explícito** en todo `div` con más de un hijo. Conviene
  prerenderear con `generateStaticParams`: mientras la ruta es dinámica el error
  no aparece en build y explota en producción.
- **NO soporta WOFF2**, que es justo lo único que baja `next/font/google`. Para
  embeber una fuente hace falta TTF/OTF/WOFF commiteado y leído con `fs`.
  Los TTF de Google se consiguen pidiéndole a la API de fonts con un
  user-agent viejo: `curl -A "Mozilla/4.0" ".../css2?family=..."` devuelve
  URLs `.ttf` en vez de `.woff2`. Hoy la OG image no lleva texto, así que
  esto no aplica al repo; vale si alguna vez se le vuelve a poner.
- **Un `<img>` que no puede resolver NO rompe el build**: la imagen sale igual
  con ese elemento vacío. Un build verde no prueba que el gráfico se haya
  dibujado. Para verificarlo hay que decodificar el PNG generado y contar
  píxeles del color esperado (`struct` + `zlib`, sin PIL).

---

## Otras trampas chicas

- **Turbopack cachea**: si un cambio de CSS "no se ve", probar `Ctrl+Shift+R`
  antes de buscar el bug.
- **Comentarios CSS**: evitar la secuencia `*/` dentro del cuerpo (escribir
  "px y py", no `px-*/py-*`), rompe el parser.
- **`lucide-react` es 1.x**, no 0.x. Misma API, no buscar doc de `0.x`.
- **Chrome ≥ 121**: `scrollbar-width` toma precedencia y anula
  `::-webkit-scrollbar`. Aislar `scrollbar-width`/`scrollbar-color` en
  `@supports (-moz-appearance: none)` para Firefox.
- **`color-mix(in srgb, var(--bg-primary) X%, transparent)`** es la forma limpia
  de hacer overlays theme-aware sin duplicar reglas light/dark. Evitar `rgba()`
  hardcodeado.
- **Texto chico sobre imagen**: nunca confiar solo en el color. Pills bordeadas
  con bg semi-translúcido + `backdrop-filter: blur(4px)`.
- **Adobe no está en simple-icons** (licencia). Para Ps/Ai/Pr, cuadrados
  bordeados con iniciales.

---

## Git y edición de archivos

- **`npm run build` compila el árbol de trabajo, no el commit.** Un build verde
  local no prueba que un commit parcial sea auto-consistente. Antes de pushear
  un commit acotado: `git show --stat <sha>` y comparar contra
  `git show origin/main:<archivo>`.
- **Nunca parsear bloques de `projects.ts` buscando el próximo `},`**: esa línea
  es el cierre de `tagline`, no el del proyecto. Hay que **contar llaves** desde
  la apertura. Un parser ingenuo ya corrompió el archivo dos veces; la
  recuperación limpia es `git show HEAD:<archivo>` a un temporal y reconstruir
  encima.
