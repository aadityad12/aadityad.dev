import Masthead from "./components/Masthead";
import Hero from "./components/brief/Hero";
import Proof from "./components/brief/Proof";

export default function Home() {
  return (
    <>
      <Masthead />
      <main className="brief" id="main">
        <Hero />
        <Proof />
        <p><a href="/datasheet/">Full datasheet</a></p>
      </main>
    </>
  );
}
