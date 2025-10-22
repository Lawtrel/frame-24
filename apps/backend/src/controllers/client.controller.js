import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

// Lista todos os clientes
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.client.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar os clientes.' });
  }
};

// Cria um novo cliente
export const createCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newCustomer = await prisma.client.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível cadastrar o cliente.' });
  }
};