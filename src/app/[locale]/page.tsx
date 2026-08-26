import Hero from '@/components/sections/Hero'
import ServicesMarquee from '@/components/sections/ServicesMarquee'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'
import Stack from '@/components/sections/Stack'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/ui/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesMarquee />
      <Projects />
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
