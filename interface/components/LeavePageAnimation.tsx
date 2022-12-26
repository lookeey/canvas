import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import Lottie, { LottieRef } from "lottie-react";
import anim from "./lottie/enter-game.json";

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 3;

  & > div {
    position: absolute;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);

    svg {
      width: auto !important;
      height: auto !important;
      .sq path {
        fill: ${({ theme }) => theme.bg} !important;
        stroke: ${({ theme }) => theme.bg};
        stroke-width: 1px;
      }

      & > g > g:first-child {
        filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.5));
      }
    }
  }
`;

export interface ILeavePageAnimationProps {
  show: boolean;
}

const LeavePageAnimation: React.FC<ILeavePageAnimationProps> = ({
  show,
}: ILeavePageAnimationProps) => {
  const lottieRef: LottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      let ref = lottieRef.current;
      ref.setSpeed(0.9);
      if (!show) {
        ref.goToAndStop(0);
      } else {
        ref.play();
      }
    }
  }, [show]);

  return (
    <>
      {show && (
        <Wrapper>
          <Lottie
            animationData={anim}
            loop={false}
            autoPlay={false}
            rendererSettings={{ imagePreserveAspectRatio: "xMinYMin slice" }}
            lottieRef={lottieRef}
          />
        </Wrapper>
      )}
    </>
  );
};
export default LeavePageAnimation;
