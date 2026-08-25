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
      <Contact />
      <Footer />
    </>
  )
}
