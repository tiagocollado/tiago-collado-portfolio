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

Pendiente.

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
estilos y componentes, y verificar las APIs de Astro en la documentación
oficial. La IA propone y ejecuta los cambios; yo los reviso, tomo las
decisiones de diseño, alcance y arquitectura, y hago los commits.

Las reglas con las que trabaja el asistente están en [CLAUDE.md](CLAUDE.md) y
en [.claude/rules/](.claude/rules/). El registro detallado (qué hizo la IA, qué
revisé o descarté, qué errores aparecieron y qué decidí yo) está en
[docs/proceso/uso-de-ia.md](docs/proceso/uso-de-ia.md).
