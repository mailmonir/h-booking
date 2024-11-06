"use client";
import { createContext, useContext, useState } from "react";
import { AlertMessageProps } from "@/components/alert-message";

interface VerifyEmailContextType {
  message: AlertMessageProps | undefined;
  setMessage: React.Dispatch<
    React.SetStateAction<AlertMessageProps | undefined>
  >;
}

// Create a context with an optional default value
const VerifyEmailContext = createContext<VerifyEmailContextType | undefined>(
  undefined
);

interface VerifyEmailProviderProps {
  children: React.ReactNode;
}

export const VerifyEmailProvider: React.FC<VerifyEmailProviderProps> = ({
  children,
}) => {
  const [message, setMessage] = useState<AlertMessageProps | undefined>({
    type: "error",
    message: "",
  });

  return (
    <VerifyEmailContext.Provider value={{ message, setMessage }}>
      {children}
    </VerifyEmailContext.Provider>
  );
};

export const useVerifyEmailContext = (): VerifyEmailContextType => {
  const context = useContext(VerifyEmailContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
