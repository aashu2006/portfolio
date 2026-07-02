import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-4">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-base text-muted-text">
        this page doesn&apos;t exist, or maybe it just hasn&apos;t been built yet
      </p>
      <Link
        href="/"
        className="editorial-tag underline decoration-1 underline-offset-2 hover:text-foreground transition-colors mt-2"
      >
        back to home
      </Link>
    </div>
  );
}
