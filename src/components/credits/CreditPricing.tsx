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
import { formatStudioPrice } from "@/core/utils/prices";

export const PriceItem = ({ children }: { children: React.ReactNode }) => (
  <ListItem>
    <ListIcon fontSize="xl" as={HiBadgeCheck} /> {children}
  </ListItem>
);

const CreditPricing = () => {
  return (
    <SimpleGrid width="100%" spacing={6} columns={{ base: 1, md: 2 }}>
      <Box
        backgroundColor="white"
        border="4px solid black"
        borderRadius={10}
        padding={8}
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
        backgroundColor="white"
        border="4px solid black"
        borderRadius={10}
        padding={8}
        transition="all 250ms"
      >
        <Box fontWeight="black" fontSize="1.5rem">
          5 Credits
          <Box
            ml={1}
            as="span"
            fontWeight="500"
            color="coolGray.400"
            fontSize="1.2rem"
          >
            / Project
          </Box>
        </Box>
        <Box fontWeight="black" fontSize="1.5rem">
          1 Credit
          <Box
            ml={1}
            as="span"
            fontWeight="500"
            color="coolGray.400"
            fontSize="1.2rem"
          >
            / 10 Shots
          </Box>
        </Box>

        <List mt={2} mb={4} spacing={1}>
          <Text>
            A <b>Project</b> is a <b>custom trained model</b>
          </Text>
          <Text>
            <b>Each credit</b> will get <b>10 images</b> generated from your
            selected prompt
          </Text>
          <Text>Craft your own prompt? could be good?</Text>
          <Text>Sponsorship development 🖤</Text>
        </List>
      </Box>
    </SimpleGrid>
  );
};

export default CreditPricing;
