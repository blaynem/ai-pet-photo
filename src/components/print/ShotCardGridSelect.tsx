import { ShotsPick } from "@/pages/api/projects";
import { SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";

import ShotCardSelect from "./ShotCardSelect";

/**
 * Grid for displaying a list of shots cards.
 */
const ShotCardGridSelect = ({
  projectId,
  shots,
  selectedShot,
  setSelectedShot,
}: {
  projectId: string;
  shots: ShotsPick[];
  selectedShot: ShotsPick;
  setSelectedShot: (shot: ShotsPick) => void;
}) => {
  return (
    <SimpleGrid columns={[3, 4]}>
      {shots.map((shot) => (
        <ShotCardSelect
          handleSelect={setSelectedShot}
          selected={shot.id === selectedShot.id}
          key={shot.id}
          shot={shot}
          projectId={projectId}
        />
      ))}
    </SimpleGrid>
  );
};

export default ShotCardGridSelect;
