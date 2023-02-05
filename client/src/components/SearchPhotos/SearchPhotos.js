import { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import useImgSearch from '../../hooks/useImgSearch';
import useFirstRun from '../../hooks/useFirstRun';
import { useMountedState } from '../../hooks/useMountedState';
import ImageUploader from '../ImagesSelectDialog/ImageUploader';
import LoaderThreeDots from '../reuseable/LoaderThreeDots';
import sanitizeUrl from '../../helpers/urlSanitizer';
import { classes, Root, CardImage } from './styles/SearchPhotosStyles';

export default function SearchPhotos({
  word,
  addSelectedImg,
  selectedImgs,
  stage,
}) {
  const isFirstRun = useFirstRun();
  const isMounted = useMountedState();
  const observer = useRef();
  const [query, setQuery] = useState(null);
  const [pageNumber, setPageNumber] = useState(null);
  const { loading, error, reqErrorMsg, pics, hasMore } = useImgSearch(
    query,
    pageNumber
  );

  const loadingMsg = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
      }}
    >
      <LoaderThreeDots height={60} width={60} />
    </Box>
  );
  const noImagesMsg = (
    <Alert severity="info">No images match your search</Alert>
  );
  const errorMsg = (
    <Alert severity="error">
      There was an error loading the images. {reqErrorMsg}
    </Alert>
  );

  // do image search once component mounted - set query and page number
  useEffect(() => {
    if (isFirstRun) {
      // only change state if component mounted
      // user may open imageSelectDialog and then close it right away
      // state update may have started while this component unmounted
      if (isMounted()) {
        setQuery(word);
        setPageNumber(1);
      }
    }
  }, [word, isFirstRun, isMounted]);

  // called when .card div created, it will call this useCallback (with reference to the .card div element) function because its ref={lastPicElementRef}
  // node corresponds to the .card element
  const lastPicElementRef = useCallback(
    (node) => {
      if (loading) return;
      // disconnect from old last ele, so you can have new last ele
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        // there is only one .card div that is set as the ref.current value
        // logic for selecting the last ele is in return ( )

        if (entries[0].isIntersecting && hasMore) {
          // trigger useCallback in useImgSearch.js -> another API call -> 10 more pics
          // if rate limit reached -> no more images will be shown -> prevent callback
          if (isMounted() && reqErrorMsg === '') {
            setPageNumber((prevPageNumber) => prevPageNumber + 1);
          }
        }
      });

      // prevent node being observed right away, else intersection occurs on pageload
      setTimeout(() => {
        if (node) observer.current.observe(node);
      }, 200);
    },
    [loading, hasMore, isMounted, reqErrorMsg]
  );

  const handleImgSelect = (e, javaScriptEvent = true) => {
    // passing in values that are not from e.target.src (ImageUploader)
    if (javaScriptEvent === false) {
      addSelectedImg(
        selectedImgs.map((imgObj) =>
          imgObj.stage === stage
            ? { ...imgObj, img: e, triggerDownloadAPI: null }
            : imgObj
        )
      );
    } else {
      // check if Unsplash or Uploaded image selected
      // eslint-disable-next-line
      if (e.target.hasAttribute('data-image-src-regular')) {
        addSelectedImg(
          selectedImgs.map((imgObj) =>
            imgObj.stage === stage
              ? {
                  ...imgObj,
                  img: e.target.getAttribute('data-image-src-regular'),
                  originalImgWidth: parseInt(
                    e.target.getAttribute('data-original-width')
                  ),
                  originalImgHeight: parseInt(
                    e.target.getAttribute('data-original-height')
                  ),
                  triggerDownloadAPI: e.target.getAttribute(
                    'data-trigger-download-api'
                  ),
                }
              : imgObj
          )
        );
        // uploaded image clicked
      } else {
        addSelectedImg(
          selectedImgs.map((imgObj) =>
            imgObj.stage === stage
              ? { ...imgObj, img: e.target.src, triggerDownloadAPI: null }
              : imgObj
          )
        );
      }
    }
  };

  const handleImgSelectKeyDown = (e) => {
    if (e.code === 'Enter') {
      // check if Unsplash or Uploaded image selected
      if (e.target.hasAttribute('data-image-src-regular')) {
        addSelectedImg(
          selectedImgs.map((imgObj) =>
            imgObj.stage === stage
              ? {
                  ...imgObj,
                  img: e.target.getAttribute('data-image-src-regular'),
                  originalImgWidth: parseInt(
                    e.target.getAttribute('data-original-width')
                  ),
                  originalImgHeight: parseInt(
                    e.target.getAttribute('data-original-height')
                  ),
                  triggerDownloadAPI: e.target.getAttribute(
                    'data-trigger-download-api'
                  ),
                }
              : imgObj
          )
        );
      } else {
        addSelectedImg(
          selectedImgs.map((imgObj) =>
            imgObj.stage === stage
              ? { ...imgObj, img: e.target.src, triggerDownloadAPI: null }
              : imgObj
          )
        );
      }
    }
  };

  const urlInStateCheck = (url) =>
    // if url in state (for a given stage - same image may be used in different stages) then add style
    selectedImgs[stage].img === url;
  return (
    <>
      <ImageUploader
        addSelectedImg={addSelectedImg}
        selectedImgs={selectedImgs}
        stage={stage}
        urlInStateCheck={urlInStateCheck}
        handleImgSelect={handleImgSelect}
        handleImgSelectKeyDown={handleImgSelectKeyDown}
      />

      <Divider variant="middle" />
      <Box sx={{ textAlign: 'center', p: 2, pt: 3 }}>
        Images from{' '}
        <Link href="https://unsplash.com/" target="_blank" rel="noopener">
          Unsplash
        </Link>
      </Box>

      <Root className={classes.root}>
        {pics.map((pic, i) => {
          // if it is the last pic, lastPicElementRef will be called with .card as a reference, used to create infinite API call using intersection observer
          if (pics.length === i + 1) {
            return (
              <Box
                className={classes.card}
                // sometimes duplicate pic ids occur
                key={`${pic.id}_index_${i}`}
                ref={lastPicElementRef}
              >
                <Box
                  className={classes.cardImageContainer}
                  sx={{
                    margin: {
                      xs: (theme) => `${theme.spacing(0.5)} auto`,
                      md: (theme) => `${theme.spacing(1)} auto`,
                    },
                  }}
                >
                  {/* eslint-disable-next-line */}
                <CardImage
                    className={`${
                      urlInStateCheck(pic.url_regular) ? classes.selected : ''
                    }`}
                    sx={{ width: { xs: 120, md: 170 } }}
                    // eslint-disable-next-line
                    tabIndex="0"
                    alt={pic.alt_description}
                    src={sanitizeUrl(pic.url_thumb)}
                    onClick={handleImgSelect}
                    onKeyDown={handleImgSelectKeyDown}
                    data-image-src-regular={pic.url_regular}
                    data-original-width={pic.width}
                    data-original-height={pic.height}
                    data-trigger-download-api={pic.trigger_download_API}
                  />
                  <Box
                    className={classes.imageCaption}
                    sx={{ width: { xs: 120, md: 170 } }}
                  >
                    <div>Photo by</div>
                    <Link
                      href={sanitizeUrl(pic.profile)}
                      target="_blank"
                      rel="noopener"
                    >
                      {pic.username}
                    </Link>
                  </Box>
                </Box>
              </Box>
            );
          }
          return (
            <Box className={classes.card} key={`${pic.id}_index_${i}`}>
              <Box
                className={classes.cardImageContainer}
                sx={{
                  margin: {
                    xs: (theme) => `${theme.spacing(1)} auto`,
                    md: (theme) => `${theme.spacing(5)} auto`,
                  },
                }}
              >
                {/* eslint-disable-next-line */}
                <CardImage
                  // className={`card--image ${urlInStateCheck(pic.url_regular) ? 'selected' : ''}`}
                  className={`${
                    urlInStateCheck(pic.url_regular) ? classes.selected : ''
                  }`}
                  sx={{ width: { xs: 120, md: 170 } }}
                  // eslint-disable-next-line
                  tabIndex="0"
                  alt={pic.alt_description}
                  src={sanitizeUrl(pic.url_thumb)}
                  onClick={handleImgSelect}
                  onKeyDown={handleImgSelectKeyDown}
                  data-image-src-regular={pic.url_regular}
                  data-original-width={pic.width}
                  data-original-height={pic.height}
                  data-trigger-download-api={pic.trigger_download_API}
                />
                <Box
                  className={classes.imageCaption}
                  sx={{ width: { xs: 120, md: 170 } }}
                >
                  <div>Photo by</div>
                  <Link
                    href={sanitizeUrl(pic.profile)}
                    target="_blank"
                    rel="noopener"
                  >
                    {pic.username}
                  </Link>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Root>
      <Box sx={{ textAlign: 'center', padding: (theme) => theme.spacing(4) }}>
        {loading && loadingMsg}
        {!loading && pics.length === 0 && !error && noImagesMsg}
        {error && errorMsg}
      </Box>
    </>
  );
}

SearchPhotos.propTypes = {
  word: PropTypes.string.isRequired,
  addSelectedImg: PropTypes.func.isRequired,
  selectedImgs: PropTypes.array.isRequired,
  stage: PropTypes.number.isRequired,
};
