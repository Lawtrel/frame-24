export interface Movie {
    id: number;
    title: string;
    description?: string;
    duration: number;
    release_date: string;
    age_rating_id: number;
    supplier_id: number;
    active: boolean;
    age_ratings?: AgeRating;
    suppliers?: Supplier;
    movie_cast?: MovieCast[];
    movie_media?: MovieMedia[];
}

export interface AgeRating {
    id: number;
    name: string;
    description?: string;
}

export interface Supplier {
    id: number;
    name: string;
    contact_info?: string;
}

export interface MovieCast {
    id: number;
    movie_id: number;
    cast_name: string;
    cast_type_id: number;
    cast_types?: CastType;
}

export interface CastType {
    id: number;
    name: string;
}

export interface MovieMedia {
    id: number;
    movie_id: number;
    media_url: string;
    media_type_id: number;
    media_types?: MediaType;
}

export interface MediaType {
    id: number;
    name: string;
}