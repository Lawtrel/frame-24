import prisma from '../lib/prisma.js';
import logger from '../utils/logger.js';


const validateTenantReferences = async (data, companyIdBigInt, tx) => {

    if (data.distributor_id) {
        const distributorIdBigInt = BigInt(data.distributor_id);
        const distributor = await tx.suppliers.findFirst({
            where: { id: distributorIdBigInt, company_id: companyIdBigInt, is_film_distributor: true }
        });
        if (!distributor) {
            throw new Error('Distribuidor não encontrado, inativo ou não vinculado à sua empresa.');
        }
        data.distributor_id = distributorIdBigInt;
    }

    if (data.age_rating) {
        const ageRatingIdBigInt = BigInt(data.age_rating);
        const ageRating = await tx.age_ratings.findFirst({
            where: { id: ageRatingIdBigInt, company_id: companyIdBigInt }
        });
        if (!ageRating) {
            throw new Error('Classificação indicativa não encontrada ou não vinculada à sua empresa.');
        }
        data.age_rating = ageRatingIdBigInt;
    }

    if (data.category_id) {
        const categoryIdBigInt = BigInt(data.category_id);
        const category = await tx.movie_categories.findFirst({
            where: { id: categoryIdBigInt, company_id: companyIdBigInt }
        });
        if (!category) {
            throw new Error('Categoria de filme não encontrada ou não vinculada à sua empresa.');
        }
        data.category_id = categoryIdBigInt;
    }
};


export const MovieService = {
    create: async (data, companyId) => {
        const companyIdBigInt = BigInt(companyId);

        try {
            return await prisma.$transaction(async (tx) => {

                await validateTenantReferences(data, companyIdBigInt, tx);

                const movieData = {
                    ...data,
                    active: true,
                };

                const movie = await tx.movies.create({
                    data: movieData,
                    include: { suppliers: true, age_ratings: true, movie_categories: true }
                });

                await tx.company_movies.create({
                    data: {
                        company_id: companyIdBigInt,
                        movie_id: movie.id,
                        is_active_for_tenant: true
                    }
                });

                return movie;
            });
        } catch (error) {
            logger.error('Erro de transação no MovieService.create', { companyId: companyId, error: error.message });
            throw error;
        }
    },


    getAll: async (companyId, query) => {
        const companyIdBigInt = BigInt(companyId);
        const {active, category_id, national, search} = query;

        const where = {
            company_movies: {
                some: {
                    company_id: companyIdBigInt,
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
                {original_title: {contains: search}},
                {brazil_title: {contains: search}}
            ];
        }

        const movies = await prisma.movies.findMany({
            where,
            include: {
                suppliers: true,
                age_ratings: true,
                movie_categories: true,
                company_movies: {
                    where: {company_id: companyIdBigInt}
                }
            },
            orderBy: {created_at: 'desc'}
        });

        return movies;
    },

    getById: async (movieId, companyId) => {
        const movieIdBigInt = BigInt(movieId);
        const companyIdBigInt = BigInt(companyId);

        const movie = await prisma.movies.findFirst({
            where: {
                id: movieIdBigInt,
                company_movies: {
                    some: {
                        company_id: companyIdBigInt,
                        is_active_for_tenant: true
                    }
                }
            },
            include: {
                suppliers: true,
                age_ratings: true,
                movie_categories: true,
                movie_cast: {
                    include: {cast_types: true},
                    orderBy: {credit_order: 'asc'}
                },
                movie_media: {
                    where: {active: true},
                    include: {media_types: true},
                    orderBy: {display_order: 'asc'}
                },
                company_movies: {
                    where: {company_id: companyIdBigInt}
                }
            }
        });

        if (!movie) {
            throw new Error('Filme não encontrado ou não disponível para sua empresa.');
        }

        return movie;
    },


    update: async (movieId, companyId, data) => {
        const movieIdBigInt = BigInt(movieId);
        const companyIdBigInt = BigInt(companyId);

        return await prisma.$transaction(async (tx) => {

            const companyMovie = await tx.company_movies.findFirst({
                where: { movie_id: movieIdBigInt, company_id: companyIdBigInt }
            });

            if (!companyMovie) {
                throw new Error('Filme não encontrado ou não disponível para sua empresa.');
            }

            await validateTenantReferences(data, companyIdBigInt, tx);

            return await tx.movies.update({
                where: { id: movieIdBigInt },
                data: data,
                include: { suppliers: true, age_ratings: true, movie_categories: true }
            });
        });
    },

    delete: async (movieId, companyId) => {
        const movieIdBigInt = BigInt(movieId);
        const companyIdBigInt = BigInt(companyId);

        await prisma.$transaction(async (tx) => {
            const companyMovie = await tx.company_movies.findFirst({
                where: {movie_id: movieIdBigInt, company_id: companyIdBigInt}
            });

            if (!companyMovie) {
                throw new Error('Filme não encontrado ou não disponível para sua empresa.');
            }

            await tx.company_movies.update({
                where: {id: companyMovie.id},
                data: {is_active_for_tenant: false}
            });
        });
    }
}