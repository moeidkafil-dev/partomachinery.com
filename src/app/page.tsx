import { Header } from "@/components/site/Header";
import { ScrollStage } from "@/components/scroll/ScrollStage";
import { Machinery } from "@/components/site/Machinery";
import { Capability } from "@/components/site/Capability";
import { Gallery } from "@/components/site/Gallery";
import { Services } from "@/components/site/Services";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { PartoBot } from "@/components/character/PartoBot";
import { SupportPanel } from "@/components/support/SupportPanel";
import { IntroStrip } from "@/components/site/IntroStrip";

/**
 * Parto Plastic Machinery — immersive industrial site.
 * Single-page narrative: pinned cinematic scroll story -> product -> capability
 * -> gallery -> services/FAQ -> contact. All content is semantic DOM and works
 * without WebGL (this site uses none) and with reduced motion.
 */
export default function Home() {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <Header />
      <main>
        <ScrollStage />
        <IntroStrip />
        <Machinery />
        <Capability />
        <Gallery />
        <Services />
        <Contact />
      </main>
      <Footer />
      <PartoBot />
      <SupportPanel />
    </div>
  );
}
