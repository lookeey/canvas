import React, { useEffect, useRef } from "react";
import Lottie, { LottieRef } from "lottie-react";
import anim from "./lottie/enter-game.json";
import { Box } from "@chakra-ui/react";

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
        <Box
          position="fixed"
          width="100%"
          height="100%"
          top="0"
          left="0"
          zIndex="100"
          sx={{
            "& > div": {
              position: "absolute",
              height: "100%",
              width: "100%",
              svg: {
                width: "auto !important",
                height: "auto !important",
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%) !important",
                ".sq path": {
                  fill: "bg",
                  stroke: "bg",
                  strokeWidth: "1px",
                },
                "& > g > g:first-child": {
                  filter: "drop-shadow(0 0 12px rgba(0, 0, 0, 0.5))"
                }
              }
            }
          }}
        >
          <Lottie
            animationData={anim}
            loop={false}
            autoPlay={false}
            rendererSettings={{ imagePreserveAspectRatio: "xMinYMin slice" }}
            lottieRef={lottieRef}
          />
        </Box>
      )}
    </>
  );
};
export default LeavePageAnimation;
