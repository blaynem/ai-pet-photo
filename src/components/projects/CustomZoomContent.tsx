import { getFullShotUrl } from "@/core/utils/bucketHelpers";
import { ShotsPick } from "@/pages/api/projects";
import { Box, Text } from "@chakra-ui/layout";
import {
  Button,
  Icon,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { ReactElement, FC, useState } from "react";
import { useMutation } from "react-query";
import { saveAs } from "file-saver";
import { FiDownload } from "react-icons/fi";
import { UPSCALE_IMAGE_COST_IN_CREDITS } from "@/core/constants";
import { reloadSession } from "@/core/utils/reloadSession";

declare const enum ModalState {
  LOADED = "LOADED",
  LOADING = "LOADING",
  UNLOADED = "UNLOADED",
  UNLOADING = "UNLOADING",
}

export type ZoomContentProps = {
  img: ReactElement | null;
  buttonUnzoom: ReactElement<HTMLButtonElement>;
  modalState: ModalState;
  shot: ShotsPick;
  onUnzoom: () => void;
  onUpscale: () => void;
};

type CustomZoomContentProps = {} & ZoomContentProps;

const CustomZoomContent: FC<CustomZoomContentProps> = ({
  buttonUnzoom,
  modalState,
  img,
  shot,
  onUpscale,
}) => {
  const [isLoadingUpscale, setIsLoadingUpscale] = useState(
    shot.upscaleId && !shot.upscaledImageUrl
  );
  // If we don't have this check, the unzoom button / description will render
  // before the modals transition is complete.
  const modalLoaded = modalState === "LOADED";
  const { isOpen, onClose, onToggle } = useDisclosure();

  const { mutate: mutateUpscale } = useMutation(
    `upscale-shot-${shot.id}`,
    (shot: ShotsPick) =>
      axios.post(`/api/shots/upscale?id=${shot.id}`).then((res) => res.data),
    {
      onSuccess: () => {
        setIsLoadingUpscale(true);
        onUpscale();
        // Reload the session fetches their new credits balance
        reloadSession();
      },
    }
  );

  return (
    <>
      {modalLoaded && buttonUnzoom}

      <Box>
        {img}
        {modalLoaded && (
          <Text align={"center"} fontWeight="light" fontSize={"2em"}>
            Style: {shot.filterName}
          </Text>
        )}
      </Box>

      <Box
        display={modalLoaded ? "flex" : "none"}
        mt={4}
        alignItems="center"
        justifyContent="center"
      >
        {shot.imageUrl && (
          <Button
            rightIcon={<Icon as={FiDownload} />}
            aria-label="Download SD"
            variant="brand"
            mr={4}
            onClick={async () => {
              saveAs(getFullShotUrl(shot, false), "image.png");
            }}
          >
            512px
          </Button>
        )}
        {shot.upscaledImageUrl && (
          <Button
            variant="brand"
            aria-label="Download HD"
            mr={4}
            onClick={async () => {
              saveAs(getFullShotUrl(shot, true), "image.png");
            }}
            rightIcon={<Icon as={FiDownload} />}
          >
            2048px
          </Button>
        )}
        {isLoadingUpscale && (
          <Button variant="brand" disabled={true}>
            <Spinner mr={2} /> <Text>Upscaling...</Text>
          </Button>
        )}
        {!isLoadingUpscale && (
          <Box
            display={modalLoaded && !shot.upscaledImageUrl ? "flex" : "none"}
            alignItems="center"
            justifyContent="center"
          >
            <Popover
              placement="bottom"
              size="md"
              isOpen={isOpen}
              onClose={onClose}
              arrowShadowColor="gray.300"
            >
              <PopoverTrigger>
                <Button variant="brand" onClick={onToggle}>
                  Upscale Image
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverHeader>Upscale Image</PopoverHeader>
                <PopoverCloseButton />

                <PopoverBody>
                  <Text fontSize="sm" mb={4}>
                    Are you sure you want to spend{" "}
                    {UPSCALE_IMAGE_COST_IN_CREDITS} credit to upscale this
                    image?
                  </Text>
                </PopoverBody>
                <PopoverFooter>
                  <Box
                    display="flex"
                    justifyContent={"space-around"}
                    width="100%"
                  >
                    <Button size="lg" variant="brand" onClick={() => onClose()}>
                      Cancel
                    </Button>
                    <Button
                      size="lg"
                      variant="brand"
                      onClick={() => {
                        onClose();
                        setIsLoadingUpscale(true);
                        mutateUpscale(shot);
                      }}
                    >
                      Yes
                    </Button>
                  </Box>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </Box>
        )}
      </Box>
    </>
  );
};

export default CustomZoomContent;
