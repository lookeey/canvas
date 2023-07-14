import { formatUnits } from "@ethersproject/units";
import {
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { QuickSelectProps } from "./types";

const BigIntSlider: React.FC<{
    setValue: QuickSelectProps["setValue"]
    name: string;
    value: bigint;
    decimals: number;
    max: bigint;
}> = ({ setValue, name, value, decimals, max }) => {
    const percent = useMemo(
        () =>
            value > max
                ? 100n
                : (value * 100n) / (max === 0n ? 1n : max),
        [value]
    );

    return (
        <Slider
            aria-label="slider-ex-1"
            defaultValue={30}
            value={Number(percent)}
            onChange={(val) => {
              setValue(
                name,
                formatUnits(max * (100n) * BigInt(val) / 10000n, decimals),
                {
                  shouldValidate: true,
                }
              );
            }}
            focusThumbOnChange={false}
            // temporary fix for slider height, which flickers on tabs change
            // see https://github.com/chakra-ui/chakra-ui/issues/6615
            sx={{
                paddingTop: "7px !important",
                paddingBottom: "7px !important",
            }}
        >
            <SliderTrack height="2px" bg="blue2">
                <SliderFilledTrack bg="blue1" />
            </SliderTrack>
            <SliderThumb bg="blue2" />
        </Slider>
    );
};

export default BigIntSlider;
