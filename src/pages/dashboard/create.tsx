import Uploader from "@/components/dashboard/Uploader";
import { Box, Heading } from "@chakra-ui/react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import PageContainer from "@/components/layout/PageContainer";
import { useRouter } from "next/router";

export default function CreateProject() {
  const router = useRouter();

  return (
    <PageContainer>
      <Box>
        <Heading as="h2" mb={4} fontWeight="semibold" fontSize="2xl">
          Create a new Studio
        </Heading>
        <Uploader
          handleOnAdd={() => {
            router.push("/dashboard");
          }}
        />
      </Box>
    </PageContainer>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props: {},
    };
  }

  return { props: {} };
}
