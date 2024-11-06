"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Maximize, Minimize } from "lucide-react";

const FullScreenButton = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullScreen(false);
        });
      }
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        onClick={toggleFullScreen}
        className="h-10 w-10 rounded-full p-0 hidden lg:inline-flex items-center justify-center"
      >
        {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </Button>
    </>
  );
};

export default FullScreenButton;
