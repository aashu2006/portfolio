import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-4">
      <h1 className="text-5xl font-semibold tracking-tight">404</h1>
      <p className="text-[15px] leading-relaxed text-muted-text max-w-xs">
        this page doesn&apos;t exist, or maybe it just hasn&apos;t been built
        yet
      </p>
      <Link href="/" className="link-quiet text-sm mt-2">
        back to home
      </Link>
    </div>
  );
}
