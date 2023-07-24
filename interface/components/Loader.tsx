import Lottie from "lottie-react";
import React from "react";
import loaderJson from "./SVG/loader.json";
import { Icon, IconProps } from "@chakra-ui/react";

const Loader: React.FC<IconProps> = (props) => {
  return <Icon boxSize={24} {...props} as={Lottie} animationData={loaderJson} />;
}

export default Loader;