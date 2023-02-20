import {
  EMAIL_ADDRESS_SUPPORT,
  PUBLIC_BUCKET_URL,
  TWITTER_LINK,
} from "@/core/constants";
import { getFullShotUrl } from "@/core/utils/bucketHelpers";
import { ProjectWithShots, ShotsPick } from "@/pages/api/projects";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import axios from "axios";
import { formatRelative } from "date-fns";
import { useMutation } from "react-query";
import ShotCardGridSelect from "../print/ShotCardGridSelect";
import FormPayment from "./FormPayment";

const ProjectAccordion = ({
  project,
  handleRefreshProjects,
  showPromotionalPricing,
  selectedShot,
  setSelectedShot,
}: {
  project: ProjectWithShots;
  handleRefreshProjects: () => void;
  showPromotionalPricing?: boolean;
  selectedShot: ShotsPick;
  setSelectedShot: (shot: ShotsPick) => void;
}) => {
  const isWaitingPayment = !project.stripePaymentId;
  const isWaitingTraining =
    project.stripePaymentId && !project.replicateModelId;

  const isReady = project.modelStatus === "succeeded";
  const isTraining =
    project.modelStatus === "processing" || project.modelStatus === "pushing";

  const checkBackTime = formatRelative(
    new Date(new Date(project.createdAt).getTime() + 30 * 60 * 1000),
    new Date(project.createdAt)
  )
    .replace("at", "around")
    .replace("today", "");

  console.log(project.shots);
  return (
    <AccordionItem
      overflow="hidden"
      position="relative"
      backgroundColor="white"
      width="100%"
      pt={4}
      pb={4}
      px={5}
      borderRadius="xl"
      shadow="lg"
    >
      <AccordionButton>
        <VStack flex={1} spacing={4} alignItems="flex-start">
          <HStack>
            {" "}
            <Avatar
              key={project.shots[0].imageUrl}
              src={getFullShotUrl(project.shots[0])}
            />{" "}
            <Box width={"100%"} textAlign={"left"}>
              <Box
                justifyContent={"space-between"}
                display={"flex"}
                width="100%"
              >
                <Text fontSize="2xl" fontWeight="semibold">
                  Model <b>{project.name}</b>{" "}
                </Text>
              </Box>

              <Text textTransform="capitalize" fontSize="sm">
                {formatRelative(new Date(project.createdAt), new Date())}
              </Text>
            </Box>
          </HStack>

          {isWaitingPayment && (
            <FormPayment
              showPromotionalPricing={showPromotionalPricing}
              handlePaymentSuccess={() => {
                handleRefreshProjects();
              }}
              project={project}
            />
          )}

          {isWaitingTraining && <></>}

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
                  //always shows the first shot of the project for now
                  <></>
                )}
              </VStack>
            </Center>
          )}
        </VStack>
        <AccordionIcon />
      </AccordionButton>
      <AccordionPanel>
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
              This is embarrassing. We are sorry, but the creation of your
              studio failed.
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
        <ShotCardGridSelect
          projectId={project.id}
          shots={project.shots}
          selectedShot={selectedShot}
          setSelectedShot={setSelectedShot}
        />
      </AccordionPanel>
    </AccordionItem>
  );
};

export default ProjectAccordion;
