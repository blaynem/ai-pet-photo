import React from "react";
import AvatarThumbnail from "./AvatarThumbnail";

const AvatarsPlaceholder = ({ imageUrls }: { imageUrls: string[] }) => {
  return (
    <>
      <AvatarThumbnail
        src={imageUrls[0]}
        transform="translateZ(1px) rotate(10deg)"
      />
      <AvatarThumbnail
        src={imageUrls[1]}
        left="80px"
        top="40px"
        transform="translateZ(1px) rotate(-4deg)"
        position="absolute"
      />
      <AvatarThumbnail
        src={imageUrls[2]}
        transform="translateZ(1px) rotate(-5deg)"
      />
    </>
  );
};

export default AvatarsPlaceholder;
