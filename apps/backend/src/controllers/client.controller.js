import { PrismaClient } from '../../generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const getAllClients = async (req, res) => {
  try {
    const clients = await prisma.client.findMany();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar os clientes.' });
  }
};

export const createClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível cadastrar o cliente.' });
  }
};