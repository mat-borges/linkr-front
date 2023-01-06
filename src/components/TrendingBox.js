import { publishColor, textPublishColor } from '../constants/colors';
import { useEffect, useState } from 'react';

import axios from 'axios';
import styled from 'styled-components';

export default function TrendingBox() {
  const [hashtags, setHashtags] = useState([]);

  useEffect(() => {
    const config = {
      headers: {
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjozLCJuYW1lIjoiTWF0ZXVzIEJvcmdlcyIsImltYWdlIjoiaHR0cHM6Ly9wYnMudHdpbWcuY29tL21lZGlhL0ZBQzJ2OU9Wa0FBSXZkMi5qcGciLCJpYXQiOjE2NzMwMjIyNTl9.w_1r8epDviaonmNIlV3xVTToWYR0SHvX45TKm4ib9xs`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/hashtags/trending`, config)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <TrendingContainer>
      <h1>trending</h1>
      <TrendingList>
        <li>#teste</li>
      </TrendingList>
    </TrendingContainer>
  );
}

const TrendingContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: fit-content;
  height: fit-content;
  margin: 0 auto;
  color: ${textPublishColor};
  background-color: ${publishColor};
  border-radius: 0.5rem;
  h1 {
    padding: 1rem;
    border-bottom: 1px solid black;
  }
`;

const TrendingList = styled.ul`
  padding: 1rem;
`;
