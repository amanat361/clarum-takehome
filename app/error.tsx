"use client";

import { useEffect } from "react";
import { Heading } from "@/components/primitives/heading";
import Image from "next/image";
import { Button } from "@/components/primitives/button";
import { ArrowPathIcon } from "@heroicons/react/16/solid";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Heading level={2}>Something went wrong!</Heading>
      <Image src="/500.jpg" alt="500 image" width={750} height={500} />
      <Button
        color="blue"
        onClick={() => reset()}
      >
        Try again
        <ArrowPathIcon />
      </Button>
    </div>
  );
}
