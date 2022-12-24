import React from "react";
import { Box, Image } from "@chakra-ui/react";
import { Filters } from "@prisma/client";

/**
 * The thumbnail representation of the prediction filter card in the studio page.
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
} & Filters) => {
  if (!exampleUrl) return null;
  return (
    <Box
      onClick={() => onClick(id)}
      borderRadius="xl"
      border={selected ? "2px" : "0px"}
      borderColor="brand.500"
      boxShadow={selected ? "lg" : "none"}
      cursor="pointer"
    >
      <Image alt={name} src={exampleUrl} width={100} height={100} />
      <p>{name}</p>
    </Box>
  );
};

export default PredictionFilter;
