import styled from "styled-components";
import { IoHeartOutline } from "react-icons/io5";
import { ReactTagify } from "react-tagify";
import { textBaseColor } from "../constants/colors";
import { useNavigate } from "react-router-dom";

export default function SinglePost({
  link,
  description,
  image,
  name,
  refreshPage,
  setRefreshPage,
}) {
  const navigate = useNavigate();
  function navigateToTrend(str) {
    const newStr = str.replace("#", "");
    setRefreshPage(!refreshPage);
    console.log("clicou")
    navigate(`/hashtag/${newStr}`);
  }

  /* const [metadata, setMetadata] = useState({})
    useEffect(() => {
        urlMetaData("").then((res) => {
            setMetadata(res)
        })
    }, [metadata]) */
  return (
    <PostContainer>
      <Left>
        <img src={image} />
        <IoHeartOutline style={{ marginBottom: "12px", cursor: "pointer" }} />
        <Likes>13 likes</Likes>
      </Left>
      <Right>
        <Name>{name}</Name>
        <ReactTagify
          colors={textBaseColor}
          tagClicked={(tag) => navigateToTrend(tag)}
        >
          <Description>{description}</Description>
        </ReactTagify>
        <Snippet onClick={() => window.open(link)}>
          <div>
            <MetaTitle>
              Como aplicar o Material UI em um projeto React
            </MetaTitle>
            <MetaDescription>
              Hey! I have moved this tutorial to my personal blog. Same content,
              new location. Sorry about making you click through to another
              page.
            </MetaDescription>
            <MetaLink>{link}</MetaLink>
          </div>
          <img src="https://i.kym-cdn.com/entries/icons/original/000/016/546/hidethepainharold.jpg" />
        </Snippet>
      </Right>
    </PostContainer>
  );
}

const PostContainer = styled.div`
  width: 100%;
  height: 232px;
  background: #171717;
  display: flex;
  justify-content: center;
  padding: 10px 18px 15px 15px;
  margin-top: 19px;
  img {
    width: 40px;
    height: 40px;
    border-radius: 26.5px;
  }
  @media (min-width: 660px) {
    width: 611px;
    height: 276px;
    background: #171717;
    border-radius: 16px;
    justify-content: flex-start;
    padding: 19px 23px 20px 18px;
  }
`;

const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 14px;
`;

const Name = styled.h1`
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  color: #ffffff;
`;

const Description = styled.h2`
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: #b7b7b7;
  line-height: 20px;
`;

const Snippet = styled.div`
  display: flex;
  width: 278px;
  height: 115px;
  border: 1px solid #4d4d4d;
  border-radius: 11px;
  padding: 7px 0 1px 11px;
  cursor: pointer;

  div {
    display: flex;
    flex-direction: column;
  }

  img {
    width: 95px;
    height: 115px;
    border-radius: 0px 12px 13px 0px;
  }
  @media (min-width: 660px) {
    width: 503px;
    height: 155px;
    border: 1px solid #4d4d4d;
    border-radius: 11px;
  }
`;

const MetaTitle = styled.h1`
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  color: #cecece;
`;

const MetaDescription = styled.h2`
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 9px;
  color: #9b9595;
  display: flex;
  justify-content: flex-start;
`;

const MetaLink = styled.h3`
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  color: #cecece;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    margin-bottom: 17px;
  }
`;

const Likes = styled.p`
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 9px;
  text-align: center;
  color: #ffffff;
`;
