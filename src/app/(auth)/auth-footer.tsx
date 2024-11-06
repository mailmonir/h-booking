import Link from "next/link";

const AuthFooter = ({
  text,
  linkText,
  link,
}: {
  text: string;
  linkText: string;
  link: string;
}) => {
  return (
    <p className="mt-10 text-center text-sm/6 text-muted-foreground">
      {text}{" "}
      <Link
        href={link}
        className="font-semibold text-primary hover:text-primary/80"
      >
        {linkText}
      </Link>
    </p>
  );
};

export default AuthFooter;
