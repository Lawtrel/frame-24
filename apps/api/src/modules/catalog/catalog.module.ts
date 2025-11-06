import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { MoviesModule } from 'src/modules/catalog/movies/movies.module';
import { MovieCategoriesModule } from 'src/modules/catalog/movie_categories/movie-categories.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [ProductsModule, MoviesModule, MovieCategoriesModule, CommonModule],
})
export class CatalogModule {}
