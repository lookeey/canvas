import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

const Wrapper = styled.div<{ fade: boolean }>`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.bg};
  opacity: ${({ fade }) => (fade ? "0" : "1")};
  transition: opacity 1s;
`;

const EnterPageAnimation: React.FC = () => {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(true);
    setTimeout(() => setShow(false), 1000);
  }, []);

  return <>{show && <Wrapper fade={fade}></Wrapper>}</>;
};
export default EnterPageAnimation;
