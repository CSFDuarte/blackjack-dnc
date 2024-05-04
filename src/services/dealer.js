import axios from 'axios';

const api = axios.create({
  baseURL: 'https://deckofcardsapi.com/api',
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

  //* Embaralha o baralho
  async shuffle() {
    const response = 
      this.deck.deck_id === '' ?
        await api.get('/deck/new/shuffle/?deck_count=1') :
        await api.get(`/deck/${this.deck.deck_id}/shuffle`);

    this.deck.deck_id = response.data.deck_id;
    this.deck.remaining = response.data.remaining;
    this.deck.shuffled = true;
    this.history = [];

    return this.deck;
  }

  //* Compra uma carta
  async draw() {
    const response = await api.get(`/deck/${this.deck.deck_id}/draw/?count=1`);
    this.history.push(response.data.cards[0]);
    return response.data.cards[0];
  }

  //* Retorna o histórico de cartas
  getHistory() {
    return this.history;
  }

  //* Atualiza o placar do jogo
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

  //* Calcula o resultado da aposta
  getBetResult(result, bet) {
    if (result === 'Blackjack!')
      return bet * 2.5;
    if (result === 'Perdeu!' || (this.score[1] || this.score[0]) < 15) 
      return 0;
    if (result === null) 
      return bet * (1 + (((this.score[1] || this.score[0]) - 10)/100));
  }

  //* Retorna o placar do jogo
  getScore(bet) {
    //* Atualiza o placar em numbers
    const score = this.updateScore();

    //* Transforma o placar em string
    let answer = '';
    score.forEach((value, index) => 
      answer += value + (index < score.length - 1 ? ' ou ' : ''));

    //* Verifica o resultado do jogo
    const result =
      score.length === 0 ?
        'Perdeu!'
      : score.length > 0 && score.includes(21) ?
        'Blackjack!'
      :
        null;

    return {
      score: answer,
      result: result,
      game: !result,
      money: this.getBetResult(result, bet),
    };
  }
}