// Create a modal dialog to collect the address information

import * as React from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

export default function AddressModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddressForm />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

// create a form to collect the address information with chakra-ui

export const AddressForm = () => {
  return (
    <form>
      <VStack spacing={3}>
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input type="text" name="name" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="address">Address</FormLabel>
          <Input type="text" name="address" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="city">City</FormLabel>
          <Input type="text" name="city" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="state">State</FormLabel>
          <Input type="text" name="state" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="zip">Zip</FormLabel>
          <Input type="text" name="zip" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="country">Country</FormLabel>
          <Input type="text" name="country" />
        </FormControl>
      </VStack>
    </form>
  );
};
