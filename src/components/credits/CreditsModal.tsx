import {
  creditsPackageOptions,
  FIFTY_CREDIT_PACKAGE,
  GENERATE_PHOTO_AMOUNT_PER_CREDIT,
  STUDIO_COST_IN_CREDITS,
} from "@/core/constants";
import { getPackageInfo } from "@/core/utils/getPackageInfo";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  HStack,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useRadioGroup,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { RadioCard } from "./RadioCard";

interface CreditsModalProps {
  /**
   * Whether modal is open
   */
  isOpen: boolean;
  /**
   * Modal close callback
   */
  onClose: () => void;
}

const PurchaseCreditsModal = ({ isOpen, onClose }: CreditsModalProps) => {
  const router = useRouter();
  const { data: userSession } = useSession();
  const [selectedValue, setSelectedValue] = useState<string>(
    FIFTY_CREDIT_PACKAGE.id
  );
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "credit-package-select",
    defaultValue: selectedValue,
    onChange: (val) => setSelectedValue(val),
  });
  const group = getRootProps();

  // Get pricing package info for displaying
  const pricingPackage = getPackageInfo(selectedValue);
  const userId = userSession?.user.id;
  // Options for credit packages radio buttons, we only want the id here to render options
  const options = creditsPackageOptions.map((option) => option.id);

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
        <ModalHeader>Select Credits Package</ModalHeader>
        <ModalBody>
          <HStack {...group} mb={4}>
            {options.map((value) => {
              const radio = getRadioProps({ value });
              return <RadioCard key={value} {...radio} />;
            })}
          </HStack>
          <Accordion mb={4} allowMultiple>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" fontWeight={"bold"}>
                  What are credits used for?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Text mb={4}>
                  Credits are used to generate photos, and purchase studios for
                  your pet.
                </Text>
                <Text mb={4} as="b">
                  Credit Conversion
                </Text>
                <List mb={4} spacing={0}>
                  <ListItem>
                    1 credit = {GENERATE_PHOTO_AMOUNT_PER_CREDIT} images
                  </ListItem>
                  <ListItem>
                    {STUDIO_COST_IN_CREDITS} credits = 1 studio
                  </ListItem>
                </List>
              </AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" fontWeight={"bold"}>
                  What is a studio?
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <Text mb={4}>
                  Studios are where you will select styles to generate new
                  images of your pet.
                </Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Text align="right" fontSize="sm">
            All purchases are final.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            size="lg"
            variant="brand"
            onClick={() => {
              router.push(
                `/api/credits/session?ppi=${userId}&packageIds=${pricingPackage?.id}`
              );
            }}
          >
            Purchase
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PurchaseCreditsModal;
