import { ShotsPick } from "@/pages/api/projects";
import { Box, Text } from "@chakra-ui/layout";
import { Button, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { ReactElement, FC } from "react";
import { useMutation } from "react-query";
import ConfirmationModal from "../shared/ConfirmationModal";

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
};

type CustomZoomContentProps = {} & ZoomContentProps;

const CustomZoomContent: FC<CustomZoomContentProps> = ({
  buttonUnzoom,
  modalState,
  img,
  shot,
}) => {
  // If we don't have this check, the unzoom button / description will render
  // before the modals transition is complete.
  const modalLoaded = modalState === "LOADED";
  const { isOpen, onClose, onOpen } = useDisclosure();

  const {
    mutate: mutateUpscale,
    isLoading: isLoadingUpscale,
    isSuccess,
  } = useMutation(
    `upscale-shot-${shot.id}`,
    (shot: ShotsPick) => axios.post(`/api/shots/upscale?id=${shot.id}`),
    {
      onSuccess: () => {
        // refresh shots later
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
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
        {modalLoaded && (
          <Button variant={"brand"} onClick={() => mutateUpscale(shot)}>
            Upscale
          </Button>
        )}
      </Box>
      <ConfirmationModal
        isOpen={isOpen}
        onClose={onClose}
        onConfirm={() => mutateUpscale(shot)}
      />
    </>
  );
};

export default CustomZoomContent;
