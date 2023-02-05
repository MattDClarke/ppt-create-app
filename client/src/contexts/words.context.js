// all methods that interact with words
import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import wordsReducer from '../reducers/words.reducer';

export const WordsContext = createContext();
export const DispatchWordsContext = createContext();

export function WordsProvider({ children }) {
  const [words, dispatchWords] = useReducer(wordsReducer, []);

  return (
    <WordsContext.Provider value={words}>
      <DispatchWordsContext.Provider value={dispatchWords}>
        {children}
      </DispatchWordsContext.Provider>
    </WordsContext.Provider>
  );
}

WordsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
