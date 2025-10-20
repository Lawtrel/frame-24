import { Router } from 'express';
import {
  getAllMovies,
  getMovieById,
} from '../controllers/movie.controller.js';

const router = Router();

router.get('/movies', getAllMovies);
router.get('/movies/:id', getMovieById);

export default router;