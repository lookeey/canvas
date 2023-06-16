import palettes from "../config/palettes";
import { Button, Grid, GridItem } from "@chakra-ui/react";

const ColorPicker: React.FC<{
  selectedColor: bigint;
  onSelect: (color: bigint) => void;
}> = ({ selectedColor, onSelect }) => {
  const colors = palettes.default;
  return (
    <Grid
      templateColumns="repeat(8, 1fr)"
      position="fixed"
      bottom="2rem"
      left="50%"
      transform="translateX(-50%)"
      padding="2px"
      bg={"whiteAlpha.800"}
      borderRadius="md"
      boxShadow="2xl"
    >
      {colors.map((color, i) => (
        <GridItem
          key={i}
          onClick={() => onSelect(BigInt(i))}
          w={8}
          h={8}
          padding="4px"
        >
          <Button
            variant={"unstyled"}
            display={"block"}
            padding="0"
            minW={"100%"}
            w={"100%"}
            h={"100%"}
            key={i}
            bg={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}
            outline={selectedColor === BigInt(i) ? "4px solid" : "2px solid"}
            outlineColor={selectedColor === BigInt(i) ? "gray.500" : "gray.300"}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default ColorPicker;
