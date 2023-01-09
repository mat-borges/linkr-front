import { detailColor, publishColor, textPublishColor } from '../../constants/colors.js';
import { useEffect, useRef } from 'react';

import { MagnifyingGlass } from 'react-loader-spinner';
import TrendingBox from '../../components/TrendingBox.js';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function Preview({ results, searchFocus, isVisible, setIsVisible, loading, searchInput }) {
  const navigate = useNavigate();
  const ulRef = useRef(null);
  const minLength = 3;

  function handleClick(name) {
    let path = '';
    if (name.includes('#')) {
      const hashtag = name.replace('#', '');
      path = `/hashtag/${hashtag}`;
    } else {
      path = `/user/${name}`;
    }
    navigate(path);
  }

  function handleClickOutsidePreview(event) {
    if (ulRef.current && !ulRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsidePreview);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsidePreview);
    };
  });

  return (
    <PreviewContainer
      display={searchFocus || isVisible ? 'flex' : 'none'}
      show={results.length === 0 ? 'flex' : 'none'}
      ref={ulRef}>
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
      {results?.map((result, index) => {
        return (
          <li key={index} onClick={() => handleClick(result.name)}>
            {result.image ? <img src={result.image} alt='mock' /> : <></>}
            <p>{result.name}</p>
          </li>
        );
      })}
    </PreviewContainer>
  );
}

const PreviewContainer = styled.ul`
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
    cursor: pointer;
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
