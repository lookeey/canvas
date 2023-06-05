import EnterPageAnimation from "components/EnterPageAnimation";
import { GetServerSideProps } from "next/types";
import { setCookie, hasCookie } from "cookies-next";
import React from "react";
import styled from "@emotion/styled";
import CanvasView from "components/CanvasView";
import ColorPicker from "../components/ColorPicker";

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
`;

export interface IGameProps {}

const Game: React.FC<IGameProps> = (props: IGameProps) => {
  return (
    <Wrapper>
      <EnterPageAnimation />
      <CanvasView />
    </Wrapper>
  );
};
export default Game;

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!hasCookie("first-visit", context)) {
    setCookie("first-visit", "false", context);
    return {
      redirect: {
        statusCode: 307,
        destination: "/home",
      },
    };
  }
  return {
    props: {},
  };
};
