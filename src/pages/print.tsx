import ProjectCard from "@/components/projects/ProjectCard";
import Uploader from "@/components/dashboard/Uploader";
import {
  Accordion,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Spacer,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
import { useQuery } from "react-query";
import PageContainer from "@/components/layout/PageContainer";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ExamplePictures from "@/components/dashboard/ExamplePictures";
import { ProjectsGetResponse, ShotsPick } from "./api/projects";
import ProjectAccordion from "@/components/projects/ProjectAccordion";
import SelectShotModal from "@/components/print/SelectShotModal";
import { useState } from "react";
import SelectProduct from "@/components/print/SelectProduct";
import ShotCard from "@/components/projects/ShotCard";
import DisplayShot from "@/components/print/DisplayShot";

export default function Home() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedShot, setSelectedShot] = useState<ShotsPick>({
    createdAt: new Date(),
    id: "",
    projectId: "",
    filterId: "",
    filterName: "",
    imageUrl: "",
    status: "",
    upscaledImageUrl: "",
    upscaleId: "",
    upscaleStatus: "",
  });

  // Redirect to login if not authenticated
  useSession({
    required: true,
    onUnauthenticated() {
      router.isReady && router.push("/login");
    },
  });

  const handleSelectShot = (shot: ShotsPick) => {
    if (shot === selectedShot) {
      setSelectedShot({
        createdAt: new Date(),
        id: "",
        projectId: "",
        filterId: "",
        filterName: "",
        imageUrl: "",
        status: "",
        upscaledImageUrl: "",
        upscaleId: "",
        upscaleStatus: "",
      });
    } else {
      setSelectedShot(shot);
    }
  };

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

  const handleBuyProduct = (sku: string) => {
    if (selectedShot.id === "") {
      alert("Please select a shot to print");
      return;
    }

    router.push(`/print/${sku}/${selectedShot.id}}`);
  };

  return (
    <PageContainer>
      <Box mt={10}>
        <HStack justifyContent={"space-between"} mb={10}>
          <VStack justifyContent={"left"} display="flex" alignItems="start">
            <Flex mb={4} align="center">
              <Heading as="h2" fontWeight="semibold" fontSize="2xl">
                Select a model to print
              </Heading>
              <Spacer />
            </Flex>
            <Button variant={"brand"} onClick={onOpen}>
              Select Image
            </Button>
          </VStack>

          <DisplayShot
            shot={selectedShot}
            projectId={selectedShot.projectId!}
          />
        </HStack>

        {isLoading && (
          <Center width="100%" textAlign="center">
            <Spinner mr={3} size="sm" speed="1s" />
            <Text>Loading Products</Text>
          </Center>
        )}

        <VStack spacing={10} width="100%">
          <SelectShotModal
            isOpen={isOpen}
            onClose={onClose}
            projects={projects!}
            setSelectedShot={handleSelectShot}
            selectedShot={selectedShot}
            refetchProjects={refetchProjects}
          />
          <SelectProduct
            shot={selectedShot}
            handleBuyProduct={handleBuyProduct}
          />
        </VStack>
      </Box>
    </PageContainer>
  );
}
