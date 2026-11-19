import { useEffect, useRef, useState } from 'react';
import { MotionConfig, motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import MagneticLink from '../ui/MagneticLink.jsx';
import SplitText from '../ui/SplitText.jsx';

/*
 * Primera mitad del bloque de cierre: sin padding inferior, así el Footer
 * arranca pegado. El botón de copiar existe porque `mailto:` no abre nada en
 * webmail.
 */

const EASE = [0.16, 1, 0.3, 1];

const EMAIL = 'tiago.collado@gmail.com';

// `download` cambia el glifo a ↓: bajar un archivo no es navegar.
const CHANNELS = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/tiagocollado/', download: false },
  { id: 'github', label: 'GitHub', href: 'https://github.com/tiagocollado', download: false },
  { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.link/9tvuws', download: false },
  { id: 'cv', label: null, href: '/tiago-collado-cv.pdf', download: true },
];

// staggerChildren solo llega a hijos motion directos y acá hay divs en el
// medio, así que cada bloque calcula su delay.
const fadeUp = (delay) => ({
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  },
});

const COPIED_DURATION_MS = 2000;

export default function Contact({ texts }) {
  const [copied, setCopied] = useState(false);

  // Para reiniciar los 2 s con un segundo click o cancelar al desmontar.
  const resetTimer = useRef(null);
  useEffect(() => () => clearTimeout(resetTimer.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), COPIED_DURATION_MS);
    } catch {
      // Portapapeles bloqueado: sin error, el mail sigue visible y el mailto
      // de al lado funciona.
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.section
        id="contact"
        aria-labelledby="contact-heading"
        className="pt-20 md:pt-24 lg:pt-28 px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.p
            variants={fadeUp(0)}
            className="text-xs font-mono tracking-[0.2em] uppercase"
            style={{ color: 'var(--color-accent)' }}
          >
            {texts.label}
          </motion.p>

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

          <motion.div variants={fadeUp(0.25)} className="mt-12 md:mt-16">
            <p
              className="text-xs font-mono tracking-[0.2em] uppercase"
              style={{ color: 'var(--ink-muted)' }}
            >
              {texts.emailLabel}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-4">
              {/* `max`: en un elemento tan ancho, el factor solo deslizaba el
                  texto decenas de px. */}
              <MagneticLink
                href={`mailto:${EMAIL}`}
                factor={0.08}
                max={6}
                className="group relative inline-block font-mono text-xl md:text-3xl lg:text-4xl tracking-tight break-all md:break-normal transition-colors duration-300 text-(--ink-primary) hover:text-accent"
              >
                {EMAIL}
                {/* Un elemento y no text-decoration, para animarlo con transform. */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 -bottom-1 md:-bottom-2 h-px md:h-0.5 w-full origin-left scale-x-0 transition-transform duration-500 ease-expo-out group-hover:scale-x-100"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                />
              </MagneticLink>

              {/* El texto va `relative` para pintarse encima del relleno.
                  aria-live anuncia "copiado" sin mover el foco. */}
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
