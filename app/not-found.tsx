import { Heading } from "@/components/primitives/heading";
import Image from "next/image";

export default function FourOhFour() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Heading level={2}>Sorry, haven&apos;t made this page yet!</Heading>
      <Image src="/404.jpg" alt="404 image" width={750} height={600} />
    </div>
  );
}
