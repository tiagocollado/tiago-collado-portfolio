# Cómo uso IA

Para qué uso IA en este proyecto, organizado por tipo de tarea: qué hizo, qué
revisé, adapté o descarté yo, qué errores o límites aparecieron y qué decidí.

**Herramienta.** Claude Code (modelo Claude Opus 5.5), trabajando sobre este
repositorio. Las instrucciones que sigue están en [CLAUDE.md](../../CLAUDE.md)
y en [.claude/rules/](../../.claude/rules/): reglas de diseño, de imágenes y
una lista de errores conocidos del stack.

**Imágenes.** Algunos fondos y marcos de los mockups y el logo de El Ritual del Tono se generaron con herramientas de IA de imagen.

**Cómo trabajo con ella.** Cada tarea empieza con un alcance acotado. Antes de
escribir código, la IA lee el sitio anterior y propone un enfoque; lo apruebo
o lo cambio. Después ejecuta, verifica y frena para que revise. Los commits los
hago yo. Si falta un dato (un texto, un rol, una fecha), la regla es preguntar,
no completarlo.

**Un límite que atraviesa todo.** La IA no usa el sitio como una persona.
Verifica sobre el código, el build y el HTML generado, y puede medir y
capturar páginas con Chrome headless; lo interactivo (animaciones, cursor,
tema, táctil) y el juicio visual final los pongo yo, en el navegador.

---

## Migración de componentes y componentes nuevos

**Qué hizo la IA.**

- **Migración.** Portó a Astro los datos, las imágenes, las secciones y los
  componentes interactivos del sitio en Next. Antes de cada tanda leyó cómo
  se coordinaban las piezas y propuso cómo resolver cada una sin el contexto
  de React, que no cruza entre islas.
- **Widget de música.** Propuso dónde va, cómo se ve y cada estado, y lo
  construyó después de mi aprobación. Hizo lo mismo con cada versión de su
  interacción: el patrón de accesibilidad, los estados nuevos y cómo crece
  sin saltos. Cuando cambié las pestañas por el tocadiscos, bajó el concepto
  a un diseño en los dos temas y en celular.
- **Home entre el hero y el cierre.** Armó una tabla de evidencia solo con el
  contenido de los casos (qué skill aparece en qué caso, con qué métodos y
  con qué cita). Después implementó Skills, la fila de puntos del hero, el
  Stack y el componente de íconos, y midió cada uno en Chrome headless.

**Qué revisé, adapté o descarté.** Aprobé la estrategia de cada isla antes de
que escribiera, y cambié dos cosas de lo que se había previsto: el selector de
idioma pasó de botones a links, y la grilla de puntos se separó en su propia
isla para hidratarla más tarde. Del widget revisé en el navegador los seis
estados, el celular de 320 px, el ecualizador y el cursor. De su interacción,
las pestañas y el alto animado en los dos temas, el uso con teclado, los
títulos largos a 320 px, el movimiento reducido y el estado de error. De la
versión final, en staging: que el tema se lea primero, que "vía Last.fm"
apenas se vea, que las filas abran su página en Last.fm, que el disco gire
y que el cartel "En vivo" se prenda cuando estoy escuchando.

**Errores y límites detectados.**

- Al separar la grilla de puntos, su contenedor pasó a ser un envoltorio sin
  caja y la grilla habría quedado quieta sin dar error. Lo detectó leyendo el
  código antes de buildear.
- Marcó como bug un espacio duro que estaba bien: era un carácter literal que
  no se distingue de un espacio común al leer el archivo. Lo descubrió al
  revisar los bytes antes de editar.
- Para cumplir una condición que le puse al widget (que al crecer no mueva lo
  de al lado), cambió la alineación del diseño aprobado de abajo a arriba, y
  lo avisó al presentarlo en vez de hacerlo en silencio.
- La primera versión de la interacción, las pestañas, cumplía todo lo pedido
  y pasó las pruebas, pero giraba alrededor del tema que suena, que es el
  caso menos común. No lo marcó: lo vi yo con el widget construido. Lo mismo
  con la selección del tocadiscos: la diseñó e implementó bien, con su patrón
  de accesibilidad verificado, pero no cuestionó si elegir un tema aportaba
  algo. Eso también lo vi yo, y se sacó.
