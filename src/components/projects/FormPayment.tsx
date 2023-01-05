import {
  PricingPackage,
  PROMOTION_STUDIO_PACKAGE,
  STANDARD_STUDIO_PACKAGE,
  STUDIO_COST_IN_CREDITS,
} from "@/core/constants";
import { priceInUSD } from "@/core/utils/prices";
import { reloadSession } from "@/core/utils/reloadSession";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  List,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import AddCreditsToPurchaseModal from "../credits/AddCreditsToPurchaseModal";
import PayWithCreditsButton from "./PayWithCreditsButton";
import { PriceItem } from "./PricingItem";

const FormPayment = ({
  project,
  handlePaymentSuccess,
  showPromotionalPricing,
}: {
  project: Project;
  handlePaymentSuccess: () => void;
  showPromotionalPricing?: boolean;
}) => {
  const { data: userSession } = useSession();
  const [waitingPayment, setWaitingPayment] = useState(false);
  const { query } = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  useQuery(
    "check-payment",
    () => axios.get(`/api/checkout/check/${query.ppi}/${query.session_id}`),
    {
      cacheTime: 0,
      refetchInterval: 500,
      enabled: waitingPayment,
      onSuccess: () => {
        handlePaymentSuccess();
        // Reload the session now to get the potential new credits value
        reloadSession();
      },
    }
  );

  const { mutate: payStudioWithCreditsMutation } = useMutation(
    "studio-payment-credits",
    () =>
      axios.post(
        `/api/credits/payment?ppi=${project.id}&userId=${userSession?.user.id}&purchaseId=STUDIO`
      ),
    {
      onSuccess: () => {
        handlePaymentSuccess();
        // Reload the session now to get the potential new credits value
        reloadSession();
      },
    }
  );

  useEffect(() => {
    setWaitingPayment(query.ppi === project.id);
  }, [query, project]);

  const visibleStudioPackage = showPromotionalPricing
    ? PROMOTION_STUDIO_PACKAGE
    : STANDARD_STUDIO_PACKAGE;

  const handlePurchase = (packages: PricingPackage[]) => {
    router.isReady &&
      router.push(
        `/api/checkout/session?ppi=${project.id}&packageIds=${packages
          .map((pack: PricingPackage) => pack.id)
          .join(",")}`
      );
  };

  return (
    <Box textAlign="center" width="100%">
      {waitingPayment ? (
        <Box>
          <Spinner speed="1s" size="xl" />
          <Text mt={2} size="sm">
            Validating payment
          </Text>
        </Box>
      ) : (
        <VStack spacing={4}>
          <Box fontWeight="bold" fontSize="xl">
            Your Model is ready to be built!
          </Box>
          <List textAlign="left" spacing={1}>
            <PriceItem>
              <b>1</b> custom <b> trained pet model</b>
            </PriceItem>
            {visibleStudioPackage.credits && (
              <PriceItem>
                <b>{visibleStudioPackage.credits}</b> credits to{" "}
                <b>create images with</b>
              </PriceItem>
            )}
            {visibleStudioPackage.bonusCredits && (
              <PriceItem>
                Comes with <b>{visibleStudioPackage.bonusCredits}</b> bonus
                credits!
              </PriceItem>
            )}
          </List>
          <Stack direction={["column", "row"]}>
            <Button variant="brand" onClick={onOpen}>
              Unlock Now - {priceInUSD(visibleStudioPackage.price)}
            </Button>
            <AddCreditsToPurchaseModal
              isOpen={isOpen}
              onClose={onClose}
              handlePurchase={handlePurchase}
              onOpen={onOpen}
              pricePack={visibleStudioPackage}
            />
            <PayWithCreditsButton
              creditCost={STUDIO_COST_IN_CREDITS}
              onPaymentApprove={payStudioWithCreditsMutation}
            />
          </Stack>
          <Box pt={4}>
            <AvatarGroup size="md" max={10}>
              {project.imageUrls.map((url) => (
                <Avatar key={url} src={url} />
              ))}
            </AvatarGroup>
          </Box>
        </VStack>
      )}
    </Box>
  );
};

export default FormPayment;
