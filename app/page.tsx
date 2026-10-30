import Masthead from "./components/Masthead";
import Hero from "./components/brief/Hero";
import Proof from "./components/brief/Proof";
import ProjectIndex from "./components/brief/ProjectIndex";

export default function Home() {
  return (
    <>
      <Masthead />
      <main className="brief" id="main">
        <Hero />
        <Proof />
        <ProjectIndex />
      </main>
    </>
  );
}
