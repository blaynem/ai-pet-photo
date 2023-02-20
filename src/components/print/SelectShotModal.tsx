import projects, { ProjectWithShots, ShotsPick } from "@/pages/api/projects";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Accordion,
} from "@chakra-ui/react";
import { Project } from "@prisma/client";
import React, { Component, FunctionComponent } from "react";
import ProjectAccordion from "../projects/ProjectAccordion";

interface SelectShotModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectWithShots[];
  refetchProjects: () => void;
  selectedShot: ShotsPick;
  setSelectedShot: (shot: ShotsPick) => void;
}

const SelectShotModal: FunctionComponent<SelectShotModalProps> = ({
  isOpen,
  onClose,
  projects,
  refetchProjects,
  selectedShot,
  setSelectedShot,
}) => {
  return (
    <Modal size={"4xl"} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Image</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Accordion width="100%" allowMultiple>
            {projects?.map((project) => (
              <ProjectAccordion
                handleRefreshProjects={refetchProjects}
                project={project}
                selectedShot={selectedShot}
                setSelectedShot={setSelectedShot}
              />
            ))}
          </Accordion>
        </ModalBody>

        <ModalFooter>
          <Button
            variant={"ghost"}
            mr={3}
            onClick={() => {
              setSelectedShot({
                createdAt: new Date(),
                id: "",
                projectId: "",
                filterId: "",
                filterName: "",
                imageUrl: "",
                status: "",
                upscaledImageUrl: "",
                upscaleId: "",
                upscaleStatus: "",
              });
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={selectedShot.id === "" ? true : false}
            variant="brand"
            mr={3}
            onClick={onClose}
          >
            Select
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectShotModal;
