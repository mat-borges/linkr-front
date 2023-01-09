import { IoHeartOutline, IoTrashSharp, IoHeart } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import Modal from './Modal/Modal';
import { ReactTagify } from 'react-tagify';
import styled from 'styled-components';
import { textBaseColor } from '../constants/colors';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import { CustomerContext } from './context/customer';

export default function SinglePost({
  postOwner_id,
  link,
  description,
  image,
  name,
  posts_id,
  refreshPage,
  setRefreshPage,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [metadata, setMetadata] = useState({});
  const [likes, setLikes] = useState(0);
  const { token, userId, setToken, setUserImage, setUserId } = useContext(CustomerContext);
  const [usersWhoLiked, setUsersWhoLiked] = useState([]);
  const [usersWhoLikedWithoutMe, setUsersWhoLikedWithoutMe] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserId(localStorage.getItem('user_id'));
    const tempUserId = localStorage.getItem('user_id');
    setUserImage(localStorage.getItem('user_image'));
    const fetchData = async () => {
      try {
        const response1 = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/posts/${posts_id}/metadata`);
        const response2 = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/posts/${posts_id}/like`);
        setMetadata(response1.data);
        setLikes(response2.data.likeCount);
        setUsersWhoLiked(response2.data.users);
        let { users } = response2.data;
        const userArr = [];
        for (let i = 0; i < users.length; i++) {
          if (parseInt(users[i].user_id) !== +tempUserId) {
            userArr.push(users[i]);
          }
        }
        setUsersWhoLikedWithoutMe(userArr);
      } catch (err) {
        swal({
          title: `Houve um erro ao carregar metadata do post ${posts_id}!`,
          icon: 'error',
        });
        console.log(err.response.data);
      }
    };
    fetchData();
  }, [refreshPage]);

  function likePost() {
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/posts/${posts_id}/like`, {}, config)
      .then((res) => {
        setRefreshPage(!refreshPage);
      })
      .catch((err) => {
        swal({
          title: `Houve um erro ao dar like no post ${posts_id}!`,
          icon: 'error',
        });
        console.log(err.response.data);
      });
  }

  function dislikePost() {
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    axios
      .delete(`${process.env.REACT_APP_API_BASE_URL}/posts/${posts_id}/like`, config)
      .then((res) => {
        setRefreshPage(!refreshPage);
      })
      .catch((err) => {
        swal({
          title: `Houve um erro ao dar dislike no post ${posts_id}!`,
          icon: 'error',
        });
        console.log(err.response.data);
      });
  }

  function navigateToUserPage(postOwnerId) {
    navigate(`/user/${postOwnerId}`);
  }

  function navigateToTrend(str) {
    const newStr = str.replace('#', '');
    setRefreshPage(!refreshPage);
    navigate(`/hashtag/${newStr}`);
  }

  function thisUserLikedThisPost() {
    for (let i = 0; i < usersWhoLiked.length; i++) {
      if (usersWhoLiked[i].user_id === +userId) {
        return true;
      }
    }
    return false;
  }

  return (
    <PostContainer>
      <Left>
        <img
          onClick={() => navigateToUserPage(postOwner_id)}
          src={image}
          alt='userImage'
          style={{ cursor: 'pointer' }}
        />
        {thisUserLikedThisPost() ? (
          <>
            <IoHeart
              id={`${posts_id}Liked`}
              onClick={dislikePost}
              style={{ marginBottom: '12px', cursor: 'pointer', color: 'red' }}
            />
            {likes === 1 ? (
              <Tooltip anchorId={`${posts_id}Liked`} content={`Apenas você curtiu esse post`} place='bottom' />
            ) : (
              <Tooltip
                anchorId={`${posts_id}Liked`}
                content={`Você, ${usersWhoLikedWithoutMe[0]?.name}`}
                place='bottom'
              />
            )}
          </>
        ) : (
          <>
            <IoHeartOutline id={posts_id} onClick={likePost} style={{ marginBottom: '12px', cursor: 'pointer' }} />
            <Tooltip anchorId={posts_id} content='AINDA NÃO CURTI' place='bottom' />
          </>
        )}
        <Likes>{likes}</Likes>
      </Left>
      <Right>
        <Title>
          <Name style={{ cursor: 'pointer' }} onClick={() => navigateToUserPage(postOwner_id)}>
            {name}
          </Name>
          <div>
            <MdOutlineModeEditOutline />
            <IoTrashSharp onClick={() => setModalIsOpen(true)} />
          </div>
        </Title>
        <ReactTagify colors={textBaseColor} tagClicked={(tag) => navigateToTrend(tag)}>
          <Description>{description}</Description>
        </ReactTagify>

        <Snippet onClick={() => window.open(link)}>
          <TextArea>
            <MetaTitle>{metadata.title}</MetaTitle>
            <MetaDescription>{metadata.description}</MetaDescription>
            <MetaLink>{metadata.url}</MetaLink>
          </TextArea>
          <ImageContainer>
            <img src={metadata.image} alt='linkImage' />
          </ImageContainer>
        </Snippet>
      </Right>
      <Modal setModalIsOpen={setModalIsOpen} modalIsOpen={modalIsOpen} posts_id={posts_id} />
    </PostContainer>
  );
}

const ImageContainer = styled.div`
  display: flex;
`;
const TextArea = styled.div`
  display: flex;
  padding: 7px 10px 8px 10px;
`;
const PostContainer = styled.div`
  width: 100%;
  max-width: 100vw;
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
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  color: #ffffff;
`;

const Description = styled.h2`
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: #b7b7b7;
  line-height: 20px;
  max-width: 100vw;
  word-break: break-all;
`;

const Snippet = styled.div`
  display: flex;
  justify-content: space-between;
  width: 278px;
  height: 115px;
  border: 1px solid #4d4d4d;
  border-radius: 11px;
  cursor: pointer;

  div {
    display: flex;
    flex-direction: column;
  }

  img {
    justify-content: flex-end;
    width: 95px;
    height: 115px;
    border-radius: 0px 12px 13px 0px;
  }
  @media (min-width: 660px) {
    width: 503px;
    height: 155px;
    border: 1px solid #4d4d4d;
    border-radius: 11px;
    ${TextArea} {
      padding: 24px 10px 20px 24px;
    }
    h1 {
      font-size: 16px;
    }
    h2 {
      font-size: 11px;
    }
    h3 {
      font-size: 11px;
    }
    img {
      justify-content: flex-end;
      width: 154px;
      height: 155px;
      border-radius: 0px 12px 13px 0px;
    }
  }
`;

const MetaTitle = styled.h1`
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  color: #cecece;
  margin-bottom: 5px;
`;

const MetaDescription = styled.h2`
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 9px;
  color: #9b9595;
  display: flex;
  justify-content: flex-start;
  overflow: hidden;
  margin-bottom: 13px;
`;

const MetaLink = styled.h3`
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 9px;
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
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  text-align: center;
  color: #ffffff;
`;

const Title = styled.div`
  display: flex;
  justify-content: space-between;
  div {
    display: flex;
    width: 45px;
    justify-content: space-between;
  }
`;
