import React from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SingleChat from './SingleChat';


const Chatbox = ({ fetchAgain, setFetchAgain }) => {
   const { SelectedChat } = ChatState();

   return (
      <Box
         display={{ base: SelectedChat ? "flex" : "none", md: "flex" }}
         alignItems="center"
         flexDirection="column"
         padding={3}
         background="white"
         width={{ base: "100%", md: "68%" }}
         borderRadius="lg"
         borderWidth="1px"
      >
         <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
   );
};

export default Chatbox