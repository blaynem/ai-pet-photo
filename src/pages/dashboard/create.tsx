import Uploader from "@/components/dashboard/Uploader";
import { Box, Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import PageContainer from "@/components/layout/PageContainer";
import { useRouter } from "next/router";
import ExamplePictures from "@/components/dashboard/ExamplePictures";

export default function CreateProject() {
  const router = useRouter();
  useSession({
    required: true,
    onUnauthenticated() {
      router.isReady && router.push("/login");
    },
  });

  return (
    <PageContainer>
      <Box>
        <Heading as="h2" mb={4} fontWeight="semibold" fontSize="2xl">
          Create a new Model
        </Heading>
        <Uploader
          handleOnAdd={() => {
            router.push("/dashboard");
          }}
        />
      </Box>
      <ExamplePictures />
    </PageContainer>
  );
}
