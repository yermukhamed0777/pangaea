import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Problem from "./components/Problem";
import Method from "./components/Method";
import Capabilities from "./components/Capabilities";
import Evidence from "./components/Evidence";
import Voices from "./components/Voices";
import Access from "./components/Access";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Problem />
      <Method />
      <Capabilities />
      <Evidence />
      <Voices />
      <Access />
      <Footer />
    </main>
  );
}
