import {
  EMAIL_ADDRESS_SUPPORT,
  PUBLIC_BUCKET_URL,
  TWITTER_LINK,
} from "@/core/constants";
import { getFullShotUrl } from "@/core/utils/bucketHelpers";
import { ProjectWithShots } from "@/pages/api/projects";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import axios from "axios";
import { formatRelative } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { HiArrowRight } from "react-icons/hi";
import { IoIosFlash } from "react-icons/io";
import { useMutation } from "react-query";
import FormPayment from "./FormPayment";

const ProjectCard = ({
  project,
  handleRefreshProjects,
  showPromotionalPricing,
}: {
  project: ProjectWithShots;
  handleRefreshProjects: () => void;
  showPromotionalPricing?: boolean;
}) => {
  const {
    mutate: trainModel,
    isLoading: isModelLoading,
    isSuccess,
  } = useMutation(
    `train-model-${project.id}`,
    (project: Project) =>
      axios.post(`/api/projects/${project.id}/train`, {
        prompt,
      }),
    {
      onSuccess: () => {
        handleRefreshProjects();
      },
    }
  );

  const isWaitingPayment = !project.stripePaymentId;
  const isWaitingTraining =
    project.stripePaymentId && !project.replicateModelId;

  const isReady = project.modelStatus === "succeeded";
  const isTraining =
    project.modelStatus === "processing" || project.modelStatus === "pushing";

  const handleDeleteStudio = async () => {
    await axios.delete(`/api/projects/${project.id}`);
    handleRefreshProjects();
  };

  const checkBackTime = formatRelative(
    new Date(new Date(project.createdAt).getTime() + 30 * 60 * 1000),
    new Date(project.createdAt)
  )
    .replace("at", "around")
    .replace("today", "");

  return (
    <Box
      overflow="hidden"
      position="relative"
      backgroundColor="white"
      width="100%"
      pt={4}
      pb={10}
      px={5}
      borderRadius="xl"
      shadow="lg"
    >
      <VStack spacing={4} alignItems="flex-start">
        <Box width={"100%"}>
          <Box justifyContent={"space-between"} display={"flex"} width="100%">
            <Text fontSize="2xl" fontWeight="semibold">
              Model <b>{project.name}</b>{" "}
            </Text>
            {/* 
             Commenting out while we figure out RLS on supabase for deleting projects 1/4/23
             {isWaitingPayment && (
              <IconButton
                alignSelf={"flex-end"}
                onClick={handleDeleteStudio}
                icon={<Icon as={MdDelete} />}
                aria-label={""}
              />
            )} */}
          </Box>

          <Text textTransform="capitalize" fontSize="sm">
            {formatRelative(new Date(project.createdAt), new Date())}
          </Text>
        </Box>

        {isWaitingPayment && (
          <FormPayment
            showPromotionalPricing={showPromotionalPricing}
            handlePaymentSuccess={() => {
              handleRefreshProjects();
            }}
            project={project}
          />
        )}

        {isWaitingTraining && (
          <>
            <VStack width="100%" spacing={4}>
              <Box fontWeight="bold" fontSize="xl">
                Your Model is ready to be built!
              </Box>
              <AvatarGroup size="lg" max={10}>
                {project.imageUrls.map((url) => (
                  <Avatar key={url} src={`${PUBLIC_BUCKET_URL}/${url}`} />
                ))}
              </AvatarGroup>
              <VStack spacing={2}>
                <Button
                  variant="brand"
                  rightIcon={<IoIosFlash />}
                  isLoading={isModelLoading || isSuccess}
                  onClick={() => trainModel(project)}
                >
                  Start Building
                </Button>
                <Text fontSize="sm" textAlign="center">
                  (This is an automated process that takes about 30 minutes.)
                </Text>
              </VStack>
            </VStack>
          </>
        )}

        {isReady && (
          <Center width="100%" marginX="auto">
            <VStack spacing={7}>
              {!project.shots ? (
                <Box fontSize="lg">
                  <Text align={"center"} mb={4}>
                    {`Looks like you haven't generated any images yet.`}
                  </Text>
                  <Text align={"center"}>
                    <b>Go to your model to add one !</b>
                  </Text>
                </Box>
              ) : (
                <AvatarGroup size="xl" max={10}>
                  {project.shots
                    .filter((shot) => Boolean(shot.imageUrl))
                    .map((shot) => (
                      <Avatar key={shot.imageUrl} src={getFullShotUrl(shot)} />
                    ))}
                </AvatarGroup>
              )}
              <Button
                rightIcon={<HiArrowRight />}
                variant="brand"
                href={`/studio/${project.id}`}
                as={Link}
              >
                {`Browse & Generate Images`}
              </Button>
            </VStack>
          </Center>
        )}
      </VStack>

      {isTraining && project.modelStatus !== "pushing" && (
        <Center marginX="auto">
          <VStack spacing={2}>
            <Spinner size="xl" speed="2s" />
            <Text textAlign="center">
              {`Building your pets custom model takes a little bit of time.`}
            </Text>
            <Text textAlign="center">{`Check back ${checkBackTime}!`}</Text>
          </VStack>
        </Center>
      )}

      {project.modelStatus === "pushing" && (
        <Center marginX="auto">
          <VStack spacing={2}>
            <Spinner size="xl" speed="2s" />
            <Text textAlign="center">
              {`Putting the final touches on your custom model.`}
            </Text>
            <Text textAlign="center">{`Check back ${checkBackTime}!`}</Text>
          </VStack>
        </Center>
      )}

      {project.modelStatus === "failed" && (
        <Center marginX="auto">
          <Text my={10} color="red.600" textAlign="center">
            Oh no!
            <br />
            This is embarrassing. We are sorry, but the creation of your studio
            failed.
            <br />
            <br />
            Please contact us by{" "}
            <Button
              as="a"
              bg="transparent"
              p={0}
              h={8}
              target="_blank"
              cursor="pointer"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              _hover={{}}
              color="brand.700"
              href={`mailto:${EMAIL_ADDRESS_SUPPORT}`}
            >
              email
            </Button>{" "}
            or reach out to us on{" "}
            <Button
              as="a"
              bg="transparent"
              p={0}
              h={8}
              target="_blank"
              cursor="pointer"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              _hover={{}}
              color="brand.700"
              href={TWITTER_LINK}
            >
              twitter
            </Button>{" "}
            so we can fix it/refund you.
          </Text>
        </Center>
      )}
    </Box>
  );
};

export default ProjectCard;
