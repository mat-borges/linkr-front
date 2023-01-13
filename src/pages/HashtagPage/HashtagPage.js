import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomerContext } from "../../components/context/customer.js";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import styled from "styled-components";
import swal from "sweetalert";
import { textBaseColor } from "../../constants/colors.js";
import PostList from "../../components/PostList.js";
import useInterval from "use-interval";
import RefreshPostsButton from "../../components/RefreshPostsButton.js";

export default function Hashtag() {
  const { hashtag } = useParams();
  const [posts, setPosts] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState();
  const [refreshPage, setRefreshPage] = useState(false);
  const { setToken, setUserId, setUserImage } = useContext(CustomerContext);
  const [actualPostCount, setActualPostCount] = useState(0);
  const [newPosts, setNewPosts] = useState([]);
  const navigate = useNavigate();

  async function SearchForNewPosts(token) {
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/hashtag/${hashtag}`,
        config
      );
      setNewPosts(data);

      if (JSON.stringify(data) !== JSON.stringify(posts)) {
        const diffArr = [];
        for (let i = data.length-1; i >=0; i--) {
          if (JSON.stringify(data[i]) !== JSON.stringify(posts[i])) {
            diffArr.push(data[i]);
          }
          console.log(diffArr);
          setNewPosts(diffArr);
        }
      }
    } catch (err) {
      if (err.response.status === 404) {
        swal("ERROR 404", "Não há posts nessa trend.", "info");
      }
    }
  }

  const tempToken = localStorage.getItem("token");
  const config = {
    headers: {
      authorization: `Bearer ${tempToken}`,
    },
  };

  useInterval(() => {
    SearchForNewPosts(tempToken);
  }, 5000);

  useEffect(() => {
    setLoadingPage(true);
    if (!localStorage.getItem("token")) {
      swal(
        "Usuário não logado!",
        "Faça o login novamente para acessar suas informações.",
        "error"
      );
      navigate("/");
    }
    setToken(localStorage.getItem("token"));
    setUserId(localStorage.getItem("user_id"));
    setUserImage(localStorage.getItem("user_image"));
    const tempToken = localStorage.getItem("token");
    const config = {
      headers: {
        authorization: `Bearer ${tempToken}`,
      },
    };

    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/hashtag/${hashtag}`, config)
      .then((res) => {
        setPosts(res.data);
        setNewPosts(res.data);
        setLoadingPage(false);
        setActualPostCount(res.data.length);
      })
      .catch((err) => {
        setLoadingPage(false);
        setError(true);
        if (err.response.status === 404) {
          swal("ERROR 404", "Não há posts nessa trend.", "info");
        }
      });
  }, [
    refreshPage,
    hashtag,
    refreshPage,
    setToken,
    setUserId,
    setUserImage,
    navigate,
  ]);

  if (loadingPage === true) {
    return (
      <Main>
        <AreaUtil>
          <Title># {hashtag}</Title>
          <div className="loading">
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color={textBaseColor}
              ariaLabel="three-dots-loading"
              wrapperStyle={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              wrapperClassName="loading"
              visible={true}
            />
          </div>
        </AreaUtil>
      </Main>
    );
  } else if (error === true) {
    return (
      <Main>
        <Title># {hashtag}</Title>
        <ErrorMessage>
          Ocorreu um erro ao tentar buscar os posts, <br />
        </ErrorMessage>
      </Main>
    );
  } else {
    return (
      <Main>
        <AreaUtil>
          <Title># {hashtag}</Title>
          {JSON.stringify(newPosts) !== JSON.stringify(posts) ? (
            <RefreshPostsButton>{newPosts.length}, new posts, load more!</RefreshPostsButton>
          ) : (
            false
          )}

          {posts !== [] ? (
            <PostList posts={posts} />
          ) : (
            <ErrorMessage>Ainda não há posts</ErrorMessage>
          )}
        </AreaUtil>
      </Main>
    );
  }
}

const AreaUtil = styled.div`
  margin-top: 2.9rem;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-family: "Oswald", sans-serif;
  font-style: italic;
  font-weight: 400;
  font-size: 20px;
  color: #ffffff;
`;

const Title = styled.div`
  margin-top: 4.97rem;
  margin-bottom: 19px;
  font-family: "Oswald", sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 33px;
  color: #ffffff;
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
