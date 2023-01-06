import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import PublishPost from "../components/PublishPost";
import SinglePost from "../components/SinglePost";
import { ThreeDots } from "react-loader-spinner";

export default function Timeline() {
  const [posts, setPosts] = useState();
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get(`http://${process.env.REACT_APP_API_BASE_URL}/timeline`)
      .then((res) => {
        setPosts(res.data);
        setLoadingPage(false);
      })
      .catch((err) => {
        setLoadingPage(false);
        setError(true);
      });
  }, [posts]);

  if (loadingPage === true) {
    return (
      <Main>
        <Title>timeline</Title>
        <PublishPost />
        <div class="loading">
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#4fa94d"
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
      </Main>
    );
  } else if (error === true) {
    return (
      <Main>
        <Title>timeline</Title>
        <PublishPost />
        <ErrorMessage>
          Ocorreu um erro ao tentar buscar os posts, <br />
          atualize a página
        </ErrorMessage>
      </Main>
    );
  } else {
    return (
      <Main>
        <AreaUtil>
          <Title>timeline</Title>
          <PublishPost />
          {posts !== [] ? (
            posts.map((p) => (
              <SinglePost
                key={p.posts_id}
                link={p.link}
                description={p.description}
                name={p.name}
                image={p.image}
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
  font-family: "Oswald";
  font-style: italic;
  font-weight: 400;
  font-size: 20px;
  color: #ffffff;
`;

const Title = styled.div`
  margin-top: 19px;
  margin-bottom: 19px;
  font-family: "Oswald";
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
