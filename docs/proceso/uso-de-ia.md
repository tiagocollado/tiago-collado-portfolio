# Cómo uso IA

Para qué uso IA en este proyecto, organizado por tipo de tarea: qué hizo, qué
revisé, adapté o descarté yo, qué errores o límites aparecieron y qué decidí.

**Herramienta.** Claude Code (modelo Claude Opus 5.5), trabajando sobre este
repositorio. Las instrucciones que sigue están en [CLAUDE.md](../../CLAUDE.md)
y en [.claude/rules/](../../.claude/rules/): reglas de diseño, de imágenes y
una lista de errores conocidos del stack.

**Cómo trabajo con ella.** Cada tarea empieza con un pedido acotado. Antes de
escribir código, la IA lee el sitio anterior y propone un enfoque; lo apruebo
o lo cambio. Después ejecuta, verifica y frena para que revise. Los commits los
hago yo. Si falta un dato (un texto, un rol, una fecha), la regla es preguntar,
no completarlo.

**Un límite que atraviesa todo.** La IA no puede abrir un navegador. Todo lo
que verifica es sobre el código, el build y el HTML generado; lo visual y lo
interactivo (animaciones, cursor, tema, táctil) lo pruebo yo.

---

## Migración de componentes

**Qué hizo la IA.** Portó a Astro los datos, las imágenes, las secciones y los
componentes interactivos del sitio en Next. Antes de cada tanda leyó cómo se
coordinaban las piezas en el sitio anterior y propuso cómo resolver cada una
sin el contexto de React, que no cruza entre islas.

**Qué revisé, adapté o descarté.** Aprobé la estrategia de cada isla antes de
que escribiera, y cambié dos cosas de lo que se había previsto: el selector de
idioma pasó de botones a links, y la grilla de puntos se separó en su propia
isla para hidratarla más tarde.

**Errores y límites detectados.**

- Al separar la grilla de puntos, su contenedor pasó a ser un envoltorio sin
  caja y la grilla habría quedado quieta sin dar error. Lo detectó leyendo el
  código antes de buildear.
- Marcó como bug un espacio duro que estaba bien: era un carácter literal que
  no se distingue de un espacio común al leer el archivo. Lo descubrió al
  revisar los bytes antes de editar.

**Qué decidí yo.** La directiva de hidratación de cada isla; que ningún texto
accesible quede fijo en un idioma; las animaciones de entrada en CSS y el
título letra por letra como isla chica, en vez de convertir componentes
enteros en islas.

---

## Verificación contra la documentación y el código

**Qué hizo la IA.** Contrastó cada API que usa el proyecto con la
documentación oficial (Astro, Tailwind, Motion, Vercel, MDN). Cuando la
documentación no alcanzaba, leyó el código instalado de la librería.

**Qué revisé, adapté o descarté.** Elegí entre las alternativas que presentó
cuando la documentación ofrecía más de una vía: `getImage()` para las imágenes
de las islas, `vercel.json` para la redirección del CV, la redirección de `/`
hecha a mano.

**Errores y límites detectados.**

- La guía de i18n de Astro no dice qué genera `/` en un build estático: se
  averiguó buildeando.
- La documentación de Motion no dice cómo traduce sus márgenes al
  `IntersectionObserver` ni cómo reparte las cascadas. En su código apareció
  además que, con movimiento reducido, Framer conserva el fade de opacidad,
  aunque un comentario del sitio anterior decía que anulaba todo.
- El README actual de Lenis describe soporte de movimiento reducido que la
  versión instalada no tiene.
- Quedan sin respuesta en la documentación, para probar en staging: si
  `vercel.json` sigue aplicando con el adapter de Vercel, y en qué orden
  aplica Vercel la barra final y las redirecciones.

**Qué decidí yo.** El movimiento reducido igual que el comportamiento real
del sitio anterior (solo el fade, sin desplazamiento), no como decía el
comentario.

---

## Herramientas y configuración

**Qué hizo la IA.** Configuró el repositorio, Tailwind, las fuentes, React y
los controles que corren antes de cada commit (build, secretos, palabras que
no corresponden al repositorio).

**Qué revisé, adapté o descarté.** Fijé las versiones de las librerías en las
del sitio publicado, después de que `npm install` trajera unas más nuevas.

**Errores y límites detectados.**

- El control de palabras daba falsos positivos adentro de los JPG; pasó a
  correrse con `-I`.
- Los textos con secuencias de escape que la IA escribía (por ejemplo, la del
  espacio duro) llegaban a los archivos convertidos en el carácter real. Un
  script falló y tres archivos quedaron alterados; lo detectó revisando los
  bytes y lo corrigió.

**Qué decidí yo.** El preset `base` del `tsconfig`, porque el proyecto no usa
TypeScript.

---

## Documentación y copy

**Qué hizo la IA.** Adaptó a Astro las reglas del proyecto anterior; redactó
`CLAUDE.md`, la bitácora, el registro de decisiones, este documento y el
README; revisó el origen de las skills que uso.

**Qué revisé, adapté o descarté.** Revisé los cambios a las reglas de
imágenes antes de que se guardaran, elegí qué partes del historial anterior
entraban en la bitácora y redefiní el criterio de estos documentos: sin
fechas, por etapa o por tipo de tarea, sin paso a paso.

**Errores y límites detectados.** Dos skills eran de terceros, y una declaraba
su licencia en un archivo que no se había copiado.

**Qué decidí yo.** Las skills de Anthropic se usan en local y no se versionan
(se citan en Créditos y licencias); la skill propia de auditoría de copy sí se
versiona. En el copy, que El Ritual del Tono siga rotulado como proyecto
universitario y que su intro no nombre el curso.
