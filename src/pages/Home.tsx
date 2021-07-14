import  { useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import Switch from 'react-switch';

import ilustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from "../hooks/useTheme";

import { database } from '../services/firebase';

import '../styles/auth.scss';

export function Home(){

  const history = useHistory();
  const { user, signWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  const { theme, toggleTheme } = useTheme();

  async function handleCreateRoom(){
    if(!user){
      await signWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert('Room does not exists.');
      return;
    }

    if (roomRef.val().endedAt) {
      alert('Room already closed');
      return;
    }

    history.push(`rooms/${roomCode}`);
  }

  return (
    <div id="page-auth" className={theme}>
      <aside>
        <img src={ilustrationImg} alt="Ilustracão simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <div className="toggle">
            <Switch
              onChange={toggleTheme}
              checked={theme === "dark"}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor="#424242"
            />
          </div>
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input 
                type="text" 
                placeholder="Digite o código da sala"
                onChange={event => setRoomCode(event.target.value)}
                value={roomCode} 
            />
            <Button type="submit">
              Entrar na sala
            </Button>

            <Button 
              type="button"
              onClick={() => history.push("/rooms")}
            >
              Salas Disponiveis
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}