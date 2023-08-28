import './style.css'
import { useState, useRef, useContext, useEffect } from "react";
import Confetti from "react-confetti";
import Die from "../die";
import { ThemeContext } from '../../context/themeContext';

export default function Main() {
    const mainRef = useRef();

    const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

    const [dice, setDice] = useState(allNewDice());
    const [startGame, setStartGame] = useState(false);
    const [isWin, setIsWin] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const [gameDuration, setGameDuration] = useState();
    const [newScore, setNewScore] = useState(false);

    function allNewDice() {
        const newDice = [];

        for (let i = 0; i < 10; i++) {
            newDice.push({
                id: i,
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
            });
        }

        return newDice;
    }

    //Every Die Click
    const clickDie = (id) => {
        if (startGame) {
            setDice((prev) =>
                prev.map((die) => {
                    if (die.id === id) return { ...die, isHeld: !die.isHeld };
                    else return die;
                })
            );
        }
    };

    //Roll 0R new game button click
    const clickBtn = () => {
        startGame ? rollDice() : startNewGame();
    };

    //new Game
    const startNewGame = () => {
        setStartGame(true);
        isWin && setIsWin(false);
        setDice(allNewDice());
        setStartTime(Date.now());
        setNewScore(false);
    };

    //Roll
    const rollDice = () => {
        const firstDieValue = dice[0].value;

        const allDiceHeld = dice.every((die) => die.isHeld);
        const sameValue = dice.every((die) => die.value === firstDieValue);

        if (allDiceHeld && sameValue) {
            setIsWin(true);
            setStartGame(false);

            //Calculate duration of this game
            const durationMiliseconds = Date.now() - startTime;

            setGameDuration(formatDuration(durationMiliseconds));

            //Check New Score
            if (!localStorage.getItem('duration-score')) {
                localStorage.setItem('duration-score', durationMiliseconds);
                setNewScore(true);
            }
            else if (durationMiliseconds < localStorage.getItem('duration-score')) {
                localStorage.setItem('duration-score', durationMiliseconds);
                setNewScore(true);
            }
        } else {
            setDice((prev) =>
                prev.map((die) => {
                    if (die.isHeld) return die;
                    else return { ...die, value: Math.ceil(Math.random() * 6) };
                })
            );
        }
    }

    //formate Score Duration
    const formatDuration = (time) => {
        const totalSeconds = Math.floor(time / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);

        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;

        return `${hours > 0 ? hours + 'h ' : ''}${minutes > 0 ? minutes + 'min ' : ''}${seconds}s`
    }

    return (
        <main className={`${isDarkTheme ? 'dark' : ''}`} ref={mainRef}>
            {newScore && (
                <Confetti
                    width={mainRef.current.clientWidth}
                    height={mainRef.current.clientHeight}
                />
            )}

            <div className={`absolute-header ${!localStorage.getItem('duration-score') && 'item-end'}`}>
                {localStorage.getItem('duration-score') && <p>Best Time: {formatDuration(localStorage.getItem('duration-score'))}</p>}

                <div className='switch-theme-icon' onClick={toggleTheme}>
                    {isDarkTheme ? <i className='fa-solid fa-sun'></i> : <i className='fa-solid fa-moon'></i>}
                </div>
            </div>

            <div className="game-desc">
                <h1>Tenzies</h1>
                <p>
                    Roll until all dice are the same. Click each die to freeze it at its
                    current value between rolls.
                </p>
            </div>
            <div className="dice-container">
                {dice.map(({ id, value, isHeld }) => (
                    <Die
                        key={id}
                        id={id}
                        value={value}
                        isHeld={isHeld}
                        clickDie={clickDie}
                    />
                ))}
            </div>
            <div>
                <p>{isWin && <> <i className="fa-solid fa-stopwatch"></i> {gameDuration} {newScore && <span className='new-score'> New Score</span>}</>}</p>
                <button className="roll-dice" onClick={clickBtn}>
                    {startGame ? "Roll" : "New Game"}
                </button>
            </div>
        </main>
    );
}
