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
  const { setToken, setUserId, setUserImage, userId, setFollowing } = useContext(CustomerContext);
  const [posts, setPosts] = useState();
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState();
  const [refreshPage, setRefreshPage] = useState(false);
  const [user, setUser] = useState('');
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [follow, setFollow] = useState();

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
        setPosts(res.data.posts);
        setUser(res.data.name);
        setLoadingPage(false);
      })
      .catch((err) => {
        setLoadingPage(false);
        setError(true);
      });
    const index = JSON.parse(localStorage.following).find((e) => e.user_id === Number(id));
    if (index) {
      setFollow(true);
    } else {
      setFollow(false);
    }
  }, [refreshPage, navigate, setToken, setUserId, setUserImage, id, setFollowing]);

  function updateFollowing() {
    const config = {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    };
    setDisabled(true);
    if (follow) {
      axios
        .delete(`${process.env.REACT_APP_API_BASE_URL}/timeline/user/${id}/${userId}`, config)
        .then((res) => {
          setFollow(false);
          setDisabled(false);
          localStorage.setItem('following', JSON.stringify(res.data));
        })
        .catch(() => {
          swal('Erro!', 'Não foi possível concluir a requisição', 'error');
          setDisabled(false);
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/timeline/user/${id}`, userId, config)
        .then((res) => {
          setFollow(true);
          setDisabled(false);
          localStorage.setItem('following', JSON.stringify(res.data));
        })
        .catch(() => {
          swal('Erro!', 'Não foi possível concluir a requisição', 'error');
          setDisabled(false);
        });
    }
  }

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
          <Title color={follow.toString()}>
            <h1>{user}'s posts</h1>
            {id === userId ? (
              ''
            ) : (
              <button disabled={disabled} onClick={updateFollowing}>
                {follow ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </Title>
          {posts.length !== 0 ? (
            posts.map((p) => (
              <SinglePost
                key={p.id}
                postOwner_id={p.user_id}
                posts_id={p.id}
                link={p.link}
                description={p.description}
                md_description={p.md_description}
                md_title={p.md_title}
                md_image={p.md_image}
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
  color: ${textBaseColor};
`;

const Title = styled.div`
  margin-top: 4.97rem;
  margin-bottom: 19px;
  font-family: 'Oswald', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 33px;
  color: ${textBaseColor};
  display: flex;
  justify-content: space-between;
  button {
    width: 112px;
    height: 31px;
    border-radius: 5px;
    background: ${(props) => (props.color === 'true' ? textBaseColor : '#1877F2')};
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    color: ${(props) => (props.color === 'true' ? '#1877F2' : textBaseColor)};
  }
  @media (min-width: 660px) {
    margin-top: 78px;
  }
`;

const Main = styled.main`
  margin-top: 2.9rem;
  @media (min-width: 660px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
