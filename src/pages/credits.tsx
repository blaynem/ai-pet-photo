import { formatStudioPrice } from "@/core/utils/prices";
import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Image,
  Link,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import { IconType } from "react-icons/lib";
import { RiCopperCoinFill } from "react-icons/ri";
import { GiTwoCoins } from "react-icons/gi";
import { FaCoins } from "react-icons/fa";
import CreditPricing from "@/components/credits/CreditPricing";
import PageContainer from "@/components/layout/PageContainer";
interface ItemProps {
  iconName: IconType;
  price: string;
  children?: React.ReactNode;
}

const Item = ({ iconName, price, children }: ItemProps) => {
  const session = useSession();
  const user = session.data?.user;
  const userId = user?.id;
  return (
    <Box borderWidth="2px" borderRadius="10px" margin="1em">
      <Flex alignItems="center" direction="column" p={4}>
        <Box
          height={"10em"}
          justifyContent="center"
          alignItems="center"
          display="flex"
          flexDirection={"column"}
        >
          <Icon as={iconName} color={"gold"} boxSize="3em"></Icon>
          <Text textAlign="center" fontWeight="900" fontSize="xl" mt={3}>
            {price}
          </Text>
        </Box>
        <Text
          alignItems="center"
          display="flex"
          textAlign="center"
          fontWeight="600"
          fontSize="xl"
          mt={3}
        >
          USD{" "}
          {(Number(price) * Number(process.env.NEXT_PUBLIC_CREDIT_PRICE)) / 100}
          .00
        </Text>
        <Text
          maxWidth={{ base: "20rem", lg: "13rem" }}
          mt={2}
          textAlign="center"
          fontSize="lg"
        >
          {children}
          <Button
            as={Link}
            variant="brand"
            href={`/api/credits/session?ppi=${userId}&credits=${price}`}
          >
            Buy
          </Button>
        </Text>
      </Flex>
    </Box>
  );
};

const BuyCredits = () => {
  return (
    <>
      <Flex
        width="100%"
        backgroundColor="whiteAlpha.900"
        py={1}
        display="flex"
        justifyContent={"center"}
      >
        <Flex
          maxWidth="container.lg"
          display="flex"
          justifyContent="left"
          flex="1"
        >
          <Text textAlign="center" fontWeight="700" fontSize="2xl" mt={3}>
            Buy Credits
          </Text>
        </Flex>
      </Flex>
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
            <Item iconName={RiCopperCoinFill} price="5"></Item>
            <Item iconName={GiTwoCoins} price="10"></Item>
            <Item iconName={FaCoins} price="15"></Item>
          </SimpleGrid>
        </Flex>
      </Flex>
      <Flex px={4} py={10} maxWidth="container.lg" width="100%" marginX="auto">
        <CreditPricing />
      </Flex>
    </>
  );
};

export default BuyCredits;
