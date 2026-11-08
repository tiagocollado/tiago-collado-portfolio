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

**Un límite que atraviesa todo.** La IA no usa el sitio como una persona.
Verifica sobre el código, el build y el HTML generado, y puede medir y
capturar páginas con Chrome headless; lo interactivo (animaciones, cursor,
tema, táctil) y el juicio visual final los pongo yo, en el navegador.

---

## Migración de componentes y componentes nuevos

**Qué hizo la IA.** Portó a Astro los datos, las imágenes, las secciones y los
componentes interactivos del sitio en Next. Antes de cada tanda leyó cómo se
coordinaban las piezas en el sitio anterior y propuso cómo resolver cada una
sin el contexto de React, que no cruza entre islas. Para el widget de música,
que no existía, propuso primero dónde va, cómo se ve y cada uno de sus
estados, y lo construyó después de mi aprobación. Para su interacción hizo lo
mismo: el patrón de accesibilidad del selector, cómo se ve cada estado nuevo,
cómo crece sin saltos y si convenía sumar un detalle por tema. Cuando
reemplacé las pestañas por el concepto del tocadiscos, bajó ese concepto a
un diseño: cada estado en los dos temas y en celular, el patrón de la
selección verificado en la guía de WAI-ARIA, qué incluye la lista y qué se
reutilizaba del código.

**Qué revisé, adapté o descarté.** Aprobé la estrategia de cada isla antes de
que escribiera, y cambié dos cosas de lo que se había previsto: el selector de
idioma pasó de botones a links, y la grilla de puntos se separó en su propia
isla para hidratarla más tarde. Del widget revisé en el navegador los seis
estados, el celular de 320 px, el ecualizador y el cursor. De su interacción,
las pestañas y el alto animado en los dos temas, el uso con teclado, los
títulos largos a 320 px, el movimiento reducido y el estado de error.

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

**Qué decidí yo.** La directiva de hidratación de cada isla; que ningún texto
accesible quede fijo en un idioma; las animaciones de entrada en CSS y el
título letra por letra como isla chica, en vez de convertir componentes
enteros en islas. Del widget: su lugar en el About y que no muestre portadas.
De su interacción: dejar afuera el detalle por tema, los títulos de la lista
en una sola línea y el tiempo relativo con más contraste también en la vista
Ahora. Después, reemplazar las pestañas por el tocadiscos y su concepto
entero: sin tiempo relativo, sin flechas, la lista siempre visible en
celular y la velocidad del giro. Primero, que el disco girara solo si el tema
sonaba, con media vuelta al poner un tema; después cambié de criterio: el
disco gira siempre, como ambiente, y el estado real lo dice un cartel "En
vivo" prendido o apagado. La IA recomendó reemplazar la media vuelta por una
escala corta, y qué anunciar con el cartel apagado (nada). Revisando en
staging decidí la jerarquía del About: el widget es secundario, va después
de la firma y alineado abajo con ella, más compacto y con el label en tinta
neutra. También el cartel como un rectángulo sin efectos, y sacar la escala.
Al final, sacar la selección: elegir un tema no aportaba nada que la lista no
mostrara, así que el widget quedó pasivo (cada fila es un link a Last.fm), y
la interacción significativa del sitio pasa al cambio de tema, que se
rediseña con la identidad visual. Y dos detalles: el título balanceado en dos
líneas y el giro a 4 s por vuelta.

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
- Escribió dos veces, en la documentación, una palabra que el control de
  palabras del repositorio no admite. El control la detectó las dos veces; la
  primera, después de un push.

**Qué decidí yo.** Las skills de Anthropic se usan en local y no se versionan
(se citan en Créditos y licencias); la skill propia de auditoría de copy sí se
versiona. El título del widget ("Lo que suena cuando diseño" / "Music I
design to") y la aprobación de cada texto de sus estados. En el copy, que El Ritual del Tono siga rotulado como proyecto
universitario y que su intro no nombre el curso.
