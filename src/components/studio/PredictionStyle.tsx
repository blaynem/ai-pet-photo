import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Styles } from "@prisma/client";
import NextImage from "next/image";

/**
 * The thumbnail representation of the prediction style card in the model page.
 */
const PredictionStyle = ({
  id,
  name,
  example_image_url,
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: (styleId: string) => void;
} & Pick<Styles, "id" | "name" | "example_image_url">) => {
  if (!example_image_url) return null;
  return (
    <Box
      onClick={() => onClick(id)}
      border={"2px"}
      borderColor={selected ? "brand.500" : "transparent"}
      boxShadow={selected ? "lg" : "none"}
      cursor="pointer"
    >
      <NextImage alt={name} src={example_image_url} width={512} height={512} />
      <Text fontSize="sm">{name}</Text>
    </Box>
  );
};

export default PredictionStyle;