- Al documentar el cambio de velocidad del disco escribió un motivo que yo
  no había dado; lo detectó al releer y lo sacó antes de entregarlo.
- En el diseño del tocadiscos calculó los contrastes en vez de estimarlos.
  Así aparecieron el disco casi invisible contra la card en tema oscuro
  (1,10:1, se resolvió con un borde) y el crédito en `--ink-muted`, que no
  llega al mínimo para texto. También anticipó que el giro infinito, sin
  `motion-safe`, parpadearía con la regla global de movimiento reducido.
- La pausa del disco no funcionó nunca, y sus pruebas dieron todo verde: en
  jsdom revisaban que el elemento tuviera la clase de pausa, no que el disco
  se detuviera. Una regla de la variante `motion-safe:` salía después en el
  CSS y la pisaba. Lo detecté yo en el navegador; la IA lo confirmó en el CSS
  generado, lo sumó a las trampas del stack y dejó escrito en la bitácora el
  límite de esas pruebas: no aplican CSS.
- Al revisar los separadores de la lista encontré un "·" suelto cuando el
  título se cortaba; la primera versión de las filas no lo contemplaba.
- Al pasar el widget a posición absoluta junto a la firma, su primera versión
  compacta (381 px) era más alta que el texto del About (292 px) y quedaba a
  7 px del claim. Lo detectó midiendo con Chrome headless antes de
  entregarlo, y lo resolvió sin tocar el alto táctil de las filas.
- La primera definición de Skills activaba una skill al recibir foco. Antes de
  implementarlo, la IA marcó que, con el panel debajo de los nombres, al
  tabular se activaría cada nombre y con Tab no se llegaría a los links de
  las tres primeras skills. Propuso tres salidas y elegí Enter o Espacio.
- Al rehacer el Stack como carrusel, dejó la pista sin recorte. Sus pruebas
  en celular sacaron capturas que se veían bien, pero no midieron el ancho
  del documento, y la verificación de producción la hizo solo en escritorio.
  Así se publicó: en celular, el menú quedaba fuera de la pantalla. Lo
  encontró en un diagnóstico de mobile, midiendo con emulación de celular, y
  lo sumó a las trampas del stack.
- En ese carrusel, en lugar de la pausa por foco en toda la sección que yo
  había pedido, puso una pausa por foco sobre la tira, que nunca se
  disparaba porque sus ítems no recibían foco. Lo marcó después de
  implementarlo, y la saqué.

**Qué decidí yo.**

- **Arquitectura.** La directiva de hidratación de cada isla; que ningún texto
  accesible quede fijo en un idioma; las animaciones de entrada en CSS y el
  título letra por letra como isla chica.
- **Widget.** Su lugar en el About, sin portadas y sin detalle por tema. El
  cambio de las pestañas al tocadiscos, sin tiempo relativo ni flechas. El
  disco que gira siempre, como ambiente, con un cartel "En vivo" para el
  estado real (la IA recomendó qué anunciar con el cartel apagado: nada). La
  jerarquía del About: el widget después de la firma, más compacto. Y al
  final, sacar la selección: el widget quedó pasivo y cada fila es un link a
  Last.fm.
- **Home.** La fila de puntos en lugar del marquee; el contenido de Skills y
  del Stack; Skills como interacción principal, activada con Enter o Espacio;
  el subrayado de la skill activa con un token por tema; dejar afuera del
  Stack lo que no puedo defender (TypeScript, Node.js, MongoDB); el Stack en
  grilla con íconos; la card cuadrada en 4:3 en celular; y `--ink-muted` a
  4,5:1 sin cambiar lo decorativo.

---

## Verificación contra la documentación y el código

**Qué hizo la IA.** Contrastó cada API que usa el proyecto con la
documentación oficial (Astro, Tailwind, Motion, Vercel, Last.fm, MDN). Cuando
la documentación no alcanzaba, leyó el código instalado de la librería o hizo
pedidos reales a la API. En cada tarea separó lo verificado en la
documentación, lo verificado en el código y lo que no pudo verificar.

