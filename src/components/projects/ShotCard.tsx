import { ShotsPick } from "@/pages/api/projects";
import { Box, Center, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import NextImage from "next/image";
import { memo } from "react";
import Zoom from "react-medium-image-zoom";
import { useQuery } from "react-query";
import CustomZoomContent, { ZoomContentProps } from "./CustomZoomContent";

const ShotCard = ({
  shot: initialShot,
  projectId,
}: {
  shot: ShotsPick;
  projectId: string;
}) => {
  const { data } = useQuery(
    `shot-${initialShot.id}`,
    () =>
      axios
        .get<{ shot: ShotsPick }>(
          `/api/projects/${projectId}/predictions/${initialShot.id}`
        )
        .then((res) => res.data),
    {
      refetchInterval: (data) => (data?.shot.outputUrl ? false : 5000),
      refetchOnWindowFocus: false,
      enabled: !initialShot.outputUrl && initialShot.status !== "failed",
      initialData: { shot: initialShot },
    }
  );

  const shot = data!.shot;

  return (
    <Box key={shot.id} backgroundColor="gray.100" overflow="hidden">
      {shot.status === "failed" && (
        <Center height="100%" backgroundColor="gray.100">
          <Text>{`Failed to Generate :(`}</Text>
        </Center>
      )}
      {shot.outputUrl ? (
        <Zoom
          ZoomContent={(zoomContentProps) => (
            <CustomZoomContent
              // Type script being annoying, i'll figure it out later.
              {...(zoomContentProps as unknown as ZoomContentProps)}
              description={` Style: ${shot.filterName}`}
            />
          )}
        >
          <NextImage
            alt={shot.filterName || "Stylized image of your pet"}
            src={shot.outputUrl}
            width="512"
            height="512"
          />
        </Zoom>
      ) : (
        <Center height="100%" backgroundColor="gray.100">
          <Spinner speed="2s" color="gray.400" />
        </Center>
      )}
    </Box>
  );
};

export default memo(ShotCard);
