import Navbar from '@/components/ui/Navbar'
import Hero from '@/components/sections/Hero'
import Projects from '@/components/sections/Projects'
import About from '@/components/sections/About'
import Stack from '@/components/sections/Stack'
import Footer from '@/components/ui/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Projects />
      <About />
      <Stack />
      <Footer />
    </>
  )
}