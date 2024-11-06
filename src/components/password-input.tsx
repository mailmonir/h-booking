import { forwardRef } from "react";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react";
import { InputProps } from "./ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative">
        <Input
          type={show ? "text" : type}
          ref={ref}
          {...props}
          className={cn("pe-10", className)}
        />
        <button
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => setShow(!show)}
          title={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff /> : <Eye />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
