import { accentColor, textBaseColor } from "../../constants/colors.js";
import { useContext, useEffect, useState } from "react";
import useInterval from "use-interval";
import { CustomerContext } from "../../components/context/customer.js";
import PublishPost from "../../components/PublishPost.js";
import { ThreeDots } from "react-loader-spinner";
import TrendingBox from "../../components/TrendingBox.js";
import axios from "axios";
import styled from "styled-components";
import swal from "sweetalert";
import { useNavigate } from "react-router";
import PostList from "../../components/PostList.js";
import RefreshPostsButton from "../../components/RefreshPostsButton.js";

export default function Timeline() {
  const [posts, setPosts] = useState();
  const [loadingPage, setLoadingPage] = useState(true);
  const [refreshPage, setRefreshPage] = useState(false);
  const [error, setError] = useState(false);
  const [follow, setFollow] = useState([]);
  const { setToken, setUserId, setUserImage } = useContext(CustomerContext);
  const navigate = useNavigate();
  const [newPosts, setNewPosts] = useState([]);
  const [delay, setDelay] = useState(null);

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
        `${process.env.REACT_APP_API_BASE_URL}/timeline`,
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

    if (!localStorage.token) {
      swal(
        "Usuário não logado!",
        "Faça o login novamente para acessar suas informações.",
        "error"
      );
      setLoadingPage(false);
      navigate("/");
    } else {
      setToken(localStorage.token);
      setUserId(localStorage.user_id);
      setUserImage(localStorage.user_image);
    }
    const config = {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    };
    setFollow(JSON.parse(localStorage.following));

    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/timeline`, config)
      .then((res) => {
        setPosts(res.data);
        setNewPosts(res.data);
        setDelay(15000);
        setLoadingPage(false);
      })
      .catch((err) => {
        setLoadingPage(false);
        setError(true);
      });
  }, [refreshPage, navigate, setToken, setUserId, setUserImage]);

  function AddNewPostsToPostsList() {
    const newPostsList = [...newPosts, ...posts];
    setPosts(newPostsList);
    setNewPosts(newPostsList);
  }

  if (loadingPage === true) {
    return (
      <Main>
        <Title>timeline</Title>
        <Container>
          <LeftBox>
            <PublishPost
              refreshPage={refreshPage}
              setRefreshPage={setRefreshPage}
            />
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
          </LeftBox>
          <RightBox>
            <TrendingBox
              background={accentColor}
              color={textBaseColor}
              hide="false"
              width="20vw"
              placedAt="TimelinePage"
              setIsVisible={() => console.log("")}
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
            <PublishPost
              refreshPage={refreshPage}
              setRefreshPage={setRefreshPage}
            />
            <ErrorMessage>
              Ocorreu um erro ao tentar buscar os posts, <br />
              atualize a página
            </ErrorMessage>
          </LeftBox>
          <RightBox>
            <TrendingBox
              background={accentColor}
              color={textBaseColor}
              hide="false"
              width="20vw"
              placedAt="TimelinePage"
              setIsVisible={() => console.log("")}
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
            <PublishPost
              refreshPage={refreshPage}
              setRefreshPage={setRefreshPage}
            />
            {JSON.stringify(newPosts) !== JSON.stringify(posts) ? (
              <RefreshPostsButton
                AddNewPostsToPostsList={AddNewPostsToPostsList}
              >
                {newPosts.length}, new posts, load more!
              </RefreshPostsButton>
            ) : (
              false
            )}
            {posts.length !== 0 ? (
              <PostList posts={posts} />
            ) : follow.length !== 0 ? (
              <ErrorMessage>No posts found from your friends</ErrorMessage>
            ) : (
              <ErrorMessage>
                You don't follow anyone yet. Search for new friends!
              </ErrorMessage>
            )}
          </LeftBox>
          <RightBox>
            <TrendingBox
              background={accentColor}
              color={textBaseColor}
              hide="false"
              width="20vw"
              placedAt="TimelinePage"
              setIsVisible={() => console.log("")}
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
  margin-top: 2.9rem;
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
  font-family: "Oswald", sans-serif;
  text-align: center;
`;

const Title = styled.h1`
  max-width: 100vw;
  margin: 4.97rem 0 1.17rem 1rem;
  color: ${textBaseColor};
  font-weight: 700;
  font-size: 1.95rem;
  font-family: "Oswald", sans-serif;
  @media (min-width: 660px) {
    margin-top: 4.6rem;
    margin-left: 0;
  }
`;
