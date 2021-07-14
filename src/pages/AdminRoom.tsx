//import { FormEvent, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { useTheme } from "../hooks/useTheme";

import { database } from '../services/firebase';

import '../styles/room.scss';

type RoomParams = {
    id: string;
}

export function AdminRoom() {
    const { user, logout } = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { theme } = useTheme();

    const { title, questions } = useRoom(roomId);

    async function handleEndRoom() {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      })

      history.push('/');
    }

    async function handleQuestionAsAnswered(questionId: string) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isAnswered: true,
      });
    }

    async function handleHighLightQuestion(questionId: string) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
        isHighlighted: true,
      });
    }

    async function handleDeleteQuestion(questionId: string) {
      if (window.confirm('Tem certeza que você deseja excluir essa pergunta?')) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
      }
    }

    async function signOut() {
      if (user) {
        logout();
        history.push('/');
      }else {
        window.confirm("Você não esta logado!");
        history.push('/');
      }
    }

    return (
        <div id="page-room" className={theme}>
          <header>
            <div className="content">
              <img src={logoImg} alt="Letmeask" />
              <div>
                <RoomCode code={roomId} />
                <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                <Button onClick={signOut}>Sair</Button>
              </div>
              
            </div>
          </header>
    
          <main>
            <div className="room-title">
              <h1>Sala {title} </h1>
              { questions.length > 0 && <span>{questions.length} perguntas(a)</span> }
            </div>    
            
            <div className="question-list">
              {questions.map(question => {
                return (
                  <Question
                    key={question.id}
                    content={question.content}
                    author={question.author}
                    isAnswered={question.isAnswered}
                    isHighlighted={question.isHighlighted}
                  >

                    {!question.isAnswered && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleQuestionAsAnswered(question.id)}
                        >
                          <img src={checkImg} alt="Marcar pergunta como respondida" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleHighLightQuestion(question.id)}
                        >
                          <img src={answerImg} alt="Dar destaque à pergunta" />
                        </button>
                      </>
                    )}
              
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(question.id)}
                    >
                      <img src={deleteImg} alt="Remover pergunta" />
                    </button>

                  </Question>
                );
              })}
            </div>
          </main>
        </div>
    )
}