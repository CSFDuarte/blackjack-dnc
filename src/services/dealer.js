import axios from 'axios';

const api = axios.create({
  baseURL: 'https://deckofcardsapi.com/api/',
});

export const CARD_BACKGROUND = 'https://deckofcardsapi.com/static/img/back.png';

export default class Dealer {
  deck = {
    deck_id: '',
    remaining: 0,
    shuffled: false,
  };

  history = [];

  async shuffle() {
    try {
      const response = 
        this.deck.deck_id === '' ?
          await api.get('deck/new/shuffle/?deck_count=1') :
          await api.get(`deck/${this.deck.deck_id}/shuffle`);

      this.deck.deck_id = response.data.deck_id;
      this.deck.remaining = response.data.remaining;
      this.deck.shuffled = true;

      return this.deck;
    } catch (error) {
      console.error(error);
      throw new Error('Falha ao embaralhar o baralho.');
    }
  }

  async draw() {
    try{
      const response = await api.get(`deck/${this.deck.deck_id}/draw/?count=1`);
      this.history.push(response.data.cards[0]);
      return response.data.cards[0];
    } catch (error) {
      console.error(error);
      throw new Error('Falha ao comprar carta.'); 
    }
  }

  async getHistory() {
    return this.history;
  }
}