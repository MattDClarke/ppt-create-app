import React from 'react';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTitle } from '../../hooks/useTitle';
import { listItems } from '../../helpers/listsValues';

export default function Lists() {
  useTitle('ppt Create | Lists');
  const { url } = useRouteMatch();
  return (
    <>
      <Typography variant="h1">Lists</Typography>
      <Typography variant="subtitle1" component="p">
        Choose a word list from the following categories
      </Typography>
      <Grid
        container
        justifyContent="center"
        sx={{ marginTop: (theme) => theme.spacing(2) }}
      >
        <Grid item xs={11} md={8} lg={6}>
          <Paper
            sx={{
              textAlign: 'left',
              pb: 2,
            }}
          >
            <Typography variant="h2" pt={2} px={2}>
              South Korea school textbooks
            </Typography>
            <Typography variant="h3" pt={2} px={2}>
              Elementary School
            </Typography>
            <List>
              <Divider />
              <ListItem sx={{ padding: (theme) => theme.spacing(0.2, 2) }}>
                <Link
                  component={RouterLink}
                  to={`${url}/korea-textbook/elementary/3`}
                >
                  Grade 3
                </Link>
              </ListItem>
              <Divider />
              <ListItem sx={{ padding: (theme) => theme.spacing(0.2, 2) }}>
                <Link
                  component={RouterLink}
                  to={`${url}/korea-textbook/elementary/4`}
                >
                  Grade 4
                </Link>
              </ListItem>
              <Divider />
              <ListItem sx={{ padding: (theme) => theme.spacing(0.2, 2) }}>
                <Link
                  component={RouterLink}
                  to={`${url}/korea-textbook/elementary/5`}
                >
                  Grade 5
                </Link>
              </ListItem>
              <Divider />
              <ListItem sx={{ padding: (theme) => theme.spacing(0.2, 2) }}>
                <Link
                  component={RouterLink}
                  to={`${url}/korea-textbook/elementary/6`}
                >
                  Grade 6
                </Link>
              </ListItem>
              <Divider />
            </List>

            <Typography variant="h2" pt={2} px={2}>
              Other
            </Typography>

            <List>
              <Divider />
              {listItems.map(({ label, value }) => (
                <React.Fragment key={value}>
                  <ListItem
                    key={value}
                    sx={{ padding: (theme) => theme.spacing(0.2, 2) }}
                  >
                    <Link component={RouterLink} to={`${url}/${value}`}>
                      {label}
                    </Link>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
