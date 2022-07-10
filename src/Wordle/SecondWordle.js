import React, { useState, useEffect } from "react";
import "./Wordle.css";
import confetti from "canvas-confetti";
import { wordList } from "./WordList";

const WORD_LENGTH = 5;

function SecondWordle() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [playerLose, setPlayerLose] = useState(false);

  var duration = 15 * 1000;
  var animationEnd = Date.now() + duration;
  var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  var end = Date.now() + 15 * 1000;

  // go Buckeyes!
  var colors = ["#bb0000", "#ffffff"];

  function frame() {
    confetti({
      particleCount: 2,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
    });
    confetti({
      particleCount: 2,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }

  var popConfetti = () => {
    var timeLeft = animationEnd - Date.now();

    var particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
    );
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    );
  };

  useEffect(() => {
    let randomElem = wordList[Math.floor(Math.random() * wordList.length)];
    setSolution(randomElem.toLowerCase());
  }, []);
  console.log("solution ", solution);

  useEffect(() => {
    if (isGameOver) return;
    if (guesses.includes(solution)) {
      setPlayerWon(true);
      frame();
      const celebrations = setInterval(() => {
        popConfetti();
      }, 250);
      setIsGameOver(true);
    }
    if (guesses.findIndex((val) => val == null) === -1) {
      setIsGameOver(true);
      setPlayerLose(true);
    }

    const handleType = (e) => {
      if (e.key === "Enter") {
        if (currentGuess.length !== 5) {
          return;
        }
        console.log("submit");

        const newGuesses = [...guesses];
        newGuesses[guesses.findIndex((val) => val == null)] = currentGuess;
        setGuesses(newGuesses);
        setCurrentGuess("");
      }

      if (e.key === "Backspace") {
        setCurrentGuess(currentGuess.slice(0, -1));
        return;
      }

      if (guesses.findIndex((val) => val == null) === false) {
      }

      if (currentGuess.length > 4) {
        return;
      }

      if (e.key.match(/^[a-z]+$/g) !== null) {
        setCurrentGuess(currentGuess + e.key);
      }
    };

    window.addEventListener("keydown", handleType);

    return () => {
      window.removeEventListener("keydown", handleType);
    };
  }, [currentGuess, isGameOver, guesses, solution]);

  return (
    <div className="grid-container">
      {guesses.map((guess, i) => {
        const isCurrentGuess = i === guesses.findIndex((val) => val == null);
        return (
          <Line
            key={i}
            isFinal={!isCurrentGuess && guess !== null}
            solution={solution}
            guess={isCurrentGuess ? currentGuess : guess ?? ""}
          />
        );
      })}
      {playerWon && <div className="win">YOU WIN</div>}
      {playerLose && <div className="lose">YOU LOSE</div>}
    </div>
  );
}

const Line = ({ guess, isFinal, solution }) => {
  const tiles = [];

  for (let i = 0; i < WORD_LENGTH; i++) {
    const char = guess[i];
    let className = "tile";
    if (isFinal) {
      if (char === solution[i]) {
        className += " correct";
      } else if (solution.includes(char)) {
        className += " close";
      } else {
        className += " incorrect";
      }
    }

    tiles.push(
      <div key={i} className={className}>
        {char}
      </div>
    );
  }

  return <div className="line">{tiles}</div>;
};

export default SecondWordle;
