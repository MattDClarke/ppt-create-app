import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import CssBaseline from '@mui/material/CssBaseline';
import { UserProvider } from '../../contexts/user.context';
import { WordsProvider } from '../../contexts/words.context';
import { ColorModeProvider } from '../../contexts/colorMode.context';
import Layout from './Layout';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <WordsProvider>
            {/* contains theme as well */}
            <ColorModeProvider>
              <CssBaseline />
              <Layout />
            </ColorModeProvider>
            <ReactQueryDevtools />
          </WordsProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
