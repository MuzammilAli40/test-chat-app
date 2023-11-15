import React, { useState } from 'react'
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from "@chakra-ui/react"
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../context/ChatProvider';
import ProfileModel from './ProfileModel';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import axios from 'axios'
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from "../../config/ChatLogics";
// import NotificationBadge, { Effect } from "react-notification-badge";


const SideDrawer = () => {

   const [search, setSearch] = useState("");
   const [searchResult, setSearchResult] = useState([]);
   const [loading, setLoading] = useState(false);
   const [loadingChat, setloadingChat] = useState()

   const { user, setSelectedChat, SelectedChat, chats, setchats, notification, setNotification } = ChatState();
   const history = useHistory();
   const toast = useToast();

   const { isOpen, onOpen, onClose } = useDisclosure();

   const logoutHandler = () => {
      localStorage.removeItem("userInfo");
      history.push("/")
   }

   const handleSearch = async () => {
      if (!search) {
         toast({
            title: "Please Enter Text To Search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
         return;
      }

      try {
         setLoading(true);
         const config = {
            headers: {
               Authorization: `Bearer ${user.token}`,
            }
         };

         const { data } = await axios.get(`/api/user?search=${search}`, config);
         setLoading(false);
         setSearchResult(data);
      } catch (error) {
         toast({
            title: "Error Occurred!",
            description: "Failed to load the search result",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
         });
      }
   };

   const accessChat = async (userId) => {
      console.log(userId);

      try {
         setloadingChat(true);
         const config = {
            headers: {
               "Content-type": "application/json",
               Authorization: `Bearer ${user.token}`,
            },
         };
         const { data } = await axios.post(`/api/chat`, { userId }, config);

         if (!chats.find((c) => c._id === data._id)) setchats([data, ...chats]);
         setSelectedChat(data);
         setloadingChat(false);
         onClose();
      } catch (error) {
         toast({
            title: "Error fetching the chat",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
         });
      }
   };

   return (
      <>
         <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            bg={"white"}
            w={"100%"}
            p={"5px 10px 5px 10px"}
            borderWidth={"5px"}
         >
            <Tooltip label="Search Users" hasArrow placement='bottom-end'>

               <Button variant={"ghost"} onClick={onOpen}>
                  <i class="fas fa-search"></i>
                  <Text display={{ base: "none", md: "flex" }} px={4}>
                     Search User
                  </Text>
               </Button>
            </Tooltip>

            <Text fontSize={"2xl"} fontFamily={"Work sans"}>
               Talk-a-Tive
            </Text>

            <div>
               <Menu>
                  <MenuButton p={1}>
                     {/*<NotificationBadge
                        count={notification.length}
                        effect={Effect.SCALE}
                     />*/}
                     <BellIcon fontSize={"2xl"} margin={1} />
                  </MenuButton>
                  <MenuList pl={2}>
                     {!notification.length && "No New Messages"}
                     {notification.map((notif) => (
                        <MenuItem
                           key={notif._id}
                           onClick={() => {
                              setSelectedChat(notif.chat);
                              setNotification(notification.filter((n) => n !== notif));
                           }}
                        >
                           {notif.chat.isGroupChat
                              ? `New Message in ${notif.chat.chatName}`
                              : `New Message from ${getSender(user, notif.chat.users)}`}
                        </MenuItem>
                     ))}
                  </MenuList>
               </Menu>

               <Menu>
                  <MenuButton
                     as={Button}
                     rightIcon={<ChevronDownIcon />}
                  >
                     <Avatar size={"sm"} cursor={"pointer"} name={user.name} src={user.pic} />
                  </MenuButton>
                  <MenuList>
                     <ProfileModel user={user}>
                        <MenuItem>
                           My Profile
                        </MenuItem>
                     </ProfileModel>
                     <MenuDivider />
                     <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                  </MenuList>
               </Menu>
            </div>
         </Box >

         <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
            <DrawerOverlay />
            <DrawerContent borderBottomWidth={"1px"} >

               <DrawerBody>
                  <Box display={"flex"} pb={2}>
                     <Input placeholder='Search by name or email'
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                     />
                     <Button onClick={handleSearch}>
                        Go
                     </Button>
                  </Box>

                  {loading ? (
                     <ChatLoading />
                  ) : (
                     searchResult?.map(user => (
                        <UserListItem
                           key={user._id}
                           user={user}
                           handleFunction={() => accessChat(user._id)}
                        />
                     ))
                  )}

                  {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
               </DrawerBody>

            </DrawerContent>

         </Drawer >
      </>
   )
}

export default SideDrawer