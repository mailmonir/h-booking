import { AlertCircle, CircleCheckBig } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export interface AlertMessageProps {
  type: "success" | "error";
  message: string;
}

export function AlertMessage({ type, message }: AlertMessageProps) {
  return (
    <div className="mb-6">
      <Alert variant={type === "success" ? "success" : "destructive"}>
        {type === "success" ? (
          <CircleCheckBig className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <AlertTitle className="text-sm">{type?.toUpperCase()}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );
}
