import { ButtonLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-xs font-semibold tracking-[0.18em] text-burgundy uppercase">Error 404</p>
      <h1 className="mt-4 text-3xl text-ink sm:text-4xl">This page could not be found</h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-ink-3">
        The article may have moved, or the address may contain a typo. The sections below are a good
        place to continue.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/history" variant="secondary">
          Explore Armenian History
        </ButtonLink>
      </div>
    </div>
  );
}
