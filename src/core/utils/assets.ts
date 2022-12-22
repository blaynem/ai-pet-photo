import { Project } from "@prisma/client";
import JSZip from "jszip";
import sharp from "sharp";
import smartcrop from "smartcrop-sharp";
import supabase from "../clients/supabase";

const zip = new JSZip();

const WIDTH = 512;
const HEIGHT = 512;

type RequestType = { data: Blob; error: null } | { data: null; error: any };

export const createZipFolder = async (urls: string[], project: Project) => {
  const requests: Promise<RequestType>[] = [];

  for (let i = 0; i < urls.length; i++) {
    const dataFetch = supabase.storage
      .from(process.env.NEXT_PUBLIC_UPLOAD_BUCKET_NAME!)
      .download(urls[i]);
    requests.push(dataFetch);
  }

  const responses = await Promise.all<RequestType>(requests);
  const buffersPromises = responses.map(async (response) => {
    if (!response.data) {
      return Promise.reject();
    }
    return response.data?.arrayBuffer().then((b) => {
      const buffer = Buffer.from(b);
      return smartcrop
        .crop(buffer, { width: WIDTH, height: HEIGHT })
        .then(function (result) {
          const crop = result.topCrop;
          return sharp(buffer)
            .extract({
              width: crop.width,
              height: crop.height,
              left: crop.x,
              top: crop.y,
            })
            .resize(WIDTH, HEIGHT)
            .toBuffer();
        });
    });
  });

  const buffers = await Promise.all(buffersPromises);
  const folder = zip.folder(project.id);

  buffers.forEach((buffer, i) => {
    const filename = urls[i].split("/").pop();
    folder!.file(filename!, buffer, { binary: true });
  });

  const zipContent = await zip.generateAsync({ type: "nodebuffer" });

  return zipContent;
};
