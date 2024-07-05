const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  const id = req.userId;

  if (!id) return res.status(400).json({ error: "Id dont exists" });

  const user = await prisma.user.findUnique({ where: { id } });

  return res.status(200).json(user);
});

module.exports = (app) => app.use("/users", router);
