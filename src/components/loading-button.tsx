import { Button } from "./ui/button";
import { ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
  type: "button" | "submit" | "reset" | undefined;
}

const LoadingButton = ({
  loading,
  disabled,
  className,
  type,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button
      type={type}
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {props.children}
    </Button>
  );
};

export default LoadingButton;
