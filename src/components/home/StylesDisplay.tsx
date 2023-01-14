import { FETCH_FILTERS_QUERY, fetchFilters } from "@/core/queries/filters";
import { getStylesUrl } from "@/core/utils/getStylesUrl";
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

  if (filtersLoading) return null;
  console.log(filters);
  return (
    <Box>
      <Heading size={"lg"} mb={4}>
        Available Styles (Updated weekly!)
      </Heading>
      <SimpleGrid columns={[3, 4, 6, 10]} spacing={[1, 2]}>
        {/* All the default dog styles displayed */}
        {filters?.map((filter) => (
          <Box
            key={filter.name}
            backgroundColor="transparent"
            overflow="hidden"
          >
            <Image
              borderRadius="lg"
              alt={filter.name || "Stylized image of a dog"}
              src={getStylesUrl(filter.exampleUrl)}
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
      {/* Add cat styles as well */}
      <SimpleGrid columns={[3, 4, 6, 10]} spacing={[1, 2]} mt={3}>
        {filters?.map((filter) => {
          if (!filter.exampleUrl_cat) return null;
          return (
            <Box
              key={filter.name}
              backgroundColor="transparent"
              overflow="hidden"
            >
              <Image
                borderRadius="lg"
                alt={filter.name || "Stylized image of a cat"}
                src={getStylesUrl(filter.exampleUrl_cat)}
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
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default StylesDisplay;
