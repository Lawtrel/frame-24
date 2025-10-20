import { PrismaClient } from '../../generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Lista todos os clientes
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.customers.findMany({
      where: { active: true },
    });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar os clientes.' });
  }
};

// Cria um novo cliente
// Note que não há campo de senha na tabela 'customers',
// a autenticação provavelmente é feita na tabela 'system_users' para funcionários.
// Esta rota cadastra um cliente para fins de marketing e histórico.
export const createCustomer = async (req, res) => {
  try {
    const newCustomer = await prisma.customers.create({
      data: req.body,
    });
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível cadastrar o cliente.' });
  }
};