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

  score = [0];
  history = [];

  async shuffle() {
    const response = 
      this.deck.deck_id === '' ?
        await api.get('deck/new/shuffle/?deck_count=1') :
        await api.get(`deck/${this.deck.deck_id}/shuffle`);

    this.deck.deck_id = response.data.deck_id;
    this.deck.remaining = response.data.remaining;
    this.deck.shuffled = true;
    this.history = [];

    return this.deck;
  }

  async draw() {
    const response = await api.get(`deck/${this.deck.deck_id}/draw/?count=1`);
    this.history.push(response.data.cards[0]);
    return response.data.cards[0];
  }

  getHistory() {
    return this.history;
  }

  updateScore() {
    this.score = [0];
    for (let i = 0; i < this.history.length; i++) {
      const card = this.history[i];
      //* Para cada carta, ele vai somar o valor dela em todos os scores
      this.score.forEach((value, index) => {
        this.score[index] +=
          card.value === 'ACE' ? 1 :
          card.value === 'JACK' || card.value === 'QUEEN' || card.value === 'KING' ? 10 :
          parseInt(card.value);
      });

      
      //* Se a carta for um Ás ele adiciona um novo resultado com o valor 1
      if(card.value === 'ACE' && this.score.length == 1)
          this.score.push(this.score[0] + 10);
    }

    //* Remove os valores maiores que 21
    this.score = this.score.filter(value => value <= 21);
    return this.score;
  }

  getScore() {
    //* Atualiza o placar em numbers
    const score = this.updateScore();

    //* Se o valor passou de 21, ele retorna PERDEU, mas se algum é valor é 21, ele retorna VENCEU
    if (score.length === 0) return 'PERDEU';
    if (score.includes(21)) return 'VENCEU';

    let answer = '';
    score.forEach((value, index) => 
      answer += value + (index < score.length - 1 ? ' ou ' : ''));

    return answer;
  }
}