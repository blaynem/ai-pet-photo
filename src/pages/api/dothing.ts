import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import db from "@/core/db";
import { Prisma } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //   const session = await getSession({ req });

  // IF YOU UNCOMMENT THIS, MAKE SURE YOU REPLACE ALL THE DATA, OTHERWISE WE GET DUPLICATES!!
  // REEE!!
  //   const newFilters: Prisma.FiltersCreateInput[]  = [
  //     {
  //       name: "Elvish",
  //       prompt:
  //         "A stylized illustration of {instanceName} {instanceClass} as an elf, fantasy concept art, intricate details, detailed armor, majestic background, art by wlop, Greg Rutkowski, digital painting, smooth lighting, looking towards the viewer.",
  //       exampleUrl:
  //         "https://replicate.delivery/pbxt/3xE7uudwFeSnDq2uzLZfeS6lawrl77dB6Zs25Lw8JVey3fPBC/out-0.png",
  //     },
  //   ];

  //   const data = await db.filters.createMany({
  //     data: newFilters,
  //   });
  res.json(`AHHH DON'T DO THIS. HACKER. STOP!`);
};

export default handler;
