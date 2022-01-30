import {useDropzone} from 'react-dropzone';
import {uploadFile} from '../lib/uploadFile';
import styles from '../styles/Dropzone.module.scss';

interface ImageUploadProps {
    imageUrl: string,
    onDrop: (newUrl: string) => void
}

export const ImageUpload = ({imageUrl, onDrop}: ImageUploadProps) => {
    const upload = ([file]: Blob[]) => uploadFile(file).then(({url}) => onDrop(url))
    const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({
        onDrop: upload,
        multiple: false,
        accept: 'image/*'
    })


    const cover_image_style = {backgroundImage: "url('" + imageUrl + "')"};

    return <div className={styles.uploadImage} style={cover_image_style}>
        <div
            className={`${styles.dropzone} ${isDragActive ? styles.active : ''} ${isDragReject ? styles.reject : ''}`} {...getRootProps()}>
            <input {...getInputProps()} />
            <div className={styles.message}>
                Click, or drop a file here to upload a new image.
            </div>
        </div>
    </div>
}
