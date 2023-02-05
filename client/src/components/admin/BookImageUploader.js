import { useState } from 'react';
import PropTypes from 'prop-types';
import ImageUploading from 'react-images-uploading';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import sanitizeUrl from '../../helpers/urlSanitizer';

import { classes, Root, ImgRoot } from './styles/BookImageUploaderStyles';

function BookImageUploader({ setFieldValue, isFetching }) {
  const [image, setImage] = useState([]);
  const [errorBoolean, setErrorBoolean] = useState(false);

  const onChange = (imageList) => {
    setErrorBoolean(false);
    setImage(imageList);
    setFieldValue('coverImg', imageList[0].file, false);
  };

  const handleImageUploadError = () => {
    setErrorBoolean(true);
    setImage([]);
    setFieldValue('coverImg', {});
  };

  return (
    <Root className={classes.root}>
      <ImageUploading
        value={image}
        acceptType={['jpg', 'gif', 'png', 'jpeg']}
        maxFileSize={5242880}
        onChange={onChange}
        dataURLKey="data_url"
        onError={handleImageUploadError}
      >
        {({ imageList, onImageUpload, isDragging, dragProps, errors }) => (
          // write your building UI
          <div>
            <div>Upload the book image cover from your computer</div>
            <Button
              style={isDragging ? { backgroundColor: '#64b5f6' } : null}
              onClick={onImageUpload}
              // eslint-disable-next-line
              {...dragProps}
              variant="outlined"
              color="primary"
              startIcon={<CloudUploadIcon />}
              disabled={isFetching}
            >
              Click or Drag and drop image here
            </Button>

            {!errorBoolean &&
              // TODO: only 1 image now (21.04.15) - may allow selecting multiple images later
              imageList.map((img, index) => (
                <div key={index}>
                  <Box className={classes.imageContainer}>
                    {/* eslint-disable-next-line */}
                    <ImgRoot
                      className={classes.image}
                      src={sanitizeUrl(img.data_url)}
                      alt="Uploaded from computer"
                      width="200"
                      // eslint-disable-next-line
                      tabIndex={0}
                    />
                  </Box>
                </div>
              ))}

            {errors && (
              <div>
                {errors.acceptType && (
                  <>
                    <Alert severity="error">
                      Only jpg, png and gif images allowed.
                    </Alert>
                  </>
                  // <span>Error: Only jpg, png and gif images allowed.</span>
                )}
                {errors.maxFileSize && (
                  <>
                    <Alert severity="error">
                      The maximum image size is 5mb
                    </Alert>
                  </>
                  // <span>Error: The maximum image size is 5mb.</span>
                )}
              </div>
            )}
          </div>
        )}
      </ImageUploading>
    </Root>
  );
}

export default BookImageUploader;

BookImageUploader.propTypes = {
  setFieldValue: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
};
