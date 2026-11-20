import type { Project } from "@/types/content";
import { LayerLegend, LayerStack3D, TechOrbit } from "./visuals/Portfolio";
import { StatGrid, Tilt, VisualSection } from "./visuals/shared";
import { DeviceModel3D, FirmwareLoop, SonarSimulator } from "./visuals/ThirdHandEye";
import { DestinationGlobe, Evolution, ScreenCarousel3D, TourIndiaFlow } from "./visuals/TourIndia";

/** The large 3D visual beside the project title. */
export function ProjectHero({ slug }: { slug: string }) {
  if (slug === "third-hand-eye") return <DeviceModel3D />;
  if (slug === "tour-india") return <DestinationGlobe />;
  if (slug === "developerbro-academic-portfolio") return <TechOrbit />;
  return null;
}

export function ProjectStats({ project }: { project: Project }) {
  return project.stats ? <StatGrid stats={project.stats} /> : null;
}

/** Interactive and moving sections specific to each project. */
export function ProjectVisuals({ slug }: { slug: string }) {
  if (slug === "third-hand-eye") {
    return (
      <>
        <VisualSection id="simulator" eyebrow="Try it" title="Move the obstacle" intro="This runs the firmware's own maths: echo time, the ÷ 29 ÷ 2 conversion, the 30 ms timeout and the 100 cm alert rule. Drag the slider and watch the sound waves, the decision and the serial output change.">
          <SonarSimulator />
        </VisualSection>
        <VisualSection id="loop" eyebrow="Firmware" title="One pass of the loop" intro="The Arduino repeats these six steps continuously. The highlight walks through them in order.">
          <FirmwareLoop />
        </VisualSection>
      </>
    );
  }
  if (slug === "tour-india") {
    return (
      <>
        <VisualSection id="evolution" eyebrow="Story" title="From hackathon site to travel guide">
          <Evolution />
        </VisualSection>
        <VisualSection id="screens" eyebrow="The live site" title="A tour of the pages" intro="Screenshots from the project's repository on a turning carousel. Hover to stop it.">
          <ScreenCarousel3D />
        </VisualSection>
        <VisualSection id="flow" eyebrow="Architecture" title="How a request is served">
          <TourIndiaFlow />
        </VisualSection>
      </>
    );
  }
  if (slug === "developerbro-academic-portfolio") {
    return (
      <VisualSection id="layers" eyebrow="Architecture" title="Five layers, from notebook to browser" intro="Results start in my thesis notebooks and rise through typed content, server rendering and the security proxy to your browser.">
        <div className="grid items-center gap-6 md:grid-cols-[1.1fr_1fr]">
          <Tilt>
            <LayerStack3D />
          </Tilt>
          <LayerLegend />
        </div>
      </VisualSection>
    );
  }
  return null;
}
