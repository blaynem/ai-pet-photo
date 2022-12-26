import ProjectCard from "@/components/projects/ProjectCard";
import Uploader from "@/components/dashboard/Uploader";
import {
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
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useQuery } from "react-query";
import PageContainer from "@/components/layout/PageContainer";
import { ProjectWithShots } from "./studio/[id]";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const {
    data: projects,
    refetch: refetchProjects,
    isLoading,
  } = useQuery(
    `projects`,
    () =>
      axios
        .get<ProjectWithShots[]>("/api/projects")
        .then((response) => response.data),
    {
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 1s, 2s, 4s, 8s, 16s, 30s
    }
  );

  // If there are no projects created yet, show the uploader.
  if (!isLoading && projects?.length === 0) {
    return (
      <PageContainer>
        <Box>
          <Heading as="h2" mb={4} fontWeight="semibold" fontSize="2xl">
            Create a new Studio
          </Heading>
          <Uploader
            handleOnAdd={() => {
              refetchProjects();
            }}
          />
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Box mt={10}>
        <Flex mb={4} align="center">
          <Heading as="h2" fontWeight="semibold" fontSize="2xl">
            My Studios
          </Heading>
          <Spacer />
          <Button
            variant="brand"
            rightIcon={<FaPlus />}
            onClick={() => router.push("/dashboard/create")}
          >
            Create New
          </Button>
        </Flex>

        {isLoading && (
          <Center width="100%" textAlign="center">
            <Spinner mr={3} size="sm" speed="1s" />
            <Text>Loading studios</Text>
          </Center>
        )}

        <VStack spacing={10} width="100%">
          {projects?.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              handleRefreshProjects={() => {
                refetchProjects();
              }}
            />
          ))}
        </VStack>
      </Box>
    </PageContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  return { props: {} };
}
