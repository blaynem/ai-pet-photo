import { Box, Text } from "@chakra-ui/layout";
import { ReactElement, FC } from "react";

declare const enum ModalState {
  LOADED = "LOADED",
  LOADING = "LOADING",
  UNLOADED = "UNLOADED",
  UNLOADING = "UNLOADING",
}

export type ZoomContentProps = {
  img: ReactElement | null;
  buttonUnzoom: ReactElement<HTMLButtonElement>;
  modalState: ModalState;
  onUnzoom: () => void;
};

type CustomZoomContentProps = {
  description: string;
} & ZoomContentProps;

const CustomZoomContent: FC<CustomZoomContentProps> = ({
  buttonUnzoom,
  modalState,
  img,
  description,
}) => {
  const showDescription = modalState === "LOADED" || modalState === "LOADING";

  return (
    <>
      {buttonUnzoom}

      <Box>
        {img}
        {showDescription && (
          <Text align={"center"} fontWeight="light" fontSize={"2em"}>
            {description}
          </Text>
        )}
      </Box>
    </>
  );
};

export default CustomZoomContent;
