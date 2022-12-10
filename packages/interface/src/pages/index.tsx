import EnterPageAnimation from "components/EnterPageAnimation"
import Layout from "components/layout"
import React from "react"
import styled from "styled-components"

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
`

export interface IGameProps {}

const Game: React.FC<IGameProps> = (props: IGameProps) => {
  return (
    <Wrapper>
      <EnterPageAnimation />
      AA
    </Wrapper>
  )
}
export default Game
