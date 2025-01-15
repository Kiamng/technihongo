import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Link href={"/Login"}>
        <Button>Login</Button>
      </Link>
      <Link href={"/SignIn"}>
        <Button>SignIn</Button>
      </Link>
    </>
  );
}
