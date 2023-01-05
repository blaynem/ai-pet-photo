import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "react-query";
import { FaMagic } from "react-icons/fa";
import { PredictionsBody } from "../../pages/api/projects/[id]/predictions";
import PredictionFilter from "@/components/studio/PredictionFilter";
import {
  GENERATE_PHOTO_AMOUNT_PER_CREDIT,
  IMAGE_GENERATION_COST_IN_CREDITS,
} from "@/core/constants";
import { useSession } from "next-auth/react";
import { RiCopperCoinFill } from "react-icons/ri";
import {
  fetchFilters,
  FETCH_FILTERS_QUERY,
  PickFilters,
} from "@/core/queries/filters";

interface GenerateProps {
  projectId: string;
  /**
   * Whether modal is open
   */
  isOpen: boolean;
  /**
   * Modal close callback
   */
  closeModal: () => void;
  /**
   * Callback fired when user clicks on create
   */
  onCreateClick: (params: PredictionsBody) => void;
}

const FiltersGrid = ({
  filters,
  loading,
  selectedFilterId,
  onClick,
}: {
  loading: boolean;
  filters: PickFilters[];
  selectedFilterId: string | null;
  onClick: (id: string) => void;
}) => {
  if (loading) {
    return <Text>Loading styles...</Text>;
  }
  return (
    <Flex
      flexDirection={{ base: "column", sm: "row" }}
      gap={2}
      mb={4}
      width="100%"
    >
      <Box>
        {filters?.length === 0 && (
          <Box>No styles available. There was a possible error.</Box>
        )}
        <SimpleGrid
          px={4}
          height={"100%"}
          maxH={["sm", "lg"]}
          overflow="auto"
          columns={[3, 4]}
          spacing={1}
        >
          {filters?.map((filter) => (
            <PredictionFilter
              {...filter}
              key={filter.id}
              selected={selectedFilterId === filter.id}
              onClick={onClick}
            />
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
};

const GenerateStudioModal = ({
  projectId,
  isOpen,
  closeModal,
  onCreateClick,
}: GenerateProps) => {
  const session = useSession();
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const { data: filters, isLoading: filtersLoading } = useQuery(
    FETCH_FILTERS_QUERY,
    async () => {
      const { data } = await fetchFilters();

      return data;
    }
  );

  // Generate a new prediction only if a filter is selected
  const generateClick = () => {
    const filter = filters?.find((filter) => filter.id === selectedFilterId);
    if (!selectedFilterId || !filter) {
      setGenerateError("Must select a filter");
      return;
    }

    const body: PredictionsBody = {
      filterId: filter.id,
      filterName: filter.name,
      projectId,
      predictionAmount: GENERATE_PHOTO_AMOUNT_PER_CREDIT,
    };

    closeModal();
    onCreateClick(body);
  };

  const handleFilterClick = (filterId: string) => {
    if (filterId === selectedFilterId) {
      setSelectedFilterId(null);
      return;
    }

    setSelectedFilterId(filterId);
    setGenerateError(null);
  };

  return (
    <Modal
      scrollBehavior="inside"
      size="xl"
      isOpen={isOpen}
      onClose={() => {
        setSelectedFilterId(null);
        setGenerateError(null);
        closeModal();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Style</ModalHeader>
        <ModalBody px={0}>
          <FiltersGrid
            loading={filtersLoading}
            onClick={handleFilterClick}
            selectedFilterId={selectedFilterId}
            filters={filters!}
          />
        </ModalBody>
        <Box px={4}>
          <Text as="b" fontSize="sm">
            Each style costs {IMAGE_GENERATION_COST_IN_CREDITS} credit, and will
            generate {GENERATE_PHOTO_AMOUNT_PER_CREDIT} images.
          </Text>
          <Text fontSize="xs">
            {`While we're still improving the generations, some of them may be a
            bit goofy, and some may even be terrifying . We appreciate your
            understanding, and we're working on them!`}
          </Text>
        </Box>
        <ModalFooter justifyContent={"space-between"}>
          <Box>
            {generateError && (
              <Text justifySelf={"left"} color={"red.400"}>
                {generateError}
              </Text>
            )}
          </Box>
          <Flex>
            <Flex align={"center"}>
              {session?.data?.user.credits || 0}
              <Icon
                as={RiCopperCoinFill}
                boxSize="1.2em"
                color={"gold"}
                margin=".5em"
              />
            </Flex>
            <Button
              size="lg"
              variant="brand"
              rightIcon={<FaMagic />}
              onClick={generateClick}
            >
              Create
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GenerateStudioModal;
