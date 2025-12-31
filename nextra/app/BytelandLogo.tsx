"use client";

import { useEffect, useRef } from "react";

export default function BytelandLogo() {
  const imgRef = useRef<HTMLImageElement>(null);
  const animationRef = useRef<Animation | null>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    // Start rotation animation using Web Animations API
    // Base duration: 10s per rotation
    const animation = imgRef.current.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      {
        duration: 10000,
        iterations: Infinity,
        easing: "linear",
      },
    );

    animationRef.current = animation;

    return () => animation.cancel();
  }, []);

  const setPlaybackRate = (rate: number) => {
    if (animationRef.current) {
      animationRef.current.updatePlaybackRate(rate);
    }
  };

  return (
    <a
      href="https://byteland.app"
      target="_blank"
      rel="noreferrer"
      className="p-2"
      title="Visit byteland.app"
      onMouseEnter={() => setPlaybackRate(5)} // 10s / 2s = 5x speed
      onMouseLeave={() => setPlaybackRate(1)} // Back to 1x speed
      onMouseDown={() => setPlaybackRate(20)} // 10s / 0.5s = 20x speed
      onMouseUp={() => setPlaybackRate(5)} // Back to hover speed
    >
      <img
        ref={imgRef}
        src="/byteland.svg"
        alt="ByteLand"
        className="h-6 w-6"
      />
    </a>
  );
}
