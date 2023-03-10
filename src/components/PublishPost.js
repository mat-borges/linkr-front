import {
  inputPublishColor,
  publishColor,
  textBaseColor,
  textInputPublishColor,
  textPublishColor,
} from '../constants/colors.js';

import axios from 'axios';
import styled from 'styled-components';
import swal from 'sweetalert';
import { useState } from 'react';

export default function PublishPost({ refreshPage, setRefreshPage }) {
  const [form, setForm] = useState({ link: '', description: '' });
  const [publishing, setPublishing] = useState(false);

  function handleForm(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function post(e) {
    e.preventDefault();
    const body = form;
    const config = {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    };
    setPublishing(true);

    axios
      .post(`${process.env.REACT_APP_API_BASE_URL}/posts/publish`, body, config)
      .then(() => {
        setRefreshPage(!refreshPage);
        swal({ title: 'Link publicado com sucesso', icon: 'success' }).then((resp) => {
          if (resp) {
            setForm({ link: '', description: '' });
            setPublishing(false);
          }
        });
      })
      .catch((err) => {
        swal({ title: 'Houve um erro ao publicar seu link!', icon: 'error' }).then((resp) => {
          if (resp) setPublishing(false);
        });
        console.log(err.response.data.errors);
      });
  }

  return (
    <PublishContainer publishing={publishing}>
      <img src={localStorage.user_image} alt='userAvatar' />
      <div>
        <h1>What are you going to share today?</h1>
        <form onSubmit={post}>
          <input
            type='url'
            name='link'
            id='link'
            placeholder='http://...'
            value={form.link}
            onChange={handleForm}
            disabled={publishing ? 'diabled' : ''}
            required
          />
          <input
            type='text'
            name='description'
            id='description'
            placeholder='Awesome article about #javascript'
            value={form.description}
            onChange={handleForm}
            disabled={publishing ? 'diabled' : ''}
          />
          <button type='submit' disabled={publishing ? 'disabled' : ''}>
            {publishing ? <p>Publishing...</p> : <p>Publish</p>}
          </button>
        </form>
      </div>
    </PublishContainer>
  );
}

const PublishContainer = styled.div`
  display: flex;
  width: 100%;
  max-width: 100vw;
  height: fit-content;
  margin: 0 auto;
  padding: 1.1rem;
  color: ${textPublishColor};
  background-color: ${publishColor};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  img {
    display: none;
    width: 2.6em;
    height: 2.6em;
    margin-right: 1.1rem;
    border-radius: 50%;
    object-fit: cover;
  }
  div {
    width: 100%;
    h1 {
      margin-bottom: 1.3rem;
      font-size: 1.25rem;
    }
    form {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      width: 100%;
      input {
        width: 100%;
        margin-top: 0.5rem;
        padding: 0.6rem;
        border: none;
        border-radius: 0.3rem;
        font-size: 0.9rem;
        background-color: ${inputPublishColor};
        ::placeholder {
          color: ${textInputPublishColor};
        }
        :focus {
          outline: 1px solid ${textInputPublishColor};
        }
        :disabled {
          filter: brightness(1.03);
        }
      }
      input[type='text'] {
        display: block;
        position: relative;
        align-items: flex-start;
        height: 5rem;
        ::placeholder {
          position: absolute;
          top: 0.6rem;
        }
      }
      button {
        max-height: 1.82rem;
        width: 7rem;
        margin-top: 0.3rem;
        padding: 0.5rem 0;
        border: none;
        border-radius: 0.4rem;
        color: ${textBaseColor};
        font-weight: 700;
        font-size: 0.8rem;
        cursor: pointer;
        background-color: #1877f2;
        :hover {
          outline: ${(props) => (props.publishing ? '' : `1px solid ${textPublishColor}`)};
          font-size: ${(props) => (props.publishing ? '0.8rem' : `0.9rem`)};
        }
        :disabled {
          cursor: inherit;
        }
      }
    }
  }
  @media (min-width: 660px) {
    width: 38rem;
    max-width: 100vw;
    border-radius: 0.8rem;
    img {
      display: flex;
    }
    div {
      width: 90%;
    }
  }
`;
