import { FaCircle, FaRegTrashAlt, FaTelegramPlane } from 'react-icons/fa';
import {
  accentColor,
  baseColor,
  commentColor,
  detailCommentColor,
  textBaseColor,
  textCommentColor,
} from '../constants/colors.js';
import { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import styled from 'styled-components';
import swal from 'sweetalert';
import { useNavigate } from 'react-router-dom';

export default function Comments(props) {
  const { showComment, sendHeight, comments, postOwner_id, post_id, setComments } = props;
  const [commentInput, setCommentInput] = useState('');
  const [commenting, setCommenting] = useState(false);
  const navigate = useNavigate();
  const siblingRef = useRef(null);
  const commentListRef = useRef(null);
  const following = [];
  if (localStorage.following) following.push(...JSON.parse(localStorage.following));

  useEffect(() => {
    sendHeight(siblingRef.current.clientHeight);
    commentListRef.current.scrollTop = 0;
  }, [showComment, comments, sendHeight]);

  function handleCommentInput(e) {
    if (e.target.value.length <= 2200) setCommentInput(e.target.value);
  }

  function sendNewComment(e) {
    e.preventDefault();
    const body = { comment: commentInput };
    const config = { headers: { Authorization: `Bearer ${localStorage.token}` } };
    setCommenting(true);
    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/posts/${post_id}/comment`, body, config)
      .then((res) => {
        setCommentInput('');
        setComments(res.data);
        setCommenting(false);
      })
      .catch((err) => {
        setCommenting(false);
        console.log(err);
      });
  }

  function deleteComment(comment_id) {
    const config = { headers: { Authorization: `Bearer ${localStorage.token}` } };
    swal({ title: 'Deletar esse comentário?', icon: 'warning', buttons: [true, true] }).then((res) => {
      if (res) {
        axios
          .delete(`${process.env.REACT_APP_API_BASE_URL}/posts/comment/${comment_id}`, config)
          .then((res) => {
            setComments(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }

  function handleObservationText(commentUser_id) {
    if (commentUser_id === postOwner_id && following.find((e) => e.user_id === commentUser_id)) {
      return (
        <>
          <FaCircle size={'0.4rem'} color={detailCommentColor} />
          <p>Autor do Post</p>
          <FaCircle size={'0.4rem'} color={detailCommentColor} />
          <p>following</p>
        </>
      );
    } else if (commentUser_id === postOwner_id) {
      return (
        <>
          <FaCircle size={'0.4rem'} color={detailCommentColor} />
          <p>Autor do Post</p>
        </>
      );
    } else if (JSON.parse(localStorage.following).includes(commentUser_id)) {
      return (
        <>
          <FaCircle size={'0.4rem'} color={detailCommentColor} />
          <p>following</p>
        </>
      );
    }
  }

  return (
    <CommentsContainer display={showComment ? 'initial' : 'none'} ref={siblingRef}>
      <CommentsList ref={commentListRef}>
        {comments.map((comment) => (
          <SingleComment key={comment.id}>
            <img src={comment.user_image} alt='teste' onClick={() => navigate(`/user/${comment.user_id}`)} />
            <Text>
              <User>
                <h1 onClick={() => navigate(`/user/${comment.user_id}`)}>{comment.user_name}</h1>
                {handleObservationText(comment.user_id)}
              </User>
              <p>{comment.comment}</p>
            </Text>
            <DeleteCommentIcon
              size={'0.9em'}
              color={detailCommentColor}
              onClick={() => deleteComment(comment.id)}
              display={Number(localStorage.user_id) === comment.user_id ? 'initial' : 'none'}
            />
          </SingleComment>
        ))}
      </CommentsList>
      <form onSubmit={sendNewComment}>
        <img src={localStorage.user_image} alt='teste' />
        <input
          type='text'
          placeholder='Escreva seu comentário aqui'
          onChange={handleCommentInput}
          value={commentInput}
          disabled={commenting ? 'disabled' : ''}
          required
        />
        <button type='submit' disabled={commenting ? 'disabled' : ''}>
          <FaTelegramPlane size={'1.5em'} />
        </button>
      </form>
    </CommentsContainer>
  );
}

const CommentsContainer = styled.div`
  display: ${(props) => props.display};
  z-index: -1;
  position: absolute;
  top: 100%;
  right: 0;
  width: 100%;
  height: fit-content;
  margin: 0 auto;
  padding: 0rem 1.2rem;
  border-radius: 0 0 0.8rem 0.8rem;
  background-color: ${commentColor};
  form {
    display: flex;
    position: relative;
    align-items: center;
    margin: 1em 0;
    padding-top: 1em;
    border-top: 1px solid ${baseColor};
    img {
      width: 2.5rem;
      height: 2.5rem;
      margin-right: 1rem;
      border-radius: 50%;
      object-fit: cover;
    }
    input {
      width: 90vw;
      padding: 0.8em;
      border: none;
      border-radius: 0.6em;
      overflow: auto;
      color: ${textBaseColor};
      background-color: ${accentColor};
    }
    button {
      position: absolute;
      top: 45%;
      right: 1%;
      border: none;
      color: ${textBaseColor};
      cursor: pointer;
      background-color: inherit;
    }
  }
  @media (min-width: 660px) {
    form {
      input {
        width: 90%;
      }
    }
  }
`;

const CommentsList = styled.div`
  max-height: 20rem;
  overflow: auto;
`;

const SingleComment = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: fit-content;
  padding: 0.8em 0;
  border-bottom: 1px solid ${baseColor};
  color: ${textBaseColor};
  img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
  }
  :last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 90%;
  min-height: 4em;
  margin-left: 1rem;
  font-size: 0.8rem;
  h1 {
    margin-right: 0.8em;
    font-weight: 700;
  }
  p {
    color: ${detailCommentColor};
    line-height: 1rem;
    text-align: justify;
  }
`;

const User = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  h1 {
    cursor: pointer;
  }
  p {
    margin-left: 0.8em;
    color: ${textCommentColor};
    line-height: 1rem;
  }
`;

const DeleteCommentIcon = styled(FaRegTrashAlt)`
  display: ${(props) => props.display};
  cursor: pointer;
`;
