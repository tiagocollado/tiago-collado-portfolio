# Gotya — portfolio de Tiago Collado

## Sobre el proyecto

Pendiente.

## Cómo correrlo

Requisitos: Node.js 22.23.4 o superior (lo fija `engines` en `package.json`) y npm.

```sh
# instalar dependencias
npm install

# servidor de desarrollo en http://localhost:4321
npm run dev

# build de producción
npm run build
```

## Stack y decisiones

Pendiente. El detalle de cada decisión está en
[docs/proceso/decisiones.md](docs/proceso/decisiones.md).

## Componentes

Pendiente.

## Datos en vivo

Pendiente.

### Si la API falla o no hay datos

Pendiente.

## Responsive y accesibilidad

Pendiente.

## Próximos pasos

Pendiente.

## Créditos y licencias

- Skills de IA de Anthropic, usadas en local y no incluidas en este
  repositorio: [`frontend-design`](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
  y [`design-critique`](https://github.com/anthropics/knowledge-work-plugins/tree/main/design/skills/design-critique).
  Cada una se rige por la licencia de su repositorio de origen.

## Proceso

Cómo se construyó el proyecto, en [docs/proceso/](docs/proceso/):

- [Bitácora](docs/proceso/bitacora.md): por etapa, desde el antecedente en
  Next, qué se hizo y qué costó; cómo se verifica y qué queda abierto.
- [Decisiones](docs/proceso/decisiones.md): cada decisión de diseño,
  arquitectura y tecnología, con su contexto y su porqué.
- [Cómo uso IA](docs/proceso/uso-de-ia.md): por tipo de tarea, qué hizo la
  IA, qué revisé o descarté, qué errores aparecieron y qué decidí yo.

## Cómo uso IA

Uso Claude Code (modelo Claude Opus 5.5) como asistente de desarrollo, en
cuatro tipos de tarea: migrar componentes del sitio anterior, verificar cada
API contra la documentación y el código de las librerías, configurar
herramientas y redactar documentación. La IA propone un enfoque y lo ejecuta
cuando lo apruebo; yo reviso, tomo las decisiones de diseño, alcance y
arquitectura, y hago los commits. No puede abrir un navegador: lo visual y lo
interactivo lo pruebo yo.

- **Reglas.** Lee en cada sesión [CLAUDE.md](CLAUDE.md) y
  [.claude/rules/](.claude/rules/): tokens de diseño, producción de imágenes y
  errores conocidos del stack.
- **Skills.** [`auditar-copy`](.claude/skills/auditar-copy/SKILL.md), propia,
  contrasta el copy contra la evidencia y busca patrones de texto generado por
  IA. Además uso `frontend-design` y `design-critique`, de Anthropic, que no se
  incluyen en el repositorio (ver [Créditos y licencias](#créditos-y-licencias)).

El detalle, con ejemplos, está en
[docs/proceso/uso-de-ia.md](docs/proceso/uso-de-ia.md).
