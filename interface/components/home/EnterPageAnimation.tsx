import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

const EnterPageAnimation: React.FC = () => {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    setTimeout(() => setShow(false), 1000);
  }, []);

  return <>{show && <Box
    position="fixed"
    width="100%"
    height="100%"
    top="0"
    left="0"
    bg={"bg"}
    opacity={fade ? "0" : "1"}
    transition="opacity 1s"
  ></Box>}</>;
};
export default EnterPageAnimation;
