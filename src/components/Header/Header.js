import { accentColor, detailColor, textBaseColor } from '../../constants/colors.js';
import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { CustomerContext } from '../context/customer.js';
import { IoIosArrowDown } from 'react-icons/io';
import SearchBar from './SearchBar.js';
import axios from 'axios';
import styled from 'styled-components';
import swal from 'sweetalert';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sideMenu, setSideMenu] = useState(false);
  const { setToken, setUserImage, setUserId, userId } = useContext(CustomerContext);

  useEffect(() => {
    if (!localStorage.token && location.pathname !== '/signup' && location.pathname !== '/') {
      swal('Usuário não logado!', 'Faça o login novamente para acessar suas informações.', 'error');
      navigate('/');
    } else if (location.pathname !== '/signup' && location.pathname !== '/') {
      setToken(localStorage.token);
      setUserId(localStorage.user_id);
      setUserImage(localStorage.user_image);
    }
    const config = {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/following/${localStorage.user_id}`, config)
      .then((res) => localStorage.setItem('following', JSON.stringify(res.data)))
      .catch((err) => {
        if (err.response.status === 401 && location.pathname !== '/signup' && location.pathname !== '/') {
          swal('Você não está logado', '', 'warning');
          navigate('/');
          localStorage.clear();
        }
      });
    setSideMenu(false);
  }, [navigate, setUserImage, setUserId, setToken, location.pathname]);

  function logOut(e) {
    e.preventDefault();
    setSideMenu(false);
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    };

    swal({ title: 'Tem certeza que deseja deslogar?', icon: 'warning', buttons: [true, true] }).then((res) => {
      if (res) {
        axios
          .post(`${process.env.REACT_APP_API_BASE_URL}/logout`, [], config)
          .then(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            localStorage.removeItem('user_image');
            localStorage.removeItem('following');
            setToken('');
            navigate('/');
          })
          .catch((err) => {
            console.log(config);
            console.log(err.response);
          });
      }
    });
  }

  return (
    <HeaderContainer display={location.pathname === '/' || location.pathname === '/signup' ? 'none' : 'flex'}>
      <h1 onClick={() => navigate('/timeline')}>linkr</h1>
      <SearchBar />
      <RightBox onClick={() => setSideMenu(!sideMenu)}>
        <MenuIcon clicked={sideMenu ? 'true' : 'false'} size={'0.7em'} />
        <img src={localStorage.user_image} alt='userAvatar' />
        <SideMenu display={sideMenu ? 'true' : 'false'}>
          <li onClick={logOut}>LogOut</li>
        </SideMenu>
      </RightBox>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  display: ${(props) => props.display};
  z-index: 5;
  position: fixed;
  top: 0;
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
