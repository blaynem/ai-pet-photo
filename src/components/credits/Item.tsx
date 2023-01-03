import { PricingPackage } from "@/core/constants";
import { priceInUSD } from "@/core/utils/prices";
import { Flex, Button, Box, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface ItemProps {
  pricingPackage: PricingPackage;
  children?: React.ReactNode;
  header?: JSX.Element;
  buyButtonText?: string;
}

const Item = ({
  children,
  header,
  buyButtonText,
  pricingPackage,
}: ItemProps) => {
  const router = useRouter();
  const session = useSession();
  const user = session.data?.user;
  const userId = user?.id;

  return (
    <Box
      backgroundColor="white"
      border="2px solid black"
      borderRadius={8}
      padding={8}
      transition="all 250ms"
      margin={4}
    >
      <Flex alignItems="center" direction="column">
        <Box mb={4} display="flex" alignItems={"center"}>
          {header ? (
            header
          ) : (
            <Text fontSize="2xl">
              <b>{pricingPackage.totalCredits} Credits</b> for{" "}
              {priceInUSD(pricingPackage.price)}
            </Text>
          )}
        </Box>
      </Flex>
      {children}
      <Box display="flex" justifyContent={"center"}>
        <Button
          variant="brand"
          onClick={() =>
            router.push(
              `/api/credits/session?ppi=${userId}&packageIds=${pricingPackage.id}`
            )
          }
        >
          {buyButtonText
            ? buyButtonText
            : `Buy ${pricingPackage.totalCredits} Credits`}
        </Button>
      </Box>
    </Box>
  );
};

export default Item;
