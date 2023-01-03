import { detailColor, textBaseColor } from '../../constants/colors.js';

import { IoIosArrowDown } from 'react-icons/io';
import logo from '../../assets/images/logo.png';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <h1 onClick={() => navigate('/')}>lnkr</h1>
      <div>
        <MenuIcon size={'0.7em'} />
        <img src={logo} alt='userAvatar' />
      </div>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1.5em;
  padding: 0 0.5em;
  font-size: 2.9rem;
  background-color: ${detailColor};
  h1 {
    font-family: 'Passion One', cursive;
    cursor: pointer;
  }
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 1em;
      margin-left: 1rem;
      border: 2px solid ${textBaseColor};
      border-radius: 50%;
      cursor: pointer;
    }
  }
`;

const MenuIcon = styled(IoIosArrowDown)`
  cursor: pointer;
`;
