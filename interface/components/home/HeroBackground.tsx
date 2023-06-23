import React, { ComponentProps, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@chakra-ui/react";
import { BottomLeftBlocks, TopRightBlocks } from "../SVG/Blocks";
import {
  Box,
  chakra,
} from "@chakra-ui/react";

const bgHue = keyframes`
  0%{background-position:0% 82%}
  50%{background-position:100% 19%}
  100%{background-position:0% 82%}
`;

const HeroBackground: React.FC = (props) => {
  return (
    <Box
      position={"absolute"}
      width={"100%"}
      height={"100%"}
      zIndex={"-2"}
    >
      <Box
        bg={"linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3)"}
        bgSize={"500% 500%"}
        animation={`${bgHue} 12s ease infinite`}
        position={"absolute"}
        width={"100%"}
        height={"100%"}
        opacity={"0.05"}
        zIndex={"-3"}
      />
      <Box
        top={"0"}
        left={"0"}
        width={"100%"}
        height={"100%"}
        position={"absolute"}>
        <AnimatedBlocks variant="top-right" height={["50%", null, "75%", "90%"]} position="absolute"  bottom={0} left={0}/>
      </Box>
      <Box
        top={"0"}
        left={"0"}
        width={"100%"}
        height={"100%"}
        position={"absolute"}>
        <AnimatedBlocks variant="bottom-left" height={["50%", null, "75%", "90%"]} position="absolute" top={0} right={0} />
      </Box>
    </Box>
  );
};

const AnimatedBlocks: React.FC<
  ComponentProps<typeof chakra.svg> & {
    variant: "top-right" | "bottom-left";
  }
> = ({ variant, ...props }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = ref.current;
    const children = Array.from(svg.children) as SVGElement[];
    let timeouts: number[] = [];
    let intervals: number[] = [];

    children.forEach((rect, idx) => {
      rect.style.transformBox = "fill-box";
      rect.style.transformOrigin = "center";

      timeouts.push(
        // @ts-ignore
        setTimeout(() => {
          function setRandomSizeOpacity() {
            rect.style.fillOpacity = Math.random() * 0.5 + 0.5 + "";
            rect.style.transform = `scale(${Math.random() * 0.1 + 0.9})`;
          }
          setRandomSizeOpacity();
          // @ts-ignore
          intervals.push(setInterval(setRandomSizeOpacity, 4000));
        }, idx * 80)
      );
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, []);

  return (
    <chakra.svg
      viewBox={`0 0 403 ${variant === "bottom-left" ? 510 : 490}`}
      version="1.1"
      opacity={0.28}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      zIndex={"-2"}
      sx={{
        "*": {
          transformBox: "fill-box",
          transition: "all 1.5s",
          transformOrigin: "center",
        },
        ...props.sx,
      }}
      ref={ref}
      {...props}
    >
      {variant === "top-right" ? <TopRightBlocks /> : <BottomLeftBlocks />}
    </chakra.svg>
  );
};

export default HeroBackground;
