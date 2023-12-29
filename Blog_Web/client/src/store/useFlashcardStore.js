import { create } from 'zustand';
import axiosClient from '~/axios';

const useFlashcardStore = create((set, get) => ({
  // Modals
  selectedDeck: {},
  setSelectedDeck: (selectedDeck) => set({ selectedDeck }),

  editModalOpen: false,
  setEditModalOpen: (editModalOpen) => set({ editModalOpen }),

  // Use for deck's modal
  shouldOpenModal: false,
  setShouldOpenModal: (shouldOpenModal) => set({ shouldOpenModal }),

  // Use for flashcard's modal
  selectedCard: {},
  setSelectedCard: (selectedCard) => set({ selectedCard }),

  shouldOpenFlashcardModal: false,
  setShouldOpenFlashcardModal: (shouldOpenFlashcardModal) =>
    set({ shouldOpenFlashcardModal }),

  // Use for deck's detail
  deck: {},
  setDeck: (deck) => set({ deck }),

  deckFlashcards: [],
  setDeckFlashcards: (deckFlashcards) => set({ deckFlashcards }),

  decks: [],
  setDecks: (decks) => set({ decks }),

  fetchingDeck: false,
  setFetchingDeck: (fetchingDeck) => set({ fetchingDeck }),

  fetchingDecks: false,
  setFetchingDecks: (fetchingDecks) => set({ fetchingDecks }),

  newDeckErrors: [],
  setNewDeckErrors: (newDeckErrors) => set({ newDeckErrors }),

  fetchDeck: (deckId) => {
    set({ fetchingDeck: true });
    axiosClient
      .get(`/decks/${deckId}`)
      .then(({ data }) => {
        const { flashcards, ...deck } = data.data;
        set({ deck: deck });
        set({ deckFlashcards: flashcards });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        set({ fetchingDeck: false });
      });
  },

  fetchDecks: () => {
    set({ fetchingDecks: true });
    axiosClient
      .get(`/decks`)
      .then(({ data }) => {
        set({ decks: data.data });
      })
      .catch((err) => {
        if (err.response.status === 422) {
          // const responseErrors = err.response.data.errors;
        } else {
          console.log(err);
        }
      })
      .finally(() => {
        set({ fetchingDecks: false });
      });
  },

  createDeckLoading: false,
  setCreateDeckLoading: (createDeckLoading) => set({ createDeckLoading }),
}));

export default useFlashcardStore;
