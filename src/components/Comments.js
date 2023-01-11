import { FaCircle, FaTelegramPlane } from 'react-icons/fa';
import {
  accentColor,
  baseColor,
  commentColor,
  detailCommentColor,
  textBaseColor,
  textCommentColor,
} from '../constants/colors';

import styled from 'styled-components';

export default function Comments({ showComment }) {
  const comments = [
    {
      image: 'https://johto.legiaodosherois.com.br/wp-content/uploads/2021/03/legiao_sTSiCf40OA65.jpg',
      user_name: 'Usuário X',
      following: true,
      text: 'Cometarinho do usuário',
    },
    {
      image: 'https://johto.legiaodosherois.com.br/wp-content/uploads/2021/03/legiao_sTSiCf40OA65.jpg',
      user_name: 'Usuário X',
      following: true,
      text: 'Cometarinho do usuário',
    },
    {
      image: 'https://johto.legiaodosherois.com.br/wp-content/uploads/2021/03/legiao_sTSiCf40OA65.jpg',
      user_name: 'Usuário X',
      following: true,
      text: 'Cometarinho do usuário',
    },
    {
      image: 'https://johto.legiaodosherois.com.br/wp-content/uploads/2021/03/legiao_sTSiCf40OA65.jpg',
      user_name: 'Usuário X',
      following: false,
      text: `Comentário do Usuário X, testando comentário gigante de um usuário que resolveu escrever um puta dum texto gigante, obrigado de nada Tentando aumentar mais ainda o do texto pra ver se não ultrapassa a margem`,
    },
    {
      image: 'https://johto.legiaodosherois.com.br/wp-content/uploads/2021/03/legiao_sTSiCf40OA65.jpg',
      user_name: 'Usuário X',
      following: false,
      text: `Comentário do Usuário X, testando comentário gigante de um usuário que resolveu escrever um puta dum texto gigante, obrigado de nada Tentando aumentar mais ainda o do texto pra ver se não ultrapassa a margem`,
    },
  ];

  return (
    <CommentsContainer display={showComment ? 'initial' : 'none'}>
      <CommentsList>
        {comments.map((comment) => (
          <SingleComment>
            <img src={comment.image} alt='teste' />
            <Text>
              <User>
                <h1>{comment.user_name}</h1>
                {comment.following ? <FaCircle size={'0.4rem'} color={detailCommentColor} /> : ''}
                <p>{comment.following ? 'seguindo' : ''}</p>
              </User>
              <p>{comment.text}</p>
            </Text>
          </SingleComment>
        ))}
      </CommentsList>
      <form>
        <img src={localStorage.user_image} alt='teste' />
        <input type='text' placeholder='Escreva seu comentário aqui' />
        <button type='submit' onClick={(e) => e.preventDefault()}>
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
  top: 80%;
  right: 0;
  width: fit-content;
  max-width: 100%;
  height: fit-content;
  margin: 0 auto;
  padding: 0rem 1.2rem;
  border-radius: 0.8rem;
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
  p {
    margin-left: 0.8em;
    color: ${textCommentColor};
    line-height: 1rem;
  }
`;
