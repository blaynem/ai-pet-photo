import { getFullShotUrl } from "@/core/utils/bucketHelpers";
import { ShotsPick } from "@/pages/api/projects";
import {
  AspectRatio,
  Badge,
  Box,
  Center,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import NextImage from "next/image";
import { memo, useState } from "react";
import { useQuery } from "react-query";

/**
 * Determines if we should attempt to refetch the images while they're processing.
 *
 * @param shot
 * @returns
 */
const shouldRefetchImages = (shot?: ShotsPick) => {
  if (!shot) {
    return false;
  }
  // If we have both image urls, we don't need to get them
  if (shot.imageUrl && shot.upscaledImageUrl) {
    return false;
  }
  // For standard shots that are loading
  if (!shot.imageUrl) {
    return shot.status !== "failed" && shot.status !== "succeeded";
  }
  // If we're trying to load upscale shots
  if (shot.upscaleId && !shot.upscaledImageUrl) {
    return (
      shot.upscaleStatus !== "failed" && shot.upscaleStatus !== "succeeded"
    );
  }
  return false;
};

const DisplayShot = ({
  shot: initialShot,
  projectId,
}: {
  shot: ShotsPick;
  projectId: string;
}) => {
  const [fetchUpscaledImage, setFetchUpscaledImage] = useState(
    !!initialShot.upscaleId
  );

  const { data } = useQuery(
    [`shot-${initialShot.id}`],
    () =>
      axios
        .get<{ shot: ShotsPick }>(
          `/api/projects/${projectId}/predictions/${initialShot.id}?upscaled=${fetchUpscaledImage}`
        )
        .then((res) => res.data),
    {
      refetchInterval: (data) =>
        shouldRefetchImages(data?.shot) ? 5000 : false,
      refetchOnWindowFocus: false,
      refetchOnMount: false, // We already have image data on mount
      initialData: { shot: initialShot },
      enabled: projectId !== "" ? true : false,
    }
  );

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
        <>
          {shot.upscaleId && (
            <Badge
              ml={1}
              mt={1}
              colorScheme="blue"
              border="1px solid"
              position={"absolute"}
            >
              HD
            </Badge>
          )}
          <NextImage
            alt={shot.filterName || "Stylized image of your pet"}
            src={getFullShotUrl(shot, shot.upscaledImageUrl ? true : false)}
            width={200}
            height={200}
          />
        </>
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

export default memo(DisplayShot);
