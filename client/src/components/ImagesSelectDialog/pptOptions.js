export const fontFaceOptions = [
  'Arial',
  'Calibri',
  'Century Gothic',
  'Comic Sans MS',
  'Corbel',
  'Georgia',
  'Tahoma',
  'Verdana',
];

export const layoutTypesOptionsWithTranslations = [
  { type: 'TEXT_IMAGE', checked: false, label: 'Text (top) and image' },
  { type: 'IMAGE_TEXT', checked: false, label: 'Image (top) and text' },
  {
    type: 'TEXT_TRANSLATION_IMAGE',
    checked: false,
    label: 'Text, translation (top) and image',
  },
  {
    type: 'IMAGE_TEXT_TRANSLATION',
    checked: false,
    label: 'Image (top), text and translation',
  },
  // flash card types - 2 slides / word
  {
    type: 'IMAGE_THEN_TEXT',
    checked: false,
    label: 'Image (slide 1) and text (slide 2)',
  },
  {
    type: 'TEXT_THEN_TRANSLATION',
    checked: false,
    label: 'Text (slide 1) and image (slide 2)',
  },
  {
    type: 'TRANSLATION_THEN_TEXT',
    checked: false,
    label: 'Translation (slide 1) and text (slide 2)',
  },
];

export const layoutTypesOptionsWithoutTranslations = [
  { type: 'TEXT_IMAGE', checked: false, label: 'Text (top) and image' },
  { type: 'IMAGE_TEXT', checked: false, label: 'Image (top) and text' },
  // flash card types - 2 slides / word
  {
    type: 'IMAGE_THEN_TEXT',
    checked: false,
    label: 'Image (slide 1) and text (slide 2)',
  },
];

export const languageOptions = [
  { label: 'Afrikaans', code: 'af' },
  { label: 'Arabic', code: 'ar' },
  { label: 'Chinese (Simplified)', code: 'zh-CN' },
  { label: 'Chinese (Traditional)', code: 'zh-TW' },
  { label: 'Danish', code: 'da' },
  { label: 'Dutch', code: 'nl' },
  { label: 'Filipino', code: 'fil' },
  { label: 'French', code: 'fr' },
  { label: 'German', code: 'de' },
  { label: 'Greek', code: 'el' },
  { label: 'Gujarati', code: 'gu' },
  { label: 'Hebrew', code: 'iw' },
  { label: 'Hindi', code: 'hi' },
  { label: 'Italian', code: 'it' },
  { label: 'Japanese', code: 'ja' },
  { label: 'Korean', code: 'ko' },
  { label: 'Russian', code: 'ru' },
  { label: 'Spanish', code: 'es' },
  { label: 'Swahili', code: 'sw' },
  { label: 'Tamil', code: 'ta' },
  { label: 'Turkish', code: 'tr' },
  { label: 'Vietnamese', code: 'vi' },
  { label: 'Xhosa', code: 'xh' },
  { label: 'Zulu', code: 'zu' },
];
