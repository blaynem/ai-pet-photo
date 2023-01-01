import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { Filters } from "@prisma/client";
import NextImage from "next/image";

/**
 * The thumbnail representation of the prediction filter card in the model page.
 */
const PredictionFilter = ({
  id,
  name,
  exampleUrl,
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: (filterId: string) => void;
} & Pick<Filters, "id" | "name" | "exampleUrl">) => {
  if (!exampleUrl) return null;
  return (
    <Box
      onClick={() => onClick(id)}
      border={"2px"}
      borderColor={selected ? "brand.500" : "transparent"}
      boxShadow={selected ? "lg" : "none"}
      cursor="pointer"
    >
      <NextImage alt={name} src={exampleUrl} width={512} height={512} />
      <Text fontSize="sm">{name}</Text>
    </Box>
  );
};

export default PredictionFilter;
