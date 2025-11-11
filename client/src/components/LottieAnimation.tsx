import Lottie from "lottie-react";
import { CSSProperties, useState, useEffect } from "react";

interface LottieAnimationProps {
  src?: string; // URL to animation JSON
  animationData?: any; // Direct animation data
  className?: string;
  style?: CSSProperties;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
}

export default function LottieAnimation({
  src,
  animationData,
  className = "",
  style,
  loop = true,
  autoplay = true,
  speed = 1,
}: LottieAnimationProps) {
  const [animation, setAnimation] = useState(animationData);
  const [isLoading, setIsLoading] = useState(!!src);

  useEffect(() => {
    if (src) {
      fetch(src)
        .then((res) => res.json())
        .then((data) => {
          setAnimation(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load animation:", err);
          setIsLoading(false);
        });
    }
  }, [src]);

  if (isLoading || !animation) {
    return <div className={className} style={style} />;
  }

  return (
    <Lottie
      animationData={animation}
      loop={loop}
      autoplay={autoplay}
      className={className}
      style={style}
    />
  );
}

