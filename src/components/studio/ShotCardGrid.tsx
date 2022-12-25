import { SimpleGrid } from "@chakra-ui/react";
import { Shot } from "@prisma/client";
import ShotCard from "../projects/ShotCard";

/**
 * Grid for displaying a list of shots cards.
 */
const ShotCardGrid = ({
  projectId,
  shots,
}: {
  projectId: string;
  shots: Omit<Shot, "prompt">[];
}) => (
  <SimpleGrid columns={[3, 4]}>
    {shots.map((shot) => (
      <ShotCard key={shot.id} shot={shot} projectId={projectId} />
    ))}
  </SimpleGrid>
);

export default ShotCardGrid;
