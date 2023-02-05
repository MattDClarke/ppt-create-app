import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ArrowRightAltOutlinedIcon from '@mui/icons-material/ArrowRightAltOutlined';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { useTitle } from '../../hooks/useTitle';
import layoutsAllLight from '../../assets/images/layoutsAllLight.svg';
import layoutsAllDark from '../../assets/images/layoutsAllDark.svg';
import { ImgRoot } from './styles/GuideStyles';

export default function Guide() {
  useTitle('ppt Create | Guide');
  const currTheme = useTheme();
  return (
    <div>
      <Typography variant="h1">Guide</Typography>
      <Grid
        container
        justifyContent="center"
        sx={{ marginTop: (theme) => theme.spacing(2) }}
      >
        <Grid item xs={11} md={8} lg={6}>
          <Paper>
            <Box sx={{ py: 3, px: 2, textAlign: 'left' }}>
              The purpose of this website is to make creating vocabulary
              introduction PowerPoint presentations easier for teachers. This
              site may be particularly useful for English teachers in Korea.
            </Box>
            <Divider />
            <Divider />
            <Typography variant="h2" align="left" sx={{ p: 2 }}>
              How to use
            </Typography>
            <List>
              <ListItem sx={{ display: 'block' }}>
                <Box
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}
                >
                  1. Choose or create a list of words
                </Box>
                <List>
                  <ListItem sx={{ display: 'block' }}>
                    You can select word lists from Korean Elementary
                    School textbook lessons or some commonly used vocabulary
                    word lists such as verbs or animals. They can be found on
                    the{' '}
                    <Link component={RouterLink} to="/lists">
                      Lists
                    </Link>{' '}
                    page.
                  </ListItem>
                  <ListItem sx={{ display: 'block' }}>
                    You can also create your own word lists on the{' '}
                    <Link component={RouterLink} to="/create">
                      Create
                    </Link>{' '}
                    page. Once you have created a list, you can choose 1 one of
                    3 options:
                    <List>
                      <ListItem>1. Save List</ListItem>
                      <ListItem>
                        2. Save list and make PowerPoint Presentation
                      </ListItem>
                      <ListItem>3. Make PowerPoint Presentation</ListItem>
                    </List>
                  </ListItem>
                  <ListItem sx={{ display: 'block' }}>
                    Your saved word lists are available on the{' '}
                    <Link component={RouterLink} to="/create">
                      Create
                    </Link>{' '}
                    page, click the <b>My saved lists</b> button at the top of
                    the page.
                  </ListItem>
                </List>
              </ListItem>
              <ListItem sx={{ display: 'block' }}>
                <Box
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 18,
                  }}
                >
                  2. Choose images and your PowerPoint layout
                </Box>
              </ListItem>
              <List>
                <ListItem sx={{ display: 'block' }}>
                  Once you click the{' '}
                  <em>Save list and make PowerPoint Presentation</em> button or{' '}
                  <em>Make PowerPoint Presentation</em> button, a pop-up will
                  appear where you will select an image for each word in the
                  word list and then you will choose how your PowerPoint
                  presentation will look.
                </ListItem>
                <ListItem sx={{ display: 'block' }}>
                  For each word: select one of the displayed images (from{' '}
                  <Link href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</Link>) by clicking
                  on it, or select an image from your computer
                </ListItem>
                <ListItem sx={{ display: 'block' }}>
                  Choose how you want your PowerPoint presentation to look. The
                  following customization options are available:
                </ListItem>
                <List>
                  <ListItem>
                    <ListItemIcon sx={{ justifyContent: 'center' }}>
                      <FiberManualRecordOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    font (type, colour, bold, italic)
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ justifyContent: 'center' }}>
                      <FiberManualRecordOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    background colour
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ justifyContent: 'center' }}>
                      <FiberManualRecordOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    add translation
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ justifyContent: 'center' }}>
                      <FiberManualRecordOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    select 1 or many PowerPoint presentation layouts to use for
                    each word of your word list. <br />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon />
                    These are the currently available PowerPoint layouts that
                    you can choose from:
                  </ListItem>
                  <ImgRoot
                    src={
                      currTheme.palette.mode === 'dark'
                        ? layoutsAllDark
                        : layoutsAllLight
                    }
                    sx={{
                      width: { xs: '80%', xsSm: '400px' },
                    }}
                    alt="all available layout types"
                  />
                </List>
              </List>
              <ListItem>
                <Box
                  sx={{
                    fontWeight: 'bold',
                    fontSize: 18,
                    py: 4,
                  }}
                >
                  3. Download your created PowerPoint Presentation File to your
                  computer
                </Box>
              </ListItem>
              <Divider />
              <ListItem
                sx={{
                  fontWeight: 'bold',
                  py: 3,
                  fontSize: 'large',
                  backgroundColor: (theme) =>
                    currTheme.palette.mode === 'dark'
                      ? theme.palette.warning.dark
                      : theme.palette.warning.light,
                }}
              >
                <ListItemIcon>
                  <ArrowRightAltOutlinedIcon />
                </ListItemIcon>
                You need to create an account to use this website
              </ListItem>
            </List>
            <Divider />
            <Divider />
            <Typography variant="h2" align="left" sx={{ p: 2 }}>
              Note
            </Typography>
            <List>
              <ListItem>
                If a word list is saved with the same name as a previously
                created list, the words in the previously created list will be
                overwritten.
              </ListItem>
              <Divider />
              <ListItem>Each user can save up to 30 word lists.</ListItem>
              <Divider />
              <ListItem>
                The number of image searches per day is currently limited to 50
                per user. (10 images are displayed per search). The number of
                searches for the whole site is also limited. If the limit is
                reached, you can still upload images from your computer.
              </ListItem>
              <Divider />
              <ListItem sx={{ display: 'block' }}>
                The translation may also be limited. If the limit is reached,{' '}
                <em>'translation error'</em> will be displayed in place of the
                translations in the PowerPoint presentation. In this case, you
                can manually translate each word in PowerPoint by adding the
                word in place of <em>'translation error'</em>, selecting the
                word, right-clicking it and selecting <em>Translate</em>.
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
