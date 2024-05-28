import React, { useState, useEffect } from "react";
import "./App.css";
import image from "./components/image.png";
import StarBg from "./components/Star_bg.mp4"; // Import the video file

function App() {
  let maxTime = 60;
  const [randomParagraph, setRandomParagraph] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [seconds, setSeconds] = useState(maxTime);
  const [mistakes, setMistakes] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    getRandomParagraph();
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      const inputField = document.querySelector("input");
      if (inputField) {
        inputField.focus();
      }

      if (event.ctrlKey && event.key === "Backspace") {
        event.preventDefault();
      }

      if (event.key === "Tab") {
        event.preventDefault();
        const tryAgainButton = document.querySelector(".try-again-button");
        if (tryAgainButton) {
          tryAgainButton.click();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function validation() {
    const characters = document.querySelectorAll("span");
    let typedChar = document.querySelector("input").value.split("")[charIndex];

    if (seconds <= 0 || charIndex - 1 > characters.length - 6) {
      if (seconds <= 0) {
        document.querySelector("input").disabled = true;
        return;
      }
      if (characters[charIndex].classList.contains("incorrect")) {
        document.addEventListener("keydown", function (event) {
          if (event.key === "Backspace") {
            setCharIndex((charIndex) => charIndex - 1);
            setMistakes((mistakes) => mistakes - 1);
            characters[charIndex - 1].classList.remove("correct", "incorrect");
          } else {
            event.preventDefault();
          }
        });
      } else {
        document.querySelector("input").disabled = true;
        return;
      }
    } else {
      if (typedChar == null) {
        setCharIndex((charIndex) => charIndex - 1);
        if (characters[charIndex - 1].classList.contains("incorrect")) {
          setMistakes((mistakes) => mistakes - 1);
        }
        characters[charIndex - 1].classList.remove("correct", "incorrect");
      } else {
        if (characters[charIndex].innerText === typedChar) {
          characters[charIndex].classList.add("correct");
        } else {
          setMistakes((mistakes) => mistakes + 1);
          characters[charIndex].classList.add("incorrect");
        }
        setCharIndex((charIndex) => charIndex + 1);
      }

      let speed = Math.round(
        ((charIndex - mistakes) / 5 / (maxTime - seconds)) * 60
      );
      speed = speed < 0 || !speed || speed === Infinity ? 0 : speed;
      setWpm(speed);
      setCpm(charIndex - mistakes);
    }
  }

  function getRandomParagraph() {
    fetch("http://localhost:5000/api/paragraphs/random/")
      .then((response) => response.json())
      .then((data) => {
        const paragraph = data.paragraph;
        const letters = paragraph
          .split("")
          .map((letter, index) => <span key={index}>{letter}</span>);
        setRandomParagraph(<p>{letters}</p>);
      })
      .catch((error) => {
        console.error("Error fetching random paragraph:", error);
      });
  }

  function clearClasses() {
    const characters = document.querySelectorAll("span");
    characters.forEach((char) => {
      char.classList.remove("correct", "incorrect");
    });
  }

  function resetInput() {
    const inputField = document.querySelector("input");
    if (inputField) {
      inputField.value = "";
    }
    document.querySelector("input").disabled = false;
  }

  const [timerRunning, setTimerRunning] = useState(false);

  function handleInputChange() {
    if (!timerRunning) {
      startTimer();
      setTimerRunning(true);
    }
  }

  const [intervalId, setIntervalId] = useState(null);

  function startTimer() {
    const id = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          clearInterval(id);
          return prevSeconds;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    setIntervalId(id);
  }

  return (
    <>
      <div className="relative w-screen h-screen flex flex-col justify-center items-center">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover -z-10"
          src={StarBg}
          autoPlay
          loop
          muted
        />
        {/* <div className='w-full flex justify-start'>
          <img className='absolute size-44 top-0 left-12 cursor-pointer' src={image} alt="Logo" onClick={() => {window.location.reload();}} />
        </div> */}
        <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] h-fit bg-sky-100 rounded-2xl p-8">
          <input
            onChange={() => {
              validation();
              handleInputChange();
            }}
            type="text"
            className="myInputField -z-50 opacity-0 absolute cursor-default"
          />
          <div className="border-[#4b6160] border-2 p-8 rounded-2xl">
            <div className="hide-scrollbar text-lg max-h-48 overflow-y-scroll tracking-wider">
              {randomParagraph}
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mt-6 pt-5 border-[#4b6160] border-t-2 justify-center">
              <div className="flex-1 border-r-2 p-2 border-[#4b6160]">
                <p className="min-w-[5rem]">Time Left:</p>
                <span>
                  <b className="pr-1">{seconds}</b>s
                </span>
              </div>
              <div className="flex-1 border-r-2 p-2 border-[#4b6160]">
                <p>Mistakes:</p>
                <span>{mistakes}</span>
              </div>
              <div className="flex-1 border-r-2 p-2 border-[#4b6160]">
                <p>WPM</p>
                <span>{wpm}</span>
              </div>
              <div className="flex-1 p-2">
                <p>CPM</p>
                <span>{cpm}</span>
              </div>
              <div className="flex justify-center items-center mt-3 relative">
                {isHovered && (
                  <div className="hover-text absolute -top-7 text-black rounded-full">
                    'Tab btn'
                  </div>
                )}
                <button
                  className="try-again-button bg-[#4b6160] text-[#bbcbca] rounded-full px-5 py-1 mt-4 sm:mt-0 transform transition-all hover:scale-110"
                  onClick={() => {
                    getRandomParagraph();
                    clearClasses();
                    resetInput();
                    setCharIndex(0);
                    setMistakes(0);
                    setCpm(0);
                    setWpm(0);
                    setTimerRunning(false);
                    setSeconds(60);
                    clearInterval(intervalId);
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
