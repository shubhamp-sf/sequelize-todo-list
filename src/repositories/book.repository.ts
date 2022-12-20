import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
} from '@loopback/repository';
import {SequelizeRepository} from '../../../loopback4-sequelize/dist';
import {DbDataSource} from '../datasources';
import {Book, BookRelations, Category} from '../models';
import {CategoryRepository} from './category.repository';

export class BookRepository extends SequelizeRepository<
  Book,
  typeof Book.prototype.id,
  BookRelations
> {
  public readonly category: BelongsToAccessor<
    Category,
    typeof Book.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('CategoryRepository')
    protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Book, dataSource);
    this.category = this.createBelongsToAccessorFor(
      'category',
      categoryRepositoryGetter,
    );
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
