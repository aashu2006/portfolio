import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <h1 className="masthead">404</h1>
      <p>
        This page doesn&apos;t exist, or maybe it just hasn&apos;t been built
        yet. <Link href="/">Head back home</Link>.
      </p>
    </>
  );
}
