import Hero from '@/components/sections/Hero'
import ServicesMarquee from '@/components/sections/ServicesMarquee'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'
import Stack from '@/components/sections/Stack'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/ui/Footer'
import { publishedProjects } from '@/data/projects'

/*
 * Los proyectos del home se eligen ACÁ, en el servidor, y se le pasan a
 * <Projects> ya filtrados.
 *
 * Por qué no los importa <Projects> directamente: es un componente del
 * cliente ('use client'), y todo lo que un componente del cliente importa
 * viaja al navegador en un archivo JS. Si importara `projects.ts`, el
 * navegador recibiría los datos de los 7 proyectos, incluidos los no
 * publicados. Pasándole la lista como prop, al navegador llegan solo los 4
 * que se muestran.
 */
const homeProjects = publishedProjects.filter((p) => p.showOnHome)

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesMarquee />
      <Projects projects={homeProjects} />
      <About />
      <Stack />
      {/* Bloque de cierre a pantalla completa.
          Al clickear "Hablemos" en el navbar el ancla #contact scrollea hasta
          el tope de Contact; si el bloque mide menos que el viewport, quedaba
          medio vacio y el footer caia fuera de cuadro. Con min-h-screen +
          justify-between el conjunto ocupa exactamente una pantalla: Contact
          arriba y la barra del footer pegada abajo.

          El wrapper es un <div> a proposito: un <section> o <main> convertiria
          al <footer> en descendiente suyo y le sacaria el rol de landmark
          contentinfo. Un div no scopea nada, asi que el landmark sobrevive. */}
      <div className="min-h-screen flex flex-col justify-between">
        <Contact />
        <Footer />
      </div>
    </>
  )
}