**Qué revisé, adapté o descarté.** Elegí entre las alternativas que presentó
cuando la documentación ofrecía más de una vía: `getImage()` para las imágenes
de las islas, la redirección de `/` hecha a mano. Algunas se reemplazaron
cuando entró el adapter de Vercel: la redirección del CV pasó de `vercel.json`
a la configuración de Astro, y la de `/` pasó a ser HTTP real.

**Errores y límites detectados.**

- La guía de i18n de Astro no dice qué genera `/` en un build estático: se
  averiguó buildeando.
- La documentación de Motion no dice cómo traduce sus márgenes al
  `IntersectionObserver` ni cómo reparte las cascadas. En su código apareció
  además que, con movimiento reducido, Framer conserva el fade de opacidad,
  aunque un comentario del sitio anterior decía que anulaba todo.
- El README actual de Lenis describe soporte de movimiento reducido que la
  versión instalada no tiene.
- La documentación de Vercel no dice si aplica `vercel.json` cuando el build
  le pasa la configuración de rutas ya armada. Leyendo el código del adapter
  vio que esa configuración sale solo de `astro.config.mjs`, y propuso mover
  ahí las reglas en vez de depender de algo que no se podía confirmar.
- La documentación de routing de Astro dice que una página le gana a un
  redirect en la misma ruta; buildeando apareció lo contrario. Lo presentó
  como comportamiento no documentado, con su riesgo, antes de recomendarlo.
- La documentación de Last.fm no dice que los errores llegan con un status
  HTTP distinto de 200, ni que el error 6 es el de usuario inexistente, ni que
  no manda headers de caché. Salió de pedidos reales.
- En los componentes de Astro intentó resolver los errores de tipos del editor
  con anotaciones JSDoc, que en el frontmatter de un `.astro` no tienen
  efecto. Lo vio en los diagnósticos del editor y reescribió el código para
  que los tipos se deduzcan solos.
- La documentación de `track.getInfo` dice que con el usuario devuelve sus
  escuchas y si marcó el tema como favorito, pero no nombra esos campos ni los
  muestra en el ejemplo. Lo presentó como no verificado, junto con el riesgo
  de abrir un proxy a Last.fm, al evaluar el detalle por tema.

**Qué decidí yo.** El movimiento reducido igual que el comportamiento real
del sitio anterior (solo el fade, sin desplazamiento), no como decía el
comentario. La redirección real de `/`, aceptando que depende de un
comportamiento no documentado y que se revisa en cada actualización. Cómo
cumplir los términos de Last.fm: sin portadas y con crédito de texto.

---

## Herramientas y configuración

**Qué hizo la IA.** Configuró el repositorio, Tailwind, las fuentes, React, el
adapter de Vercel, las variables de entorno y los controles que corren antes
de cada commit (build, secretos, palabras que no corresponden al
repositorio). Para probar el endpoint en cada estado armó un reemplazo de
`fetch` que vive fuera del repositorio. Para probar los estados y el teclado
del widget sin navegador, montó la isla real en jsdom, también instalado
fuera del repositorio, con respuestas falsas del endpoint. Para medir el
layout del About usó Chrome headless por el protocolo de DevTools, con un
script fuera del repositorio que mide posiciones y saca capturas en varios
anchos y en los dos temas.

**Un límite puesto a propósito.** La IA no abre el archivo `.env`: la clave de
Last.fm la cargo yo. Para probar, el servidor de desarrollo lee el archivo
como lo haría en cualquier máquina, y el control que busca la clave en el
build imprime solo nombres de archivo, nunca el valor.

**Qué revisé, adapté o descarté.** Fijé las versiones de las librerías en las
del sitio publicado, después de que `npm install` trajera unas más nuevas.

**Errores y límites detectados.**

- El control de palabras daba falsos positivos adentro de los JPG; pasó a
  correrse con `-I`.
- Los textos con secuencias de escape que la IA escribía (por ejemplo, la del
  espacio duro) llegaban a los archivos convertidos en el carácter real. Un
  script falló y tres archivos quedaron alterados; lo detectó revisando los
  bytes y lo corrigió.
