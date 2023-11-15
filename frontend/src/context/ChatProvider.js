import { createContext, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
   const [user, setuser] = useState();
   const [SelectedChat, setSelectedChat] = useState();
   const [chats, setchats] = useState([]);
   const [notification, setNotification] = useState([]);


   const history = useHistory();

   useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo) {
         history.push('/');
      } else {
         setuser(userInfo.data);
      }
   }, [history]);

   return (
      <ChatContext.Provider value={{
         user, setuser, SelectedChat, setSelectedChat, chats, setchats, notification, setNotification
      }}
      >
         {children}
      </ChatContext.Provider>
   )
}

export const ChatState = () => {
   return useContext(ChatContext)
}

export default ChatProvider