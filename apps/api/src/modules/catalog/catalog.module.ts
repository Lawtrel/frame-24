import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { MoviesModule } from 'src/modules/catalog/movies/movies.module';
import { MovieCategoriesModule } from 'src/modules/catalog/movie_categories/movie-categories.module';

@Module({
  imports: [ProductsModule, MoviesModule, MovieCategoriesModule],
})
export class CatalogModule {}
