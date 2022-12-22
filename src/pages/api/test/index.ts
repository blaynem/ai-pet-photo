const handler = async (req: any, res: any) => {
  console.log(req.headers);
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({ text: "REEES" });
};

export default handler;
