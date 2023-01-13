import { textBaseColor, textPublishColor } from '../constants/colors';
import { useEffect, useState } from 'react';

import { TailSpin } from 'react-loader-spinner';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function TrendingBox(props) {
  const { background, color, hide, width, placedAt, setIsVisible } = props;
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const config = {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/trending`, config)
      .then((res) => {
        setLoading(false);
        setHashtags(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <TrendingContainer background={background} color={color} hide={hide} width={width} placedAt={placedAt}>
      <h1>trending</h1>
      <TrendingList loading={loading.toString()}>
        {loading ? (
          <div>
            <TailSpin color={textBaseColor} />
          </div>
        ) : (
          hashtags.map((hashtag) => {
            return (
              <li
                key={hashtag.hashtag_id}
                onClick={() => {
                  setIsVisible(false);
                  navigate(`/hashtag/${hashtag.name}`);
                }}>
                <p># {hashtag.name}</p>
              </li>
            );
          })
        )}
      </TrendingList>
    </TrendingContainer>
  );
}

const TrendingContainer = styled.div`
  display: ${(props) => (props.placedAt !== 'TimelinePage' || props.hide === 'true' ? 'none' : 'flex')};
  flex-direction: column;
  width: ${(props) => props.width};
  max-width: 300px;
  margin: 0 auto;
  border-radius: 0.5rem;
  color: ${(props) => props.color};
  background-color: ${(props) => props.background};
  h1 {
    padding: 1rem;
    border-bottom: 1px solid ${textPublishColor};
    font-weight: 700;
    font-size: 1.6rem;
    font-family: 'Oswald', sans-serif;
    cursor: auto;
  }
  @media (max-width: 800px) {
    display: ${(props) => (props.placedAt !== 'TimelinePage' ? 'flex' : 'none')};
  }
`;

const TrendingList = styled.ul`
  max-width: 100%;
  min-height: 15rem;
  padding: 1rem;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 15rem;
  }
  li {
    max-width: 100%;
    line-height: 1.6rem;
    cursor: pointer;
    p {
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
