import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/css";
import Lottie, { LottieRef } from "lottie-react";

import topAnimation from "../components/lottie/top.json";
import bottomAnimation from "../components/lottie/bottom.json";

const bgHue = keyframes`
  0% {
    filter: hue-rotate(0deg);
  }
  25% {
    filter: hue-rotate(45deg);
  }
  75% {
    filter: hue-rotate(-45deg)
  }
  100% {
    filter: hue-rotate(0deg);
  }
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  & > div {
    position: absolute;
    opacity: 0.35;
  }

  .bottom-left {
    left: 0;
    bottom: 0;
  }

  .top-right {
    right: 0;
    top: 0;
  }

  animation: ${bgHue} 20s infinite;
`;

const HeroBackground: React.FC = (props) => {
  const lottieRefs: LottieRef[] = [useRef(null), useRef(null)];
  const [animationReversed, setReverseAnimation] = useState(false);

  const reverseAnimation = () => {
    lottieRefs.forEach((lottieRef) => {
      if (lottieRef?.current) {
        setReverseAnimation(!animationReversed);
        lottieRef.current.playSegments(
          animationReversed ? [100, 241] : [241, 100],
          true
        );
      }
    });
  };
  return (
    <Background>
      <Lottie
        animationData={topAnimation}
        lottieRef={lottieRefs[0] as any}
        onLoopComplete={() => {
          reverseAnimation();
        }}
        className="top-right"
      />
      <Lottie
        animationData={bottomAnimation}
        lottieRef={lottieRefs[1] as any}
        onLoopComplete={() => {
          reverseAnimation();
        }}
        className="bottom-left"
      />
    </Background>
  );
};
export default HeroBackground;
