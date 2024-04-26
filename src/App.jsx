import { useState, useEffect } from 'react';
import './App.css';
import paragraphs from './paragraphs';

function App() {
  const [randomParagraph, setRandomParagraph] = useState('');
  // const [mistakes, setMistakes] = useState(0);

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

    if (typedChar == null) {
      charIndex--;
      // if(characters[charIndex].classList.contains('incorrect')){
      //   setMistakes((mistakes) => mistakes - 1);
      // }
      characters[charIndex].classList.remove('correct', 'incorrect');
    } else {
      if (characters[charIndex].innerText === typedChar) {
        console.log('correct');
        characters[charIndex].classList.add('correct');
      } else {
        console.log('incorrect');
        // setMistakes((mistakes) => mistakes + 1);
        characters[charIndex].classList.add('incorrect');
      }
      charIndex++;
    }
  }

  let charIndex = 0;

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
  }

  return (
    <>
      <div className='w-screen h-screen bg-cyan-600 flex justify-center items-center'>
        <div className='w-full sm:w-[80%] md:w-[60%] lg:w-[50%] h-fit bg-sky-100 rounded-2xl p-8'>
          <input
            onChange={() => {
              validation();
            }}
            type='text'
            className='myInputField'
          />
          <div className='border-sky-500 border-2 p-8 rounded-2xl'>
            <div className='hide-scrollbar text-lg max-h-48 overflow-y-scroll tracking-wider'>
              {randomParagraph}
            </div>
            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mt-6 pt-5 border-sky-500 border-t-2 justify-center'>
              <div className='flex-1 border-r-2 p-2 border-sky-500'>
                <p className='min-w-[5rem]'>Time Left:</p>
                <span>
                  <b>60</b>s
                </span>
              </div>
              <div className='flex-1 border-r-2 p-2 border-sky-500'>
                <p>Mistakes:</p>
                {/* <span>{mistakes}</span> */}
              </div>
              <div className='flex-1 border-r-2 p-2 border-sky-500'>
                <p>WPM</p>
                <span>0</span>
              </div>
              <div className='flex-1 p-2'>
                <p>CPM</p>
                <span>0</span>
              </div>
              <div className='flex justify-center items-center mt-3'>
                <button
                  className='try-again-button bg-cyan-600 text-white rounded-full px-5 py-1 mt-4 sm:mt-0 transform transition-all hover:scale-110'
                  onClick={()=>{
                    getRandomParagraph();
                    clearClasses();
                    resetInput();
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
