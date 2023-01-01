import PageContainer from "@/components/layout/PageContainer";
import {
  Box,
  Button,
  Divider,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import { FaMagic } from "react-icons/fa";
import { formatRelative } from "date-fns";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import ShotCardGrid from "@/components/studio/ShotCardGrid";
import GenerateStudioModal from "@/components/studio/GenerateStudioModal";
import { useRouter } from "next/router";
import { reloadSession } from "@/core/utils/reloadSession";
import axios from "axios";
import { FC } from "react";
import { useMutation, useQuery } from "react-query";
import { ProjectIdResponse } from "../api/projects/[id]";
import {
  PredictionsBody,
  PredictionsResponse,
} from "../api/projects/[id]/predictions";

type StudioPageProps = {
  projectId: string;
};

const StudioPage: FC<StudioPageProps> = ({ projectId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  useSession({
    required: true,
    onUnauthenticated() {
      router.isReady && router.push("/login");
    },
  });

  const {
    data: project,
    isLoading: projectLoading,
    isError,
    refetch: refetchProject,
  } = useQuery(
    `projects-${projectId}`,
    () =>
      axios
        .get<ProjectIdResponse>(`/api/projects/${projectId}`)
        .then((response) => response.data?.project),
    {
      retry: false,
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
        // Refetch the project to update the shots.
        refetchProject();
        // Reload the session to update the credits amount.
        reloadSession();
      },
    }
  );

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
      {isError && <div>Oh no! There was an error.</div>}
      {!projectLoading && !isError && (
        <>
          <Box
            borderRadius="xl"
            p={{ base: 5, md: 10 }}
            backgroundColor="white"
          >
            <Flex alignItems="center">
              <Box>
                <Text fontSize="2xl" fontWeight="semibold">
                  Studio <b>{project!.instanceName}</b>
                </Text>
                <Text textTransform="capitalize" fontSize="sm">
                  {formatRelative(new Date(project!.createdAt), new Date())}
                </Text>
              </Box>
              <Spacer />
              <Button
                size="lg"
                variant="brand"
                rightIcon={<FaMagic />}
                onClick={onOpen}
              >
                Generate
              </Button>
            </Flex>
            <Divider mt={4} mb={4} />
            {project!.shots.length === 0 ? (
              <Box textAlign="center" fontSize="lg">
                {`You haven't generated any shots yet. Select a filter and click generate to create!`}
              </Box>
            ) : (
              <ShotCardGrid projectId={project!.id} shots={project!.shots} />
            )}
          </Box>
          <GenerateStudioModal
            isOpen={isOpen}
            closeModal={onClose}
            projectId={project!.id}
            onCreateClick={(body) => createPrediction(body)}
          />
        </>
      )}
    </PageContainer>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const projectId = context.query.id as string;

  return {
    props: {
      projectId,
    },
  };
}

export default StudioPage;
