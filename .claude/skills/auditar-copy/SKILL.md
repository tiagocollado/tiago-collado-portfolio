---
name: auditar-copy
description: Audita textos del portfolio contrastando cada afirmación contra la evidencia y buscando patrones de escritura generada por IA y desvíos de la voz de marca Gotya. Usar al escribir, revisar o corregir cualquier copy del sitio — case studies, About, Hero, microcopy, alts, taglines — o cuando Tiago pida revisar si un texto "suena a IA", suena genérico o dice algo que no puede probar.
---

# Auditar copy — Portfolio Gotya

Este portfolio es la prueba de que su dueño sabe escribir para producto. Un copy
que suena generado contradice el argumento del sitio más fuerte que cualquier
error técnico.

## Cómo auditar

Recorré el texto **tres veces, por separado**:

1. **Pasada de hechos**: ¿cada afirmación es cierta? Es la primera y la que más
   caro sale saltearse. Método completo abajo.
2. **Pasada de patrones**: buscá las marcas de abajo, una por una. Citá la línea
   exacta y proponé un reemplazo concreto, no "reescribir más natural".
3. **Pasada de voz**: releé el texto completo preguntando si lo escribiría
   alguien hablando de su propio trabajo a un reclutador, en voz alta.

**El orden importa.** Una frase falsa bien escrita pasa las otras dos pasadas
sin despeinarse, y pulir el tono de algo que no ocurrió es trabajo perdido.

---

## Pasada de hechos — va primero

Los cuatro case studies publicados tenían afirmaciones falsas, y **ninguna era
un dato desactualizado: nunca fueron ciertas**. Las escribió un modelo
rellenando un hueco donde faltaba el dato. Ejemplos reales: un WhatsApp
"ruteado por servicio" que era un solo número; un endpoint que validaba stock y
no existe; *"el 90% de las queries"*; una discusión con el cliente que no pasó.
Ninguna la detecta una pasada de estilo.

**Por cada afirmación concreta del texto, preguntá: ¿con qué se prueba?**

| De dónde sale el caso | Dónde se verifica |
|---|---|
| Un sitio publicado | El HTML real, bajado con `curl`. Buscá la evidencia del elemento: `<video>` para un hero con video, `<form>` y sus `<label>` para un formulario, `name="description"` / `ld+json` / `<h1>` para una afirmación de SEO |
| Código propio | El repo: el componente, el modelo de datos, la ruta. Si el copy explica *por qué* funciona algo, el porqué tiene que estar en el código |
| Una API en vivo | Pedirle los datos y comparar contra lo que dice el texto |
| Solo la memoria de Tiago | **Preguntale, afirmación por afirmación.** No hay otra fuente y no se completa con lo plausible |

**Las reglas:**

1. **Listá las afirmaciones una por una antes de reescribir nada**, numeradas,
   para que Tiago pueda contestar por número. Incluí las de `projects.ts` que se
   ven en la página: `tagline`, `description`, `tags`, `metadata` y los `alt`.
2. **Cuando falta el dato, se pregunta.** Un hueco en el copy se nota; una
   explicación plausible y falsa, no — y en una entrevista es lo primero que se
   repregunta.
3. **Marcá los superlativos y los números sin fuente.** "El activo que más
   convierte", "un 40% más rápido", "el 90% de los casos". O va la evidencia al
   lado, o va el verbo neutro.
4. **Un número aproximado se escribe como aproximado.** "Más de 35 pantallas"
   se sostiene; "38 pantallas" salido de la memoria, no.
5. **Ojo con corregir una verdad.** El resumen de texto de una página decía que
   el hero era una imagen fija y en el HTML había un `<video autoplay loop>`.
   **No alcanza con un resumen: hay que mirar la fuente.**
6. **Lo que el copy no puede decir, la imagen tampoco.** Si el proyecto tiene
   NDA o restricciones, revisá también las capturas y los diagramas: un nodo de
   un flujo puede contar lo que el texto calla.

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

**La pasada de hechos se reporta aparte y primero**, como una lista numerada de
afirmaciones con su evidencia, para que Tiago conteste por número:

```
1. [archivo:key] "…la afirmación…"
   Evidencia: qué lo prueba (URL, archivo:línea, respuesta de la API)
   Veredicto: ✅ cierta · ❌ falsa · ❓ solo la sabe Tiago
```

Las otras dos pasadas, por cada hallazgo:

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
