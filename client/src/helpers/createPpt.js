import PptxGenJS from 'pptxgenjs';
import axios from 'axios';
import { backendEndpoint } from '../config';
import {
  getTextSizeForWidth,
  inchesToPixels,
} from './fittingTextToContainerWidth';

function trackDownloads(downloadLocations) {
  // if no Unsplash images used
  if (downloadLocations.length === 0) return;
  axios({
    method: 'GET',
    params: {
      downloadLocations: downloadLocations.toString(),
    },
    // cross site access request, send cookie
    withCredentials: true,
    url: `${backendEndpoint}/api/photos/track-download`,
  })
    .then(() => {
      console.log('success');
    })
    .catch(function () {
      console.log('Error');
    });
}

export default async function createPpt(title, selectedImgs, pptOptions) {
  const pres = new PptxGenJS();
  // slide layout types - can pass in a string (option chosen by user) to choose;
  // width and height in inches
  const slideLayouts = {
    LAYOUT_16x9: { width: 10, height: 5.625 }, // default
    LAYOUT_16x10: { width: 10, height: 6.25 },
    LAYOUT_4x3: { width: 10, height: 7.5 },
    LAYOUT_WIDE: { width: 13.3, height: 7.5 },
  };
  // TODO: set slide parameters: y, x, ... based on slide layout chosen (if layout option for user made)
  const layoutType = 'LAYOUT_16x9';

  // calc width of 90% of slide (inches to pixels) for given layout (to fit text inside)
  const slideWidth = inchesToPixels(slideLayouts[layoutType].width * 0.9);
  const { fontFace, color, background, bold, italic, layoutTypes } = pptOptions;

  // if user selects no layouts - use TEXT_IMAGE layout
  if (layoutTypes.length === 0) {
    layoutTypes.push({ type: 'TEXT_IMAGE', label: 'Text (top) and image' });
  }

  // flash card layout types - large image and text
  const flashCardLayoutTypes = [
    'IMAGE_THEN_TEXT',
    'TEXT_THEN_TRANSLATION',
    'TRANSLATION_THEN_TEXT',
  ];
  // ==========================================================================================================================

  /// ///////////////////////// DEFINE SLIDE MASTER LAYOUTS /////////////////////////
  /// //////////////////// 1. (For title (page 1)... no image) ////////////////////
  pres.defineSlideMaster({
    title: 'TEXT',
    background: { color: background },
    objects: [
      {
        placeholder: {
          options: {
            name: 'text',
            type: 'title',
            x: '5%',
            y: '5%',
            w: '90%',
            h: '90%',
            align: 'center',
            valign: 'middle',
            fontFace,
            color,
            bold,
            italic,
          },
        },
      },
    ],
  });

  // //////////////////// 2. For title {1 or 2 lines} and image) ////////////////////
  pres.defineSlideMaster({
    // call the method to define a slide master layout
    title: 'TEXT_IMAGE',
    background: { color: background },
    objects: [
      {
        placeholder: {
          // Line 1 - 2 of title (make sure length is not too long...)
          options: {
            name: 'text-top',
            type: 'title',
            y: 0,
            h: 1.25,
            x: '5%',
            w: '90%',
            align: 'center',
            valign: 'middle',
            margin: 0,
            fontFace,
            color,
            bold,
            italic,
            isTextbox: true,
          },
        },
      },
    ],
  });

  // //////////////////// 3. For image and title {1 or 2 lines}) ////////////////////
  pres.defineSlideMaster({
    // call the method to define a slide master layout
    title: 'IMAGE_TEXT',
    background: { color: background },
    objects: [
      {
        placeholder: {
          // Line 1 - 2 of title (make sure length is not too long...)
          options: {
            name: 'text-bottom',
            type: 'title',
            y: 4.135,
            h: 1.25,
            x: '5%',
            w: '90%',
            align: 'center',
            valign: 'middle',
            margin: 0,
            fontFace,
            color,
            bold,
            italic,
            isTextbox: true,
          },
        },
      },
    ],
  });

  // ////////////////// 4. For title {1 or 2 lines}, translation and image) //////////////////
  pres.defineSlideMaster({
    // call the method to define a slide master layout
    title: 'TEXT_TRANSLATION_IMAGE',
    background: { color: background },
    objects: [
      {
        placeholder: {
          // Line 1 - 2 of title (make sure length is not too long...)
          options: {
            name: 'text-top',
            type: 'title',
            y: 0,
            h: 1.25,
            x: '5%',
            w: '90%',
            align: 'center',
            valign: 'middle',
            margin: 0,
            fontFace,
            color,
            bold,
            italic,
            isTextbox: true,
          },
        },
      },
      {
        placeholder: {
          // Line 2 of title (make sure length is not too long...)
          options: {
            name: 'translation-top',
            type: 'title',
            y: 1.3,
            x: '5%',
            w: '90%',
            align: 'center',
            fontFace,
            color,
            bold,
            italic,
            isTextbox: true,
          },
        },
      },
    ],
  });

  // ////////////////// 5. For image and title {1 or 2 lines}, translation) //////////////////
  pres.defineSlideMaster({
    // call the method to define a slide master layout
    title: 'IMAGE_TEXT_TRANSLATION',
    background: { color: background },
    objects: [
      {
        placeholder: {
          // Line 1 - 2 of title (make sure length is not too long...)
          options: {
            name: 'text-bottom',
            type: 'title',
            y: 3.385,
            h: 1.25,
            x: '5%',
            w: '90%',
            align: 'center',
            valign: 'middle',
            margin: 0,
            fontFace,
            color,
            bold,
            italic,
            isTextbox: true,
          },
        },
      },
      {
        placeholder: {
          // Line 2 of title (make sure length is not too long...)
          options: {
            name: 'translation-bottom',
            type: 'title',
            y: 4.675,
            x: '5%',
            w: '90%',
            align: 'center',
            fontFace,
            color,
            bold,
            italic,
            isTextbox: true,
          },
        },
      },
    ],
  });

  // ==========================================================================================================================

  // ADD TITLE SLIDE
  pres.addSection({ title: 'Word list title' });
  const titleSlide = pres.addSlide({
    masterName: 'TEXT',
    sectionTitle: 'Word list title',
  }); // pass master title to addSlide

  // calculate font size for text to fill 90% width of slide
  const fitTitle = getTextSizeForWidth(
    title,
    `${bold ? 'bold' : ''} ?px ${fontFace}`,
    slideWidth,
    60,
    110
  );
  titleSlide.addText(title, {
    placeholder: 'text',
    fontSize: fitTitle,
  });
  // add notes - TODO: needed? might use later
  titleSlide.addNotes('Title of word list');

  // ==========================================================================================================================

  /// ////////////////  for each layout type - create slides - loop thro ////////////////

  layoutTypes.forEach((type) => {
    // STEP 1: Create a section
    pres.addSection({ title: `${type.label}` });
    // STEP 2: Provide section title to a slide that you want in corresponding section

    // loop through selected images and create slides
    selectedImgs.forEach((imgObj) => {
      // height that works for default slide layout - can adjust later if other slide layouts used
      let imgHeight = 3.125;
      if (type.type === 'TEXT_IMAGE' || type.type === 'IMAGE_TEXT') {
        imgHeight = 4.0625;
      }
      if (type.type === 'IMAGE_THEN_TEXT') {
        imgHeight = 5;
      }
      // calculate width on slide based on original width
      const imgWidth =
        (imgObj.originalImgWidth / imgObj.originalImgHeight) * imgHeight;

      let fitTextFontSize;

      if (flashCardLayoutTypes.includes(type.type)) {
        fitTextFontSize = getTextSizeForWidth(
          title,
          `${bold ? 'bold' : ''} ?px ${fontFace}`,
          slideWidth,
          24,
          105
        );
      }

      // calculate font size for text to fill 90% width of slide
      fitTextFontSize = getTextSizeForWidth(
        imgObj.word,
        `${bold ? 'bold' : ''} ?px ${fontFace}`,
        slideWidth,
        24,
        100
      );
      // convert font size in px to pt
      const fontSizePt = (fitTextFontSize / 96) * 72;

      // 2. Add slide
      const slide = pres.addSlide({
        masterName: `${
          flashCardLayoutTypes.includes(type.type) ? 'TEXT' : type.type
        }`,
        sectionTitle: `${type.label}`,
      });

      // Add text, charts, etc. to any placeholder using its `name`
      if (type.type === 'TEXT_IMAGE') {
        slide.addText(imgObj.word, {
          placeholder: 'text-top',
          fontSize: fontSizePt,
        });
        //  move image lower (change y)
        slide.addImage({
          data: imgObj.img,
          y: 1.5,
          h: imgHeight,
          w: imgWidth,
          x: (slideLayouts[layoutType].width - imgWidth) / 2, // center image
        });
      }

      if (type.type === 'IMAGE_TEXT') {
        slide.addText(imgObj.word, {
          placeholder: 'text-bottom',
          fontSize: fontSizePt,
        });
        //  move image lower (change y)
        slide.addImage({
          data: imgObj.img,
          y: 0.2,
          h: imgHeight,
          w: imgWidth,
          x: (slideLayouts[layoutType].width - imgWidth) / 2, // center image
        });
      }

      if (type.type === 'TEXT_TRANSLATION_IMAGE') {
        slide.addText(imgObj.word, {
          placeholder: 'text-top',
          fontSize: fontSizePt,
        });

        slide.addText(imgObj.translation || 'translation error', {
          placeholder: 'translation-top',
        });
        //  move image lower (change y)
        slide.addImage({
          data: imgObj.img,
          y: 2.375,
          h: imgHeight,
          w: imgWidth,
          x: (slideLayouts[layoutType].width - imgWidth) / 2, // center image
        });
      }

      if (type.type === 'IMAGE_TEXT') {
        slide.addText(imgObj.word, {
          placeholder: 'text-bottom',
          fontSize: fontSizePt,
        });
        slide.addImage({
          data: imgObj.img,
          y: 0.2,
          h: imgHeight,
          w: imgWidth,
          x: (slideLayouts[layoutType].width - imgWidth) / 2, // center image
        });
      }

      if (type.type === 'IMAGE_TEXT_TRANSLATION') {
        slide.addText(imgObj.word, {
          placeholder: 'text-bottom',
          fontSize: fontSizePt,
        });

        slide.addText(imgObj.translation || 'translation error', {
          placeholder: 'translation-bottom',
        });
        slide.addImage({
          data: imgObj.img,
          y: 0.2,
          h: imgHeight,
          w: imgWidth,
          x: (slideLayouts[layoutType].width - imgWidth) / 2, // center image
        });
      }

      // flash card type layouts
      if (type.type === 'IMAGE_THEN_TEXT') {
        slide.addImage({
          data: imgObj.img,
          y: 0.3125,
          h: imgHeight,
          w: imgWidth,
          x: (slideLayouts[layoutType].width - imgWidth) / 2, // center image
        });
        // Add another slide
        const slideTwo = pres.addSlide({
          masterName: 'TEXT',
          sectionTitle: `${type.label}`,
        });
        slideTwo.addText(imgObj.word, {
          placeholder: 'text',
          fontSize: fontSizePt,
        });
      }
      if (type.type === 'TEXT_THEN_TRANSLATION') {
        slide.addText(imgObj.word, {
          placeholder: 'text',
          fontSize: fontSizePt,
        });
        // Add another slide
        const slideTwo = pres.addSlide({
          masterName: 'TEXT',
          sectionTitle: `${type.label}`,
        });
        slideTwo.addText(imgObj.translation || 'translation error', {
          placeholder: 'text',
          fontSize: fontSizePt,
        });
      }
      if (type.type === 'TRANSLATION_THEN_TEXT') {
        slide.addText(imgObj.translation || 'translation error', {
          placeholder: 'text',
          fontSize: fontSizePt,
        });
        // Add another slide
        const slideTwo = pres.addSlide({
          masterName: 'TEXT',
          sectionTitle: `${type.label}`,
        });
        slideTwo.addText(imgObj.word, {
          placeholder: 'text',
          fontSize: fontSizePt,
        });
      }
    });
  });

  // 4. Save the Presentation and trigger download event for Unsplash images: https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
  // await used so that handleSubmit() in ImagesSelectDialog shows loading = true until ppt created
  // Using Promise to determine when the file has actually completed generating
  const downloadLocations = [];
  selectedImgs.forEach((imgObj) => {
    downloadLocations.push(imgObj.triggerDownloadAPI);
  });
  // remove triggerDownloadAPI values that are null (locally uploaded image)
  const filteredDownloadLocations = downloadLocations.filter(
    (url) => url !== null
  );
  trackDownloads(filteredDownloadLocations);
  await pres
    .writeFile({ fileName: `${title}` })
    .then((fileName) => console.log(`Created file: ${fileName}`));
}
