import PageContainer from "@/components/layout/PageContainer";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spacer,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { useSession } from "next-auth/react";
import { FaMagic } from "react-icons/fa";
import { formatRelative } from "date-fns";
import Link from "next/link";
import { HiArrowLeft } from "react-icons/hi";
import ShotCardGrid from "@/components/studio/ShotCardGrid";
import GenerateStudioModal from "@/components/studio/GenerateStudioModal";
import { useRouter } from "next/router";
import { reloadSession } from "@/core/utils/reloadSession";
import axios from "axios";
import { FC, useReducer } from "react";
import { useMutation, useQuery } from "react-query";
import { ProjectIdResponse } from "@/pages/api/projects/[id]";
import {
  PredictionsBody,
  PredictionsResponse,
} from "@/pages/api/projects/[id]/predictions";
import { AddressForm } from "@/components/print/AddressForm";
import { PricingPackage } from "@/core/constants";

type StudioPageProps = {
  shotId: string;
  productId: string;
};

export type Address = {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
};

const StudioPage: FC<StudioPageProps> = ({ shotId, productId }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [addressInputs, setAddressInputs] = useReducer(
    (state: Address, newState: Address) => ({ ...state, ...newState }),
    {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
    }
  );

  const router = useRouter();

  useSession({
    required: true,
    onUnauthenticated() {
      router.isReady && router.push("/login");
    },
  });

  const handlePurchase = (packages: PricingPackage[]) => {
    router.isReady &&
      router.push(
        `/api/checkout/session?ppi=${shotId}&packageIds=${packages
          .map((pack: PricingPackage) => pack.id)
          .join(",")}`
      );
  };

  return (
    <PageContainer title="Shipping Address">
      <Heading as="h2" mb={4} fontWeight="semibold" fontSize="2xl">
        Enter Shipping Address
      </Heading>
      <AddressForm
        addressInput={addressInputs}
        setAddressInput={setAddressInputs}
      />
    </PageContainer>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const productId = context.query.productId as string;
  const shotId = context.query.shotId as string;

  return {
    props: {
      shotId,
      productId,
    },
  };
}

export default StudioPage;
