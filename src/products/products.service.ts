import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid';


@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

  ) {}

  async create(createProductDto: CreateProductDto) {
    
      try {

        const product = this.productRepository.create(createProductDto);
        await this.productRepository.save( product );

        return product;

      } catch (error) {
        this.handleExceptions( error )
      }

  }

  async findAll( paginationDto: PaginationDto ) {

    try {

      const { limit=10, offset=0 } = paginationDto; 

      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        //TODO Relations
      });

      return products;

    } catch ( error ) {
      this.handleExceptions( error );
    }

  }

  async findOne( term: string ) {

    let product: Product;

    if ( isUUID(term) ) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = await this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where(`UPPER(title) =:title or slug =:slug`, {
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        }).getOne();
    }
    
    if ( !product ) 
      throw new NotFoundException(`Product with term ${ term } not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto
    });

    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);

    try {
      return await this.productRepository.save( product );
    } catch ( error ) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {

    const product = await this.findOne( id );
    await this.productRepository.remove( product );
    
    return `This action removes a #${id} product`;
  }

  private handleExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);
    
    this.logger.error( error )

    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
