import prisma from '../lib/prisma.js';
import logger from '../utils/logger.js';


export const createMovie = async (req, res) => {
    try {
        const companyId = BigInt(req.companyId);
        const { original_title, duration_minutes, distributor_id, age_rating, category_id, ...data } = req.body;

        if (!original_title || !duration_minutes || !distributor_id) {
            return res.status(400).json({
                error: 'Campos obrigatórios: original_title, duration_minutes, distributor_id'
            });
        }

        const newMovie = await prisma.$transaction(async (tx) => {
            const movie = await tx.movies.create({
                data: {
                    ...data,
                    original_title,
                    duration_minutes,
                    distributor_id: BigInt(distributor_id),
                    age_rating: age_rating ? BigInt(age_rating) : null,
                    category_id: category_id ? BigInt(category_id) : null,
                    active: true
                },
                include: { suppliers: true, age_ratings: true, movie_categories: true }
            });

            await tx.company_movies.create({
                data: {
                    company_id: companyId,
                    movie_id: movie.id,
                    is_active_for_tenant: true
                }
            });

            return movie;
        });

        logger.info('Filme criado com sucesso (Transaction).', { movieId: newMovie.id, title: newMovie.original_title, companyId: req.companyId });
        res.status(201).json({ success: true, data: newMovie });

    } catch (error) {
        // ... (Log e tratamento de erro)
        res.status(500).json({ error: 'Não foi possível cadastrar o filme.' });
    }
};

export const getAllMovies = async (req, res) => {
    try {
        const companyId = BigInt(req.companyId);
        const { active, category_id, national, search } = req.query;

        const where = {
            company_movies: {
                some: {
                    company_id: companyId,
                    is_active_for_tenant: true
                }
            }
        };

        if (active !== undefined) {
            where.active = active === 'true';
        }

        if (category_id) {
            where.category_id = BigInt(category_id);
        }

        if (national !== undefined) {
            where.national = national === 'true';
        }

        if (search) {
            where.OR = [
                { original_title: { contains: search } },
                { brazil_title: { contains: search } }
            ];
        }

        const movies = await prisma.movies.findMany({
            where,
            include: {
                suppliers: true,
                age_ratings: true,
                movie_categories: true,
                company_movies: {
                    where: { company_id: companyId }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        res.json({
            success: true,
            data: movies,
            count: movies.length
        });

    } catch (error) {
        logger.error('Erro ao buscar filmes.', {
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
        const movieId = BigInt(req.params.id);
        const companyId = BigInt(req.companyId);

        const movie = await prisma.movies.findFirst({
            where: {
                id: movieId,
                company_movies: {
                    some: {
                        company_id: companyId,
                        is_active_for_tenant: true
                    }
                }
            },
            include: {
                suppliers: true,
                age_ratings: true,
                movie_categories: true,
                movie_cast: {
                    include: {
                        cast_types: true
                    },
                    orderBy: { credit_order: 'asc' }
                },
                movie_media: {
                    where: { active: true },
                    include: {
                        media_types: true
                    },
                    orderBy: { display_order: 'asc' }
                },
                company_movies: {
                    where: { company_id: companyId }
                }
            }
        });

        if (!movie) {
            return res.status(404).json({
                error: 'Filme não encontrado ou não disponível para sua empresa.'
            });
        }

        res.json({
            success: true,
            data: movie
        });

    } catch (error) {
        logger.error('Erro ao buscar filme.', {
            message: error.message,
            movieId: req.params.id,
            companyId: req.companyId
        });

        res.status(500).json({
            error: 'Não foi possível buscar o filme.'
        });
    }
};

export const updateMovie = async (req, res) => {
    try {
        const movieId = BigInt(req.params.id);
        const companyId = BigInt(req.companyId);
        const data = req.body;

        const updatedMovie = await prisma.$transaction(async (tx) => {
            const companyMovie = await tx.company_movies.findFirst({
                where: { movie_id: movieId, company_id: companyId }
            });

            if (!companyMovie) {
                throw new Error('Filme não encontrado ou não disponível para sua empresa.');
            }

            return await tx.movies.update({
                where: { id: movieId },
                data: {
                    ...data,
                    distributor_id: data.distributor_id ? BigInt(data.distributor_id) : undefined,
                    age_rating: data.age_rating ? BigInt(data.age_rating) : undefined,
                    category_id: data.category_id ? BigInt(data.category_id) : undefined
                },
                include: { suppliers: true, age_ratings: true, movie_categories: true }
            });
        });

        logger.info('Filme atualizado com sucesso (Transaction).', { movieId: updatedMovie.id, companyId: req.companyId });
        res.json({ success: true, data: updatedMovie });

    } catch (error) {
        if (error.message.includes('Filme não encontrado')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Não foi possível atualizar o filme.' });
    }
};

export const deleteMovie = async (req, res) => {
    try {
        const movieId = BigInt(req.params.id);
        const companyId = BigInt(req.companyId);

        await prisma.$transaction(async (tx) => {
            const companyMovie = await tx.company_movies.findFirst({
                where: { movie_id: movieId, company_id: companyId }
            });

            if (!companyMovie) {
                throw new Error('Filme não encontrado ou não disponível para sua empresa.');
            }

            await tx.company_movies.update({
                where: { id: companyMovie.id },
                data: { is_active_for_tenant: false }
            });
        });

        logger.info('Filme desativado para o tenant (Transaction).', { movieId, companyId: req.companyId });
        res.status(204).send();

    } catch (error) {
        if (error.message.includes('Filme não encontrado')) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Não foi possível deletar o filme.' });
    }
};