# Cómo uso IA

Registro del uso de IA en el proyecto: para qué la usé, qué revisé o descarté,
qué errores o límites aparecieron y qué decisiones tomé yo.

**Herramienta**: Claude Code (modelo Claude Opus 5.5), trabajando sobre este
repositorio. Las instrucciones que sigue están en `CLAUDE.md` y en
`.claude/rules/`: reglas de diseño, de imágenes y una lista de errores
conocidos del stack.

**Cómo trabajé con ella**: cada etapa empieza con un pedido acotado. La IA
propone y ejecuta los cambios, verifica las APIs de Astro en la documentación
oficial y frena para que revise antes de seguir. Los commits los hago yo.
Cuando falta un dato (un texto, una fecha, un rol), la regla es preguntar, no
completarlo.

| Fecha | Tarea | Qué hizo la IA | Qué revisé, adapté o descarté | Errores o límites detectados | Qué decidí yo |
|---|---|---|---|---|---|
| 2026-11-06 | Configuración del repositorio y documentación | Escribió el `.gitignore`; adaptó a Astro las reglas del proyecto anterior; redactó `CLAUDE.md`, la bitácora (con un resumen de la versión Next sacado de su historial de commits), el registro de decisiones, este registro y el esqueleto del README; verificó en docs.astro.build lo que las reglas afirman sobre Astro | Revisé la lista de cambios de las reglas de imágenes antes de que se guardaran y elegí qué partes del historial anterior se incluían | Detectó contradicciones entre las decisiones previas y la documentación del sitio anterior (por ejemplo, cómo implementar el skip link sin una isla de React). La guía de componentes de framework de Astro no confirma por sí sola que las islas sean independientes: eso sale de la receta de estado compartido | Qué se migra y qué no; qué reglas se conservan; que los proyectos sin publicar sigan documentados; que el CV no se versione y se resuelva con una redirección; cómo se implementa el skip link |
| 2026-11-07 | Base del sitio: Tailwind, estilos globales, fuentes, layout, tema e i18n | Instaló Tailwind según la guía oficial; portó los estilos globales; configuró fuentes, i18n y metadata; escribió el script de tema, el skip link y la función `t()`; verificó cada API en docs.astro.build y, donde la documentación no alcanzaba, en el código instalado de Astro y de `next-themes` | Revisé las alternativas para la redirección de `/`, el origen de la metadata y el canonical antes de elegir | La guía de i18n no dice qué genera `/` en un build estático: se averiguó buildeando. La opción `redirectToDefaultLocale` producía un meta refresh de 2 segundos y un warning. El comentario del script de tema se publicaba en el HTML. La IA no puede abrir un navegador, así que el parpadeo de tema y el salto de tipografía quedan por probar a mano | Redirección de `/` hecha a mano con 307; metadata en los diccionarios con los textos actuales; sin canonical por ahora, para mantener la paridad |
| 2026-11-07 | Documentar el uso de IA en el README | Redactó la sección "Cómo uso IA" (reglas, verificación y skills); revisó el origen de cada skill y verificó en GitHub que dos de ellas coinciden con las publicadas por Anthropic | Revisé el origen de las skills antes de que se mencionaran en el README | Dos skills eran de terceros y una declaraba sus términos de licencia en un archivo que no se había copiado | Las skills de Anthropic se usan en local y no se versionan; se citan con link a su fuente en "Créditos y licencias". La skill propia queda versionada |
| 2026-11-07 | Contenido y casos de estudio | Portó datos, imágenes, secciones y páginas del sitio anterior; instaló React con el comando oficial; investigó en la documentación cómo usar imágenes optimizadas en islas y cómo hacer la redirección 307 del CV, y propuso una opción para cada una | Elegí `getImage()` para las imágenes de las islas y `vercel.json` para el CV, entre las alternativas que presentó | La documentación no aclara si `vercel.json` sigue aplicando con el adapter de Vercel: queda para probar en staging. `npm install` traía versiones más nuevas que las del sitio publicado. El control de palabras daba falsos positivos en los JPG. La IA no puede ver el sitio en un navegador: la comparación visual con el sitio publicado queda para hacer a mano | Las dos alternativas técnicas; fijar las versiones de las librerías; que el copy mantenga "Proyecto universitario" y la intro de El Ritual del Tono no nombre el curso; sumar Astro al carrusel del Stack |
