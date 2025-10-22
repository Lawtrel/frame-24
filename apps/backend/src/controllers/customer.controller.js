import prisma from '../lib/prisma.js';
import bcrypt from 'bcryptjs';

export const getAllEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível buscar os funcionários.' });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { name, role, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha

    const newEmployee = await prisma.employee.create({
      data: {
        name,
        role,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível cadastrar o funcionário.' });
  }
};