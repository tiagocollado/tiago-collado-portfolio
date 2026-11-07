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

- [Bitácora](docs/proceso/bitacora.md): el antecedente en Next y, para cada
  etapa, qué se hizo, qué problemas aparecieron, cómo se resolvieron y qué
  queda abierto.
- [Decisiones](docs/proceso/decisiones.md): cada decisión de diseño,
  arquitectura y tecnología, con su contexto y su porqué.
- [Cómo uso IA](docs/proceso/uso-de-ia.md): el registro detallado, etapa por
  etapa.

## Cómo uso IA

Uso Claude Code (modelo Claude Opus 5.5) como asistente de desarrollo: para
adaptar la documentación del proyecto anterior, configurar Astro, portar
estilos y componentes. La IA propone y ejecuta los cambios; yo los reviso,
tomo las decisiones de diseño, alcance y arquitectura, y hago los commits.

- **Reglas del proyecto.** El asistente lee en cada sesión
  [CLAUDE.md](CLAUDE.md) y las reglas de [.claude/rules/](.claude/rules/):
  tokens de diseño, producción de imágenes y trampas conocidas del stack.
- **Verificación.** Cada decisión técnica se contrasta con la documentación
  oficial de Astro, Tailwind y las demás librerías. Si algo no se puede
  verificar, queda dicho.
- **Skills.** [`auditar-copy`](.claude/skills/auditar-copy/SKILL.md), propia:
  contrasta cada afirmación del copy contra la evidencia y busca patrones de
  texto generado por IA. Además uso dos skills de Anthropic que no se incluyen
  en el repositorio (ver [Créditos y licencias](#créditos-y-licencias)):
  `frontend-design`, que orienta la dirección visual para que no caiga en
  soluciones genéricas, y `design-critique`, que da una crítica estructurada
  de usabilidad, jerarquía y consistencia.

El registro detallado (qué hizo la IA, qué revisé o descarté, qué errores
aparecieron y qué decidí yo) está en
[docs/proceso/uso-de-ia.md](docs/proceso/uso-de-ia.md).
