import logger from '../utils/logger.js';
import {MovieService} from "../services/movie.service.js";


export const createMovie = async (req, res) => {
    try {
        const { original_title, duration_minutes, distributor_id } = req.body;

        if (!original_title || !duration_minutes || !distributor_id) {
            return res.status(400).json({
                error: 'Campos obrigatórios: original_title, duration_minutes, distributor_id'
            });
        }

        const newMovie = await MovieService.create(req.body, req.companyId);

        logger.info('Filme criado com sucesso.', { movieId: newMovie.id, title: newMovie.original_title, companyId: req.companyId });
        res.status(201).json({ success: true, data: newMovie });

    } catch (error) {
        logger.error('Erro no Controller ao criar filme.', { message: error.message, companyId: req.companyId });
        res.status(500).json({ error: error.message || 'Não foi possível cadastrar o filme.' });
    }
};

export const getAllMovies = async (req, res) => {
    try {
        const companyId = req.companyId;

        const movies = await MovieService.getAll(companyId, req.query);

        res.json({
            success: true,
            data: movies,
            count: movies.length
        });

    } catch (error) {
        logger.error('Erro no Controller ao buscar filmes.', {
            message: error.message,
            companyId: req.companyId
        });
        res.status(500).json({
            error: 'Não foi possível buscar os filmes.'
        });
    }
};

export const getMovieById = async (req, res) => {
    try {
        const movieId = req.params.id;
        const companyId = req.companyId;

        const movie = await MovieService.getById(movieId, companyId);

        res.json({
            success: true,
            data: movie
        });

    } catch (error) {
        logger.error('Erro no Controller ao buscar filme.', {
            message: error.message,
            movieId: req.params.id,
            companyId: req.companyId
        });

        if (error.message.includes('não encontrado')) {
            return res.status(404).json({ error: error.message });
        }

        res.status(500).json({
            error: 'Não foi possível buscar o filme.'
        });
    }
};

export const updateMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const companyId = req.companyId;

        const updatedMovie = await MovieService.update(movieId, companyId, req.body);

        logger.info('Filme atualizado com sucesso.', { movieId: updatedMovie.id, companyId });
        res.json({ success: true, data: updatedMovie });

    } catch (error) {
        if (error.message.includes('não disponível')) {
            return res.status(404).json({ error: error.message });
        }
        logger.error('Erro no Controller ao atualizar filme.', { message: error.message, movieId: req.params.id, companyId: req.companyId });
        res.status(500).json({ error: 'Não foi possível atualizar o filme.' });
    }
};

export const deleteMovie = async (req, res) => {
    try {
        const movieId = req.params.id;
        const companyId = req.companyId;

        await MovieService.delete(movieId, companyId);

        logger.info('Filme desativado para o tenant.', { movieId, companyId });
        res.status(204).send();

    } catch (error) {
        if (error.message.includes('não disponível')) {
            return res.status(404).json({ error: error.message });
        }
        logger.error('Erro no Controller ao deletar filme.', { message: error.message, movieId: req.params.id, companyId: req.companyId });
        res.status(500).json({ error: 'Não foi possível deletar o filme.' });
    }
};