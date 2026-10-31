import { RESUME } from "./content";
import Masthead from "./components/Masthead";
import Hero from "./components/brief/Hero";
import Proof from "./components/brief/Proof";
import ProjectIndex from "./components/brief/ProjectIndex";
import Experience from "./components/brief/Experience";
import Credentials from "./components/brief/Credentials";
import About from "./components/brief/About";
import Contact from "./components/brief/Contact";

export default function Home() {
  return (
    <>
      <Masthead variant="brief" resume={RESUME} />
      <main className="brief" id="main">
        <Hero />
        <Proof />
        <ProjectIndex />
        <Experience />
        <Credentials />
        <About />
      </main>
      <Contact />
    </>
  );
}
