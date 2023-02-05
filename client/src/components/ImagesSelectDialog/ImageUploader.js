import { useState } from 'react';
import PropTypes from 'prop-types';
import ImageUploading from 'react-images-uploading';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import sanitizeUrl from '../../helpers/urlSanitizer';

import { classes, Root, ImgRoot } from './styles/ImageUploaderStyles';

function ImageUploader({
  selectedImgs,
  stage,
  urlInStateCheck,
  handleImgSelect,
  handleImgSelectKeyDown,
}) {
  const [image, setImage] = useState([]);
  const [errorBoolean, setErrorBoolean] = useState(false);

  const onChange = (imageList) => {
    // data for submit
    setErrorBoolean(false);

    if (imageList.length === 0) {
      // check if current img src in selected images state is a local image (base64 image)
      // only make src null again if the selected image for the given stage is a local img src (not from API img)
      const currentSrcLocalImg =
        selectedImgs[stage].img.substring(0, 10) === 'data:image';
      if (currentSrcLocalImg) {
        handleImgSelect(null, false);
      }
      // add img to selected images state when opened
    } else {
      handleImgSelect(imageList[0].data_url, false);
    }

    setImage(imageList);
  };

  const handleImageUploadError = () => {
    setErrorBoolean(true);
  };

  return (
    <Root className={classes.root}>
      <ImageUploading
        value={image}
        acceptType={['jpg', 'gif', 'png']}
        maxFileSize={5242880}
        onChange={onChange}
        dataURLKey="data_url"
        onError={handleImageUploadError}
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          isDragging,
          dragProps,
          errors,
        }) => (
          // write your building UI
          <div>
            <div>Upload an image from your computer (optional)</div>
            <Button
              style={isDragging ? { backgroundColor: '#64b5f6' } : null}
              onClick={onImageUpload}
              // eslint-disable-next-line
              {...dragProps}
              variant="outlined"
              color="primary"
              startIcon={<CloudUploadIcon />}
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
                      className={`${
                        urlInStateCheck(img.data_url) ? classes.selected : ''
                      }`}
                      src={sanitizeUrl(img.data_url)}
                      alt="Uploaded from computer"
                      width="200"
                      onClick={handleImgSelect}
                      onKeyDown={handleImgSelectKeyDown}
                      // eslint-disable-next-line
                      tabIndex={0}
                    />

                    <IconButton
                      className={classes.imageCloseBtn}
                      color="error"
                      aria-label="upload picture"
                      component="span"
                      onClick={() => onImageRemove(index)}
                      size="large"
                    >
                      <CloseIcon />
                    </IconButton>
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
                )}
                {errors.maxFileSize && (
                  <>
                    <Alert severity="error">
                      The maximum image size is 5mb
                    </Alert>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </ImageUploading>
    </Root>
  );
}

ImageUploader.propTypes = {
  selectedImgs: PropTypes.array.isRequired,
  stage: PropTypes.number.isRequired,
  urlInStateCheck: PropTypes.func.isRequired,
  handleImgSelect: PropTypes.func.isRequired,
  handleImgSelectKeyDown: PropTypes.func.isRequired,
};

export default ImageUploader;
