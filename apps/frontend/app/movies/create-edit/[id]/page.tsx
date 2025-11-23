'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { moviesService, movieCategoriesService, castTypesService, mediaTypesService, ageRatingsService } from '../../../services/api';
import { FormLayout } from '../../../components/FormLayout';
import { FormInput, FormSelect, FormTextarea } from '../../../components/FormInput';
import { ImageUpload } from '../../../components/ImageUpload';
import { z } from 'zod';

// Esquema de validação com Zod
const movieSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    original_title: z.string().optional(),
    synopsis: z.string().min(10, 'Sinopse deve ter pelo menos 10 caracteres'),
    release_date: z.string().date('Data de lançamento inválida'),
    duration_minutes: z.number().min(1, 'Duração deve ser maior que 0'),
    director: z.string().min(1, 'Diretor é obrigatório'),
    cast: z.string().optional(),
    trailer_url: z.string().url('URL do trailer inválida').or(z.literal('')).optional(),
    movie_category_id: z.string().uuid('Selecione uma categoria válida'),
    cast_type_id: z.string().uuid('Selecione um tipo de elenco válido'),
    media_type_id: z.string().uuid('Selecione um tipo de mídia válido'),
    age_rating_id: z.string().uuid('Selecione uma classificação válida'),
    is_active: z.boolean().default(true),
    // O campo 'poster' será tratado separadamente pelo ImageUpload
});

type MovieFormData = z.infer<typeof movieSchema>;

export default function CreateEditMoviePage() {
    const { id } = useParams();
    const isEdit = id !== 'create';
    const router = useRouter();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [defaultValues, setDefaultValues] = useState<MovieFormData>({} as MovieFormData);
    const [posterFile, setPosterFile] = useState<File | null>(null);
    const [currentPosterUrl, setCurrentPosterUrl] = useState<string | undefined>(undefined);

    // Listas de opções para selects
    const [categories, setCategories] = useState<any[]>([]);
    const [castTypes, setCastTypes] = useState<any[]>([]);
    const [mediaTypes, setMediaTypes] = useState<any[]>([]);
    const [ageRatings, setAgeRatings] = useState<any[]>([]);

    useEffect(() => {
        if (!token) return;
        
        const loadData = async () => {
            try {
                const [
                    loadedCategories,
                    loadedCastTypes,
                    loadedMediaTypes,
                    loadedAgeRatings
                ] = await Promise.all([
                    movieCategoriesService.getAll(token),
                    castTypesService.getAll(token),
                    mediaTypesService.getAll(token),
                    ageRatingsService.getAll(token),
                ]);

                setCategories(loadedCategories);
                setCastTypes(loadedCastTypes);
                setMediaTypes(loadedMediaTypes);
                setAgeRatings(loadedAgeRatings);

                if (isEdit) {
                    const movie = await moviesService.getById(id as string, token);
                    setDefaultValues({
                        title: movie.title,
                        original_title: movie.original_title || '',
                        synopsis: movie.synopsis,
                        release_date: movie.release_date.split('T')[0], // Formato YYYY-MM-DD
                        duration_minutes: movie.duration_minutes,
                        director: movie.director,
                        cast: movie.cast || '',
                        trailer_url: movie.trailer_url || '',
                        movie_category_id: movie.movie_category_id,
                        cast_type_id: movie.cast_type_id,
                        media_type_id: movie.media_type_id,
                        age_rating_id: movie.age_rating_id,
                        is_active: movie.is_active,
                    });
                    setCurrentPosterUrl(movie.poster_url);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                alert('Erro ao carregar dados');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id, isEdit, token]);

    const onSubmit = async (data: MovieFormData) => {
        if (!token) return;
        setIsSubmitting(true);

        try {
            const payload = {
                ...data,
                duration_minutes: Number(data.duration_minutes),
            };

            let movieId: string;

            if (isEdit) {
                await moviesService.update(id as string, payload, token);
                movieId = id as string;
                alert('Filme atualizado com sucesso!');
            } else {
                const newMovie = await moviesService.create(payload, token);
                movieId = newMovie.id;
                alert('Filme criado com sucesso!');
            }

            // Upload do poster, se houver
            if (posterFile) {
                const formData = new FormData();
                formData.append('poster', posterFile);
                await moviesService.uploadPoster(movieId, formData, token);
            }

            router.push('/movies');
        } catch (error) {
            console.error('Error saving movie:', error);
            alert('Erro ao salvar filme');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));
    const castTypeOptions = castTypes.map(c => ({ value: c.id, label: c.name }));
    const mediaTypeOptions = mediaTypes.map(m => ({ value: m.id, label: m.name }));
    const ageRatingOptions = ageRatings.map(a => ({ value: a.id, label: a.name }));

    return (
        <FormLayout
            title={isEdit ? 'Editar Filme' : 'Novo Filme'}
            subtitle={isEdit ? `Atualizar dados do filme ${defaultValues.title}` : 'Preencha os dados para cadastrar um novo filme'}
            schema={movieSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            backHref="/movies"
            submitButtonText={isEdit ? 'Salvar Alterações' : 'Cadastrar Filme'}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput name="title" label="Título" required />
                        <FormInput name="original_title" label="Título Original (opcional)" />
                    </div>
                    
                    <FormTextarea name="synopsis" label="Sinopse" rows={5} required />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormInput name="release_date" label="Data de Lançamento" type="date" required />
                        <FormInput name="duration_minutes" label="Duração (minutos)" type="number" required />
                        <FormInput name="director" label="Diretor" required />
                    </div>

                    <FormInput name="cast" label="Elenco Principal (separado por vírgulas)" />
                    <FormInput name="trailer_url" label="URL do Trailer (YouTube/Vimeo)" />
                </div>

                <div className="md:col-span-1 space-y-6">
                    <ImageUpload
                        name="poster"
                        label="Poster do Filme"
                        required={!isEdit}
                        currentImage={currentPosterUrl}
                        onImageChange={setPosterFile}
                    />
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Classificação e Tipos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <FormSelect name="movie_category_id" label="Categoria" options={categoryOptions} required />
                    <FormSelect name="cast_type_id" label="Tipo de Elenco" options={castTypeOptions} required />
                    <FormSelect name="media_type_id" label="Tipo de Mídia" options={mediaTypeOptions} required />
                    <FormSelect name="age_rating_id" label="Classificação Indicativa" options={ageRatingOptions} required />
                </div>
            </div>
        </FormLayout>
    );
}
