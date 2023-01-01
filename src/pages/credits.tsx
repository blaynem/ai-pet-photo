import { List, ListIcon, ListItem, SimpleGrid, Text } from "@chakra-ui/react";
import React from "react";
import { RiCopperCoinFill } from "react-icons/ri";
import PageContainer from "@/components/layout/PageContainer";
import {
  FIFTY_CREDIT_PACKAGE,
  GENERATE_PHOTO_AMOUNT_PER_CREDIT,
  HUNDRED_CREDIT_PACKAGE,
  STUDIO_COST_IN_CREDITS,
} from "@/core/constants";
import Item from "@/components/credits/Item";

const CustomListItem = ({ children }: { children: React.ReactNode }) => (
  <ListItem>
    <ListIcon color={"gold"} fontSize="xl" as={RiCopperCoinFill} /> {children}
  </ListItem>
);

const calcLeftoverCredits = (totalCredits: number, creditsUsed: number) => {
  return totalCredits - creditsUsed;
};

const BuyCredits = () => {
  return (
    <PageContainer>
      <Text fontWeight="700" fontSize="4xl" mt={8} mb={8}>
        Purchase Credits
      </Text>

      <SimpleGrid columns={[1, 2]}>
        <Item pricingPackage={FIFTY_CREDIT_PACKAGE}>
          <>
            <Text fontWeight="900" fontSize="md">
              Example usage of credits:
            </Text>
            <List mt={2} mb={4} spacing={1}>
              <CustomListItem>
                {/* This is 40 credits in model + 10 credits in generated image */}
                <b>1</b> model ({STUDIO_COST_IN_CREDITS} credits) +{" "}
                <b>
                  {calcLeftoverCredits(
                    FIFTY_CREDIT_PACKAGE.totalCredits,
                    STUDIO_COST_IN_CREDITS
                  ) * GENERATE_PHOTO_AMOUNT_PER_CREDIT}
                </b>{" "}
                generated images
              </CustomListItem>
              <CustomListItem>
                {/* This is 50 credits in generated image */}
                generate{" "}
                <b>
                  {FIFTY_CREDIT_PACKAGE.totalCredits *
                    GENERATE_PHOTO_AMOUNT_PER_CREDIT}
                </b>{" "}
                images using up to <b>{FIFTY_CREDIT_PACKAGE.totalCredits}</b>{" "}
                different filters
              </CustomListItem>
            </List>
          </>
        </Item>
        <Item pricingPackage={HUNDRED_CREDIT_PACKAGE}>
          <>
            <Text fontWeight="900" fontSize="md">
              Example usage of credits:
            </Text>
            <List mt={2} mb={4} spacing={1}>
              <CustomListItem>
                {/* This is 40 credits in studio + 60 credits in generated image */}
                <b>1</b> model ({STUDIO_COST_IN_CREDITS} credits) +{" "}
                <b>
                  {calcLeftoverCredits(
                    HUNDRED_CREDIT_PACKAGE.totalCredits,
                    STUDIO_COST_IN_CREDITS
                  ) * GENERATE_PHOTO_AMOUNT_PER_CREDIT}
                </b>{" "}
                generated images
              </CustomListItem>
              <CustomListItem>
                {/* This is 100 credits in generated image */}
                generate{" "}
                <b>
                  {HUNDRED_CREDIT_PACKAGE.totalCredits *
                    GENERATE_PHOTO_AMOUNT_PER_CREDIT}
                </b>{" "}
                images using up to <b>{HUNDRED_CREDIT_PACKAGE.totalCredits}</b>{" "}
                different filters
              </CustomListItem>
            </List>
          </>
        </Item>
      </SimpleGrid>
      {/* TODO: Create a little FAQ here? */}
    </PageContainer>
  );
};

export default BuyCredits;
