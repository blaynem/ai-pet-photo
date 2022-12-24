import PageContainer from "@/components/layout/PageContainer";
import ShotCard from "@/components/projects/ShotCard";
import db from "@/core/db";
import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Filters, Project, Shot } from "@prisma/client";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useMutation } from "react-query";
import superjson from "superjson";
import { FaMagic } from "react-icons/fa";
import { formatRelative } from "date-fns";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import {
  PredictionsBody,
  PredictionsResponse,
} from "../api/projects/[id]/predictions";
import PredictionFilter from "@/components/studio/PredictionFilter";

export type ProjectWithShots = Project & {
  shots: Omit<Shot, "prompt">[];
};

interface IStudioPageProps {
  project: ProjectWithShots;
  // The available filters to be used to generate an image
  filters: Filters[];
}

const StudioPage = ({ project, filters }: IStudioPageProps) => {
  const [shots, setShots] = useState(project.shots);
  const [shotCredits, setShotCredits] = useState(project.credits);
  const [selectedFilter, setSelectedFilter] = useState<Filters | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const { mutate: createPrediction, isLoading } = useMutation(
    "create-prediction",
    (body: PredictionsBody) =>
      axios.post<PredictionsResponse>(
        `/api/projects/${project.id}/predictions`,
        body
      ),
    {
      onSuccess: (response) => {
        const shot = response.data.shot!;

        setShots([shot, ...shots]);
        setShotCredits(shotCredits - 1);
      },
    }
  );

  // Generate a new prediction only if a filter is selected
  const generateClick = () => {
    if (!selectedFilter) {
      setGenerateError("Select a filter first!");
      return;
    }

    const body = {
      filterId: selectedFilter.id,
      filterName: selectedFilter.name,
      projectId: project.id,
    };

    createPrediction(body);
  };

  // When a filter is clicked, we want to set it as the selected filter
  const handleFilterClick = (filterId: string) => {
    // Find the filter by its id
    const filter = filters.find((filter) => filter.id === filterId);
    if (!filter) return;

    // If the filter is already selected, we want to deselect it
    if (selectedFilter?.id === filter.id) {
      setSelectedFilter(null);
      return;
    }

    setSelectedFilter(filter);
    setGenerateError(null);
  };

  return (
    <PageContainer>
      <Box mb={4}>
        <Button
          color="blackAlpha.500"
          leftIcon={<HiArrowLeft />}
          variant="link"
          href="/dashboard"
          as={Link}
        >
          Back to Dashboard
        </Button>
      </Box>
      <Box borderRadius="xl" p={{ base: 5, md: 10 }} backgroundColor="white">
        <Text fontSize="2xl" fontWeight="semibold">
          Studio <b>{project.instanceName}</b>{" "}
          <Badge colorScheme="teal">{shotCredits} shots left</Badge>
        </Text>
        <Text textTransform="capitalize" fontSize="sm">
          {formatRelative(new Date(project.createdAt), new Date())}
        </Text>

        <Flex
          flexDirection={{ base: "column", sm: "row" }}
          gap={2}
          mt={10}
          mb={4}
          width="100%"
        >
          <Box>
            {filters.length === 0 && (
              <Box>No filters available. There was a possible error.</Box>
            )}
            {filters?.map((filter) => (
              <PredictionFilter
                {...filter}
                key={filter.id}
                selected={selectedFilter?.id === filter.id}
                onClick={handleFilterClick}
              />
            ))}
          </Box>
        </Flex>
        {filters.length >= 1 && (
          <Button
            type="submit"
            size="lg"
            variant="brand"
            rightIcon={<FaMagic />}
            isLoading={isLoading}
            onClick={generateClick}
          >
            Generate
          </Button>
        )}
        {generateError && (
          <Box mt={4} color={"red.400"}>
            {generateError}
          </Box>
        )}
        <Divider mt={4} mb={4} />
        {shots.length === 0 ? (
          <Box textAlign="center" fontSize="lg">
            {`You haven't generated any shots yet. Select a filter and click generate to create!`}
          </Box>
        ) : (
          <VStack spacing={4} divider={<Divider />} alignItems="flex-start">
            {shots.map((shot) => (
              <ShotCard key={shot.id} projectId={project.id} shot={shot} />
            ))}
          </VStack>
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

  const filters = await db.filters.findMany({
    where: { enabled: true },
    select: {
      id: true,
      name: true,
      exampleUrl: true,
    },
  });

  const project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.user.id, modelStatus: "succeeded" },
    select: {
      credits: true,
      createdAt: true,
      id: true,
      instanceName: true,
      shots: {
        // Not selecting the `prompt` so user doesn't have info on that.
        select: {
          createdAt: true,
          filterId: true,
          filterName: true,
          id: true,
          outputUrl: true,
          projectId: true,
          status: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!project) {
    return {
      notFound: true,
    };
  }

  const { json: serializedProject } = superjson.serialize(project);
  const { json: serializedFilters } = superjson.serialize(filters);

  return {
    props: {
      filters: serializedFilters,
      project: serializedProject,
    },
  };
}

export default StudioPage;
