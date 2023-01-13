import 'react-tooltip/dist/react-tooltip.css';

import { IoHeart, IoHeartOutline, IoTrashSharp } from 'react-icons/io5';
import { accentColor, commentColor, textAccentColor, textBaseColor } from '../constants/colors';
import { useContext, useEffect, useRef, useState } from 'react';

import { AiOutlineComment } from 'react-icons/ai';
import { BiRepost } from 'react-icons/bi';
import Comments from './Comments.js';
import { CustomerContext } from './context/customer';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import Modal from './Modal/Modal';
import { ReactTagify } from 'react-tagify';
import { Tooltip } from 'react-tooltip';
import axios from 'axios';
import styled from 'styled-components';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

export default function SinglePost(props) {
  const {
    postOwner_id,
    link,
    description,
    image,
    name,
    posts_id,
    md_description,
    md_title,
    md_image,
  } = props;
  const { token, userId, setToken, setUserImage, setUserId, setFollowing } = useContext(CustomerContext);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [likes, setLikes] = useState(0);
  const [usersWhoLiked, setUsersWhoLiked] = useState([]);
  const [usersWhoLikedWithoutMe, setUsersWhoLikedWithoutMe] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [revealInput, setRevealInput] = useState(false);
  const [body, setBody] = useState({ description: description, link: link });
  const [showComment, setShowComment] = useState(false);
  const [refreshPage,setRefreshPage] = useState(false)
  const [comments, setComments] = useState([]);
  const [action, setAction] = useState('');
  const navigate = useNavigate();
  const targetRef = useRef(null);

  // get post and verify user authentication
  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserId(localStorage.getItem('user_id'));
    const tempUserId = localStorage.getItem('user_id');
    setUserImage(localStorage.getItem('user_image'));
    setFollowing(localStorage.following);

    const fetchData = async () => {
      try {
        const response2 = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/posts/${posts_id}/like`);
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
  }, [refreshPage, setToken, setUserId, setUserImage, posts_id, setFollowing]);

  // get comments
  useEffect(() => {
    const config = {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    };
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/posts/${posts_id}/comments`, config)
      .then((res) => setComments(res.data))
      .catch((err) => {
        console.log(err);
      });
  }, [posts_id, showComment]);

  const handleCommentHeight = (height) => (targetRef.current.style.height = `${height}px`);

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

  function handleChange(e) {
    setBody({ ...body, [e.target.name]: e.target.value });
  }

  function keyUp(e) {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    if (e.key === 'Escape') {
      setRevealInput(false);
    }
    if (e.key === 'Enter') {
      setDisabled(true);
      axios
        .put(`${process.env.REACT_APP_API_BASE_URL}/timeline/${posts_id}`, body, config)
        .then((res) => {
          setRevealInput(false);
          setRefreshPage(!refreshPage);
          setDisabled(false);
        })
        .catch(() => {
          swal({
            title: `Houve um erro ao atualizar o post!`,
            icon: 'error',
          });
          setDisabled(false);
        });
    }
  }

  return (
    <>
      <PostContainer>
        <Left>
          <img onClick={() => navigate(`/user/${postOwner_id}`)} src={image} alt='userImage' />
          {thisUserLikedThisPost() ? (
            <>
              <IoHeart
                id={`${posts_id}Liked`}
                onClick={dislikePost}
                style={{ marginBottom: '0.2em', cursor: 'pointer', color: 'red' }}
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
              <IoHeartOutline id={posts_id} onClick={likePost} style={{ marginBottom: '0.2em', cursor: 'pointer' }} />
              <Tooltip anchorId={posts_id} content='Curtir!' place='bottom' />
            </>
          )}
          <Likes>{likes} likes</Likes>
          <CommentsBox onClick={() => setShowComment(!showComment)}>
            <AiOutlineComment size={'1.2rem'} />
            <p>
              {comments.length} {comments.length > 1 ? ' comentários' : ' comentário'}
            </p>
          </CommentsBox>
          <Shares>
            <BiRepost
              style={{ cursor: 'pointer' }}
              size={'1.2rem'}
              onClick={() => {
                setAction('reposting');
                setModalIsOpen(true);
              }}
            />
            <p>x re-posts</p>
          </Shares>
        </Left>
        <Right>
          <Title>
            <Name onClick={() => navigate(`/user/${postOwner_id}`)}>{name}</Name>
            <div>
              <MdOutlineModeEditOutline
                style={{ display: `${postOwner_id === +userId ? 'flex' : 'none'}` }}
                onClick={() => setRevealInput(!revealInput)}
              />
              <IoTrashSharp
                style={{ display: `${postOwner_id === +userId ? 'flex' : 'none'}` }}
                onClick={() => {
                  setAction('deleting');
                  setModalIsOpen(true);
                }}
              />
            </div>
          </Title>
          {revealInput ? (
            <input
              disabled={disabled ? 'disabled' : ''}
              onChange={handleChange}
              onKeyUp={keyUp}
              value={body.description}
              name='description'
              autoFocus
            />
          ) : (
            <ReactTagify colors={textBaseColor} tagClicked={(tag) => navigateToTrend(tag)}>
              <Description>{description}</Description>
            </ReactTagify>
          )}
          <Snippet onClick={() => window.open(link)}>
            <TextArea>
              <MetaTitle>{md_title}</MetaTitle>
              <MetaDescription>{md_description}</MetaDescription>
              <MetaLink>{link}</MetaLink>
            </TextArea>
            <ImageContainer>
              <img src={md_image} alt='ImageNotFound' />
            </ImageContainer>
          </Snippet>
        </Right>
        <Modal
          token={token}
          setModalIsOpen={setModalIsOpen}
          modalIsOpen={modalIsOpen}
          posts_id={posts_id}
          setRefreshPage={setRefreshPage}
          refreshPage={refreshPage}
          action={action}
          userId={userId}
        />
        <FillContainer display={showComment ? 'initial' : 'none'}>
          <div></div>
          <div>
            <div></div>
          </div>
        </FillContainer>
        <Comments
          showComment={showComment}
          sendHeight={handleCommentHeight}
          comments={comments}
          postOwner_id={postOwner_id}
          post_id={posts_id}
          setComments={setComments}
        />
      </PostContainer>
      <Blank height={showComment ? '26rem' : '0'} ref={targetRef}></Blank>
    </>
  );
}

