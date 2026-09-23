# Reglas de diseño — Portfolio Gotya

Antes de cualquier cambio visual, releer esto. Si algo no está cubierto acá,
preguntar antes de improvisar valores.

## Vara de calidad

Rol: Senior Frontend Developer + Director de Arte UI/UX. La vara es producto
premium nivel Awwwards, con la sensibilidad de Linear (precisión), Vercel
(contención) y Apple (terminación).

- La calidad vive en el detalle: consistencia de spacing, estados bien
  resueltos, coherencia del conjunto. No en sumar efectos.
- Ante dos soluciones válidas, elegí la más restrained y la mejor terminada.
- Menos elementos mejor resueltos > más features a medias. Ante la duda, sacar.
- Prohibido inventar valores sueltos o caer en defaults de Tailwind
  (`blue-500`, `gap-12` arbitrario).
- Todo lo que entra tiene que poder defenderse con una ley UX.

## Tokens de marca

| Token | Valor |
|---|---|
| Accent | `#C96A3A` (hover `#B05A2E`) |
| Light | bg `#EDE2CD` · surface `#F4EAD5` · ink `#111110` |
| Dark (default) | bg `#111110` · ink `#F0EDE8` |
| Radius | 12px cards · 999px pills |
| Easing | `cubic-bezier(0.16, 1, 0.3, 1)` |

Tipografía actual: Space Grotesk (display) + Geist (body) + Geist Mono (labels).
En revisión, junto con la paleta: paso 3 de la versión siguiente (`CLAUDE.md` §8).

Concepto: minimalismo técnico pero cálido.

## Nombres — por función, nunca por referencia

Todo nombre —variable, prop, campo de datos, clase CSS, token, keyframe, key
de i18n, archivo— dice **qué hace o qué es**. Nunca de dónde salió la idea.

| ❌ Por referencia | ✅ Por función |
|---|---|
| `awwwardsContent` | `caseStudyText` — los textos del caso |
| `awwwardsKeys` | `requiredKeys` — las keys obligatorias |
| `--ease-apple` | `--ease-expo-out` — la curva |
| `IsadeburghFooter` | `Footer` |

Por qué:

1. **La referencia no le dice nada a quien lee el código.** `awwwardsLayout`
   obligaba a saber qué es Awwwards y qué layout se tomó de ahí para entender
   un `if`. Terminó siendo un flag que valía `true` en los 7 proyectos y no
   decidía nada, y nadie lo notó porque el nombre no decía qué decidía.
2. **Deja de ser cierta** en cuanto el diseño se separa de la referencia, y
   el nombre se queda.
3. **El repo es público.** Un nombre por referencia le cuenta a cualquiera de
   dónde se copió cada cosa.

**Los comentarios sí pueden decir de dónde salió una idea**, pero el porqué
tiene que sostenerse solo: *"como en la referencia"* no es un motivo. Y un
comentario nunca apunta a un archivo que no está en el repo (las capturas de
referencia se borraron y quedaron punteros a PNGs inexistentes).

## Spacing — siempre múltiplos de 4

`xs 4 · sm 8 · md 16 · lg 24 · xl 32 · 2xl 48 · 3xl 64 · 4xl 96 · 5xl 128`

Padding vertical de secciones: `py-20` mobile · `md:py-28` tablet · `lg:py-36` desktop

### Gaps mínimos

| De → a | Mínimo |
|---|---|
| H1 → párrafo | `mt-6` |
| H1 → CTA | `mt-10 md:mt-12` |
| H2 → contenido | `mt-8 md:mt-10` |
| Párrafo → CTA | `mt-8` |
| Entre párrafos | `space-y-6` |

## Escalera de anchos — 3 niveles, no inventar un cuarto

| Nivel | Ancho | Para qué |
|---|---|---|
| Shell | `max-w-7xl` (1280) | Todo contenedor de sección, navbar y footer |
| Editorial | `max-w-3xl` (768) títulos · `max-w-2xl` (672) body | Medida de lectura, adentro del Shell |
| Excepción | `max-w-xl` (576) | Solo el body desplazado del About. Es la única |

⚠️ **El `max-w` y el gutter NUNCA van en el mismo elemento.** Con
`box-sizing: border-box` el padding cuenta dentro del `max-w` y el contenido
queda corrido respecto de las secciones que sí los separan. Patrón correcto:

```jsx
<section className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
  <div className="max-w-7xl mx-auto"> ... </div>
</section>
```

Este bug vivió meses en el Navbar y en el Stack, y daba seis bordes izquierdos
distintos a 1920px. El gutter es siempre ese string exacto, idéntico en todos lados.

> Al auditar: el error NO se ve buscando valores de `max-w` raros. El Stack ya
> tenía `max-w-7xl` y estaba igual de roto. El problema es *dónde* vive el
> padding, no qué número tiene el `max-w`.

## Tipografía

- Display (H1/H2): `leading-tight` (1.15)
- Body: `leading-relaxed` (1.625) — nunca menos
- Bloques narrativos: `max-w-prose` (~65ch) o `max-w-2xl`

## Animación

- Duración estándar `0.6s` · mínimo `0.3s` · easing `[0.16, 1, 0.3, 1]`
- Stagger entre hijos: `0.08–0.12s`
- Scroll-in: fade + `y: 24 → 0` (no menos de 24px)
- Hover scale en cards: máximo `1.02` (más se ve barato)

### Hover states obligatorios

- Cards: `shadow-lg → shadow-2xl` + glow accent terracota
- Botones primarios: `bg-accent-hover` + `-translate-y-0.5`
- Links de texto: underline con offset animado (`underline-offset-4 → 8`)
- Toggles: `scale 1.1` + rotate sutil

### Animation polish (no negociable)

El portfolio es de un UX/UI Designer: la página tiene que sentirse viva. Todo
bloque nuevo suma al menos una animación.

- **No interactivo** (cards informativas, badges): animación one-shot al entrar
  en viewport, sin hover, cursor default. No prometer interacción que no existe.
- **Interactivo**: hover explícito + transition ≥ 0.3s.
- Decorativas continuas (ambient, breathing, parallax) bienvenidas si no son ruido.
- ❌ Nunca una sección o componente puramente estático. Si no se mueve
  nada, no terminó.

## Ley UX — cada decisión se defiende

Si no podés explicar el porqué en términos de Miller, Jakob,
Estética-Usabilidad, Similitud, Proximidad, Hick o Fitts, no está listo.
No es decoración intelectual: es la prueba, sin discurso, de que el dueño
del portfolio sabe lo que hace. Los reclutadores de producto reconocen
estos patrones aunque no los citen.

- **Miller (7±2)**: chunks de 4-5 items máximo. Si son 9, agrupar en 3 de 3.
- **Jakob**: patrones conocidos (timeline CV, breadcrumbs, X arriba a la
  derecha) bajan la carga cognitiva. No reinventar UI básica.
- **Estética-Usabilidad**: lo que se ve cuidado se percibe como funcional.
  Spacing prolijo y menos cromo > features extra mal terminadas.
- **Similitud / Proximidad**: agrupar lo del mismo tipo; lo relacionado va junto.
- **Hick**: menos opciones, decisión más rápida. No saturar el Hero de CTAs.

Cuando el cambio sea de copy o estructura, mencionar la ley aplicada en el commit.

## Antes de decir "listo", auditar

1. ¿Los gaps siguen la escala de 4?
2. ¿Padding vertical de sección correcto?
3. ¿`mt-6` mínimo bajo los títulos?
4. ¿Hover en todo lo clickeable?
5. ¿Funciona en `sm`, `md` y `lg`?

Si alguna respuesta es "no", no está listo.