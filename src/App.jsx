import { useRef, useState } from 'react'
import './App.css'
import {FaBookOpen, FaSearch, FaSpinner} from 'react-icons/fa'
import axios from 'axios'

function App() {
  const searchText = useRef('');
  const [resultData, setResultData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const handleSearchCLick = async () => {
    setIsLoading(true);
    setErrorMessage('');
    setResultData('');
    setHasSearched(true);
    const word = searchText.current.trim();
    if (!word) return;

    try {
      const response = await axios.get("/.netlify/functions/dictionary", {
        params: { word },
      });

      setResultData(response.data);
    } catch (error) {
        if (error.response?.status === 530) {
          setErrorMessage("No definition found for that word.");
        } else if (error.response?.status === 404) {
          setErrorMessage("No definition found for that word.");
        } else if (!error.response) {
          setErrorMessage("Could not reach the dictionary service. Check your connection.");
        }  else if (error.response?.data?.message) {
          setErrorMessage(error.response?.data?.message);
        } else {
          setErrorMessage("Something went wrong while looking up that word.");
        }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <div className="search">
        <h1><FaBookOpen /> <span>My</span> Dictionary</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for words..." onChange={(e) => searchText.current = e.target.value}  onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleSearchCLick();
            }
          }}/>
          <button onClick={handleSearchCLick}><FaSearch /></button>
        </div>
      </div>
      
      <div className="results">
        {!hasSearched && <p>Start searching to get results.</p>}
        {isLoading ? (
          <FaSpinner className='spinner' />
        ) : resultData && (
          <>
            <h2>{resultData[0]?.word || 'Word not found'}</h2>
            <h3>Part of Speech: </h3>
            <p>{resultData[0]?.meanings[0]?.partOfSpeech || 'Not available'}</p>
            <h3>Definition: </h3>
            <p>{resultData[0]?.meanings[0]?.definitions[0]?.definition || 'Not available'}</p>
            <h3>Example: </h3>
            <p>{resultData[0]?.meanings[0]?.definitions[0]?.example || 'Not available'}</p>
          </>
        )}
        {errorMessage && <p role="alert">{errorMessage}</p>}
      </div>
      
    </main>
  )
}

export default App
