import { v4 as uuid } from 'uuid';

export const fileNamer = ( req: Express.Request, image: Express.Multer.File, callback: Function ) => {
    
    if ( !image ) return callback( new Error('Image is empty'), false );

    const fileExtension = image.mimetype.split('/')[1];

    const fileName = `${ uuid() }.${ fileExtension }`

    callback( null, fileName );

}