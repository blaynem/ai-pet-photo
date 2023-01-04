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
import { Styles } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";
import { FaMagic } from "react-icons/fa";
import { PredictionsBody } from "../../pages/api/projects/[id]/predictions";
import PredictionStyle from "@/components/studio/PredictionStyle";
import {
  GENERATE_PHOTO_AMOUNT_PER_CREDIT,
  IMAGE_GENERATION_COST_IN_CREDITS,
} from "@/core/constants";
import { useSession } from "next-auth/react";
import { RiCopperCoinFill } from "react-icons/ri";

type PickStyles = Pick<Styles, "id" | "name" | "example_image_url">;

interface GenerateProps {
  projectId: string;
  /**
   * Whether modal is open
   */
  isOpen: boolean;
  /**
   * Modal close callback
   */
  closeModal: () => void;
  /**
   * Callback fired when user clicks on create
   */
  onCreateClick: (params: PredictionsBody) => void;
}

const StylesGrid = ({
  styles,
  loading,
  selectedStyleId,
  onClick,
}: {
  loading: boolean;
  styles: PickStyles[];
  selectedStyleId: string | null;
  onClick: (id: string) => void;
}) => {
  if (loading) {
    return <Text>Loading styles...</Text>;
  }
  return (
    <Flex
      flexDirection={{ base: "column", sm: "row" }}
      gap={2}
      mb={4}
      width="100%"
    >
      <Box>
        {styles?.length === 0 && (
          <Box>No styles available. There was a possible error.</Box>
        )}
        <SimpleGrid columns={[3, 4]} spacing={1}>
          {styles?.map((style) => (
            <PredictionStyle
              {...style}
              key={style.id}
              selected={selectedStyleId === style.id}
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
  closeModal,
  onCreateClick,
}: GenerateProps) => {
  const session = useSession();
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const { data: styles, isLoading: stylesLoading } = useQuery(
    "fetch-styles",
    async () => {
      const { data } = await axios.get<PickStyles[]>(`/api/styles`);

      return data;
    }
  );

  // Generate a new prediction only if a style is selected
  const generateClick = () => {
    const style = styles?.find((s) => s.id === selectedStyleId);
    if (!selectedStyleId || !style) {
      setGenerateError("Must select a style");
      return;
    }

    const body: PredictionsBody = {
      styleId: style.id,
      styleName: style.name,
      projectId,
      predictionAmount: GENERATE_PHOTO_AMOUNT_PER_CREDIT,
    };

    closeModal();
    onCreateClick(body);
  };

  const handleStyleClick = (styleId: string) => {
    if (styleId === selectedStyleId) {
      setSelectedStyleId(null);
      return;
    }

    setSelectedStyleId(styleId);
    setGenerateError(null);
  };

  return (
    <Modal
      scrollBehavior="inside"
      size="xl"
      isOpen={isOpen}
      onClose={() => {
        setSelectedStyleId(null);
        setGenerateError(null);
        closeModal();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Style</ModalHeader>
        <ModalBody>
          <StylesGrid
            loading={stylesLoading}
            onClick={handleStyleClick}
            selectedStyleId={selectedStyleId}
            styles={styles!}
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
