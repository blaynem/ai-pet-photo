import {
  FIFTY_CREDIT_PACKAGE,
  GENERATE_PHOTO_AMOUNT_PER_CREDIT,
  HUNDRED_CREDIT_PACKAGE,
  STUDIO_COST_IN_CREDITS,
} from "@/core/constants";
import { getPackageInfo } from "@/core/utils/getPackageInfo";
import { priceInUSD } from "@/core/utils/prices";
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
  useRadio,
  useRadioGroup,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
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
}

const RadioCard = (props: any) => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const inputProps = getInputProps();
  const checkbox = getCheckboxProps();

  // Get pricing package info for displaying
  const pricingPackage = getPackageInfo(inputProps.value);

  return (
    <Box as="label">
      <input {...inputProps} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: "brand.500",
          color: "blackAlpha.700",
          borderColor: "brand.500",
        }}
        _focus={{
          boxShadow: "outline",
        }}
        px={5}
        py={3}
      >
        <b>{pricingPackage?.totalCredits} Credits</b> for{" "}
        {priceInUSD(pricingPackage?.price!)}
      </Box>
    </Box>
  );
};

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
  // Options for credit packages radio buttons
  const options = [FIFTY_CREDIT_PACKAGE.id, HUNDRED_CREDIT_PACKAGE.id];

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
        <ModalHeader>Purchase Credits</ModalHeader>
        <ModalBody>
          <Text as="b" fontSize="l">
            Select Credit Package
          </Text>
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
          </Accordion>
        </ModalBody>
        <ModalFooter>
          <Button
            size="lg"
            variant="brand"
            onClick={() =>
              router.push(
                `/api/credits/session?ppi=${userId}&packageId=${pricingPackage?.id}`
              )
            }
          >
            Purchase
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PurchaseCreditsModal;