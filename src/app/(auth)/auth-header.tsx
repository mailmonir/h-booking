import Logo from "@/components/logo";

const AuthHeader = ({ heading }: { heading: string }) => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="flex justify-center">
        <Logo />
      </div>
      <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-foreground">
        {heading}
      </h2>
    </div>
  );
};

export default AuthHeader;
