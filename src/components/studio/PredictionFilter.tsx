import React from "react";
import { Box, Text } from "@chakra-ui/react";
import NextImage from "next/image";
import { getStylesUrl } from "@/core/utils/getStylesUrl";
import { PickFilters } from "@/core/queries/filters";

/**
 * The thumbnail representation of the prediction filter card in the model page.
 */
const PredictionFilter = ({
  animal,
  id,
  name,
  exampleUrl,
  exampleUrl_cat,
  selected,
  onClick,
}: {
  animal: "dog" | "cat";
  selected: boolean;
  onClick: (filterId: string) => void;
} & PickFilters) => {
  if (!exampleUrl) return null;
  // If the animal is a cat, use the cat example url. However, fallback to the dog example url if the cat is not available.
  const exampleUrlToUse =
    animal === "cat" ? exampleUrl_cat || exampleUrl : exampleUrl;
  return (
    <Box
      onClick={() => onClick(id)}
      border={"2px"}
      borderColor={selected ? "brand.500" : "transparent"}
      boxShadow={selected ? "lg" : "none"}
      cursor="pointer"
    >
      <NextImage
        alt={name}
        src={getStylesUrl(exampleUrlToUse)}
        width={512}
        height={512}
      />
      <Text fontSize="sm">{name}</Text>
    </Box>
  );
};

export default PredictionFilter;
