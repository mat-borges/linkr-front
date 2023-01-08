import { detailColor, publishColor, textPublishColor } from '../../constants/colors';
import { useEffect, useState } from 'react';

import { DebounceInput } from 'react-debounce-input';
import { MagnifyingGlass } from 'react-loader-spinner';
import TrendingBox from '../../components/TrendingBox.js';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState('');
  const [searchFocus, setSearchFocus] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const minLength = 3;

  useEffect(() => {
    const config = {
      headers: {
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJuYW1lIjoiTWF0ZXVzIEJvcmdlcyIsImltYWdlIjoiaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ZBQzJ2OU9Wa0FBSXZkMi5qcGciLCJpYXQiOjE2NzMwMjIyNTl9.w_1r8epDviaonmNIlV3xVTToWYR0SHvX45TKm4ib9xs`,
      },
    };
    if (searchInput.length >= minLength) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/search/${searchInput}`, config)
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

  function searchGo(e) {
    e.preventDefault();
    setSearchInput('');
    navigate('/search');
  }

  function handleSearch(e) {
    setSearchInput(e.target.value);
  }
  return (
    <Search>
      <form onSubmit={searchGo}>
        <DebounceInput
          element={SearchBarInput}
          id='search-bar'
          type='text'
          placeholder='Procurar'
          autoComplete='off'
          value={searchInput}
          onChange={handleSearch}
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          minLength={3}
          debounceTimeout={300}
        />
        <Preview display={searchFocus ? 'flex' : 'none'} show={results.length === 0 ? 'flex' : 'none'}>
          <h2>{loading ? <MagnifyingGlass color={detailColor} /> : 'Nenhum resultado encontrado'}</h2>
          <li>
            <TrendingBox
              background={publishColor}
              color={textPublishColor}
              hide={searchInput.length < minLength ? 'false' : 'true'}
              width='fit-content'
              placedAt={searchFocus === true && searchInput.length < minLength ? 'SearchBar' : 'none'}
            />
          </li>
          {results?.map((result) => {
            return (
              <li>
                {result.image ? <img src={result.image} alt='mock' /> : <></>}
                <p>{result.name}</p>
              </li>
            );
          })}
        </Preview>
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

const Preview = styled.ul`
  z-index: 1;
  position: absolute;
  top: 0;
  width: 90%;
  height: fit-content;
  min-height: 10rem;
  padding: 3.5rem 1rem 1rem;
  border-radius: 0.7rem;
  background-color: white;
  display: ${(props) => props.display};
  flex-direction: column;
  align-items: flex-start;
  li {
    display: flex;
    align-items: center;
    color: ${textPublishColor};
    font-size: 1.1rem;
    h1 {
      font-size: 1.4rem;
    }
    img {
      height: 2rem;
      margin-right: 0.8rem;
      border-radius: 50%;
      object-fit: contain;
    }
  }
  h2 {
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    display: ${(props) => props.show};
    font-size: 1rem;
    color: ${textPublishColor};
    font-weight: 700;
  }
`;
