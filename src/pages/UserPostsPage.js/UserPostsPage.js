import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CustomerContext } from '../../components/context/customer.js';
import SinglePost from '../../components/SinglePost.js';
import { ThreeDots } from 'react-loader-spinner';
import axios from 'axios';
import styled from 'styled-components';
import swal from 'sweetalert';
import { textBaseColor } from '../../constants/colors.js';

export default function UserPostPage() {
  const { id } = useParams();
  const { setToken, setUserId, setUserImage } = useContext(CustomerContext);
  const [posts, setPosts] = useState();
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState();
  const [refreshPage, setRefreshPage] = useState(false);
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingPage(true);
    if (!localStorage.token) {
      swal('Usuário não logado!', 'Faça o login novamente para acessar suas informações.', 'error');
      navigate('/');
    }
    setToken(localStorage.token);
    setUserId(localStorage.user_id);
    setUserImage(localStorage.user_image);

    const config = {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/timeline/user/${id}`, config)
      .then((res) => {
        console.log(res.data.posts);
        setPosts(res.data.posts);
        setUser(res.data.name);
        setLoadingPage(false);
      })
      .catch((err) => {
        setLoadingPage(false);
        setError(true);
      });
  }, [refreshPage, navigate, setToken, setUserId, setUserImage, id]);

  if (loadingPage === true) {
    return (
      <Main>
        <AreaUtil>
          <Title></Title>
          <div className='loading'>
            <ThreeDots
              height='80'
              width='80'
              radius='9'
              color={textBaseColor}
              ariaLabel='three-dots-loading'
              wrapperStyle={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              wrapperClassName='loading'
              visible={true}
            />
          </div>
        </AreaUtil>
      </Main>
    );
  } else if (error === true) {
    return (
      <Main>
        <Title>{user}'s posts</Title>
        <ErrorMessage>
          Ocorreu um erro ao tentar buscar os posts, <br />
        </ErrorMessage>
      </Main>
    );
  } else {
    return (
      <Main>
        <AreaUtil>
          <Title>{user}'s posts</Title>
          {posts !== [] ? (
            posts.map((p) => (
              <SinglePost
                key={p.id}
                postOwner_id={p.user_id}
                posts_id={p.id}
                link={p.link}
                description={p.description}
                name={p.name}
                image={p.user_image}
                refreshPage={refreshPage}
                setRefreshPage={setRefreshPage}
              />
            ))
          ) : (
            <ErrorMessage>Ainda não há posts</ErrorMessage>
          )}
        </AreaUtil>
      </Main>
    );
  }
}

const AreaUtil = styled.div``;

const ErrorMessage = styled.p`
  text-align: center;
  font-family: 'Oswald', sans-serif;
  font-style: italic;
  font-weight: 400;
  font-size: 20px;
  color: #ffffff;
`;

const Title = styled.div`
  margin-top: 19px;
  margin-bottom: 19px;
  font-family: 'Oswald', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 33px;
  color: #ffffff;
  @media (min-width: 660px) {
    margin-top: 78px;
  }
`;

const Main = styled.main`
  @media (min-width: 660px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
