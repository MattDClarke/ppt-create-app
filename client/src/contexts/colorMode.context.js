import { useMemo, createContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useLocalStorage from '../hooks/useLocalStorage';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function ColorModeProvider({ children }) {
  // const [mode, setMode] = useState('light');
  const [mode, setMode] = useLocalStorage('colorMode', 'light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [setMode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          // prevent messing with colorMode local storage in dev tools
          mode: `${mode === 'light' || mode === 'dark' ? mode : 'light'}`,
        },
        typography: {
          button: {
            // default is uppercase
            textTransform: 'none',
            margin: '0.2rem',
          },
        },
        // MUI defaults + custom (xsSm, smMd)
        breakpoints: {
          values: {
            xs: 0,
            xsSm: 500,
            sm: 600,
            smSmMd: 720,
            smMd: 768,
            md: 900,
            lg: 1200,
            xl: 1536,
          },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              '&::selection': {
                background: `${mode === 'light' ? '#ff9800' : '#e65100'}`,
              },

              body: {
                scrollbarColor: '#6b6b6b #2b2b2b',
                '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
                  backgroundColor: `${
                    mode === 'light' ? '#bdbdbd' : '#2b2b2b'
                  }`,
                },
                '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
                  borderRadius: 8,
                  backgroundColor: `${
                    mode === 'light' ? '#1976d2' : '#9c27b0'
                  }`,
                  minHeight: 24,
                  border: `3px solid ${
                    mode === 'light' ? '#bdbdbd' : '#2b2b2b'
                  }`,
                },
                '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover':
                  {
                    backgroundColor: `${
                      mode === 'light' ? '#42a5f5' : '#ba68c8'
                    }`,
                  },
              },
            },
          },
          MuiAppBar: {
            defaultProps: {
              enableColorOnDark: true,
            },
          },
          MuiLink: {
            styleOverrides: {
              root: {
                textDecoration: 'none',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              // Name of the slot
              containedPrimary: {
                // Some CSS
                transition: '0.5s',
                backgroundSize: '200% auto',
                backgroundImage: `
                ${
                  mode === 'light'
                    ? 'linear-gradient(to right, #9c27b0 0%, #0288d1 60%, #9c27b0 100%)'
                    : 'linear-gradient(to right, #ba68c8 0%, #42a5f5 60%, #ba68c8 100%)'
                }
                `,
                '&:hover': {
                  backgroundPosition: 'right center',
                },
              },
              containedError: {
                transition: '0.5s',
                backgroundSize: '200% auto',
                backgroundImage: `
                ${
                  mode === 'light'
                    ? 'linear-gradient(to left, #d32f2f 0%, #e65100 60%, #d32f2f 100%)'
                    : 'linear-gradient(to left, #ef5350 0%, #d32f2f 60%, #ef5350 100%)'
                }
                `,
                '&:hover': {
                  backgroundPosition: 'right center',
                },
              },
              outlinedPrimary: {
                '&:hover': {
                  borderColor: '#01579b',
                },
              },
              outlinedError: {
                '&:hover': {
                  borderColor: '#ef5350',
                },
              },
            },
          },
          MuiTooltip: {
            opacity: 1,
            styleOverrides: {
              tooltip: {
                backgroundColor: `${mode === 'light' ? '#ebebeb' : '#3b3a3a'}`,
                color: `${mode === 'light' ? '#121212' : '#fff'}`,
              },
              popper: {
                opacity: 1,
              },
            },
          },
          MuiLinearProgress: {
            styleOverrides: {
              barColorPrimary: {
                backgroundImage: `
                ${
                  mode === 'light'
                    ? 'linear-gradient(to right, #9c27b0 0%, #0288d1 60%, #9c27b0 100%)'
                    : 'linear-gradient(to right, #ba68c8 0%, #42a5f5 60%, #ba68c8 100%)'
                }
                `,
              },
            },
          },
        },
      }),
    [mode]
  );

  // responsive Typography
  theme.typography.h1 = {
    fontSize: 34,
    px: 2,
    [theme.breakpoints.up('sm')]: {
      fontSize: 36,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 38,
    },
  };
  theme.typography.subtitle1 = {
    fontSize: 20,
    paddingLeft: 2,
    [theme.breakpoints.up('sm')]: {
      fontSize: 23,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 26,
    },
  };
  theme.typography.h2 = {
    fontSize: 20,
    paddingLeft: 2,
    [theme.breakpoints.up('sm')]: {
      fontSize: 23,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 26,
    },
  };
  theme.typography.h3 = {
    fontSize: 18,
    [theme.breakpoints.up('sm')]: {
      fontSize: 21,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 24,
    },
  };
  theme.typography.h4 = {
    fontSize: 16,
    [theme.breakpoints.up('sm')]: {
      fontSize: 19,
    },
    [theme.breakpoints.up('lg')]: {
      fontSize: 22,
    },
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}

ColorModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
