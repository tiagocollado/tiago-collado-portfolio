import { MotionConfig, motion } from 'framer-motion';

const OVERLAY_INK = '#F0EDE8';

// Literales a propósito: Tailwind encuentra las clases leyendo el archivo, no
// ejecutándolo. El `order` reordena las cards en mobile (ver Projects.astro).
const ORDER_CLASSES = ['order-1', 'order-2', 'order-3', 'order-4', 'order-5', 'order-6', 'order-7'];

// Proporción de la card según su `cardShape` (src/data/projects.js). La vertical
// rige desde `md`, donde la grilla tiene dos columnas: en mobile la card ocupa
// todo el ancho y vuelve a 4:3, como las demás.
const CARD_SHAPE_CLASSES = {
  wide: 'aspect-[4/3]',
  square: 'aspect-square',
  portrait: 'aspect-[4/3] md:aspect-[3/4]',
};

const CORNER_MARKS = [
  ['top-3 left-3', 'border-l-2 border-t-2', '-translate-x-1 -translate-y-1'],
  ['top-3 right-3', 'border-r-2 border-t-2', 'translate-x-1 -translate-y-1'],
  ['bottom-3 left-3', 'border-l-2 border-b-2', '-translate-x-1 translate-y-1'],
  ['bottom-3 right-3', 'border-r-2 border-b-2', 'translate-x-1 translate-y-1'],
];

const FILL_IMAGE_STYLE = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  color: 'transparent',
};

export default function ProjectCard({
  href,
  title,
  servicesLabel,
  cardShape,
  coverImage,
  gridPosition = 0,
  viewProjectLabel,
}) {
  const shapeClasses = CARD_SHAPE_CLASSES[cardShape] ?? CARD_SHAPE_CLASSES.wide;

  return (
    <MotionConfig reducedMotion="user">
      <motion.article
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          duration: 0.6,
          delay: gridPosition * 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={ORDER_CLASSES[gridPosition] ?? ''}
      >
        <div
          data-cursor="view"
          className={`group relative isolate overflow-hidden rounded-2xl border
                      border-(--border-default) transition-all duration-500 ease-out
                      hover:-translate-y-2 hover:border-accent hover:shadow-2xl hover:shadow-accent/25
                      ${shapeClasses}`}
          style={{
            backgroundColor: coverImage
              ? 'var(--color-surface)'
              : 'color-mix(in srgb, var(--color-accent) 22%, #111110)',
          }}
        >
          <a
            href={href}
            className="absolute inset-0 z-30"
            aria-label={`${title} — ${servicesLabel}. ${viewProjectLabel}`}
          />

          {coverImage && (
            <div className="absolute inset-0 isolate overflow-hidden">
              <img
                src={coverImage.src}
                srcSet={coverImage.srcset}
                sizes={coverImage.sizes}
                alt=""
                loading="lazy"
                decoding="async"
                style={FILL_IMAGE_STYLE}
                className="scale-105 object-cover transition-transform duration-700 ease-out
                           group-hover:scale-100"
              />

              <div
                className="absolute inset-0 origin-left scale-x-0 bg-accent transition-transform
                           duration-500 ease-out group-hover:scale-x-100"
                style={{ mixBlendMode: 'color' }}
              />
              <div
                className="absolute inset-0 origin-left scale-x-0 transition-transform
                           duration-500 ease-out group-hover:scale-x-100"
                style={{ backgroundColor: 'rgba(17, 17, 16, 0.70)' }}
              />
            </div>
          )}

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity
                       duration-300 ease-out group-hover:opacity-100 group-hover:delay-300"
          >
            {CORNER_MARKS.map(([position, edges, offset]) => (
              <span
                key={position}
                className={`absolute h-4 w-4 rounded-xs transition-transform duration-300 ease-out
                            group-hover:translate-x-0 group-hover:translate-y-0 group-hover:delay-300
                            ${position} ${edges} ${offset}`}
                style={{ borderColor: 'rgba(240, 237, 232, 0.70)' }}
              />
            ))}
          </div>

          <div
            className="pointer-events-none absolute inset-0 z-10 p-8 opacity-0 transition-opacity
                       duration-300 ease-out group-hover:opacity-100 group-hover:delay-300
                       [@media(hover:none)]:hidden"
            style={{ color: OVERLAY_INK }}
          >
            <h3 className="font-display text-xl font-semibold uppercase leading-tight tracking-tight md:text-2xl">
              {title}
            </h3>

            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em]">
                {viewProjectLabel}
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-expo-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                >
                  ↗
                </span>
              </span>

              <span className="text-right font-mono text-[11px] uppercase tracking-[0.12em] opacity-80">
                {servicesLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 hidden [@media(hover:none)]:block">
          <h3 className="font-display text-lg font-semibold uppercase leading-tight tracking-tight text-(--ink-primary)">
            {title}
          </h3>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-(--ink-secondary)">
            {servicesLabel}
          </p>
        </div>
      </motion.article>
    </MotionConfig>
  );
}
