import { accentColor, textBaseColor } from '../../constants/colors.js';
import { useContext, useEffect, useState } from 'react';

import { CustomerContext } from '../../components/context/customer.js';
import PublishPost from '../../components/PublishPost.js';
import SinglePost from '../../components/SinglePost.js';
import { ThreeDots } from 'react-loader-spinner';
import TrendingBox from '../../components/TrendingBox.js';
import axios from 'axios';
import styled from 'styled-components';
import swal from 'sweetalert';
import { useNavigate } from 'react-router';

export default function Timeline() {
  const [posts, setPosts] = useState();
  const [loadingPage, setLoadingPage] = useState(true);
  const [refreshPage, setRefreshPage] = useState(false);
  const [error, setError] = useState(false);
  const { setToken, setUserId, setUserImage } = useContext(CustomerContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLoadingPage(true);

    if (!localStorage.token) {
      swal('Usuário não logado!', 'Faça o login novamente para acessar suas informações.', 'error');
      setLoadingPage(false);
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
      .get(`${process.env.REACT_APP_API_BASE_URL}/timeline`, config)
      .then((res) => {
        setPosts(res.data);
        setLoadingPage(false);
      })
      .catch((err) => {
        setLoadingPage(false);
        setError(true);
      });
  }, [refreshPage, navigate, setToken, setUserId, setUserImage]);

  if (loadingPage === true) {
    return (
      <Main>
        <Title>timeline</Title>
        <Container>
          <LeftBox>
            <PublishPost />
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
          </LeftBox>
          <RightBox>
            <TrendingBox
              background={accentColor}
              color={textBaseColor}
              hide='false'
              width='20vw'
              placedAt='TimelinePage'
              setIsVisible={() => console.log('')}
            />
          </RightBox>
        </Container>
      </Main>
    );
  } else if (error === true) {
    return (
      <Main>
        <Title>timeline</Title>
        <Container>
          <LeftBox>
            <PublishPost />
            <ErrorMessage>
              Ocorreu um erro ao tentar buscar os posts, <br />
              atualize a página
            </ErrorMessage>
          </LeftBox>
          <RightBox>
            <TrendingBox
              background={accentColor}
              color={textBaseColor}
              hide='false'
              width='20vw'
              placedAt='TimelinePage'
              setIsVisible={() => console.log('')}
            />
          </RightBox>
        </Container>
      </Main>
    );
  } else {
    return (
      <Main>
        <Title>timeline</Title>
        <Container>
          <LeftBox>
            <PublishPost />
            {posts !== [] ? (
              posts.map((p) => (
                <SinglePost
                  key={p.posts_id}
                  postOwner_id={p.user_id}
                  link={p.link}
                  description={p.description}
                  name={p.name}
                  image={p.image}
                  posts_id={p.posts_id}
                  refreshPage={refreshPage}
                  setRefreshPage={setRefreshPage}
                />
              ))
            ) : (
              <ErrorMessage>Ainda não há posts</ErrorMessage>
            )}
          </LeftBox>
          <RightBox>
            <TrendingBox
              background={accentColor}
              color={textBaseColor}
              hide='false'
              width='20vw'
              placedAt='TimelinePage'
              setIsVisible={() => console.log('')}
            />
          </RightBox>
        </Container>
      </Main>
    );
  }
}

const Main = styled.main`
  width: fit-content;
  max-width: 100vw;
  margin: 0 auto;
  @media (min-width: 660px) {
    display: flex;
    flex-direction: column;
  }
`;

const Container = styled.div`
  display: flex;
`;

const LeftBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightBox = styled.div`
  display: none;
  @media (min-width: 800px) {
    display: flex;
    height: fit-content;
    margin-left: 1.2rem;
  }
`;

const ErrorMessage = styled.p`
  color: ${textBaseColor};
  font-style: italic;
  font-weight: 400;
  font-size: 1.15rem;
  font-family: 'Oswald', sans-serif;
  text-align: center;
`;

const Title = styled.h1`
  max-width: 100vw;
  margin: 1.17rem 0 1.17rem 1rem;
  color: ${textBaseColor};
  font-weight: 700;
  font-size: 1.95rem;
  font-family: 'Oswald', sans-serif;
  @media (min-width: 660px) {
    margin-top: 4.6rem;
    margin-left: 0;
  }
`;
