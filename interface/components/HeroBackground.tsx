import React, { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/css";
import { BottomLeftBlocks, TopRightBlocks } from "./SVG/Blocks";

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
  display: flex;
  justify-content: space-between;
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

   {
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
  return (
    <Background>
      <AnimatedBlocks variant="top-right" style={{height: "100%"}} />
      <AnimatedBlocks variant="bottom-left" style={{height: "100%"}}/>
    </Background>
  );
};

const StyledSvg = styled.svg`
  * {
    transition: all 1.5s;
    transform-box: fill-box;
    transform-origin: center;
  }
`;

const AnimatedBlocks: React.FC<{
  variant: "top-right" | "bottom-left";
} & React.SVGProps<SVGSVGElement>> = ({
  variant,
  ...props
}) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const svg = ref.current;
    const children = Array.from(svg.children);
    let timeouts: number[] = [];
    let intervals: number[] = [];

    children.forEach((rect: SVGElement, idx) => {
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
    <StyledSvg
      viewBox="0 0 403 510"
      version="1.1"
      opacity={0.35}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      xmlSpace="preserve"
      ref={ref}
      {...props}
    >
      {variant === "top-right" ? <TopRightBlocks /> : <BottomLeftBlocks />}
    </StyledSvg>
  );
};

export default HeroBackground;
