'use client'

import { useTranslations } from 'next-intl'

/**
 * Skip link — primer elemento focusable de la página.
 *
 * Invisible hasta que recibe foco por teclado (`sr-only` +
 * `focus:not-sr-only`). Sin esto, quien navega con teclado tiene que tabular
 * por el logo, los tres links del navbar y los dos toggles ANTES de llegar
 * al contenido, en cada página del sitio.
 *
 * ⚠️ Por qué es un client component con `onClick` y no un `<a href="#main">`
 * a secas: Lenis monta con `anchors: true` e intercepta los clicks en anclas
 * para hacer el scroll suave él mismo, lo que puede comerse el movimiento de
 * foco nativo del browser — que acá es justamente lo único que importa.
 * Previniendo el default y llamando a `focus()` a mano, el comportamiento es
 * el mismo con Lenis, sin Lenis y con `prefers-reduced-motion`.
 *
 * No hace falta scrollear: `<main>` arranca al tope de la página. Lo que el
 * link resuelve es la POSICIÓN DEL FOCO, no la del scroll.
 */
export default function SkipLink() {
  const t = useTranslations('a11y')

  return (
    <a
      href="#main"
      onClick={(e) => {
        e.preventDefault()
        document.getElementById('main')?.focus()
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:inline-flex focus:items-center focus:px-5 focus:py-2.5 focus:rounded-full focus:border focus:text-sm focus:font-medium focus:no-underline focus:border-accent focus:text-(--ink-primary) focus:bg-(--color-surface)"
    >
      {t('skip_to_content')}
    </a>
  )
}
