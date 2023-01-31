import supabase from "@/core/clients/supabase";
import { resizeImage } from "@/core/utils/upload";
import { CreateProjectBody } from "@/pages/api/projects";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  Highlight,
  Icon,
  Image,
  Input,
  Select,
  SimpleGrid,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { MdCheckCircle, MdCloud } from "react-icons/md";
import { RiCloseCircleFill } from "react-icons/ri";
import { useMutation } from "react-query";
import AvatarsPlaceholder from "../home/AvatarsPlaceholder";
import ErrorMessages, { ErrorMessageHeader } from "./ErrorMessages";

type TUploadState = "not_uploaded" | "uploading" | "uploaded";

const MAX_FILES = 15;

type SubjectClassOptions = {
  value: string;
  label: string;
  /**
   * Qualifier for the subject class, this will be used to generate
   * the instanceName for training.
   */
  qualifier: string;
};

const subjectClassOptions: SubjectClassOptions[] = [
  { value: "dog", label: "Dog", qualifier: "pup" },
  { value: "cat", label: "Cat", qualifier: "kitty" },
];

const Uploader = ({ handleOnAdd }: { handleOnAdd: () => void }) => {
  const { data: sessionData } = useSession();
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const [uploadState, setUploadState] = useState<TUploadState>("not_uploaded");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [urls, setUrls] = useState<string[]>([]);
  const [projectName, setProjectName] = useState<string>("");
  const [instanceClass, setInstanceClass] = useState<SubjectClassOptions>(
    subjectClassOptions[0]
  );
  const toast = useToast();

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    maxSize: 10000000, // 10mo
    onDropRejected: (events) => {
      setErrorMessages([]);
      const messages: { [key: string]: string } = {};

      events.forEach((event) => {
        event.errors.forEach((error) => {
          messages[error.code] = error.message;
        });
      });

      setErrorMessages(Object.keys(messages).map((id) => messages[id]));
    },
    onDrop: (acceptedFiles) => {
      if (files.length + acceptedFiles.length > MAX_FILES) {
        toast({
          title: `You can't upload more than ${MAX_FILES} images`,
          duration: 3000,
          isClosable: true,
          position: "top-right",
          status: "error",
        });
      } else {
        setErrorMessages([]);
        setFiles([
          ...files,
          ...acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          ),
        ]);
      }
    },
  });

  // Remove file from the currently uploaded list
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    const filesToUpload = Array.from(files);
    setUploadState("uploading");

    try {
      // If there are less than 3 photos, throw an error
      if (filesToUpload.length < 3) {
        throw new Error("You must upload at least 3 images");
      }

      for (let index = 0; index < filesToUpload.length; index++) {
        const file = await resizeImage(filesToUpload[index]);

        const { data, error } = await supabase.storage
          .from(process.env.NEXT_PUBLIC_UPLOAD_BUCKET_NAME!)
          .upload(`${sessionData?.user.id}/${file.name}`, file);

        if (error) {
          throw new Error(error.message);
        }

        setUrls((current) => [...current, data?.path!]);
      }

      setUploadState("uploaded");
    } catch (error: any) {
      console.error(error);
      setUploadState("not_uploaded");
      setErrorMessages([error?.message || "An error occured"]);
    }
  };

  const { mutate: createProjectMutation, isLoading } = useMutation(
    "create-project",
    (body: CreateProjectBody) => axios.post("/api/projects", body),
    {
      onSuccess: () => {
        handleOnAdd();

        // Reset
        setFiles([]);
        setUrls([]);
        setProjectName("");
        setInstanceClass(subjectClassOptions[0]);
        setUploadState("not_uploaded");

        toast({
          title: "Model created!",
          duration: 3000,
          isClosable: true,
          position: "top-right",
          status: "success",
        });
      },
    }
  );

  const createProject = () => {
    if (projectName.length < 1) {
      setErrorMessages(["Model name must be at least 1 character long"]);
      return;
    }

    if (!projectName || !instanceClass) return;

    if (errorMessages.length > 0) {
      return;
    }

    // We lowercase the project name and remove all non-alphabetical characters
    const parsedProjectName = projectName.toLowerCase().replace(/[^a-z]/g, "");
    const nameEnding = "pet";

    const body: CreateProjectBody = {
      urls,
      // We create a unique name by taking the first 4 letters of the project name
      // and adding the instance class qualifier to the end.
      // Note: This does not have to be unique, as all training data will be separated.
      instanceName: `${parsedProjectName.slice(0, 4)}${nameEnding}${
        instanceClass.qualifier
      }`,
      instanceClass: instanceClass.value,
      name: projectName,
    };

    createProjectMutation(body);
  };

  const onProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length >= 1) {
      setErrorMessages([]);
    }
    setProjectName(e.currentTarget.value);
  };

  return (
    <Box>
      {uploadState === "not_uploaded" && (
        <Center
          _hover={{
            bg: "whiteAlpha.800",
          }}
          transition="all 0.2s"
          backgroundColor="whiteAlpha.500"
          cursor="pointer"
          borderRadius="xl"
          border="1px dashed gray"
          p={10}
          flexDirection="column"
          {...getRootProps({ className: "dropzone" })}
        >
          <input {...getInputProps()} />
          <Box mb={4} position="relative">
            <AvatarsPlaceholder
              imageUrls={[
                "/pics/teddyGrass.jpg",
                "/pics/tedOnABed.jpg",
                "/pics/teddyLog.jpg",
              ]}
            />
          </Box>
          <VStack textAlign="center" spacing={1}>
            <Box fontWeight="bold" fontSize="2xl">
              Drag and drop or click to upload
            </Box>
            <Box fontWeight="bold" fontSize="lg">
              <Highlight query="one" styles={{ bg: "brand.500", px: 1 }}>
                Add 3-15 images of one pet
              </Highlight>
            </Box>

            {errorMessages?.length !== 0 && (
              <ErrorMessages
                header={ErrorMessageHeader.UPLOADER}
                messages={errorMessages}
                max_amt={MAX_FILES}
              />
            )}
          </VStack>
        </Center>
      )}

      <Flex pt={3} flexWrap="wrap">
        {files.map((file, index) => (
          <Box
            m={3}
            width="7rem"
            height="7rem"
            position="relative"
            key={file.name}
          >
            <Center top={-2} right={-2} position="absolute">
              {uploadState == "uploading" && !urls[index] && (
                <Spinner
                  size="lg"
                  thickness="8px"
                  speed="1s"
                  color="brand.500"
                />
              )}
              {urls[index] && (
                <Icon
                  borderRadius="full"
                  backgroundColor="white"
                  color="green.400"
                  as={MdCheckCircle}
                  fontSize="2rem"
                />
              )}
              {uploadState === "not_uploaded" && (
                <Box
                  onClick={() => handleRemoveFile(index)}
                  position={"absolute"}
                  top={1}
                  right={1}
                  _hover={{
                    cursor: "pointer",
                  }}
                >
                  <RiCloseCircleFill color="red" stroke="black" />
                </Box>
              )}
            </Center>
            <Box>
              <Image
                objectFit="cover"
                borderRadius="xl"
                border="4px solid white"
                shadow="xl"
                alt={file.name}
                width="7rem"
                height="7rem"
                src={file.preview}
                onLoad={() => {
                  URL.revokeObjectURL(file.preview);
                }}
              />
            </Box>
          </Box>
        ))}
      </Flex>

      {files.length > 0 && uploadState !== "uploaded" && (
        <Box mb={10} textAlign="center">
          <Button
            isLoading={uploadState === "uploading"}
            rightIcon={<MdCloud />}
            size="lg"
            onClick={handleUpload}
            variant="brand"
          >
            Upload {files.length} image{files.length > 1 && "s"}
          </Button>
        </Box>
      )}

      {uploadState === "uploaded" && (
        <SimpleGrid
          gap={4}
          columns={{ base: 1, md: 3 }}
          as="form"
          onSubmit={(e) => {
            e.preventDefault();
            createProject();
          }}
          mt={4}
          alignItems="flex-start"
        >
          <FormControl>
            <Input
              isRequired
              backgroundColor="white"
              placeholder="Teddy"
              value={projectName}
              onChange={onProjectNameChange}
            />
            <FormHelperText color="blackAlpha.600">Model Name</FormHelperText>
          </FormControl>
          <FormControl>
            <Select
              value={instanceClass.value}
              onChange={(e) => {
                const selectedClass = subjectClassOptions.find(
                  (option) => option.value === e.currentTarget.value
                );
                setInstanceClass(selectedClass!);
              }}
              backgroundColor="white"
            >
              {subjectClassOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
            <FormHelperText color="blackAlpha.600">
              Type of the subject
            </FormHelperText>
          </FormControl>
          <Box>
            <Button
              disabled={!Boolean(projectName)}
              isLoading={isLoading}
              variant="brand"
              rightIcon={<MdCheckCircle />}
              onClick={() => {
                createProject();
              }}
            >
              Create your Model
            </Button>
          </Box>
        </SimpleGrid>
      )}
      {errorMessages?.length !== 0 && (
        <ErrorMessages
          header="Please fix the following errors:"
          messages={errorMessages}
          max_amt={MAX_FILES}
        />
      )}
    </Box>
  );
};

export default Uploader;
