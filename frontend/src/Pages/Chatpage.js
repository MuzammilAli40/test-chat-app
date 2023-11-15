import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/Miscellaneous/SideDrawer';
import Chatbox from '../components/ChatBox';
import MyChats from '../components/MyChats';

const Chatpage = () => {
   const [fetchAgain, setFetchAgain] = useState(false);
   const { user } = ChatState();

   return (
      <div style={{ width: "100%" }}>
         {user && <SideDrawer />}
         <Box display="flex" justifyContent="space-between" width="100%" height="91.5vh" padding="10px">
            {user && <MyChats fetchAgain={fetchAgain} />}
            {user && (
               <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
         </Box>
      </div>
   );
};

export default Chatpage;