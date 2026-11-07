import { LostScene } from "@/components/illustrations/scenes-people";
import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="container-page grid items-center gap-8 pt-14 md:grid-cols-2">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">This node dropped out of the network</h1>
        <p className="mt-4 text-lg text-ink-2">The page you were looking for does not exist or has moved.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/research" variant="secondary">Research works</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">Contact</ButtonLink>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">
        <LostScene />
      </div>
    </div>
  );
}
