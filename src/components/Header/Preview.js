import { detailColor, publishColor, textPublishColor } from '../../constants/colors.js';
import { useEffect, useRef } from 'react';

import { MagnifyingGlass } from 'react-loader-spinner';
import TrendingBox from '../../components/TrendingBox.js';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function Preview(props) {
  const { results, searchFocus, isVisible, setIsVisible, loading, searchInput, setSearchInput } = props;
  const navigate = useNavigate();
  const ulRef = useRef(null);
  const minLength = 3;

  function handleClick(result) {
    let path = '';
    if (result.name.includes('#')) {
      const hashtag = result.name.replace('#', '');
      path = `/hashtag/${hashtag}`;
    } else {
      const id = result.user_id;
      path = `/user/${id}`;
    }
    setIsVisible(false);
    setSearchInput('');
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
      <TrendingBox
        background={publishColor}
        color={textPublishColor}
        hide={searchInput.length < minLength ? 'false' : 'true'}
        width='100%'
        placedAt={isVisible === true && searchInput.length < minLength ? 'SearchBar' : 'none'}
      />
      {results?.map((result, index) => {
        return (
          <li key={index} onClick={() => handleClick(result)}>
            {result.image ? <img src={result.image} alt='mock' /> : <></>}
            <p>{result.name}</p>
          </li>
        );
      })}
    </PreviewContainer>
  );
}

const PreviewContainer = styled.ul`
  display: ${(props) => props.display};
  z-index: 1;
  position: absolute;
  top: 0;
  flex-direction: column;
  align-items: flex-start;
  width: 90%;
  height: fit-content;
  min-height: 10rem;
  padding: 3.5rem 1rem 1rem;
  border-radius: 0.7rem;
  background-color: white;
  li {
    display: flex;
    align-items: center;
    max-width: 100%;
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
    display: ${(props) => props.show};
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: ${textPublishColor};
    font-weight: 700;
    font-size: 1rem;
    text-align: center;
  }
`;
