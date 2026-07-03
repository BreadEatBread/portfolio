import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Experience } from "@/components/Experience";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { ShowcaseGrid } from "@/components/ShowcaseGrid";
import { Skills } from "@/components/Skills";
import { caseStudies, projects } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="flex-1">
        <Hero />
        <About />
        <Skills />
        <ShowcaseGrid
          id="projects"
          eyebrow="03 · Projects"
          title="프로젝트"
          items={projects}
        />
        <ShowcaseGrid
          id="case-studies"
          eyebrow="04 · Case Studies"
          title="케이스 스터디"
          items={caseStudies}
        />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
