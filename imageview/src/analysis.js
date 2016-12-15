var ExifImage = require('exif').ExifImage;


try {
    new ExifImage({ image : 'src/public/test/1481822239.74d2b29d90-6558-4c70-89b1-c72abcf51e72.jpg' }, function (error, exifData) {
        if (error)
            console.log('Error: '+error.message);
        else
            console.log(exifData); // Do something with your data!
    });
} catch (error) {
    console.log('Error: ' + error.message);
}