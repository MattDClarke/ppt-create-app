import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';
import { Draggable } from 'react-beautiful-dnd';
import textImageLight from '../../assets/images/textImageLight.svg';
import imageTextLight from '../../assets/images/imageTextLight.svg';
import textTranslationImageLight from '../../assets/images/textTranslationImageLight.svg';
import imageTextTranslationLight from '../../assets/images/imageTextTranslationLight.svg';
import imageThenTextLight from '../../assets/images/imageThenTextLight.svg';
import textThenTranslationLight from '../../assets/images/textThenTranslationLight.svg';
import translationThenTextLight from '../../assets/images/translationThenTextLight.svg';
import textImageDark from '../../assets/images/textImageDark.svg';
import imageTextDark from '../../assets/images/imageTextDark.svg';
import textTranslationImageDark from '../../assets/images/textTranslationImageDark.svg';
import imageTextTranslationDark from '../../assets/images/imageTextTranslationDark.svg';
import imageThenTextDark from '../../assets/images/imageThenTextDark.svg';
import textThenTranslationDark from '../../assets/images/textThenTranslationDark.svg';
import translationThenTextDark from '../../assets/images/translationThenTextDark.svg';

import {
  classes,
  ListItemRoot,
  ListItemImg,
} from './styles/LayoutTypesDialogListItemStyles';

export default function LayoutTypesDialogListItem({
  list,
  id,
  index,
  layoutTypes,
  setLayoutTypes,
}) {
  const currTheme = useTheme();
  const handleChange = (position) => {
    const updatedLayoutTypes = layoutTypes.map((item, i) =>
      i === position ? { ...item, checked: !item.checked } : item
    );
    setLayoutTypes(updatedLayoutTypes);
  };

  const imgSrcLight = {
    TEXT_IMAGE: textImageLight,
    IMAGE_TEXT: imageTextLight,
    TEXT_TRANSLATION_IMAGE: textTranslationImageLight,
    IMAGE_TEXT_TRANSLATION: imageTextTranslationLight,
    IMAGE_THEN_TEXT: imageThenTextLight,
    TEXT_THEN_TRANSLATION: textThenTranslationLight,
    TRANSLATION_THEN_TEXT: translationThenTextLight,
  };

  const imgSrcDark = {
    TEXT_IMAGE: textImageDark,
    IMAGE_TEXT: imageTextDark,
    TEXT_TRANSLATION_IMAGE: textTranslationImageDark,
    IMAGE_TEXT_TRANSLATION: imageTextTranslationDark,
    IMAGE_THEN_TEXT: imageThenTextDark,
    TEXT_THEN_TRANSLATION: textThenTranslationDark,
    TRANSLATION_THEN_TEXT: translationThenTextDark,
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <ListItemRoot
          // eslint-disable-next-line
          {...provided.draggableProps}
          // eslint-disable-next-line
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={classes.root}
          divider
          sx={{
            transition: 'background-color 0.3s ease',
            padding: 0,
            backgroundColor: (theme) =>
              snapshot.isDragging.toString() === 'true'
                ? `${theme.palette.action.selected}`
                : `${theme.palette.background.def}`,
          }}
          // spread in draggable props styles
          style={{
            ...provided.draggableProps.style,
          }}
          aria-roledescription="Press space bar to lift the layout type"
        >
          <Tooltip TransitionComponent={Zoom} title="Reorder" placement="top">
            <DragIndicatorIcon
              className={classes.DragIndicatorIcon}
              sx={{
                marginRight: { xs: '0', sm: '24px' },
              }}
            />
          </Tooltip>
          <Box className={classes.ListItemFormControls}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={layoutTypes[index].checked}
                  onChange={() => handleChange(index)}
                  name={list.type}
                  icon={<CheckCircleOutlinedIcon />}
                  checkedIcon={<CheckCircleIcon />}
                  sx={{
                    color: (theme) => theme.palette.success.light,
                    '&.Mui-checked': {
                      color: (theme) => theme.palette.success.main,
                    },
                  }}
                  inputProps={{
                    'aria-label': `${layoutTypes[index].label}`,
                  }}
                />
              }
              label=""
            />
            <ListItemImg
              src={
                currTheme.palette.mode === 'dark'
                  ? imgSrcDark[list.type]
                  : imgSrcLight[list.type]
              }
              alt={list.label}
              sx={{
                height: {
                  xs: '50px',
                  xsSm: '66px',
                  lg: '100px',
                },
              }}
            />
            <Box
              className={classes.ListItemLabel}
              sx={{
                fontSize: {
                  xs: 16,
                  lg: 24,
                },
                paddingLeft: { xs: '3px', xsSm: 1, smSmMd: 3 },
                py: 2,
              }}
            >
              {list.label}
            </Box>
          </Box>
        </ListItemRoot>
      )}
    </Draggable>
  );
}

LayoutTypesDialogListItem.propTypes = {
  list: PropTypes.object.isRequired,
  layoutTypes: PropTypes.array.isRequired,
  setLayoutTypes: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};
