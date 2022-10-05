export const fileFilter = ( req: Express.Request, image: Express.Multer.File, callback: Function ) => {
    
    if ( !image ) return callback( new Error('Image is empty'), false );

    const fileExtension = image.mimetype.split('/')[1];
    const validExtension = ['jpg','jpeg','png'];

    if ( validExtension.includes( fileExtension ) ) {
        return callback( null, true );
    }

    callback( null, false );

}