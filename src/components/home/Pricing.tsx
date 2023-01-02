import React from "react";
import {
  Box,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Tag,
  Text,
} from "@chakra-ui/react";
import { HiBadgeCheck } from "react-icons/hi";
import { priceInUSD } from "@/core/utils/prices";
import { STANDARD_STUDIO_PACKAGE } from "@/core/constants";

export const PriceItem = ({ children }: { children: React.ReactNode }) => (
  <ListItem>
    <ListIcon fontSize="xl" as={HiBadgeCheck} /> {children}
  </ListItem>
);

const Pricing = () => {
  return (
    <SimpleGrid width="100%" spacing={6} columns={{ base: 1, md: 2 }}>
      <Box
        backgroundColor="white"
        border="4px solid black"
        borderRadius={10}
        padding={8}
        borderColor="brand.500"
        transition="all 250ms"
      >
        <Text mt={2} fontWeight="black" fontSize="4xl">
          Why not Free?
        </Text>
        <Text mt={2} mb={4}>
          Training a custom AI model is expensive due to the resources required.
        </Text>
      </Box>
      <Box
        backgroundColor="brand.300"
        border="4px solid"
        borderRadius={10}
        padding={8}
        transition="all 250ms"
        borderColor="brand.500"
      >
        <Tag
          py={1}
          px={3}
          shadow="semibold"
          border="2px solid black"
          color="black"
          backgroundColor="brand.500"
        >
          1 Model{" "}
          {STANDARD_STUDIO_PACKAGE.totalCredits
            ? `+ ${STANDARD_STUDIO_PACKAGE.totalCredits} credits`
            : ""}
        </Tag>

        <Box mt={2} fontWeight="black" fontSize="3.5rem">
          {priceInUSD(STANDARD_STUDIO_PACKAGE.price)}
          <Box
            ml={1}
            as="span"
            fontWeight="500"
            color="coolGray.400"
            fontSize="1.2rem"
          >
            / model
          </Box>
        </Box>

        <List mt={2} mb={4} spacing={1}>
          <PriceItem>
            1 custom trained <b> pet model</b>
          </PriceItem>
          {STANDARD_STUDIO_PACKAGE.totalCredits > 0 && (
            <PriceItem>
              <b>{STANDARD_STUDIO_PACKAGE.totalCredits}</b> credits to generate
              images with
            </PriceItem>
          )}
        </List>
      </Box>
    </SimpleGrid>
  );
};

export default Pricing;
