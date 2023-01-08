import { accentColor, detailColor, textBaseColor } from '../../constants/colors.js';

import { IoIosArrowDown } from 'react-icons/io';
import SearchBar from './SearchBar.js';
import logo from '../../assets/images/logo.png';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const [sideMenu, setSideMenu] = useState(false);

  return (
    <HeaderContainer>
      <h1 onClick={() => navigate('/')}>linkr</h1>
      <SearchBar />
      <RightBox onClick={() => setSideMenu(!sideMenu)}>
        <MenuIcon clicked={sideMenu ? 'true' : 'false'} size={'0.7em'} />
        <img src={logo} alt='userAvatar' />
        <SideMenu display={sideMenu ? 'true' : 'false'}>
          <li onClick={() => setSideMenu(!sideMenu)}>LogOut</li>
        </SideMenu>
      </RightBox>
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
`;

const RightBox = styled.div`
  position: relative;
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
`;

const SideMenu = styled.ul`
  display: ${(props) => (props.display === 'true' ? 'flex' : 'none')};
  position: absolute;
  top: 1em;
  right: -0.5rem;
  left: -0.5rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 130%;
  padding: 1rem;
  border-radius: 0 0 0.5rem 0.5rem;
  font-weight: 700;
  background-color: ${accentColor};
  li {
    font-size: 1.2rem;
    text-align: center;
    cursor: pointer;
    :hover {
      transition: all 0.2s linear;
      transform: scale(1.2);
    }
  }
`;

const MenuIcon = styled(IoIosArrowDown)`
  cursor: pointer;
  transition: all 0.3s ease;
  transform: ${(props) => props.clicked === 'true' && 'rotate(180deg)'};
`;
