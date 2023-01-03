import { creditsPackageOptions, FIFTY_CREDIT_PACKAGE } from "@/core/constants";
import { getPackageInfo } from "@/core/utils/getPackageInfo";
import {
  Button,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  RadioGroup,
  useDisclosure,
  useRadioGroup,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";
import React, { FunctionComponent, useState } from "react";
import { RadioCard } from "./RadioCard";

interface AddCreditsToPurchaseModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  projectId: string;
  packageId: string;
}

const AddCreditsToPurchaseModal: FunctionComponent<
  AddCreditsToPurchaseModalProps
> = ({ onClose, onOpen, isOpen, projectId, packageId }) => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const router = useRouter();
  const options = creditsPackageOptions.map((option) => option.id);
  const packageArray = [packageId, selectedValue];
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "credit-package-select",
    defaultValue: selectedValue,
    onChange: (val) => setSelectedValue(val),
  });
  const group = getRootProps();
  const packageIdArray = packageArray.map((packageId) => packageId);

  const handleBuyWithCredits = () => {
    router.isReady &&
      router.push(
        `/api/checkout/session?ppi=${projectId}&packageIds=${packageIdArray.join(
          ","
        )}`
      );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Would you like to add credits to this purchase?
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {" "}
          <HStack {...group} mb={4}>
            {options.map((value) => {
              const radio = getRadioProps({ value });
              return <RadioCard key={value} {...radio} />;
            })}
          </HStack>
        </ModalBody>
        <ModalFooter>
          <HStack>
            <Button
              onClick={() =>
                router.push(
                  `/api/checkout/session?ppi=${projectId}&packageIds=${packageId}`
                )
              }
            >
              No thanks!
            </Button>
            <Button
              onClick={handleBuyWithCredits}
              isDisabled={selectedValue === ""}
              cursor={selectedValue === "" ? "normal" : "auto"}
            >
              Add Credits
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddCreditsToPurchaseModal;
