import { FETCH_FILTERS_QUERY, fetchFilters } from "@/core/queries/filters";
import {
  AspectRatio,
  Box,
  Center,
  SimpleGrid,
  Spinner,
  Image,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useQuery } from "react-query";

/**
 * Grid for displaying a list of shots cards.
 */
const StylesDisplay = () => {
  const { data: filters, isLoading: filtersLoading } = useQuery(
    FETCH_FILTERS_QUERY,
    async () => {
      const { data } = await fetchFilters();

      return data;
    }
  );
  return (
    <Box>
      <Heading size={"lg"} mb={4}>
        Available Styles (Updated weekly!)
      </Heading>
      <SimpleGrid columns={[3, 4, 6, 10]} spacing={[1, 2]}>
        {filters?.map((filter) => (
          <Box
            key={filter.name}
            backgroundColor="transparent"
            overflow="hidden"
          >
            <Image
              borderRadius="lg"
              alt={filter.name || "Stylized image of your pet"}
              src={filter.exampleUrl}
              fallback={
                <AspectRatio ratio={1} height={"100%"}>
                  <Center>
                    <Spinner speed="2s" color="gray.400" />
                  </Center>
                </AspectRatio>
              }
            />
            <Text fontSize={"sm"}>{filter.name}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default StylesDisplay;
