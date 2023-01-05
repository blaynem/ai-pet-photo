import Head from "next/head";
import React from "react";

const description =
  "Generate amazing AI pictures of your pet with just a few clicks!";
const title = "PetPics - Create awesome AI art of your pets";
const image = "/PawPrint.png";
const twitterCardImage = "https://www.petpics.ai/card-image.jpg";

const DefaultHead = () => {
  return (
    <Head>
      <link
        rel="shortcut icon"
        media="(prefers-color-scheme: dark)"
        href="/PawPrint.png"
      />
      <link
        rel="icon"
        media="(prefers-color-scheme: light)"
        href="/PawPrintLightMode.png"
      />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta itemProp="image" content={image} />
      <meta property="og:logo" content={image}></meta>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@PetPics_ai" />
      <meta name="twitter:creator" content="@PetPics_ai" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twitterCardImage} />
    </Head>
  );
};

export default DefaultHead;
