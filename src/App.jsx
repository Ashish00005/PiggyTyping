import React, { useState, useEffect } from 'react';
import './App.css';
import paragraphs from './paragraphs';
import image from './components/image.png'

function App() {
  
  let maxTime = 60;
  const [randomParagraph, setRandomParagraph] = useState('hiiii');
  const [charIndex, setCharIndex] = useState(0);
  const [seconds, setSeconds] = useState(maxTime);
  const [mistakes,setMistakes] = useState(0);
  const [cpm,setCpm] = useState(0)
  const [wpm,setWpm] = useState(0)

  useEffect(() => {
    getRandomParagraph();
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      // Focus on the input field when any key is pressed
      const inputField = document.querySelector('input');
      if (inputField) {
        inputField.focus();
      }
      
      if (event.ctrlKey && event.key === 'Backspace') {
        event.preventDefault();
      }

      // Check if the Tab key is pressed
      if (event.key === 'Tab') {
        // Prevent the default tab behavior (moving focus to the next element)
        event.preventDefault();

        // Programmatically click the "Try Again" button
        const tryAgainButton = document.querySelector('.try-again-button');
        if (tryAgainButton) {
          tryAgainButton.click();
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function validation() {
    const characters = document.querySelectorAll('span');
    let typedChar = document.querySelector('input').value.split('')[charIndex];

    if(seconds <= 0 || charIndex-1 > (characters.length-6)){
      if(seconds<=0){
        document.querySelector('input').disabled = true;
       return
      }
      if(characters[charIndex].classList.contains('incorrect')){
        document.addEventListener('keydown', function(event) {
          if (event.key === 'Backspace') {
            setCharIndex((charIndex) => charIndex - 1);
            setMistakes((mistakes)=> mistakes-1);
            characters[charIndex-1].classList.remove('correct', 'incorrect');
          } else {
              event.preventDefault(); // Prevent the default behavior for other keys
          }
      });
      }
      else{
      document.querySelector('input').disabled = true;
      return
      }
  }
  else{
    if (typedChar == null) {
      setCharIndex((charIndex) => charIndex - 1);
      if(characters[charIndex-1].classList.contains('incorrect')){
        setMistakes((mistakes)=> mistakes-1);
      }
     // console.log(charIndex);
      characters[charIndex-1].classList.remove('correct', 'incorrect');
    } else {
      if (characters[charIndex].innerText === typedChar) {
       // console.log('correct');
        characters[charIndex].classList.add('correct');
      } else {
        //console.log('incorrect');
        setMistakes((mistakes)=>mistakes+1)
        characters[charIndex].classList.add('incorrect');
      }
      setCharIndex((charIndex) => charIndex + 1);
      // console.log(charIndex);
    }

      let speed = Math.round(((charIndex - mistakes) / 5 / (maxTime - seconds)) * 60)
      speed = speed < 0 || !speed || speed === Infinity ? 0 : speed;
      setWpm(speed)
      setCpm(charIndex-mistakes)
  }
}


  function getRandomParagraph() {
    const randIndex = Math.floor(Math.random() * paragraphs.length);
    const paragraph = paragraphs[randIndex];
    const letters = paragraph.split('').map((letter, index) => (
      <span key={index}>{letter}</span>
    ));
    setRandomParagraph(<p>{letters}</p>);
  }

  function clearClasses() {
    const characters = document.querySelectorAll('span');
    characters.forEach((char) => {
      char.classList.remove('correct', 'incorrect');
    });
  }

  function resetInput(){
    const inputField = document.querySelector('input');
    if (inputField) {
      inputField.value = '';
    }
    document.querySelector('input').disabled = false;
  }

  const [timerRunning, setTimerRunning] = useState(false);

  function handleInputChange() {
    if (!timerRunning) {
      startTimer();
      setTimerRunning(true);
    }
  }
  const [intervalId, setIntervalId] = useState(null);

  function startTimer(){
    const id = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds === 0) {
          clearInterval(id); // Stop the timer when it reaches 0
          return prevSeconds;
        }
        return prevSeconds - 1;
      });
    },1000)
    setIntervalId(id);
  }

  return (
    <>
      <div className='w-screen h-screen bg-cyan-600 flex relative justify-center items-center '>
      <img className='absolute size-44 top-0 left-12 cursor-pointer'src={image} alt="Logo" onClick={() => {window.location.reload();}} />
        <div className='w-full sm:w-[80%] md:w-[60%] lg:w-[50%] h-fit bg-sky-100 rounded-2xl p-8'>
          <input 
            onChange={() => {
              validation();
              handleInputChange();
            }}
            type='text'
            className='myInputField -z-50 opacity-0 absolute cursor-default'
          />
          <div className='border-sky-500 border-2 p-8 rounded-2xl'>
            <div className='hide-scrollbar text-lg max-h-48 overflow-y-scroll tracking-wider'>
              {randomParagraph}
            </div>
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mt-6 pt-5 border-sky-500 border-t-2 justify-center'>
              <div className='flex-1 border-r-2 p-2 border-sky-500'>
                <p className='min-w-[5rem]'>Time Left:</p>
                <span>
                  <b className='pr-1'>{seconds}</b>s
                </span>
              </div>
              <div className='flex-1 border-r-2 p-2 border-sky-500'>
                <p>Mistakes:</p>
                <span>{mistakes}</span>
              </div>
              <div className='flex-1 border-r-2 p-2 border-sky-500'>
                <p>WPM</p>
                <span>{wpm}</span>
              </div>
              <div className='flex-1 p-2'>
                <p>CPM</p>
                <span>{cpm}</span>
              </div>
              <div className='flex justify-center items-center mt-3'>
                <button
                  className='try-again-button bg-cyan-600 text-white rounded-full px-5 py-1 mt-4 sm:mt-0 transform transition-all hover:scale-110'
                  onClick={()=>{
                    getRandomParagraph();
                    clearClasses();
                    resetInput();
                    setCharIndex(0)
                    setMistakes(0);
                    setCpm(0)
                    setWpm(0)
                    setTimerRunning(false)
                    setSeconds(60)
                    clearInterval(intervalId)
                  }} 
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
