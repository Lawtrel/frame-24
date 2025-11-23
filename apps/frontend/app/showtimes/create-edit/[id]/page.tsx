'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/AuthContext';
import { showtimesService, moviesService, roomsService, audioTypesService, projectionTypesService, sessionLanguagesService } from '../../../services/api';
import { FormLayout } from '../../../components/FormLayout';
import { FormInput, FormSelect } from '../../../components/FormInput';
import { z } from 'zod';

// Esquema de validação com Zod
const showtimeSchema = z.object({
    movie_id: z.string().uuid('Selecione um filme válido'),
    room_id: z.string().uuid('Selecione uma sala válida'),
    start_time: z.string().datetime('Data e hora de início inválidas'),
    price: z.number().min(0.01, 'Preço deve ser maior que zero'),
    audio_type_id: z.string().uuid('Selecione um tipo de áudio válido'),
    projection_type_id: z.string().uuid('Selecione um tipo de projeção válido'),
    session_language_id: z.string().uuid('Selecione um idioma válido'),
    is_active: z.boolean().default(true),
});

type ShowtimeFormData = z.infer<typeof showtimeSchema>;

export default function CreateEditShowtimePage() {
    const { id } = useParams();
    const isEdit = id !== 'create';
    const router = useRouter();
    const { token } = useAuth();
    const [isLoading, setIsLoading] = useState(isEdit);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [defaultValues, setDefaultValues] = useState<ShowtimeFormData>({} as ShowtimeFormData);

    // Listas de opções para selects
    const [movies, setMovies] = useState<any[]>([]);
    const [rooms, setRooms] = useState<any[]>([]);
    const [audioTypes, setAudioTypes] = useState<any[]>([]);
    const [projectionTypes, setProjectionTypes] = useState<any[]>([]);
    const [sessionLanguages, setSessionLanguages] = useState<any[]>([]);

    useEffect(() => {
        if (!token) return;
        
        const loadData = async () => {
            try {
                const [
                    loadedMovies,
                    loadedRooms,
                    loadedAudioTypes,
                    loadedProjectionTypes,
                    loadedSessionLanguages
                ] = await Promise.all([
                    moviesService.getAll(token),
                    roomsService.getAll(token),
                    audioTypesService.getAll(token),
                    projectionTypesService.getAll(token),
                    sessionLanguagesService.getAll(token),
                ]);

                setMovies(loadedMovies);
                setRooms(loadedRooms);
                setAudioTypes(loadedAudioTypes);
                setProjectionTypes(loadedProjectionTypes);
                setSessionLanguages(loadedSessionLanguages);

                if (isEdit) {
                    const showtime = await showtimesService.getById(id as string, token);
                    
                    // Formatar data e hora para o formato datetime-local
                    const startTimeLocal = new Date(showtime.start_time).toISOString().slice(0, 16);

                    setDefaultValues({
                        movie_id: showtime.movie_id,
                        room_id: showtime.room_id,
                        start_time: startTimeLocal,
                        price: showtime.price,
                        audio_type_id: showtime.audio_type_id,
                        projection_type_id: showtime.projection_type_id,
                        session_language_id: showtime.session_language_id,
                        is_active: showtime.is_active,
                    });
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

    const onSubmit = async (data: ShowtimeFormData) => {
        if (!token) return;
        setIsSubmitting(true);

        try {
            const payload = {
                ...data,
                price: Number(data.price),
                // A data e hora já estão no formato ISO string (datetime-local)
            };

            if (isEdit) {
                await showtimesService.update(id as string, payload, token);
                alert('Sessão atualizada com sucesso!');
            } else {
                await showtimesService.create(payload, token);
                alert('Sessão criada com sucesso!');
            }
            router.push('/showtimes');
        } catch (error) {
            console.error('Error saving showtime:', error);
            alert('Erro ao salvar sessão');
        } finally {
            setIsSubmitting(false);
        }
    };

    const movieOptions = movies.map(m => ({ value: m.id, label: m.title }));
    const roomOptions = rooms.map(r => ({ value: r.id, label: `Sala ${r.number} - ${r.cinema_complex?.name || 'N/A'}` }));
    const audioTypeOptions = audioTypes.map(a => ({ value: a.id, label: a.name }));
    const projectionTypeOptions = projectionTypes.map(p => ({ value: p.id, label: p.name }));
    const sessionLanguageOptions = sessionLanguages.map(l => ({ value: l.id, label: l.name }));

    return (
        <FormLayout
            title={isEdit ? 'Editar Sessão' : 'Nova Sessão'}
            subtitle={isEdit ? `Atualizar dados da sessão` : 'Agende uma nova sessão de filme'}
            schema={showtimeSchema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            backHref="/showtimes"
            submitButtonText={isEdit ? 'Salvar Alterações' : 'Agendar Sessão'}
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect name="movie_id" label="Filme" options={movieOptions} required />
                    <FormSelect name="room_id" label="Sala" options={roomOptions} required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput name="start_time" label="Data e Hora de Início" type="datetime-local" required />
                    <FormInput name="price" label="Preço do Ingresso (R$)" type="number" step="0.01" required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormSelect name="audio_type_id" label="Tipo de Áudio" options={audioTypeOptions} required />
                    <FormSelect name="projection_type_id" label="Tipo de Projeção" options={projectionTypeOptions} required />
                    <FormSelect name="session_language_id" label="Idioma da Sessão" options={sessionLanguageOptions} required />
                </div>
            </div>
        </FormLayout>
    );
}
