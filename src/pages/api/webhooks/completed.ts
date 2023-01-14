import db from "@/core/db";
import { Project, Shot } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import nodemailer from "nodemailer";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.query.secret || req.query.secret !== process.env.WEBHOOK_SECRET!) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!req.query.projectId) {
      return res.status(400).json({ message: "No projectId" });
    }

    const projectId = req.query.projectId as string;
    const project = await db.project.findFirstOrThrow({
      where: {
        id: projectId,
      },
      select: {
        name: true,
        userId: true,
      },
    });

    const user = await db.user.findFirstOrThrow({
      where: {
        id: project.userId!,
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user.email) {
      return res.status(400).json({ message: "No email" });
    }
    if (!project.name) {
      return res.status(400).json({ message: "No project name" });
    }

    let transporter = nodemailer.createTransport(process.env.EMAIL_SERVER);

    transporter.sendMail({
      from: '"PetPics ai" <general@petpics.ai>',
      to: user.email!,
      subject: `${project.name} is ready!`,
      text: "Your model is ready to generate! 🎉 🎉 🎉",
      html: `<html>
      <head>
      <style>
      html{
        width: 100%;
      }
      body {
        width: 100%;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.4;
        color: #333;
      }
      .container {
        width: 100%;
        max-width: 680px;
        margin: 0 auto;
        padding:15px;
      }
      .header {
        padding: 15px;
        background-color: #fff;
        border-bottom: 1px solid #e5e5e5;
      }
      a {
        background-color: #337ab7;
        border-color: #2e6da4;
        border-radius: 4px;
        border: 1px solid transparent;
        color: #fff !important;
        display: inline-block;
        font-size: 14px;
        font-weight: 700;
        line-height: 1.4;
        margin-bottom: 5px;
        padding: 6px 12px;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
        text-decoration: none;
      }
      .content {
        padding: 15px;
        background-color: #fff;
        border-bottom: 1px solid #e5e5e5;
      }
      </style>
      </head>
      <body>
      <div class="container">
      <div class="header">
      <h1>Your model, "${project.name}" is ready! 🎉 </h1>
      </div>
      <div class="content">
      <p>Hi there!</p>
      <p>Visit PetPics.ai to generate images with your model</p>
      <a href="https://petpics.ai">Visit PetPics Now</a>
      </div>
      </div>
      </body>
      </html>`,
    });

    res.status(200).json({ message: "ok" });
  } catch (e) {
    res.status(500).json({ message: "error" });
  }
};

export default handler;
