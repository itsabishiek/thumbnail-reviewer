"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="">
      <section className="mt-8  flex flex-col items-center gap-4 pb-24">
        <Image
          src="/hero.png"
          width="500"
          height="500"
          alt="hero banner"
          className="rounded-xl"
        />
        <h1 className="text-center max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
          The easiest way to get feedback on your thumbnails
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300 text-xl max-w-lg mx-auto">
          Upload your thumbnails variations and send links to your friends to
          help you hone in your design skills.
        </p>
        <Button asChild size="lg">
          <Link href="/create">Get started</Link>
        </Button>
      </section>
    </main>
  );
}
