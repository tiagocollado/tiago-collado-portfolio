import { useEffect, useRef, useState } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import MagneticLink from '../ui/MagneticLink.jsx';
import SplitText from '../ui/SplitText.jsx';

/*
 * Contact: la primera mitad del bloque de cierre de la home. No tiene
 * padding inferior ni una línea abajo: el Footer arranca pegado y los dos se
 * leen como una sola pieza.
 *
 * Estructura:
 *  1. Micro-label de sección.
 *  2. Una pregunta corta, sin párrafo de body: quien llega acá ya hizo click
 *     en "Hablemos" y viene con intención. No hay que volver a venderle.
 *  3. El mail en mono grande, con un botón para copiarlo.
 *  4. Los cuatro canales en una fila.
 *
 * El mail va en mono para contrastar con el sans del resto, y porque una
 * dirección de mail es un string técnico: en monoespaciada se lee natural.
 *
 * El botón de copiar existe porque `mailto:` no le sirve a quien usa webmail:
 * el click no abre nada y el contacto se pierde. Copiar al portapapeles es un
 * patrón que la gente ya espera (Jakob).
 *
 * `texts` trae los textos de la sección ya traducidos.
 */

const EASE = [0.16, 1, 0.3, 1];

const EMAIL = 'tiago.collado@gmail.com';

// `download` cambia el glifo a ↓: bajar un archivo y navegar a otro sitio no
// son la misma acción. LinkedIn, GitHub y WhatsApp son nombres propios y no
// se traducen; el label del CV sale de `texts`.
const CHANNELS = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/tiagocollado/', download: false },
  { id: 'github', label: 'GitHub', href: 'https://github.com/tiagocollado', download: false },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.link/9tvuws', download: false },
  { id: 'cv', label: null, href: '/tiago-collado-cv.pdf', download: true },
];

/*
 * staggerChildren solo llega a hijos motion DIRECTOS, y acá hay divs de
 * layout en el medio. Por eso cada bloque calcula su propio delay.
 */
const fadeUp = (delay) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  },
});

// Cuánto dura el estado "copiado" antes de volver a "copiar".
const COPIED_DURATION_MS = 2000;

export default function Contact({ texts }) {
  const [copied, setCopied] = useState(false);

  // El timeout se guarda para cancelarlo si se copia dos veces seguidas (que
  // el segundo click reinicie los 2 s) o si el componente se desmonta antes.
  const resetTimer = useRef(null);
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPIED_DURATION_MS);
    } catch {
      // El portapapeles puede estar bloqueado (contexto no seguro, permisos
      // denegados). No se muestra un error: el mail sigue visible en pantalla
      // y el link `mailto:` de al lado funciona igual.
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        id="contact"
        aria-labelledby="contact-heading"
        // Sin padding inferior: el Footer arranca pegado.
        className="pt-20 md:pt-24 lg:pt-28 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* 1 · Micro-label de sección */}
          <motion.p
            variants={fadeUp(0)}
            className="text-xs font-mono tracking-[0.2em] uppercase"
            style={{ color: 'var(--color-accent)' }}
          >
            {texts.label}
          </motion.p>

          {/* 2 · La pregunta: es el h2 de la sección */}
          <SplitText
            as="h2"
            id="contact-heading"
            text={texts.title}
            stagger={0.02}
            delay={0.15}
            yFrom={20}
            blurFrom={4}
            duration={0.6}
            whileInView
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight block mt-10 md:mt-12 lg:mt-16 text-(--ink-primary)"
          />

          {/* 3 · Email: micro-label, dirección en mono grande y botón copiar */}
          <motion.div variants={fadeUp(0.25)} className="mt-12 md:mt-16">
            <p
              className="text-xs font-mono tracking-[0.2em] uppercase"
              style={{ color: 'var(--ink-muted)' }}
            >
              {texts.emailLabel}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-4">
              {/* Imán apenas perceptible. El factor solo no alcanza: en un
                  elemento ancho como este el texto se deslizaba decenas de
                  px. `max` le pone un tope de 6px. */}
              <MagneticLink
                href={`mailto:${EMAIL}`}
                factor={0.08}
                max={6}
                className="group relative inline-block font-mono text-xl md:text-3xl lg:text-4xl tracking-tight break-all md:break-normal transition-colors duration-300 text-(--ink-primary) hover:text-accent"
              >
                {EMAIL}
                {/* Subrayado que se dibuja de izquierda a derecha en hover. Es
                    un elemento aparte (y no text-decoration) para animarlo con
                    transform, que el navegador compone barato. */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1 md:-bottom-2 h-px md:h-0.5 w-full origin-left scale-x-0 transition-transform duration-500 ease-expo-out group-hover:scale-x-100"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
              </MagneticLink>

              {/* Botón copiar.
                  - cursor-pointer explícito: un <button> no trae la manito por
                    defecto, y el sitio no oculta el cursor nativo.
                  - El relleno sube desde abajo en hover, como un vaso que se
                    llena. Es un span con transform (lo compone la GPU), no un
                    background-color animado.
                  - El texto va con `relative`: al estar posicionado y venir
                    después en el DOM, se pinta encima del relleno.
                  - aria-live anuncia "copiado" sin mover el foco. */}
              <button
                type="button"
                onClick={copyEmail}
                data-cursor="link"
                className={`group relative overflow-hidden cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-mono uppercase tracking-[0.18em] transition-colors duration-500 ${
                  copied
                    ? 'border-accent text-white'
                    : 'border-(--border-strong) text-(--ink-secondary) hover:border-accent hover:text-white'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 origin-bottom transition-transform duration-700 ease-expo-out ${
                    copied ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
                  }`}
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
                <span className="relative" aria-live="polite">
                  {copied ? texts.copied : texts.copy}
                </span>
                {copied ? (
                  <Check className="relative w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Copy
                    className="relative w-3.5 h-3.5 transition-transform duration-300 ease-expo-out group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </motion.div>

          {/* 4 · Canales: mismo tratamiento que los links de la barra de
              metadata de los casos de estudio, para no inventar otro patrón. */}
          <motion.div
            variants={fadeUp(0.35)}
            className="flex flex-wrap items-center gap-x-8 gap-y-4 mt-10 md:mt-12"
          >
            {CHANNELS.map((channel) => (
              <a
                key={channel.id}
                href={channel.href}
                {...(channel.download
                  ? { download: true }
                  : { target: '_blank', rel: 'noopener noreferrer' })}
                data-cursor="link"
                className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.18em] transition-colors duration-300 text-(--ink-secondary) hover:text-accent"
              >
                <span>{channel.label ?? texts.downloadCv}</span>
                <span
                  aria-hidden="true"
                  className={`inline-block transition-transform duration-300 ease-expo-out ${
                    channel.download
                      ? 'group-hover:translate-y-1'
                      : 'group-hover:translate-x-1 group-hover:-translate-y-1'
                  }`}
                  style={{ color: 'var(--color-accent)' }}
                >
                  {channel.download ? '↓' : '↗'}
                </span>
              </a>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </MotionConfig>
  );
}
