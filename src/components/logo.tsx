import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        className="w-auto h-8"
        src="/logo.png"
        alt="Your Company"
        width={100}
        height={100}
        priority
      />
    </Link>
  );
};

export default Logo;
