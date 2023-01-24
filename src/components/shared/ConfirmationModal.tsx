import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

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
    <Modal
      scrollBehavior="inside"
      size="md"
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upscale Image</ModalHeader>
        <ModalBody>
          <Text fontSize="sm" mb={4}>
            Are you sure you want to spend 1 credit to upscale this image?
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button size="lg" variant="brand" onClick={() => onConfirm()}>
            Yes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;
