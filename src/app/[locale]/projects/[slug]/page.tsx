import { notFound } from 'next/navigation'
import { projects } from '@/data/projects'
import { Locale } from '@/types'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Gallery from '@/components/sections/Gallery'

interface ProjectPageProps {
  params: Promise<{
    locale: Locale
    slug: string
  }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

// Mapeo de sección → tipo de label
const SECTION_KEYS = ['context', 'role', 'process', 'solution', 'results'] as const

function getSectionLabelPrefix(projectType: string) {
  if (projectType === 'fullstack') return 'fs'
  return 'ux'
}

// Devuelve el siguiente proyecto en el carrusel, saltando comingSoon
// y haciendo wrap-around al primero cuando estamos en el último.
function getNextProject(currentOrder: number) {
  const eligible = projects.filter((p) => !p.comingSoon).sort((a, b) => a.order - b.order)
  const idx = eligible.findIndex((p) => p.order === currentOrder)
  return eligible[(idx + 1) % eligible.length]
}

/**
 * Mini-renderer para contenido de case studies.
 * Soporta una sintaxis liviana en los strings de i18n para que los keys
 * puedan mezclar prosa + subheadings + bullets sin sumar dependencias:
 *   - Línea `## Texto`         → subheading <h3>
 *   - Línea `- Texto`          → item de lista (los items consecutivos
 *                                 se agrupan en un mismo <ul>)
 *   - Línea vacía              → separador entre bloques
 *   - Cualquier otro texto     → párrafo <p>
 *
 *  Ejemplo:
 *    "Intro en prosa.\n\n## Arquitectura\n- Backend en Node\n- ...
 *     \n\n## Interfaz\n- Tailwind\n- ..."
 */
type Block =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] }

