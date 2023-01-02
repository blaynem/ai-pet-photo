import { Divider, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";

interface ItemProps {
  iconName: string;
  title: string;
  children: React.ReactNode;
}

const Item = ({ iconName, title, children }: ItemProps) => (
  <Flex alignItems="center" direction="column" p={4}>
    <Image alt="logo" width="8rem" src={iconName} />
    <Text textAlign="center" fontWeight="900" fontSize="2xl" mt={3}>
      {title}
    </Text>
    <Text
      maxWidth={{ base: "20rem", lg: "13rem" }}
      mt={2}
      textAlign="center"
      fontSize="lg"
    >
      {children}
    </Text>
  </Flex>
);

const Features = () => {
  return (
    <Flex width="100%" backgroundColor="whiteAlpha.900" py={10} flex="1">
      <Flex
        px={{ base: 4, lg: 0 }}
        py={4}
        width="100%"
        flexDirection="column"
        margin="auto"
        maxWidth="container.lg"
      >
        <SimpleGrid mb={10} columns={{ base: 1, md: 3 }}>
          <Item iconName="publish.svg" title="1. Upload">
            Upload <b>some pictures</b> of your pet with different angles
          </Item>
          <Item iconName="square.svg" title="2. Wait">
            Give your pet some loves while we build <b>a model</b> based on your
            photos
          </Item>
          <Item iconName="preview.svg" title="3. Generate">
            Choose a <b>style</b> to generate art of your pet!
          </Item>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};

export default Features;
