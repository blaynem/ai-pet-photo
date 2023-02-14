import ProjectCard from "@/components/projects/ProjectCard";
import Uploader from "@/components/dashboard/Uploader";
import {
  Accordion,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Spacer,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "react-query";
import PageContainer from "@/components/layout/PageContainer";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ExamplePictures from "@/components/dashboard/ExamplePictures";
import { ProjectsGetResponse } from "./api/projects";
import ProjectAccordion from "@/components/projects/ProjectAccordion";

export default function Home() {
  const router = useRouter();
  // Redirect to login if not authenticated
  useSession({
    required: true,
    onUnauthenticated() {
      router.isReady && router.push("/login");
    },
  });

  const {
    data: projects,
    refetch: refetchProjects,
    isLoading,
  } = useQuery(
    `projects`,
    () =>
      axios
        .get<ProjectsGetResponse>("/api/projects?shotAmount=10")
        .then((response) => response.data.projects),
    {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 1s, 2s, 4s, 8s, 16s, 30s
    }
  );

  const { data: showPromotionalPricing } = useQuery(`promotionalPurchase`, () =>
    axios
      .get<boolean>("/api/payment/promotional")
      .then((response) => response.data)
  );

  // If there are no projects created yet, show the uploader.
  if (!isLoading && projects?.length === 0) {
    return (
      <PageContainer>
        <Box>
          <Heading as="h2" mb={4} fontWeight="semibold" fontSize="2xl">
            Create a new Model
          </Heading>
          <Uploader
            handleOnAdd={() => {
              refetchProjects();
            }}
          />
          <ExamplePictures />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box mt={10}>
        <Flex mb={4} align="center">
          <Heading as="h2" fontWeight="semibold" fontSize="2xl">
            Select a model to print
          </Heading>
          <Spacer />
        </Flex>

        {isLoading && (
          <Center width="100%" textAlign="center">
            <Spinner mr={3} size="sm" speed="1s" />
            <Text>Loading models</Text>
          </Center>
        )}

        <VStack spacing={10} width="100%">
          <Accordion width="100%" allowMultiple>
            {projects?.map((project) => (
              <ProjectAccordion
                handleRefreshProjects={refetchProjects}
                project={project}
              />
            ))}
          </Accordion>
        </VStack>
      </Box>
    </PageContainer>
  );
}
