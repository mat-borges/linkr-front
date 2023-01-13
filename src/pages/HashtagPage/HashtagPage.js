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
  const [refreshPage] = useState(false);
  const { setToken, setUserId, setUserImage } = useContext(CustomerContext);
  const [newPosts, setNewPosts] = useState([]);
  const [delay, setDelay] = useState(null);
  const navigate = useNavigate();

  useInterval(() => {
    console.log("use interval");
    SearchForNewPosts(localStorage.getItem("token"));
  }, delay);

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
      if (JSON.stringify(data) !== JSON.stringify(posts)) {
        let diffArr = [];
        for (let i = 0; i < data.length; i++) {
          if (JSON.stringify(posts).includes(JSON.stringify(data[i]))) {
            continue;
          } else {
            diffArr.push(data[i]);
          }
          setNewPosts(diffArr);
        }
      }
    } catch (err) {
      if (err.response.status === 404) {
        swal("ERROR 404", "Não há posts nessa trend.", "info");
      }
    }
  }

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
        setDelay(15000);
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
function AddNewPostsToPostsList(){
  const newPostsList =[...newPosts,...posts]
  setPosts(newPostsList);
  setNewPosts(newPostsList);
}
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
            <RefreshPostsButton AddNewPostsToPostsList={AddNewPostsToPostsList}>
              {newPosts.length}, new posts, load more!
            </RefreshPostsButton>
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