const Blank = styled.div`
  height: ${(props) => props.height};
`;

const FillContainer = styled.div`
  display: ${(props) => props.display};
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 16px 16px 0 0;
  div {
    :first-of-type {
      height: 95%;
      background-color: inherit;
    }
    :last-of-type {
      height: 5%;
      background-color: ${commentColor};
      div {
        width: 100%;
        height: 100%;
        background-color: ${accentColor};
        border-radius: 0 0 16px 16px;
      }
    }
  }
`;

const PostContainer = styled.div`
  width: fit-content;
  max-width: 100vw;
  height: fit-content;
  background-color: ${accentColor};
  display: flex;
  justify-content: center;
  padding: 10px 18px 15px 15px;
  margin-top: 19px;
  position: relative;
  z-index: 4;
  img {
    width: 40px;
    height: 40px;
    border-radius: 26.5px;
  }
  @media (min-width: 660px) {
    width: 611px;
    height: 276px;
    background: ${accentColor};
    border-radius: 16px;
    justify-content: flex-start;
    padding: 19px 23px 20px 18px;
  }
`;

const ImageContainer = styled.div`
  display: flex;
`;

const TextArea = styled.div`
  display: flex;
  padding: 7px 10px 8px 10px;
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
  color: ${textBaseColor};
  cursor: pointer;
`;

const Description = styled.h2`
  font-family: 'Lato';
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  color: ${textAccentColor};
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
    cursor: pointer;
  }
`;

const Likes = styled.p`
  font-family: 'Lato', sans-serif;
  font-style: normal;
  font-weight: 400;
  font-size: 11px;
  text-align: center;
  color: ${textBaseColor};
`;

const CommentsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1em;
  font-size: 11px;
  text-align: center;
  color: ${textBaseColor};
  line-height: 1.2em;
  cursor: pointer;
`;

const Shares = styled(CommentsBox)`
  cursor: inherit;
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
