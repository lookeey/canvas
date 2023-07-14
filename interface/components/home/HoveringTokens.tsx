import { Box, useBreakpoint, useBreakpointValue } from "@chakra-ui/react";
import _Image from "next/image";
import { motion, useInView } from "framer-motion";
import ink from "images/ink-display.png";
import hue from "images/hue-display.png";
import light from "images/light.png";
import React from "react";

const Image = motion(_Image);

const HoveringTokens = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { margin: "-40px" });
  const isSm = useBreakpointValue([true, false])
  return (
    <Box position="relative" ref={ref}>
      <Image src={light} alt="" />
      <motion.div
        style={{ position: "absolute", top: "8%", left: isSm ? "16%" : "12%" }}
        animate={{ y: [0, 8], x: [0, 4] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
          delay: 1.5,
        }}
      >
        <Image
          src={hue}
          alt="hue"
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -40 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          width={isSm ? 200 : undefined}
        />
      </motion.div>
      <motion.div
        style={{ position: "absolute", top: "20%", left: isSm ? "25%" : "20%" }}
        animate={{ y: [0, 8], x: [0, 4], opacity: 1 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "mirror" }}
      >
        <Image
          src={ink}
          alt="ink"
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : -40 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          width={isSm ? 260 : undefined}
        />
      </motion.div>
    </Box>
  );
};

export default HoveringTokens;
