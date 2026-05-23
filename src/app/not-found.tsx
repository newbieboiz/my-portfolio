import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-space-8 py-space-16 flex flex-1 flex-col items-center justify-center font-mono">
      <div className="w-full max-w-prose">
        <p className="text-text-tertiary text-small mb-space-2">{"// error"}</p>
        <h1 className="text-error text-h1 tracking-heading mb-space-4 font-bold">
          404
        </h1>
        <p className="text-text-secondary text-body mb-space-2">
          <span className="text-text-tertiary" aria-hidden="true">
            {">"}
          </span>{" "}
          route not found
        </p>
        <p className="text-text-muted text-small mb-space-8">
          the page you are looking for does not exist.
        </p>
        <div className="gap-space-4 flex flex-wrap">
          <Link
            href="/projects"
            className="text-accent hover:text-accent-hover text-small duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            cd /projects
          </Link>
          <Link
            href="/contact"
            className="text-text-secondary hover:text-text-primary text-small duration-micro focus-visible:ring-accent focus-visible:ring-offset-bg-primary rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            ./contact
          </Link>
        </div>
      </div>
    </div>
  );
}
