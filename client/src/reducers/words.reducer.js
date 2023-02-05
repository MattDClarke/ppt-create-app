import { v4 as uuid } from 'uuid';

const wordsReducer = (state, action) => {
  const { type, id, word, newWord, newWordIds, newWords } = action;
  switch (type) {
    case 'ADD':
      return [...state, { id: uuid(), word }];

    case 'ADD_ALL': {
      // give each word a new id - there may be duplicates
      // (e.g. list 2 created with list 1. list 2 word modified -> will have same id as word from list 1)
      const newWordsNewIds = newWords.map((wrd) => ({ ...wrd, id: uuid() }));
      return [...newWordsNewIds];
      // return [...newWords];
    }

    case 'REMOVE':
      return state.filter((wrd) => wrd.id !== id);

    case 'REMOVE_ALL':
      return [];

    case 'EDIT':
      return state.map((wrd) =>
        wrd.id === id ? { ...wrd, word: newWord } : wrd
      );

    case 'REORDER': {
      // need to re-arrange array of words based on new id order
      // map over passed in id array
      // for each id search through state, if id matches then add that word object to the new state
      // update state using newState
      const newState = newWordIds.map(
        (newWordId) =>
          // filter returns an array, get obj using [0]
          state.filter((wrd) => wrd.id === newWordId)[0]
      );

      return newState;
    }
    default:
      return state;
  }
};

export default wordsReducer;
