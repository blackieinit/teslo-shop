import { Controller, Post, Query, UploadedFile, UseInterceptors} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('products')
  @UseInterceptors( FileInterceptor('image') )
  uploadImageProduct( 
    @UploadedFile() image: Express.Multer.File,
  ) {
    return image;
  }

}
