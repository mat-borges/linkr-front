import { useContext, useEffect, useState } from "react";

import SinglePost from "../../components/SinglePost";
import swal from "sweetalert";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { CustomerContext } from "../../components/context/customer";

export default function Hashtag() {
  const { hashtag } = useParams();
  const [posts, setPosts] = useState();
  const [loadingPage, setLoadingPage] = useState(true);
  const [error, setError] = useState();
  const [refreshPage, setRefreshPage] = useState(false);
  const { token } = useContext(CustomerContext);
  const navigate = useNavigate();
  //setToken(localStorage.getItem("token"));
  useEffect(() => {
    setLoadingPage(true);
    if (!token) {
      swal(
        "Usuário não logado!",
        "Faça o login novamente para acessar suas informações.",
        "error"
      );
      navigate("/");
    }
    const config = {
      headers: {
        authorization: token,
      },
    };
    console.log(token);
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/hashtag/${hashtag}`, config)
      .then((res) => {
        setPosts(res.data);
        setLoadingPage(false);
      })
      .catch((err) => {
        setLoadingPage(false);
        setError(true);
        if (err.response.status === 404) {
          swal("ERROR 404", "Não há posts nessa trend.", "info");
        }
      });
  }, [refreshPage, hashtag]);

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
          {posts !== [] ? (
            posts.map((p) => (
              <SinglePost
                key={p.posts_id}
                posts_id={p.posts_id}
                link={p.link}
                description={p.description}
                name={p.name}
                image={p.image}
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
  font-family: "Oswald", sans-serif;
  font-style: italic;
  font-weight: 400;
  font-size: 20px;
  color: #ffffff;
`;

const Title = styled.div`
  margin-top: 19px;
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
  @media (min-width: 660px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;
