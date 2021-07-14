import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
//import emptyImg from '../assets/images/empty-room.svg';
import { database } from '../services/firebase';
import '../styles/room-list.scss';
import '../styles/room.scss';

import { useTheme } from "../hooks/useTheme";

type RoomType = {
  roomId:string;
  title: string;
  roomIsOpen: boolean;
}[]

export function RoomsList() {
  const history = useHistory();
  const [rooms, setRooms] = useState<RoomType>([])
  //const [isLoading, setIsLoading] = useState<boolean>(true)
  const { theme } = useTheme();

  useEffect(() => {
    const roomsRef = database.ref(`rooms`);

    roomsRef.once('value', rooms => {
      //const dbRoom: object = rooms.val() ?? {}
      const databaseRoom: object = rooms.val() ?? {};
      
      const parsedRooms = Object.entries(databaseRoom).map(([key,value]) => {
        if (value.endedAt) {
            return {
                roomId: key,
                title: value.title,
                roomIsOpen: false
            }
        } else {
            return {
                roomId: key,
                title: value.title,
                roomIsOpen: true
            }
        }
      })

      //console.log(parsedRooms);
      setRooms(parsedRooms);
      //setIsLoading(false)
    })
  }, [])

  function handleGoHomePage() {
    return history.push('/')
  }
  
  function handleGoToRoom(roomId: string, isOpen: boolean) {
    if (isOpen) {
      return history.push(`rooms/${roomId}`)
    } else {
      return window.alert('A sala já fechou!')
    }
  }
  
  return (
    <div id="rooms" className={theme}>
        <header>
          <div className='content'>
          <img src={logoImg} alt="Let me Ask Logo" onClick={handleGoHomePage}/>
          </div>
        </header>
        <main className="content">
            <div className="room-list">
                <div className="room-box-div">
                    {rooms.map(room => {
                        return (
                        <div 
                            className={`room-item-div ${room.roomIsOpen ? '': 'closed'}`}
                            onClick={() => handleGoToRoom(room.roomId, room.roomIsOpen)}
	                          key={room.roomId}                            
                        >
                        
                            {room.title}
                        
                        </div>
                        );
                    })}
                </div>
            </div>
        </main>
    </div>
  )
}