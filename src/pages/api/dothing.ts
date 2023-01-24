import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import db from "@/core/db";
import { Prisma } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //   const session = await getSession({ req });

  // IF YOU UNCOMMENT THIS, MAKE SURE YOU REPLACE ALL THE DATA, OTHERWISE WE GET DUPLICATES!!
  // REEE!!
  // const newFilters: Prisma.FiltersCreateInput[] = [
  //   {
  //     name: "Cyberspace",
  //     prompt:
  //       "{instanceName} {instanceClass}  as lonely cybernetic astronaut in jupiter, epic scene, by victo ngai, kilian eng vibrant colours, dynamic lighting, digital art, winning award masterpiece, fantastically beautiful, illustration, aesthetically inspired by beksinski and dan mumford, trending on artstation, art by greg rutkowski, 8 k",
  //     exampleUrl: "cyberspace_ted.jpg",
  //     exampleUrl_cat: "cyberspace_vince.jpg",
  //   },
  // ];

  // const data = await db.filters.createMany({
  //   data: newFilters,
  // });
  res.json(`AHHH DON'T DO THIS. HACKER. STOP!`);
};

export default handler;
