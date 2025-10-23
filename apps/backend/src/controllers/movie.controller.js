import prisma from '../lib/prisma.js';

// Criar
export const createMovie = async (req, res) => {
  try {
    const newMovie = await prisma.movies.create({ data: req.body });
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível cadastrar o filme.' });
  }
};

// Listar todos
export const getAllMovies = async (req, res) => {
  try {
    const movies = await prisma.movies.findMany();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível buscar os filmes.' });
  }
};

// Buscar por ID
export const getMovieById = async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await prisma.movies.findUnique({
      where: { id: parseInt(id) },
    });
    if (!movie) {
      return res.status(404).json({ error: 'Filme não encontrado.' });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Não foi possível buscar o filme.' });
  }
};

// Atualizar
export const updateMovie = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedMovie = await prisma.movies.update({
      where: { id: parseInt(id) },
      data: req.body,
    });
    res.json(updatedMovie);
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível atualizar o filme.' });
  }
};

// Deletar
export const deleteMovie = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.movies.delete({ where: { id: parseInt(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Não foi possível deletar o filme.' });
  }
};