function parseContent(raw: string): Block[] {
  const blocks: Block[] = []
  // Cada "bloque" se separa por línea vacía. Dentro de un bloque puede
  // haber: una sola línea (heading o párrafo) o varias líneas que
  // empiezan con "- " (lista).
  const rawBlocks = raw.split(/\n{2,}/)

  for (const rawBlock of rawBlocks) {
    const lines = rawBlock.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) continue

    // Lista: todas las líneas empiezan con "- "
    if (lines.every((l) => l.startsWith('- '))) {
      blocks.push({
        kind: 'list',
        items: lines.map((l) => l.slice(2).trim()),
      })
      continue
    }

    // Heading: una sola línea con "## "
    if (lines.length === 1 && lines[0].startsWith('## ')) {
      blocks.push({ kind: 'heading', text: lines[0].slice(3).trim() })
      continue
    }

    // Caso default: párrafo (junta líneas con espacio).
    blocks.push({ kind: 'paragraph', text: lines.join(' ') })
  }

  return blocks
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const cs = await getTranslations('case_study')
  const labelPrefix = getSectionLabelPrefix(project.type)

  // Cargar contenido del caso de estudio
  const caseStudyKey = `case_study_${slug}`
  let hasCaseStudy = false
  const caseStudyContent: Record<string, string> = {}

  if (!project.comingSoon) {
    try {
      const t = await getTranslations(caseStudyKey)
      hasCaseStudy = true
      for (const key of SECTION_KEYS) {
        caseStudyContent[key] = t(key)
      }
    } catch {
      hasCaseStudy = false
    }
  }

  // Behance excluido (decisión: sacarlos del portfolio).
  const hasLinks = Boolean(
    project.links.live || project.links.github || project.links.githubBack
  )

  const nextProject = getNextProject(project.order)

  return (
    <div className="min-h-screen pb-24 md:pb-32">

      {/* ============ HEADER ============ */}
      <div className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 pt-16 md:pt-20">
        <div className="max-w-4xl mx-auto">

          {/* Back link — la flecha se desliza 4px a la izquierda en hover
              (CSS group-hover, sin Framer para mantener la page como
              server component). */}
          <a
            href={`/${locale}`}
            className="group inline-flex items-center gap-2 text-sm mb-10 md:mb-14 transition-opacity duration-200 hover:opacity-70"
            style={{ color: 'var(--ink-secondary)' }}
          >
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-expo-out group-hover:-translate-x-1"
            >
              ←
            </span>
            {cs('back')}
          </a>

          {/* 1. Tipo de proyecto */}
          <p
            className="text-xs font-mono tracking-[0.2em] uppercase mb-5"
            style={{ color: 'var(--color-accent)' }}
          >
            {project.type === 'ux' ? 'UX / UI Case Study'
              : project.type === 'fullstack' ? 'Full-stack Project'
              : 'Design Project'}
          </p>

          {/* 2. Título */}
          <h1
            className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05] mb-6 md:mb-8"
            style={{ color: 'var(--ink-primary)' }}
          >
            {project.title}
          </h1>

          {/* 3. Herramientas / Tags */}
          <div className="flex flex-wrap gap-2 mb-8 md:mb-10">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono tracking-wide px-3 py-1.5 rounded-full border"
                style={{
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--ink-secondary)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 4. Descripción / Tagline */}
          <p
            className="text-lg md:text-2xl leading-relaxed mb-10 md:mb-12 max-w-3xl"
            style={{ color: 'var(--ink-secondary)' }}
          >
            {project.tagline[locale]}
          </p>

          {/* 5. CTAs del proyecto — pills compactos con flecha animada.
              Se renderean SOLO si el proyecto tiene live o repos. Behance
              excluido por decisión del portfolio. Si no hay ninguno, la
              fila no aparece. */}
          {hasLinks && (
            <div className="flex flex-wrap gap-3 mb-12 md:mb-16">
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: '#FFFFFF',
                  }}
                >
                  <span>{cs('view_live')}</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--ink-primary)',
                  }}
                >
                  <span>{cs('view_github_frontend')}</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              )}
              {project.links.githubBack && (
                <a
                  href={project.links.githubBack}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
                  style={{
                    borderColor: 'var(--border-default)',
                    color: 'var(--ink-primary)',
                  }}
                >
                  <span>{cs('view_github_backend')}</span>
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============ CASE STUDY SECTIONS ============ */}
      <div className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32">
        <div className="max-w-3xl mx-auto space-y-24 md:space-y-32">

          {SECTION_KEYS.map((key, index) => {
            const sectionNumber = String(index + 1).padStart(2, '0')
            const sectionLabel = cs(`${labelPrefix}_s${index}`)
            const content = hasCaseStudy ? caseStudyContent[key] : ''

            return (
              <section key={key} className="relative">
                {/* Número + Título */}
                <div className="flex items-baseline gap-4 md:gap-5 mb-8 md:mb-10">
                  <span
                    className="font-mono text-sm md:text-base font-semibold tracking-wider"
                    style={{ color: 'var(--color-accent)' }}
                  >
                    {sectionNumber}
                  </span>
                  <span
                    className="h-px flex-1 max-w-10 mt-3"
                    style={{ backgroundColor: 'var(--border-strong)' }}
                  />
                  <h2
                    className="font-display text-3xl md:text-4xl font-semibold tracking-tight"
                    style={{ color: 'var(--ink-primary)' }}
                  >
                    {sectionLabel}
                  </h2>
                </div>

                {/* Contenido — parseado con mini-renderer (## subheading,
                    - bullets, párrafos). Permite estructurar Solución
                    sin sumar dependencias. */}
                <div
                  className="text-lg md:text-xl leading-[1.75] space-y-6 pl-0 md:pl-14"
                  style={{ color: 'var(--ink-secondary)' }}
                >
                  {hasCaseStudy ? (
                    parseContent(content).map((block, i) => {
                      if (block.kind === 'heading') {
                        return (
                          <h3
                            key={i}
                            className="font-display text-xl md:text-2xl font-semibold tracking-tight mt-2"
                            style={{ color: 'var(--ink-primary)' }}
                          >
                            {block.text}
                          </h3>
                        )
                      }
                      if (block.kind === 'list') {
                        return (
                          <ul key={i} className="space-y-3 list-none">
                            {block.items.map((item, j) => (
                              <li key={j} className="flex gap-3">
                                <span
                                  aria-hidden
                                  className="font-mono text-sm leading-[1.75] shrink-0"
                                  style={{ color: 'var(--color-accent)' }}
                                >
                                  —
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        )
                      }
                      return <p key={i}>{block.text}</p>
                    })
                  ) : key === 'context' ? (
                    <p>{project.description[locale]}</p>
                  ) : (
                    <p className="italic opacity-60">[{cs('pending_content')}]</p>
                  )}
                </div>
              </section>
            )
          })}

        </div>
      </div>

      {/* ============ GALERÍA ============ */}
      {project.gallery && project.gallery.length > 0 && (
        <Gallery slug={slug} images={project.gallery} />
      )}

      {/* ============ PROJECT NAVIGATION ============
          Reemplaza el viejo bloque de "Demostración del proyecto".
          - Card prominente: próximo proyecto (con wrap-around al primero
            cuando estamos en el último).
          - Link sobrio: volver al listado completo.
      */}
      <div className="px-6 md:px-10 lg:px-16 xl:px-24 2xl:px-32 mt-28 md:mt-40">
        <div className="max-w-5xl mx-auto">

          <a
            href={`/${locale}/projects/${nextProject.slug}`}
            className="group block p-8 md:p-12 rounded-2xl border transition-all duration-300 hover:-translate-y-2"
            style={{
              borderColor: 'var(--border-default)',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <p
              className="text-xs font-mono tracking-[0.2em] uppercase mb-4"
              style={{ color: 'var(--color-accent)' }}
            >
              {cs('next_project_label')}
            </p>
            <div className="flex items-end justify-between gap-6">
              <h2
                className="font-display text-3xl md:text-5xl font-semibold tracking-tight leading-tight"
                style={{ color: 'var(--ink-primary)' }}
              >
                {nextProject.title}
              </h2>
              <span
                aria-hidden
                className="text-2xl md:text-3xl inline-block transition-transform duration-300 ease-expo-out group-hover:translate-x-2"
                style={{ color: 'var(--color-accent)' }}
              >
                →
              </span>
            </div>
          </a>

          {/* Link sobrio para volver al listado completo */}
          <a
            href={`/${locale}`}
            className="group inline-flex items-center gap-2 text-sm mt-12 md:mt-16 transition-opacity duration-200 hover:opacity-70"
            style={{ color: 'var(--ink-secondary)' }}
          >
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 ease-expo-out group-hover:-translate-x-1"
            >
              ←
            </span>
            {cs('view_all_projects')}
          </a>

        </div>
      </div>

    </div>
  )
}