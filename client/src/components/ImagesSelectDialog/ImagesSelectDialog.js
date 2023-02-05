import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { ColorPicker, useColor } from 'react-color-palette';
import 'react-color-palette/lib/css/styles.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import {
  fontFaceOptions,
  layoutTypesOptionsWithTranslations,
  layoutTypesOptionsWithoutTranslations,
  languageOptions,
} from './pptOptions';
import useInputState from '../../hooks/useInputState';
import { useMountedState } from '../../hooks/useMountedState';
import { backendEndpoint } from '../../config';

import createPpt from '../../helpers/createPpt';
import SearchPhotos from '../SearchPhotos/SearchPhotos';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import ProgressBar from './ProgressBar';
import LayoutTypesDialog from './LayoutTypesDialog';
import { WordsContext } from '../../contexts/words.context';

export default function ImagesSelectDialog({ imagesSelectDialogShow, title }) {
  const words = useContext(WordsContext);
  const [stage, setStage] = useState(0);
  // to create error message if error occurs during ppt creation (conversion to base64 image or in PptxGenJS)
  const [errorBoolean, setErrorBoolean] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMounted = useMountedState();

  // state for ppt options
  const [fontFace, setFontFace] = useInputState(fontFaceOptions[0]);
  const [translationLang, setTranslationLang] = useInputState('ko');
  const [color, setColor] = useColor('hex', '#000000');
  const [backgroundColor, setBackgroundColor] = useColor('hex', '#FFFFFF');
  const [pptBooleanOptionsState, setPptBooleanOptionsState] = useState({
    bold: false,
    italic: false,
    translationBool: false,
  });

  const [layoutTypes, setLayoutTypes] = useState(
    layoutTypesOptionsWithoutTranslations
  );

  const handlePptBooleanOptionsChange = (event) => {
    setPptBooleanOptionsState({
      ...pptBooleanOptionsState,
      [event.target.name]: event.target.checked,
    });
    // change layout types if translationBool changed
    if (event.target.name === 'translationBool') {
      if (event.target.checked === true) {
        setLayoutTypes(layoutTypesOptionsWithTranslations);
      } else {
        setLayoutTypes(layoutTypesOptionsWithoutTranslations);
      }
    }
  };

  const { bold, italic, translationBool } = pptBooleanOptionsState;

  const loadingMsg = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px auto',
        padding: 0,
      }}
    >
      <LoaderThreeDots />
    </Box>
  );
  const wordsLength = words.length;

  // state for selected images and other info
  // state will change based on users img selections and selections for ppt layout
  // pass state setter to SearchPhotos to add to, also pass in stage to add to state correctly
  // [{stage: 0, word: 'cat', img: 'https..... convert to base64 before ppt created...', translation: false, width: ...},{}, ...]
  // make selectedImages state an array of objects - stage: value
  const selectedImgsObjArr = words.map((word, i) => ({
    stage: i,
    word: word.word,
    img: null,
    translation: null,
    originalImgWidth: null,
    originalImgHeight: null,
    triggerDownloadAPI: null,
  }));

  const [selectedImgs, addSelectedImg] = useState(selectedImgsObjArr);

  // determine modal stage progress %
  const progressPercent = ((stage + 1) / wordsLength) * 100;

  const handleClose = () => {
    imagesSelectDialogShow(false);
  };

  const handleNext = () => {
    setStage(stage + 1);
  };

  const handleLastNext = () => {
    setStage(1000);
  };

  const handlePrevious = () => {
    setStage(stage - 1);
  };

  // go back to last img selection
  const handleBackToImagesSelection = () => {
    setStage(wordsLength - 1);
  };

  const handleErrors = (response) => {
    // HTTP response status not ok - offline, network error (DNS lookup failure...)
    if (!response.ok) {
      // custom error
      throw Error(response.statusText);
    }
    return response;
  };

  const handlePptCreateError = () => {
    if (isMounted()) {
      setErrorBoolean(true);
      // show final stage so that error message displays
      setStage(1001);
      setLoading(false);
    }
  };

  const toDataURL = (url) =>
    fetch(url)
      .then(handleErrors)
      // convert url to a chunk of data
      .then((response) => response.blob())
      .catch((error) => handlePptCreateError(error))
      // promise represents O / X of async and its resulting value
      .then(
        (blob) =>
          new Promise((resolve) => {
            // reads data from a blob
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            // convert blob to base64 img
            return reader.readAsDataURL(blob);
          })
      )
      .catch((error) => handlePptCreateError(error));

  const imagesSrcToDataURL = () => {
    // convert any urls to base64 strings
    // to make creating ppt more efficient (PptxGenJs API docs)
    // map returns an array of promises
    const newSelectedImgs = selectedImgs.map(async (imgObj) => {
      // skip imgObj if img already base64 format (locally uploaded images)
      if (imgObj.img.substring(0, 10) === 'data:image') {
        return { ...imgObj };
      }

      let newUrl;
      await toDataURL(imgObj.img)
        .then((dataUrl) => (newUrl = dataUrl))
        .catch((error) => handlePptCreateError(error));
      return {
        ...imgObj,
        img: newUrl,
      };
    });
    // when promise is resolved it returns an array of the results
    return Promise.all(newSelectedImgs);
  };

  function getImageDimensions(file) {
    return new Promise(function (resolve) {
      // use the img src to create an image -> determine width and height
      const i = new Image();
      // i.onload = function () {
      //     resolved({ w: i.width, h: i.height });
      // };
      i.onload = () => resolve({ w: i.width, h: i.height });
      i.src = file;
    }).catch((error) => handlePptCreateError(error));
  }

  // get width and height for images uploaded from pc
  function addImgWidthAndHeight(result) {
    const newResults = result.map(async (imgObj) => {
      // skip images with w and h already (w and height from API)
      if (imgObj.originalImgWidth !== null) {
        return { ...imgObj };
      }
      const dimensions = await getImageDimensions(imgObj.img).catch((error) =>
        handlePptCreateError(error)
      );
      return {
        ...imgObj,
        originalImgWidth: dimensions.w,
        originalImgHeight: dimensions.h,
      };
    });

    return Promise.all(newResults);
  }

  function validatePptOptions(pptOptions) {
    let isAllValid = true;
    if (
      typeof pptOptions.bold !== 'boolean' ||
      typeof pptOptions.italic !== 'boolean' ||
      // dnt need to pass to createPpt -> not added to pptOptions
      typeof translationBool !== 'boolean'
    ) {
      isAllValid = false;
    }

    if (fontFaceOptions.includes(pptOptions.fontFace) === false) {
      isAllValid = false;
    }

    let typesArr = [];
    let labelsArr = [];

    if (translationBool) {
      typesArr = layoutTypesOptionsWithTranslations.map((obj) => obj.type);
      labelsArr = layoutTypesOptionsWithTranslations.map((obj) => obj.label);
      pptOptions.layoutTypes.forEach((option) => {
        if (typesArr.includes(option.type) === false) {
          isAllValid = false;
        }
        if (labelsArr.includes(option.label) === false) {
          isAllValid = false;
        }
      });
    } else {
      typesArr = layoutTypesOptionsWithoutTranslations.map((obj) => obj.type);
      labelsArr = layoutTypesOptionsWithoutTranslations.map((obj) => obj.label);
      pptOptions.layoutTypes.forEach((option) => {
        if (typesArr.includes(option.type) === false) {
          isAllValid = false;
        }
        if (labelsArr.includes(option.label) === false) {
          isAllValid = false;
        }
      });
      // check if translationLang is valid - not ppt option passed to pptCreate
      const languageOptionsCodeArr = languageOptions.map((obj) => obj.code);
      if (languageOptionsCodeArr.includes(translationLang) === false) {
        isAllValid = false;
      }
    }

    const regex = /^#([A-Fa-f0-9]{6})$/;
    if (
      regex.test(pptOptions.color) === false ||
      regex.test(pptOptions.background) === false
    ) {
      isAllValid = false;
    }

    return isAllValid;
  }

  function createPptOptions() {
    // get type for each layoutType that is checked - pass array of types (strings) to createPpt
    const layoutTypesChecked = layoutTypes
      .filter((item) => item.checked === true)
      .map((itm) => ({ type: itm.type, label: itm.label }));

    // validation check
    const pptOptions = {
      fontFace,
      color: color.hex,
      background: backgroundColor.hex,
      bold,
      italic,
      layoutTypes: layoutTypesChecked,
    };
    const isValid = validatePptOptions(pptOptions);
    return { pptOptions, isValid };
  }

  async function getTranslations(wordsArr, charCount) {
    const data = await axios({
      method: 'GET',
      params: {
        target: translationLang,
        query: wordsArr,
        charCount,
      },
      headers: {
        'Content-type': 'application/json',
      },
      withCredentials: true,
      url: `${backendEndpoint}/api/translate`,
    });
    return data;
  }

  const handleSubmit = async () => {
    // make Dialog for final stage display
    // stage is a number, arbitrarily set final stage to 1001 (word input limited to 100)
    if (isMounted()) {
      setLoading(true);
      setStage(1001);
    }
    // wait for conversion to dataUrl
    // errors handled in the function imagesSrcToDataURL
    const result = await imagesSrcToDataURL();
    // for each img src, get img dimensions (needed for positioning imgs in PptxGenJS)
    // add width and height property to each selected img -> for uploaded images from pc
    let resultsWithWidthAndHeight = await addImgWidthAndHeight(result);
    // add ppt options - user selected
    const { pptOptions, isValid } = createPptOptions();
    let isAllValid = isValid;

    // Google translate if checked and input valid
    if (translationBool) {
      const wordsArr = words.map((obj) => obj.word);
      let charCount = 0;
      // check that each word is 50 chars or less
      wordsArr.forEach((wrd) => {
        const wordLen = wrd.length;
        charCount += wordLen;
        if (wordLen > 50) {
          isAllValid = false;
        }
      });
      if (isAllValid) {
        try {
          const translationsRes = await getTranslations(wordsArr, charCount);
          const translations = translationsRes.data;
          // add translations
          // extra check
          if (resultsWithWidthAndHeight.length === translations.length) {
            resultsWithWidthAndHeight = resultsWithWidthAndHeight.map(
              (imgObj, i) => ({
                ...imgObj,
                translation: translations[i],
              })
            );
          }
        } catch (error) {
          console.log('translation error');
        }
      }
    }
    // create ppt
    try {
      await createPpt(title, resultsWithWidthAndHeight, pptOptions);
    } catch (error) {
      handlePptCreateError(error);
    }
    if (isMounted()) {
      setLoading(false);
    }
  };

  return (
    <>
      {/* create a Dialog for each word, keepMounted keeps children in the DOM - loaded images stay in the DOM */}
      {words.map((word, i) => (
        <Dialog
          key={word.id}
          open={stage === i}
          onClose={handleClose}
          keepMounted
          aria-labelledby={`Word ${i} in list - ${word}`}
          sx={{ '& div': { mx: 0 } }}
        >
          <DialogTitle
            id={`Word ${i} in list - ${word}`}
            style={{ textAlign: 'center' }}
          >
            Choose an image for each word - Click an image to select it
            <ProgressBar value={progressPercent} />
          </DialogTitle>

          <DialogContent dividers sx={{ px: { xs: '5px', smSmMd: '24px' } }}>
            <DialogContentText sx={{ textAlign: 'center', p: 2 }}>
              Word {i + 1} of {wordsLength}: '{word.word}' for list '{title}'
            </DialogContentText>

            {/* pass word to Unsplash API search */}
            <SearchPhotos
              word={word.word}
              selectedImgs={selectedImgs}
              addSelectedImg={addSelectedImg}
              stage={i}
            />
          </DialogContent>

          <DialogActions style={{ justifyContent: 'center' }}>
            {/* Dont display on first stage */}
            {stage !== 0 && (
              <Button
                onClick={handlePrevious}
                color="primary"
                disabled={stage === 0}
              >
                Previous
              </Button>
            )}

            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>

            {/* Dont display on last img selection stage */}
            {stage !== words.length - 1 && stage !== 1000 && stage !== 1001 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={
                  stage === wordsLength - 1 || selectedImgs[stage].img === null
                }
              >
                Next
              </Button>
            )}

            {/* Display on last img selection stage */}
            {stage === words.length - 1 && stage !== 1000 && stage !== 1001 && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleLastNext}
                disabled={selectedImgs[stage].img === null}
              >
                Next
              </Button>
            )}
          </DialogActions>
        </Dialog>
      ))}

      {/* stage displaying options for ppt (slide types, font, font color, bold, background color, ...) */}
      {stage === 1000 && (
        <Dialog
          open={stage === 1000}
          onClose={handleClose}
          keepMounted
          sx={{ '& div': { mx: 0 } }}
        >
          <DialogTitle style={{ textAlign: 'center' }}>
            PowerPoint options
          </DialogTitle>

          <DialogContent dividers sx={{ px: { xs: '5px', smSmMd: '24px' } }}>
            <FormControl
              sx={{
                m: 1,
                display: 'block',
              }}
            >
              <Typography variant="caption" display="block" gutterBottom>
                Font
              </Typography>
              <Select
                labelId="font-select"
                id="font-select"
                value={fontFace}
                onChange={setFontFace}
                style={{ fontFamily: fontFace }}
              >
                {fontFaceOptions.map((font) => (
                  <MenuItem
                    key={font}
                    value={font}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{
                m: 1,
                minWidth: 120,
                display: 'block',
              }}
            >
              <Typography variant="caption" display="block" gutterBottom mt={2}>
                Font Colour
              </Typography>

              <ColorPicker
                width={240}
                height={100}
                color={color}
                onChange={setColor}
                hideHSV
                hideRGB
                dark={false}
              />

              <Typography variant="caption" display="block" gutterBottom mt={2}>
                Background Colour
              </Typography>
              <ColorPicker
                width={240}
                height={100}
                color={backgroundColor}
                onChange={setBackgroundColor}
                hideHSV
                hideRGB
                dark={false}
              />
            </FormControl>
            <FormControl
              component="fieldset"
              sx={{
                m: 1,
              }}
            >
              <Typography variant="caption" display="block" gutterBottom mt={2}>
                Font style
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={bold}
                      onChange={handlePptBooleanOptionsChange}
                      name="bold"
                      icon={<CheckCircleOutlinedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      sx={{
                        color: (theme) => theme.palette.success.light,
                        '&.Mui-checked': {
                          color: (theme) => theme.palette.success.main,
                        },
                      }}
                    />
                  }
                  label="Bold"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={italic}
                      onChange={handlePptBooleanOptionsChange}
                      name="italic"
                      icon={<CheckCircleOutlinedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      sx={{
                        color: (theme) => theme.palette.success.light,
                        '&.Mui-checked': {
                          color: (theme) => theme.palette.success.main,
                        },
                      }}
                    />
                  }
                  label="Italic"
                />
              </FormGroup>
            </FormControl>
            <FormControl
              component="fieldset"
              sx={{
                py: 2,
                ml: 1,
                display: 'block',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={translationBool}
                    onChange={handlePptBooleanOptionsChange}
                    name="translationBool"
                    icon={<CheckCircleOutlinedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    sx={{
                      color: (theme) => theme.palette.success.light,
                      '&.Mui-checked': {
                        color: (theme) => theme.palette.success.main,
                      },
                    }}
                  />
                }
                label="Add translation"
              />
              <Alert severity="error">
                  Translation does not currently work. The Google Cloud translation API that is used
                  for translation is not enabled. If <b>Add translation</b> is selected,
                  the text <i>'translation error'</i> will be shown instead of the translations on
                  the PowerPoint slides.
              </Alert>
            </FormControl>
            {/* display translation select menu if translation is checked */}
            {translationBool ? (
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 120,
                  display: 'block',
                }}
              >
                <Typography variant="caption" display="block" gutterBottom>
                  Select a language
                </Typography>
                <Select
                  labelId="language-select"
                  id="language-select"
                  value={translationLang}
                  onChange={setTranslationLang}
                >
                  {languageOptions.map(({ label, code }) => (
                    <MenuItem key={code} value={code}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              ''
            )}

            {/* ppt layout options dialog. Layout options depend on if translation chosen */}
            <LayoutTypesDialog
              layoutTypes={layoutTypes}
              setLayoutTypes={setLayoutTypes}
            />
          </DialogContent>

          <DialogActions style={{ justifyContent: 'center' }}>
            <Button onClick={handleBackToImagesSelection} color="primary">
              Go back
            </Button>

            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>

            <Button
              variant="contained"
              color="primary"
              // disabled={selectedImgs[i].img === null} // make sure options chosen (at least 1) for user input, or use default values
              onClick={handleSubmit}
            >
              Create PPT
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* final stage displaying ppt creation success or failure. with loading icon */}
      {stage === 1001 && (
        <Dialog
          open={stage === 1001}
          onClose={handleClose}
          keepMounted
          sx={{ '& div': { mx: 0 } }}
        >
          <DialogTitle style={{ textAlign: 'center' }}>Created PPT</DialogTitle>

          <DialogContent dividers sx={{ px: { xs: '5px', smSmMd: '24px' } }}>
            {loading && loadingMsg}
            {!loading && !errorBoolean && (
              <Alert severity="success">
                ppt created! Check your downloads folder.
              </Alert>
            )}
            {errorBoolean && (
              <Alert severity="error">
                There was an error creating the ppt. Please try again.
              </Alert>
            )}
          </DialogContent>

          <DialogActions style={{ justifyContent: 'center' }}>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

ImagesSelectDialog.propTypes = {
  imagesSelectDialogShow: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
