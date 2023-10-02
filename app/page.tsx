import Link from "next/link";
export default function Home() {
  return (
    <div>
      <Link href={"/create"}>Try for free</Link>
    </div>
  );
}
