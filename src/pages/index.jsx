import Dealer, { CARD_BACKGROUND } from '@/services/dealer';
import { translateSuit, translateValue } from '@/services/translation';
import { Button, Container, Grid, Input, Typography } from '@mui/material';
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
  const [score, setScore] = useState({
    score: '0',
    result: null,
    game: false,
    money: 0,
  });
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(0);

  const shuffleDeck = async () => {
    try {
      setDeck(await dealer.shuffle());
      setCard(null);
      setHistory([]);
      setScore({ score: '0', result: null, game: true, money: 0});
      setBalance(balance - bet);
    } catch (error) {
      console.error('Falha ao embaralhar:', error);
    }
  };

  const drawCard = async () => {
    try {
      setDeck({ ...deck, remaining: deck.remaining - 1, shuffled: deck.remaining > 1})
      setCard(await dealer.draw());
      setHistory(dealer.getHistory());
      const score = dealer.getScore(bet)
      setScore(score);
      if(score.result) setBalance(balance + score.money);
    } catch (error) {
      console.error('Falha ao comprar carta:', error);
    }
  };

  const stopGame = () => {
    setScore({ ...score, game: false });
    setBalance(balance + score.money);
  };

  return (
    <Container>
      <Grid container justifyContent="center" alignItems="flex-start" direction={'row'} my={1}>
        <Grid item justifyContent="center" alignItems="flex-start" my={2} sm={12} md={6}>
          <Grid container direction={"column"}>
            {/* CABEÇALHO */}
            <Typography variant="h4" align="center">
              Simulador de Blackjack
            </Typography>
            <Typography variant="h5" align="center">
              DNC Treinamentos
            </Typography>

            {/* CARTEIRA */}
            <Typography variant="h6" align="center">
              Carteira: {balance} DNCoins
            </Typography>

            {/* APOSTA */}
            <Typography variant="h6" align="center">
              Aposta: <Input inputProps={{style: {textAlign: 'center'}}} disabled={score.game} type="number" value={bet} onChange={(event) => setBet(event.target.value)} style={{ margin: 'auto', width: '100px', backgroundColor: 'white', borderRadius: '5px', marginTop: 4, marginBottom: 12, justifyItems: 'center' }} />
            </Typography>
            
            
            {!score.game && (
              <Button variant="contained" onClick={shuffleDeck} style={{ margin: 'auto' }}>
                Iniciar jogo
              </Button>
            )}
          </Grid>

          {deck.shuffled && (
            <Container style={{ textAlign: 'center' }}>
              {/* BARALHO DE CARTAS */}
              <img src={CARD_BACKGROUND} style={{ maxWidth: '100%', borderRadius: '5px' }} />

              {/* PLACAR ATUAL */}
              {score.score && (<>
                <Typography variant="h6" align="center">
                  Pontuação: {score.score}
                </Typography>
                <Typography variant="h6" align="center">
                  Cartas compradas: {52 - deck.remaining}
                </Typography>
              </>)}

              {/* RESULTADO FINAL */}
              {score.result && (
                <Typography variant="h6" align="center">
                  Resultado: {score.result}
                </Typography>
              )}

              {/* AÇÒES DO JOGO */}
              {score.game &&(<>
                <Grid container justifyContent="center" alignItems="center" direction={'column'} my={1}>
                  <Button variant="contained" onClick={drawCard} style={{ margin: 'auto', width: '180px', backgroundColor: 'green' }}>
                    Comprar carta
                  </Button>
                  <Button variant="contained" onClick={stopGame} style={{ margin: 'auto', width: '180px', backgroundColor: 'red' }}>
                    Parar
                  </Button>
                </Grid>
              </>)}
            </Container>
          )}
        </Grid>
        <Grid item justifyContent="center" alignItems="center" my={2} sm={12} md={6}>
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
