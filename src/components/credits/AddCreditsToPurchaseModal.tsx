import { creditsPackageOptions, PricingPackage } from "@/core/constants";
import { priceInUSD } from "@/core/utils/prices";
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tr,
  Td,
  Thead,
  TableContainer,
  Icon,
  IconButton,
  Tbody,
} from "@chakra-ui/react";
import React, { FunctionComponent, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

interface AddCreditsToPurchaseModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  handlePurchase: (packages: PricingPackage[]) => void;
  pricePack: PricingPackage;
}

const AddCreditsToPurchaseModal: FunctionComponent<
  AddCreditsToPurchaseModalProps
> = ({ onClose, isOpen, handlePurchase, pricePack }) => {
  const [packages, setPackages] = useState<PricingPackage[]>([pricePack]);

  useEffect(() => {
    setPackages([pricePack]);
  }, [pricePack]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add additional credits?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <TableContainer>
            <Table size="sm" variant="simple" colorScheme={"blackAlpha"}>
              <Thead>
                <Tr>
                  <Td>
                    <b> Item</b>
                  </Td>
                  <Td isNumeric>
                    <b>Price</b>
                  </Td>
                  <Td></Td>
                </Tr>
              </Thead>
              <Tbody>
                {packages.map((packageInfo, index) => {
                  return (
                    <Tr key={packageInfo.id + index}>
                      <Td>{packageInfo.displayName}</Td>
                      <Td isNumeric>{priceInUSD(packageInfo.price)}</Td>
                      <Td flexShrink={1}>
                        {" "}
                        <IconButton
                          size="xs"
                          icon={<Icon as={FaTrash} />}
                          isDisabled={index === 0}
                          cursor="pointer"
                          onClick={() => {
                            const newPackages = packages.filter(
                              (_, i) => i !== index
                            );
                            setPackages(newPackages);
                          }}
                          aria-label={""}
                        />
                      </Td>
                    </Tr>
                  );
                })}
                <Tr>
                  <Td>
                    <b>Total</b>
                  </Td>
                  <Td isNumeric>
                    <b>
                      {priceInUSD(
                        packages.reduce((acc, curr) => acc + curr.price, 0)
                      )}
                    </b>
                  </Td>
                  <Td />
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>

          <HStack
            width={"100%"}
            display="flex"
            justifyContent="space-around"
            marginTop={"1em"}
          >
            {/* TODO: Create buttons to purchase 50 credits and 100 credits */}
            {creditsPackageOptions.map((option) => {
              return (
                <Button
                  onClick={() => setPackages([...packages, option])}
                  key={option.id}
                >
                  + {option.displayName}
                </Button>
              );
            })}
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => handlePurchase(packages)}>
            Continue Purchase
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

//TODO: create component to display pricing packages as line items

export default AddCreditsToPurchaseModal;