- Si la clave de Last.fm hubiera sido obligatoria, faltar habría dado un 500
  genérico, porque Astro valida las secretas al importarlas. Lo detectó en la
  documentación antes de escribir el endpoint.
- El servidor que armó para revisar el build no mandaba el tipo de los
  archivos CSS y JavaScript, el navegador los rechazaba y las primeras
  mediciones daban cero. Lo detectó porque el `body` tenía el margen por
  defecto del navegador, y corrigió el servidor antes de sacar conclusiones.
- Para decidir los íconos del Stack consultó qué herramientas tienen ícono en
  simple-icons con los datos públicos del paquete, sin instalarlo. Al sumar
  la integración del sitemap, comparó `npm audit` contra el lock anterior:
  los avisos ya estaban y vienen del adapter de Vercel.

**Qué decidí yo.** El preset `base` del `tsconfig`, porque el proyecto no usa
TypeScript.

---

## Documentación y copy

**Qué hizo la IA.** Adaptó a Astro las reglas del proyecto anterior; redactó
`CLAUDE.md`, la bitácora, el registro de decisiones, el registro de IA y el
README; revisó el origen de las skills que uso. En el caso de Recuérdalo,
contrastó el copy (textos, metadata y alts) contra el archivo de Figma del
proyecto, leído en modo solo lectura: la investigación, el UI Kit y las 29
pantallas. El contraste de los colores del kit lo calculó, en vez de tomar el
dato que declara el archivo.

**Qué revisé, adapté o descarté.** Revisé los cambios a las reglas de
imágenes antes de que se guardaran, elegí qué partes del historial anterior
entraban en la bitácora y redefiní el criterio de estos documentos: sin
fechas, por etapa o por tipo de tarea, sin paso a paso.

**Errores y límites detectados.**

- Dos skills eran de terceros, y una declaraba su licencia en un archivo que
  no se había copiado.
- En el copy del widget, la pasada de hechos de la skill de auditoría marcó
  dos cosas en sus propios borradores: un "Probá de nuevo en un rato" que es
  falso cuando la falla es de configuración (reintentar no cambia nada), y un
  título que, encima de "Sonando ahora", decía que estoy diseñando en ese
  momento.
- En las pestañas, la misma pasada marcó que "Últimos 5" ata el número del
  copy a una constante del endpoint: si cambia la cantidad, el texto miente.
  Lo dejé así porque dice el tamaño de la lista antes de abrirla.
- En el copy de Recuérdalo, la pasada de hechos contra Figma encontró
  afirmaciones sin respaldo en un texto que ya estaba aprobado: el orgullo de
  lograr algo solas "en cada entrevista", cuando la investigación lo respalda
  con una sola cita;
  "botones de 56 px" cuando el principal mide 64, y "zonas táctiles de 48"
  cuando el kit fija 56 como mínimo; "limitaciones visuales" que la persona del
  caso no tiene; y un botón Volver en "cada pantalla", cuando el inicio no lo
  tiene. Ninguna se nota leyendo el texto; aparecieron al buscar cada una en
  el archivo. También marcó que la intro repetía el tagline y que el cierre
  nombraba a la persona sin presentarla.
- Al completar el README escribió que la sección de contacto tenía un
  formulario; al revisar contra el código vio que la isla es el botón que
  copia el mail, y lo corrigió antes de entregarlo. Los créditos que no
  encontró anotados en el repositorio los dejó afuera y los señaló.
- Escribió dos veces, en la documentación, una palabra que el control de
  palabras del repositorio no admite. El control la detectó las dos veces; la
  primera, después de un push.

**Qué decidí yo.** Las skills de Anthropic se usan en local y no se
versionan; la skill propia de auditoría de copy sí se versiona. El título del
widget ("Lo que suena cuando diseño" / "Music I design to") y la aprobación
de cada texto de sus estados. En el copy, que El Ritual del Tono siga
rotulado como proyecto universitario y que su intro no nombre el curso. En Recuérdalo contesté la
pasada de hechos punto por punto: confirmé lo que solo sabía yo (la duración,
que el trabajo fue individual), saqué lo que no tenía respaldo y escribí los
textos de reemplazo del desafío, de los entregables y del cierre.
