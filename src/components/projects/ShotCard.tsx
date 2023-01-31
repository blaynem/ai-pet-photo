import { getFullShotUrl } from "@/core/utils/bucketHelpers";
import { ShotsPick } from "@/pages/api/projects";
import { AspectRatio, Box, Center, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import NextImage from "next/image";
import { memo, useState } from "react";
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
  // if shot has failed status, dont refetch,
  // if shot has upscaleId and no upscaledImageUrl, refetch
  // if shot has no imageUrl, refetch
  const [isUpscale, setIsUpscale] = useState(!!initialShot.upscaleId);
  const enableFetch =
    initialShot.status !== "failed" &&
    ((initialShot.upscaleId && !initialShot.upscaledImageUrl) ||
      !initialShot.imageUrl);

  const makeFetch = (upscale: boolean) => {
    const params = new URLSearchParams();
    upscale && params.append("upscaled", upscale.toString());
    return axios.get<{ shot: ShotsPick }>(
      `/api/projects/${projectId}/predictions/${
        initialShot.id
      }?${params.toString()}`
    );
  };

  const { data, refetch: refetchShot } = useQuery(
    `shot-${initialShot.id}`,
    () => makeFetch(isUpscale).then((res) => res.data),
    {
      refetchInterval: (data) => (enableFetch ? 5000 : false),
      refetchOnWindowFocus: false,
      enabled: enableFetch,
      initialData: { shot: initialShot },
    }
  );

  const handleRefetchForUpscale = () => {
    refetchShot();
    setIsUpscale(true);
  };

  const shot = data!.shot;

  return (
    <Box key={shot.id} backgroundColor="gray.100" overflow="hidden">
      {shot.status === "failed" && (
        <div style={{ height: "512" }}>
          <Center height="100%" backgroundColor="gray.100">
            <Text align="center">{`Failed to Generate :(`}</Text>
          </Center>
        </div>
      )}
      {shot.imageUrl ? (
        <Zoom
          ZoomContent={(zoomContentProps) => (
            <CustomZoomContent
              // Type script being annoying, i'll figure it out later.
              {...(zoomContentProps as unknown as ZoomContentProps)}
              shot={shot}
              refetchShot={handleRefetchForUpscale}
            />
          )}
        >
          <NextImage
            alt={shot.filterName || "Stylized image of your pet"}
            src={getFullShotUrl(shot, !!shot.upscaledImageUrl)}
            width="640"
            height="640"
          />
        </Zoom>
      ) : (
        <AspectRatio ratio={1} height={"100%"}>
          <Center>
            <Spinner speed="2s" color="gray.400" />
          </Center>
        </AspectRatio>
      )}
    </Box>
  );
};

export default memo(ShotCard);
