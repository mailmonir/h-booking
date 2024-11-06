import { AlertCircle, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MessageProps {
  message: { type: string; message: string };
}

const Message = ({ message }: MessageProps) => {
  return (
    <Alert variant={message.type === "error" ? "destructive" : "success"}>
      {message.type === "success" ? (
        <Check className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle className="capitalize">{message.type}</AlertTitle>
      <AlertDescription>{message.message}</AlertDescription>
    </Alert>
  );
};

export default Message;
