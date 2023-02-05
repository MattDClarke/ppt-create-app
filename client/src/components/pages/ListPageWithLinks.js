import React from 'react';
import { useParams, Link as RouterLink, useRouteMatch } from 'react-router-dom';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useBooksGet from '../../hooks/useBooksGet';
import { useTitle } from '../../hooks/useTitle';
import Loader from '../reuseable/Loader';
import { sentenceCase } from '../../helpers/utils';

export default function ListPageWithLinks() {
  // The <List> that rendered this component has a
  // path of `/lists/:listId`. The `:listId` portion
  // of the URL indicates a placeholder that we can
  // get from `useParams()`.
  // const [imageIds, setImageIds] = useState([]);
  const { list, level, grade } = useParams();
  useTitle('ppt Create | Textbooks');
  const levelAndGrade = `${list}_${level}_${grade}`;
  const { status, data, error } = useBooksGet(levelAndGrade);
  const { url } = useRouteMatch();


  function sortBooks(a, b) {
    const nameA = a.bookKey;
    const nameB = b.bookKey;
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  }



  return (
    <>
      <Typography variant="h1">
        {sentenceCase(level)} School Grade {grade}
      </Typography>
      {/* eslint-disable-next-line  */}
      {status === 'loading' ? (
        <Loader fullScreen={false} />
      ) : status === 'error' ? (
        <span>Error: {error.response.data}</span>
      ) : (
        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          p={2}
          m={2}
          bgcolor="background.paper"
          sx={{ margin: (theme) => `${theme.spacing(2)} auto` }}
        >
          {data.books
            .sort((a, b) => sortBooks(a, b))
            .map(
              ({ bookKey, year, publisher, authorSurname }, index) => (
                <Card
                  key={bookKey}
                  sx={{ maxWidth: 210, margin: (theme) => theme.spacing(2) }}
                >
                  <CardActionArea>
                    <Link
                      component={RouterLink}
                      to={`${url}/${year}_${publisher.toLowerCase()}_${authorSurname.toLowerCase()}`}
                    >
                      <CardMedia
                        component="img"
                        alt={`book cover - ${year} ${publisher} ${authorSurname}`}
                        sx={{ height: '247px' }}
                        image={`https://res.cloudinary.com/dorxifpci/image/upload/w_200/v1636282318/${data.publicIds[index]}`}
                      />

                      <CardContent sx={{ textDecoration: 'none' }}>
                        <Typography gutterBottom variant="h4" component="h2">
                          {`${publisher} | ${year}`}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          {`Author: ${authorSurname}`}
                        </Typography>
                      </CardContent>
                    </Link>
                  </CardActionArea>
                </Card>
              )
            )}
        </Box>
      )}
    </>
  );
}
