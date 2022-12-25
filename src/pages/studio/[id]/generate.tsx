import PageContainer from "@/components/layout/PageContainer";
import {
  Box,
  Button,
  Divider,
  Flex,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { Filters } from "@prisma/client";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { FaMagic } from "react-icons/fa";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import {
  PredictionsBody,
  PredictionsResponse,
} from "../../api/projects/[id]/predictions";
import PredictionFilter from "@/components/studio/PredictionFilter";
import { useRouter } from "next/router";

type PickFilters = Pick<Filters, "id" | "name" | "exampleUrl">;

interface IStudioPageProps {
  projectId: string;
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
      mt={10}
      mb={4}
      width="100%"
    >
      <Box>
        {filters?.length === 0 && (
          <Box>No filters available. There was a possible error.</Box>
        )}
        <SimpleGrid columns={[3, 4, 6]} spacing={4}>
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

const GenerateStudio = ({ projectId }: IStudioPageProps) => {
  const router = useRouter();
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
        // on success, let's push the user to the studio page
        router.push(`/studio/${projectId}`);
      },
    }
  );

  // Generate a new prediction only if a filter is selected
  const generateClick = () => {
    const filter = filters?.find((filter) => filter.id === selectedFilterId);
    if (!selectedFilterId || !filter) {
      setGenerateError("Select a filter first!");
      return;
    }

    const body: PredictionsBody = {
      filterId: filter.id,
      filterName: filter.name,
      projectId,
      predictionAmount: 5,
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
    <PageContainer>
      <Box mb={4}>
        <Button
          color="blackAlpha.500"
          leftIcon={<HiArrowLeft />}
          variant="link"
          href={`/studio/${projectId}`}
          as={Link}
        >
          Back to Studio
        </Button>
      </Box>
      <Box borderRadius="xl" p={{ base: 5, md: 10 }} backgroundColor="white">
        <Flex alignItems="center">
          <Box>
            <Text fontSize="2xl" fontWeight="semibold">
              {"Let's create some magic!"}
            </Text>
          </Box>
          <Spacer />
          <Button
            size="lg"
            variant="brand"
            rightIcon={<FaMagic />}
            onClick={generateClick}
          >
            Create
          </Button>
        </Flex>
        <FiltersGrid
          loading={filtersLoading}
          onClick={handleFilterClick}
          selectedFilterId={selectedFilterId}
          filters={filters!}
        />
        {generateError && (
          <>
            <Divider mt={4} mb={4} />
            <Box color={"red.400"}>{generateError}</Box>
          </>
        )}
      </Box>
    </PageContainer>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });
  const projectId = context.query.id as string;

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {
      projectId: projectId,
    },
  };
}

export default GenerateStudio;
