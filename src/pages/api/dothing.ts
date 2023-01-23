import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import db from "@/core/db";
import { Prisma } from "@prisma/client";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //   const session = await getSession({ req });

  // IF YOU UNCOMMENT THIS, MAKE SURE YOU REPLACE ALL THE DATA, OTHERWISE WE GET DUPLICATES!!
  // REEE!!
  const newFilters: Prisma.FiltersCreateInput[] = [
    // {
    //   name: "King",
    //   prompt:
    //     "{instanceName} {instanceClass} king with a crown, royal gold armor, crown, king helmet, royal cape, holding golden cross on chest, wearing golden royal crown, rococo, by Albert Aublet, Krenz Cushart, WLOP, Sakimichan, high fantasy, purple aethetic, matte painting",
    //   exampleUrl: "king_ted.jpg",
    //   exampleUrl_cat: "king_vincent.jpg",
    // },
  ];

  // const data = await db.filters.createMany({
  //   data: newFilters,
  // });
  res.json(`AHHH DON'T DO THIS. HACKER. STOP!`);
};

export default handler;
