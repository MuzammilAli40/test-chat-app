import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import { FormControl, Box, IconButton, Input, Spinner, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModel from './Miscellaneous/ProfileModel';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
// import Lottie from 'react-lottie';
import animationData from "../animations/typing.json";



const ENDPOINT = "https://muzammil-chat-app-5267b8f1a5b4.herokuapp.com/";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(false);
   const [newMessage, setNewMessage] = useState("");
   const [socketConnected, setSocketConnected] = useState(false);
   const [typing, setTyping] = useState(false);
   const [istyping, setIsTyping] = useState(false);
   const toast = useToast();

   const { SelectedChat, setSelectedChat, user, notification, setNotification } =
      ChatState();

   const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
         preserveAspectRatio: "xMidYMid slice",
      },
   };

   const sendMessage = async (event) => {
      if (event.key === "Enter" && newMessage) {
         socket.emit("stop typing", SelectedChat._id);
         try {
            const config = {
               headers: {
                  "Content-type": "application/json",
                  Authorization: `Bearer ${user.token}`,
               },
            };
            setNewMessage("");
            const { data } = await axios.post(
               "/api/message",
               {
                  content: newMessage,
                  chatId: SelectedChat,
               },
               config
            );
            socket.emit("new message", data);
            setMessages([...messages, data]);
         } catch (error) {
            toast({
               title: "Error Occured!",
               description: "Failed to send the Message",
               status: "error",
               duration: 5000,
               isClosable: true,
               position: "bottom",
            });
         }
      }
   };


   const fetchMessages = async () => {
      if (!SelectedChat) return;

      try {
         const config = {
            headers: {
               Authorization: `Bearer ${user.token}`,
            },
         };

         setLoading(true);

         const { data } = await axios.get(
            `/api/message/${SelectedChat._id}`,
            config
         );
         setMessages(data);
         setLoading(false);

         socket.emit("join chat", SelectedChat._id);
      } catch (error) {
         toast({
            title: "Error Occured!",
            description: "Failed to Load the Messages",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
      }
   };

   const typingHandler = (e) => {
      setNewMessage(e.target.value);

      if (!socketConnected) return;

      if (!typing) {
         setTyping(true);
         socket.emit("typing", SelectedChat._id);
      }
      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      setTimeout(() => {
         var timeNow = new Date().getTime();
         var timeDiff = timeNow - lastTypingTime;
         if (timeDiff >= timerLength && typing) {
            socket.emit("stop typing", SelectedChat._id);
            setTyping(false);
         }
      }, timerLength);
   };

   useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));

   }, []);

   useEffect(() => {
      fetchMessages();

      selectedChatCompare = SelectedChat;
   }, [SelectedChat]);

   useEffect(() => {
      socket.on("message recieved", (newMessageRecieved) => {
         if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
            if (!notification.includes(newMessageRecieved)) {
               setNotification([newMessageRecieved, ...notification]);
               setFetchAgain(!fetchAgain);
            }
         } else {
            setMessages([...messages, newMessageRecieved]);
         }
      });
   });

   return (
      <>
         {SelectedChat ? (
            <>
               <Text
                  fontSize={{ base: "28px", md: "30px" }}
                  paddingBottom={3}
                  px={2}
                  width="100%"
                  fontFamily="Work sans"
                  display="flex"
                  justifyContent={{ base: "space-between" }}
                  alignItems="center"
               >
                  <IconButton
                     display={{ base: "flex", md: "none" }}
                     icon={<ArrowBackIcon />}
                     onClick={() => setSelectedChat("")}
                  />
                  {messages &&
                     (!SelectedChat.isGroupChat ? (
                        <>
                           {getSender(user, SelectedChat.users)}
                           <ProfileModel
                              user={getSenderFull(user, SelectedChat.users)}
                           />
                        </>
                     ) : (
                        <>
                           {SelectedChat.chatName.toUpperCase()}
                           <UpdateGroupChatModal
                              fetchMessages={fetchMessages}
                              fetchAgain={fetchAgain}
                              setFetchAgain={setFetchAgain}
                           />
                        </>
                     ))}

               </Text>
               <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-end"
                  padding={3}
                  background="#E8E8E8"
                  width="100%"
                  height="100%"
                  borderRadius="lg"
                  overflowY="hidden"
               >
                  {loading ? (
                     <Spinner
                        size="xl"
                        width={20}
                        height={20}
                        alignSelf="center"
                        margin="auto"
                     />
                  ) : (
                     <div className="messages">
                        <ScrollableChat messages={messages} />
                     </div>
                  )}

                  <FormControl
                     onKeyDown={sendMessage}
                     id="first-name"
                     isRequired
                     mt={3}
                  >
                     {istyping ? (
                        <></>
                        // <div>
                        //    <Lottie
                        //       options={defaultOptions}
                        //       height={50}
                        //       width={70}
                        //       style={{ marginBottom: 15, marginLeft: 0 }}
                        //    />
                        // </div>
                     ) : (
                        <></>
                     )}
                     <Input
                        variant="filled"
                        bg="#E0E0E0"
                        placeholder="Enter a message.."
                        value={newMessage}
                        onChange={typingHandler}
                     />
                  </FormControl>
               </Box>
            </>
         ) : (
            <>
               <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                  <Text fontSize="3xl" paddingBottom={3} fontFamily="Work sans">
                     Click on a user to start chatting
                  </Text>
               </Box>
            </>
         )
         }
      </>
   );
}

export default SingleChat