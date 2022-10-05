import { BadRequestException, Controller, Post, Query, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('products')
  @UseInterceptors( FileInterceptor('image', {
    fileFilter: fileFilter
  }) )
  uploadImageProduct( 
    @UploadedFile() image: Express.Multer.File,
  ) {

    if (!image) {
      throw new BadRequestException("Image is empty")
    };
  
    return image;
  }

}
