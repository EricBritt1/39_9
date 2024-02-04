import React from "react";
import { useState, useEffect, useRef} from "react";
import axios from "axios";

// When you come back make sure that currentDeckRemaining is in state form rather than useRef();

//Did this all by myself and am proud about it. Learning how to properly look at documentation to handle errors. I definitely need to throw in try and catches but, I figured out how to properly clean up!

const CardGame = () => {
    const [deck, setDeck] = useState(null);
    const [currentDeckRemaining, setCurrentCardRemaining] = useState(null);
    const [currentCardImage, setCurrentCardImage] = useState(null)
    const currentDeckId = useRef();


    useEffect(() => {
        let ignore = false;
        async function createDeck() {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/new/`)
            if(!ignore) {
                setDeck(res.data)
                currentDeckId.current = res.data.deck_id;
                setCurrentCardRemaining(res.data.remaining)
            }
        };
        createDeck()
        return () => {
            ignore = true;
        };
    }, [])

    async function drawCard() {
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${currentDeckId.current}/draw/?count=1
    `)
    if (currentDeckRemaining > 0) {
    setCurrentCardRemaining(res.data.remaining)
    setCurrentCardImage(res.data.cards[0].image)
    }
    };

    async function shuffleDeck() {
        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${currentDeckId.current}/shuffle/`)
        
        setCurrentCardRemaining(res.data.remaining)
        setCurrentCardImage(null)
    }

    return (
        <div>
            {deck? <h1>Cards remaining in deck: {currentDeckRemaining} </h1> : <h1> Loading.... </h1>}

            {(currentDeckRemaining > 0) ? <button onClick={drawCard}>Draw A Card!</button> : <button onClick={shuffleDeck}>Reshuffle!</button>}

            {(currentCardImage && currentDeckRemaining > 0) || (!currentCardImage && currentDeckRemaining > 0)?
            <div>
                <img src={currentCardImage} alt=""></img>
            </div> : <h4>No cards remaining. Reshuffle deck for more cards!</h4>
            }
        </div>
    )
};

export default CardGame;