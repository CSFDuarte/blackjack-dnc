import Dealer, { CARD_BACKGROUND } from '@/services/dealer';
import { translateSuit, translateValue } from '@/services/translation';
import { Button, Container, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';

const dealer = new Dealer();

function App() {
  const [card, setCard] = useState(null);
  const [deck, setDeck] = useState({
    deck_id: '',
    remaining: 0,
    shuffled: false,
  });
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState('0');

  const shuffleDeck = async () => {
    try {
      setDeck(await dealer.shuffle());
      setCard(null);
      setHistory([]);
      setScore('0');
    } catch (error) {
      console.error('Falha ao embaralhar:', error);
    }
  };

  const drawCard = async () => {
    try {
      setDeck({ ...deck, remaining: deck.remaining - 1, shuffled: deck.remaining > 1})
      setCard(await dealer.draw());
      setHistory(await dealer.getHistory());
      setScore(await dealer.getScore());
    } catch (error) {
      console.error('Falha ao comprar carta:', error);
    }
  };

  return (
    <Container>
      <Grid container justifyContent="center" alignItems="flex-start" direction={'row'} my={1}>
        <Grid item justifyContent="center" alignItems="flex-start" direction={'column'} my={2} sm={12} md={6}>
          {/* CABEÇALHO */}
          <Grid container direction={"column"}>
            <Typography variant="h4" align="center">
              Simulador de Blackjack
            </Typography>
            <Typography variant="h5" align="center">
              DNC Treinamentos
            </Typography>
            <Button variant="contained" onClick={shuffleDeck} style={{ margin: 'auto' }}>
              {deck.deck_id === '' ? 'Novo baralho' : deck.shuffled ? 'Embaralhar novamente' : 'Embaralhar'}
            </Button>
          </Grid>

          {/* BARALHO DE CARTAS */}
          {deck.shuffled && (
            <Container style={{ textAlign: 'center' }}>
              <img src={CARD_BACKGROUND} style={{ maxWidth: '100%', borderRadius: '5px' }} />
              <Typography variant="h6" align="center">
                Pontuação: {score}
              </Typography>
              <Typography variant="h6" align="center">
                Cartas compradas: {52 - deck.remaining}
              </Typography>
              {(score === 'VENCEU' || score === 'PERDEU' || <Button variant="contained" onClick={drawCard} disabled={!deck.shuffled} style={{ margin: 'auto'}}>
                Comprar carta
              </Button>)}
            </Container>
          )}
        </Grid>
        <Grid item justifyContent="center" alignItems="center" direction={'column'} my={2} sm={12} md={6}>
          {/* CARTA COMPRADA */}
          {card && (<>
            <Typography variant="h4" align="center">
              Carta comprada
            </Typography>
            <Container style={{ textAlign: 'center', marginTop: '20px' }}>
              <img src={card.image} alt={card.code} style={{ maxWidth: '100px', borderRadius: '5px' }} />
              <Typography variant="h6" align="center">
                {translateValue(card.value) + " de " + translateSuit(card.suit)}
              </Typography>
            </Container>
          </>)}

          {/* HISTÓRICO DE CARTAS COMPRADAS */}
          {history.length > 0 && (<>
            <Typography variant="h4" align="center" my={1}>
              Sua mão
            </Typography>
            <Grid container justifyContent="center" alignItems="center" direction={'row'} my={2}>
              {history.map((card, index) => (
                <Grid item key={index}>
                  <img src={card.image} alt={card.code} style={{ maxWidth: '100px', borderRadius: '5px' }} />
                </Grid>
              ))}
            </Grid>
          </>)}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
