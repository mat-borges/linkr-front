import { useEffect, useState } from 'react';

import { DebounceInput } from 'react-debounce-input';
import Preview from './Preview';
import axios from 'axios';
import { detailColor } from '../../constants/colors';
import styled from 'styled-components';

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const minLength = 3;

  useEffect(() => {
    const config = {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    };
    if (searchInput.length >= minLength) {
      setLoading(true);
      const type = searchInput.includes('#') ? 'hashtag' : 'user';
      let input = searchInput;
      if (type === 'hashtag') {
        input = input.replace('#', '');
      }

      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/search/${type}/${input}`, config)
        .then((res) => {
          setLoading(false);
          setResults(res.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
      setResults([]);
    }
  }, [searchInput]);

  return (
    <Search>
      <form onSubmit={(e) => e.preventDefault()}>
        <DebounceInput
          element={SearchBarInput}
          id='search-bar'
          type='text'
          placeholder='Procurar (por usuário ou #hashtag)'
          autoComplete='off'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => {
            setSearchFocus(true);
            setIsVisible(true);
          }}
          onBlur={() => setSearchFocus(false)}
          minLength={minLength}
          debounceTimeout={300}
        />
        <Preview
          results={results}
          searchFocus={searchFocus}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          loading={loading}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
      </form>
    </Search>
  );
}

const Search = styled.div`
  display: flex;
  align-items: center;
  width: 50%;
  form {
    display: flex;
    z-index: 2;
    position: relative;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
`;

const SearchBarInput = styled.input`
  z-index: 2;
  width: 90%;
  padding: 0.7rem 2.5rem 0.7rem 1rem;
  border: none;
  border-radius: 0.7rem;
  color: #c6c6c6;
  font-size: 1.1rem;
  :active,
  :focus {
    outline-color: ${detailColor};
  }
  ::placeholder {
    color: inherit;
  }
`;
