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
}: {
  projectId: string;
  shots: ShotsPick[];
}) => {
  const [selectedShots, setSelectedShots] = useState(new Set<string>());

  const handleSelectShot = (shotId: string) => {
    if (selectedShots.has(shotId)) {
      selectedShots.delete(shotId);
    } else {
      selectedShots.add(shotId);
    }
    setSelectedShots(new Set(selectedShots));
  };

  return (
    <SimpleGrid columns={[3, 4]}>
      {shots.map((shot) => (
        <ShotCardSelect
          handleSelect={handleSelectShot}
          selected={selectedShots.has(shot.id)}
          key={shot.id}
          shot={shot}
          projectId={projectId}
        />
      ))}
    </SimpleGrid>
  );
};

export default ShotCardGridSelect;
