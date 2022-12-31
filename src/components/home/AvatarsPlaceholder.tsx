import React from "react";
import AvatarThumbnail from "./AvatarThumbnail";

const AvatarsPlaceholder = () => {
  return (
    <>
      <AvatarThumbnail
        src="/teddyGrass.jpg"
        transform="translateZ(1px) rotate(10deg)"
      />
      <AvatarThumbnail
        src="/tedOnABed.jpeg"
        left="80px"
        top="40px"
        transform="translateZ(1px) rotate(-4deg)"
        position="absolute"
      />
      <AvatarThumbnail
        src="/teddyLog.jpg"
        transform="translateZ(1px) rotate(-5deg)"
      />
    </>
  );
};

export default AvatarsPlaceholder;
