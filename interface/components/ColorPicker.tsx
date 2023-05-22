import styled from "@emotion/styled";
import palettes from "../config/palettes";

const Wrapper = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  border: 2px solid black;
  pointer-events:  none;
`;

const Color = styled.button<{ color: string; selected: boolean }>`
  width: 30px;
  height: 30px;
  background-color: ${({ color }) => color};
  border: ${({ selected }) => (selected ? "2px solid gray" : "none")};
`;

const ColorPicker: React.FC<{ selectedColor: number }> = ({
  selectedColor,
}) => {
  const colors = palettes.default;
  return (
    <Wrapper>
      {colors.map((color, i) => (
        <>
          <Color
            key={i}
            color={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
            selected={selectedColor === i}
          />
        </>
      ))}
    </Wrapper>
  );
};

export default ColorPicker;
