import { textBaseColor, textPublishColor } from '../constants/colors';
import { useEffect, useState } from 'react';

import { TailSpin } from 'react-loader-spinner';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function TrendingBox({ background, color, hide, width, placedAt }) {
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const config = {
      headers: {
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJuYW1lIjoiTWF0ZXVzIEJvcmdlcyIsImltYWdlIjoiaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ZBQzJ2OU9Wa0FBSXZkMi5qcGciLCJpYXQiOjE2NzMwMjIyNTl9.w_1r8epDviaonmNIlV3xVTToWYR0SHvX45TKm4ib9xs`,
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
              <li key={hashtag.hashtag_id} onClick={() => navigate(`/hashtag/${hashtag.name}`)}>
                # {hashtag.name}
              </li>
            );
          })
        )}
      </TrendingList>
    </TrendingContainer>
  );
}

const TrendingContainer = styled.div`
  display: ${(props) => (props.placedAt === 'SearchBar' || props.hide === 'true' ? 'none' : 'flex')};
  flex-direction: column;
  width: ${(props) => props.width};
  min-width: fit-content;
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
    display: ${(props) => (props.placedAt === 'SearchBar' ? 'flex' : 'none')};
  }
`;

const TrendingList = styled.ul`
  padding: 1rem;
  min-height: 15rem;
  div {
    height: 15rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  li {
    line-height: 1.6rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis ellipsis;
    cursor: pointer;
  }
`;
