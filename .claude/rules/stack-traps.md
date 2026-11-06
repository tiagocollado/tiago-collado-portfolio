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

🔍 **Si algo "no cambia nada", revisar la hoja de estilos global buscando
reglas universales antes de seguir debuggeando.** Costó 3 iteraciones
descubrirlo.

### Corolario del hover (mordió 14 veces)

Si una propiedad cambia en `hover:`, su valor base **NO** puede venir de `style`
inline: el hover no se ve nunca y el build no lo detecta. El valor base va como
utility (`text-(--ink-secondary)`, `border-(--border-default)`, `bg-transparent`)
para que la variante `hover:` pueda ganarle. Las props que NO cambian en hover
pueden seguir en `style`.

🔍 Para auditarlo: buscar etiquetas JSX o `.astro` con una utility
`hover:text-*` / `hover:border-*` / `hover:bg-*` **y a la vez** un `style`
inline con `color` / `borderColor` / `backgroundColor`. Ojo con parsear la
etiqueta hasta el primer `>`: los `=>` de los handlers la cortan al medio y se
escapan casos.

### Inline styles de spacing

Son síntoma, no prolijidad rota. Antes de sacarlos, verificar que las utilities
funcionen: si están muertas por el bug de arriba, al sacarlos quedás con cero padding.

---

## Islas de Astro

### Cada isla es su propia app de React

El contexto de React no cruza entre islas. La doc lo dice para los providers
en general: al hidratar componentes por partes dentro de Astro, esos wrappers
de contexto no se pueden usar (receta *Share state between islands*). Un
provider que envuelve a una isla no llega a la de al lado, y no hay error:
la otra isla lee el valor por defecto del contexto.

- **Las variantes del cursor** (`default | link | view | drag`) pasan a
  atributos **`data-cursor`** en el HTML, y `CustomCursor` los lee por
  **delegación de eventos** sobre el documento. Así cualquier elemento, sea
  isla o `.astro` sin JS, puede pedir una variante.

### `<MotionConfig reducedMotion="user">` tampoco cruza

Es un provider de contexto, así que tiene el mismo límite: **va en cada isla
que anima**. Una isla sin él anima con `prefers-reduced-motion` activado y
nada lo avisa. Se verifica con la preferencia de movimiento reducido activada
en DevTools, isla por isla.

### A las islas se les pasan solo los textos que usan

Las props de una isla se serializan para mandarse al navegador. Todo lo que
se le pasa viaja en la página, se muestre o no:

1. **Si a una isla se le pasa el diccionario entero**, cada página lleva el
   copy de todas las demás. Se le pasan como props **los textos ya
   traducidos** que usa, elegidos con `t()` en el `.astro`. ⚠️ Si la isla
   empieza a usar un texto nuevo y no se le pasa, no aparece y el build no
   avisa.
2. **Todo lo que importa una isla viaja en su JS.** Si importa un archivo de
   datos, el navegador recibe el archivo completo, no solo lo que se muestra.
   Los datos se eligen en el `.astro` y se pasan como prop.

🔍 Se verifica buscando el texto en el HTML generado por el build (el archivo
**entero**, no solo lo visible) y en los `.js` de `_astro/`.

---

## `astro:assets`

- **Sin `sizes` correcto, las variantes no sirven de nada.** El browser elige
  del `srcset` según `sizes`; si el valor no coincide con el ancho real, baja
  una variante más grande de la que necesita.
- **`widths` exige `sizes`**: la referencia de `<Image>` lo marca como
  obligatorio cuando se pasa `widths`.
- **El `sizes` automático de `layout` asume casi todo el ancho.** Con
  `layout="constrained"` o `"full-width"`, Astro genera `srcset` y `sizes`
  solo, pero ese `sizes` supone que la imagen ocupa casi todo el ancho de la
  pantalla cuando el viewport es más chico que la imagen. Para una card de
  media columna o una imagen del shell de 1280 eso no es cierto: el `sizes`
  sale de `imageSpec.js`, del layout real, no a ojo.
- **Sin estilos, `layout` no es responsive.** La doc lo dice: sin
  `image.responsiveStyles: true` o estilos propios, las imágenes no se adaptan.
- **`densities` no es compatible con `layout`**: si están los dos, `densities`
  se ignora sin avisar.
- **Solo se optimiza lo que está en `src/`.** Las imágenes de `public/` no se
  optimizan nunca y no tienen imágenes responsive.

---

## Framer Motion

- **`staggerChildren` solo llega a hijos motion DIRECTOS.** Con wrappers
  intermedios no propaga: calcular el delay a mano (`base + i * stagger`).
- **Ignora la regla CSS de `prefers-reduced-motion`** porque anima por JS. Lo
  que lo arregla es `<MotionConfig reducedMotion="user">` **en cada isla que
  anima** (ver *Islas de Astro*).
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
  Con navegación de página completa (MPA) cada página arranca de cero; vuelve
  a aplicar si se activa `ClientRouter`.
- Monta con `anchors: true`, así que intercepta las anclas y hace el scroll
  suave él. **Nunca `window.scrollTo`**: pelearía contra su animación.

## Contextos "sticky" tras navegar

Si un componente setea estado en `mouseEnter` y confía en `mouseLeave` para
limpiarlo, al navegar nunca se limpia. Resetear por `pathname`. Con MPA el
estado se pierde en cada navegación; vuelve a aplicar si se activa
`ClientRouter`.

---

## Silencios de HTML y accesibilidad

Todos estos pasan el build sin una sola advertencia.

### Un ancla rota es silenciosa

`<a href="#top">` sin un `id="top"` en la página no tira error, no rompe el
build, no loguea nada: simplemente no pasa nada al clickear. Al reusar un
componente con anclas internas en una página nueva, verificar el destino en el
HTML generado por el build:

```bash
grep -rlo 'id="top"' <carpeta de salida del build>
```

### Un `<footer>` dentro de `<main>` NO es landmark `contentinfo`

El rol se pierde si es descendiente de `article`, `aside`, `main`, `nav` o
`section`, sin warning de build ni de linter. Cuidado con "arreglarlo" un nivel
y darlo por hecho: el wrapper del home ya era un `div` a propósito, pero el
`<main>` del layout lo anulaba igual.

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

## Otras trampas chicas

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
- **Para publicar un archivo suelto con otro trabajo a medio hacer en el stage,
  no se hace `git add`**: se commitea con el path al final, que toma solo ese
  archivo e ignora el resto del stage. Un `git add` + `commit` a secas ya metió
  una vez un borrado staged que rompía el build de Vercel.

  ```
  git commit -m "…" -- <archivo>
  git show --stat HEAD     # tiene que listar UN solo archivo
  ```
- **Para comparar una página contra el deploy, hashear el HTML entero no
  sirve**: el payload de los `<script>` trae los IDs del build y cambia en cada
  deploy, así que todo "difiere". Hay que sacar `<script>` y `<style>`, después
  las etiquetas y las entidades, normalizar los espacios y recién ahí comparar.
- **Nunca parsear bloques de `projects.js` buscando el próximo `},`**: esa línea
  es el cierre de `tagline`, no el del proyecto. Hay que **contar llaves** desde
  la apertura. Un parser ingenuo ya corrompió el archivo dos veces; la
  recuperación limpia es `git show HEAD:<archivo>` a un temporal y reconstruir
  encima.
