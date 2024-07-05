const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const createToken = (params = {}) => {
  return jwt.sign(params, process.env.JWT_HASH, {
    expiresIn: "1d",
  });
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (await prisma.user.findUnique({ where: { email } }))
    return res.status(400).json({ error: "User already exists" });
  const cryptedPass = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: cryptedPass,
    },
  });

  user.password = undefined;

  res.status(201).json({
    user,
    token: createToken({ id: user.id }),
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(400).json({ error: "User not found" });
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ error: "Password invalid" });

  user.password = undefined;

  res.json({
    user,
    token: createToken({ id: user.id }),
  });
};

module.exports = { registerUser, loginUser };
