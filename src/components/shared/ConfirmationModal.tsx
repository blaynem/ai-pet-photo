import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface CreditsModalProps {
  /**
   * Whether modal is open
   */
  isOpen: boolean;
  /**
   * Modal close callback
   */
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
}: CreditsModalProps) => {
  const router = useRouter();
  const { data: userSession } = useSession();
  const userId = userSession?.user.id;
  // Options for credit packages radio buttons, we only want the id here to render options
  return (
    <div style={{ zIndex: 9999 }}>
      <Modal
        scrollBehavior="inside"
        size="md"
        isOpen={isOpen}
        onClose={() => {
          onClose();
        }}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent zIndex={9999}>
          <ModalHeader>Upscale Image</ModalHeader>
          <ModalBody>
            <Text fontSize="sm" mb={4}>
              Are you sure you want to spend 1 credit to upscale this image?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Box display="flex" justifyContent={"space-around"} width="100%">
              <Button size="lg" variant="brand" onClick={() => onClose()}>
                Cancel
              </Button>
              <Button
                size="lg"
                variant="brand"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                Yes
              </Button>
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ConfirmationModal;
