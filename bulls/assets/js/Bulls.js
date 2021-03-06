import React, { useState, useEffect } from 'react';
import 'milligram';

import { ch_join, ch_push, ch_reset } from './socket';

function SetTitle({text}) {
    useEffect(() => {
        let orig = document.title;
        document.title = text;

        // Cleanup function
        return () => {
            document.title = orig;
        };
    });

    return <div />;
}

function Controls({guess, reset}) {
    // WARNING: State in a nested component requires
    // careful thought.
    // If this component is ever unmounted (not shown
    // in a render), the state will be lost.
    // The default choice should be to put all state
    // in your root component.
    const [text, setText] = useState("");

    function keyDown(ev) {
        if (ev.key === "Enter") {
            guess(text);
        }
        else if (ev.key === "Backspace") {
            setText(text.slice(0,-1));
        }
        else {
            setText(text.concat(ev.key));
        }
    }

    return (
        <div className="row">
            <div className="column">
                <p>
                    <input type="text"
                           value={text}
                           onKeyDown={keyDown} />
                </p>
            </div>
            <div className="column">
                <p>
                    <button onClick={() => guess(text)}>Guess</button>
                </p>
            </div>
            <div className="column">
                <p>
                    <button onClick={reset}>
                        Reset
                    </button>
                </p>
            </div>
        </div>
    );
}

function Bulls() {
    // render function,
    // should be pure except setState
    const [state, setState] = useState({
        code: "",
        guesses: [],
    });

    let {code, guesses} = state;

    let view = code.split('');

    useEffect(() => {
        ch_join(setState);
    });

    function validGuess(guess) {
        let nums = /^[0-9]+$/;
        let guessSet = new Set();
        if (guess.length !== 4) {
            return false;
        }
        if (!guess.match(nums)) {
            return false;
        }
        for (let i = 0; i < guess.length; i++) {
            if (guessSet.has(guess[i])) {
                return false;
            }
            else {
                guessSet.add(guess[i]);
            }
        }
        return true;
    }

    function guess(text) {
        // Inner function isn't a render function
        if (validGuess(text)) {
            ch_push({codeGuess: text});
        }
        else {
                alert("Your guess contained duplicates or invalid characters");
        }
    }

    function reset() {
        console.log("Time to reset");
        ch_reset();
    }

    function correctGuess() {
        for (let i = 0; i < guesses.length; i++) {
            if (guesses[i].includes("4B")) {
                return true;
            }
        }
        return false;
    }

    function GameWon(props) {
        let {reset} = props;

        return (
            <div className="row">
                <SetTitle text="You Win!" />
                <div className="column">
                    <h1>You won in {guesses.length} guesses!</h1>
                    <p>
                        <button onClick={reset}>
                            Reset
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    function GameOver(props) {
        let {reset} = props;

        // On GameOver screen,
        // set page title to "Game Over!"
        return (
            <div className="row">
                <SetTitle text="Game Over!" />
                <div className="column">
                    <h1>Game Over!</h1>
                    <p>
                        <button onClick={reset}>
                            Reset
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    function getRow(index) {
        if (guesses.length > index) {
            return (guesses[index]);
        }
        else {
            return ('_____');
        }
    }

    let body = null;

    if (correctGuess()) {
        body = <GameWon reset={reset} />;
    }
    else if (guesses.length < 8) {
        body = (
            <div>
                <div className="row">
                    <div className="column">
                        <p>Code: {view.join(' ')}</p>
                    </div>
                    <div className="column">
                        <p>Lives: {8 - guesses.length}</p>
                    </div>
                </div>
                <Controls reset={reset} guess={guess} />
                <table className="center">
                    <caption><h2>Past Guesses</h2></caption>
                    <tr>
                        <td>
                            {getRow(0)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {getRow(1)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {getRow(2)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {getRow(3)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {getRow(4)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {getRow(5)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {getRow(6)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {getRow(7)}
                        </td>
                    </tr>
                </table>
                <div id="instructions">
                    <h2>Welcome to Cows and Bulls!</h2>
                    <p>You are trying to guess a 4 digit number, which does not contain repeated digits.
                        After each guess, the game will tell you how many Cows and Bulls you got, with each
                        guess sorted in a list. A Bull is a correct digit in the correct spot, and a Cow is a
                        correct digit but in the wrong spot. The system will not allow you to make any guesses
                        which are not 4 numerical digits or which contain repeated digits. You only get 8
                        guesses before the game ends! Good luck!</p>
                </div>
            </div>
        )
    }
    else {
        body = <GameOver reset={reset} />;
    }

    return (
        <div className="container">
            {body}
        </div>
    );
}

export default Bulls;
