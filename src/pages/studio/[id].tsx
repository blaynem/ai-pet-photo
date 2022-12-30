import PageContainer from "@/components/layout/PageContainer";
import db from "@/core/db";
import {
  Box,
  Button,
  Divider,
  Flex,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Project, Shot } from "@prisma/client";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import superjson from "superjson";
import { FaMagic } from "react-icons/fa";
import { formatRelative } from "date-fns";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import ShotCardGrid from "@/components/studio/ShotCardGrid";
import GenerateStudioModal from "@/components/studio/GenerateStudioModal";
import { useRouter } from "next/router";

export type ProjectWithShots = Project & {
  shots: Omit<Shot, "prompt">[];
};

interface IStudioPageProps {
  project: ProjectWithShots;
}

const StudioPage = ({ project }: IStudioPageProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  // Call this function to refresh data on the page.
  const refreshData = () => {
    router.replace(router.asPath);
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
        <Flex alignItems="center">
          <Box>
            <Text fontSize="2xl" fontWeight="semibold">
              Studio <b>{project.instanceName}</b>
            </Text>
            <Text textTransform="capitalize" fontSize="sm">
              {formatRelative(new Date(project.createdAt), new Date())}
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
        {project.shots.length === 0 ? (
          <Box textAlign="center" fontSize="lg">
            {`You haven't generated any shots yet. Select a filter and click generate to create!`}
          </Box>
        ) : (
          <ShotCardGrid projectId={project.id} shots={project.shots} />
        )}
      </Box>
      <GenerateStudioModal
        isOpen={isOpen}
        onClose={onClose}
        projectId={project.id}
        onGenerate={refreshData}
      />
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

  const project = await db.project.findFirstOrThrow({
    where: { id: projectId, userId: session.user.id, modelStatus: "succeeded" },
    select: {
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

  return {
    props: {
      project: serializedProject,
    },
  };
}

export default StudioPage;
