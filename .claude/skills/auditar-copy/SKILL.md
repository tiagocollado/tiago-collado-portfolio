---
name: auditar-copy
description: Audita textos del portfolio buscando patrones de escritura generada por IA y desvíos de la voz de marca Gotya. Usar al escribir, revisar o corregir cualquier copy del sitio — case studies, About, Hero, microcopy, alts, taglines — o cuando Tiago pida revisar si un texto "suena a IA" o suena genérico.
---

# Auditar copy — Portfolio Gotya

Este portfolio es la prueba de que su dueño sabe escribir para producto. Un copy
que suena generado contradice el argumento del sitio más fuerte que cualquier
error técnico.

## Cómo auditar

Recorré el texto **dos veces, por separado**:

1. **Pasada de patrones**: buscá las marcas de abajo, una por una. Citá la línea
   exacta y proponé un reemplazo concreto, no "reescribir más natural".
2. **Pasada de voz**: releé el texto completo preguntando si lo escribiría
   alguien hablando de su propio trabajo a un reclutador, en voz alta.

Reportá siempre por línea citada. Un veredicto global ("suena bien") no sirve
para corregir nada.

---

## Patrones de IA — los que más aparecen

### Estructura

- **Tríadas.** Tres sustantivos o tres adjetivos en fila, casi siempre con el
  tercero de relleno. "Rápido, accesible y escalable" — el tercero entró por
  ritmo, no por contenido. Cortá a dos, o a uno bien elegido.
- **"No es X, es Y".** Suena a revelación y casi nunca revela nada.
  "No es solo un sitio, es una experiencia." Reemplazar por la afirmación sola.
- **El párrafo que cierra reafirmando lo que ya dijo.** Si el último párrafo se
  puede borrar sin perder información, bórralo.
- **Paralelismo forzado entre secciones.** Si las tres decisiones del case study
  arrancan con la misma estructura sintáctica, una es real y dos se acomodaron.

### Léxico

Palabras que casi siempre tapan la falta de un dato concreto:

`potenciar` · `impulsar` · `robusto` · `seamless` · `fluido` · `intuitivo` ·
`en el mundo actual` · `hoy en día` · `permite` (como verbo principal) ·
`optimizar` sin decir qué métrica · `soluciones` · `experiencias únicas` ·
`aprovechar al máximo` · `clave` como adjetivo · `fundamental` ·
`no solo... sino también`

Regla: si la frase sigue siendo verdadera al cambiar el proyecto por otro
cualquiera, no dice nada. Borrala o reemplazala por el dato específico.

### Signos de puntuación

- **Guiones largos como aparte.** Uno por texto largo, cero si se puede.
- **Dos puntos que anuncian una revelación.** "El resultado: un sitio más
  rápido." Sacá los dos puntos y afirmá.
- **Comillas alrededor de conceptos inventados.** Si necesitás comillas para que
  se entienda, el término está mal elegido.

### Contenido

- **Superlativos sin evidencia.** "Notablemente más rápido" sin número al lado.
  O va el número o va el verbo neutro.
- **Beneficios en vez de decisiones.** Un case study cuenta qué decidiste y por
  qué, no qué bueno quedó. "Mejoró la experiencia del usuario" es una
  conclusión; "moví la reserva arriba del fold porque el 70% del tráfico entra
  desde el mail de la OTA" es una decisión.
- **Emojis como bullets** y títulos con dos puntos en el medio.

---

## La voz de Gotya

- **Primera persona, siempre.** Gotya es nombre comercial, no un "nosotros".
  Si aparece un plural mayestático, es error.
- **Directo, sin narrativas forzadas de Silicon Valley.** Nada de "todo empezó
  cuando…", ni problema-viaje-transformación.
- **Sin condescendencia y sin venderse de más.** El lector es un reclutador de
  producto: reconoce los patrones aunque no los cite.
- **El porqué antes que el qué.** Cada decisión de copy, layout o jerarquía debe
  poder defenderse con una ley UX. Si el texto explica una decisión, que se vea
  el criterio.
- **Paridad ES/EN.** Toda corrección en un idioma se revisa en el otro. Los dos
  JSON son `src/messages/es.json` y `en.json`.

## Qué NO tocar

- Términos técnicos correctos. Precisión no es jerga.
- Los títulos de rol y las categorías de `services`: tienen reglas propias en
  `CLAUDE.md` y no se improvisan.
- El copy de `futbol-talent-pro` sin releer antes la sección de NDA de
  `CLAUDE.md`. Hay vocabulario explícitamente prohibido ahí, incluidos los
  `alt` de las imágenes.

---

## Formato del reporte

Por cada hallazgo:

```
[archivo:key] — patrón detectado
  Actual:    "…"
  Problema:  qué patrón es y por qué debilita el texto
  Propuesta: "…"
```

Al final, una línea sobre el conjunto: si el texto se lee como escrito por una
persona que hizo el trabajo, o como una descripción de ese trabajo.

Nunca aplicar los cambios sin que Tiago los apruebe uno por uno. El copy es
suyo y las propuestas son propuestas.
