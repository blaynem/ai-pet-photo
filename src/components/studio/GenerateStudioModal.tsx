import {
  Box,
  Button,
  Divider,
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
import { Filters } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { FaMagic } from "react-icons/fa";
import {
  PredictionsBody,
  PredictionsResponse,
} from "../../pages/api/projects/[id]/predictions";
import PredictionFilter from "@/components/studio/PredictionFilter";
import {
  GENERATE_PHOTO_AMOUNT_PER_CREDIT,
  IMAGE_GENERATION_COST_IN_CREDITS,
} from "@/core/constants";
import { useSession } from "next-auth/react";
import { RiCopperCoinFill } from "react-icons/ri";

type PickFilters = Pick<Filters, "id" | "name" | "exampleUrl">;

interface GenerateProps {
  projectId: string;
  /**
   * Whether modal is open
   */
  isOpen: boolean;
  /**
   * Modal close callback
   */
  onClose: () => void;
  /**
   * Callback to be fired after a new prediction is generated
   */
  onGenerate: () => void;
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
    return <Text>Loading filters...</Text>;
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
          <Box>No filters available. There was a possible error.</Box>
        )}
        <SimpleGrid columns={[3, 4]} spacing={1}>
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
  onClose,
  onGenerate,
}: GenerateProps) => {
  const session = useSession();
  const [selectedFilterId, setSelectedFilterId] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const { data: filters, isLoading: filtersLoading } = useQuery(
    "fetchFilters",
    async () => {
      const { data } = await axios.get<PickFilters[]>(`/api/filters`);

      return data;
    }
  );

  const { mutate: createPrediction } = useMutation(
    "create-prediction",
    (body: PredictionsBody) =>
      axios.post<PredictionsResponse>(
        `/api/projects/${projectId}/predictions`,
        body
      ),
    {
      onSuccess: () => {
        onClose();
        onGenerate();
      },
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

    createPrediction(body);
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
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Style</ModalHeader>
        <ModalBody>
          <FiltersGrid
            loading={filtersLoading}
            onClick={handleFilterClick}
            selectedFilterId={selectedFilterId}
            filters={filters!}
          />
          <Text as="b" fontSize="sm">
            Each style costs {IMAGE_GENERATION_COST_IN_CREDITS} credit, and will
            generate {GENERATE_PHOTO_AMOUNT_PER_CREDIT} images.
          </Text>
          {generateError && (
            <>
              <Divider mb={4} />
              <Box color={"red.400"}>{generateError}</Box>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          {session?.data?.user.credits || 0}
          <Icon
            as={RiCopperCoinFill}
            boxSize="1.2em"
            color={"gold"}
            margin=".5em"
          />
          <Button
            size="lg"
            variant="brand"
            rightIcon={<FaMagic />}
            onClick={generateClick}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GenerateStudioModal;
