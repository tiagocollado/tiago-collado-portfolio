# Uso de inteligencia artificial

Registro del uso de IA durante el proyecto, como pide la consigna: para qué
se usó, qué se revisó o descartó, qué errores o límites aparecieron y qué
decisiones fueron mías.

| Fecha | Tarea | Herramienta | Qué hizo la IA | Qué revisé, adapté o descarté | Errores o límites detectados | Qué decidí yo |
|---|---|---|---|---|---|---|
| 2026-11-06 | F1 — configuración y documentación | Claude Code (Claude Opus 5.5) | Escribió el `.gitignore`; copió y adaptó las reglas y skills del repo viejo; redactó el `CLAUDE.md` nuevo, la bitácora, la tabla de decisiones, este registro, el historial de la versión Next y el esqueleto del README; verificó en docs.astro.build lo que afirma sobre Astro | Revisé la lista de cambios de `imagenes.md` antes de que se guardara y aprobé los tres recortes dudosos. El resto lo completo después de revisar los archivos | Señaló contradicciones entre el plan y la documentación vieja (el skip link sin JavaScript, el CV), y que `git grep` sin `--untracked` no revisa los archivos nuevos. La guía de framework components de Astro no confirma por sí sola que las islas sean independientes | Qué entra al repo nuevo y qué no; qué secciones de cada regla se conservan; que los proyectos sin publicar sigan documentados en `CLAUDE.md`; qué commits del historial viejo se omiten; que `AGENTS.md` se quede; que el CV no entre al repo y se resuelva con una redirección; cómo se implementa el skip link |
