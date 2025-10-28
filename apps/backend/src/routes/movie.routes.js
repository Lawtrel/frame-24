import { Router } from 'express';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorization.js';
import {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
} from '../controllers/movie.controller.js';

const router = Router();




router.get('/movies',
    authenticate,
    authorize('movie', 'read'),
    getAllMovies
);


router.get('/movies/:id',
    authorize('movie', 'read'),
    getMovieById
);


router.post('/movies',
    authenticate,
    authorize('movie', 'create'),
    createMovie
);

router.put('/movies/:id',
    authenticate,
    authorize('movie', 'update'),
    updateMovie
);


router.delete('/movies/:id',
    authenticate,
    authorize('movie', 'delete'),
    deleteMovie
);

export default router;