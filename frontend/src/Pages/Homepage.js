import React, { useEffect } from 'react'
import { Box, Container, Text, TabList, TabPanels, TabPanel, Tab, Tabs } from '@chakra-ui/react';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router-dom/cjs/react-router-dom';


const Homepage = () => {

   const history = useHistory();

   useEffect(() => {

      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (user) history.push("/chats")

   }, [history]);


   return (
      <Container maxW='xl' centerContent>
         <Box
            d='flex'
            justifyContent="center"
            p={3}
            bg={"white"}
            w="100%"
            m="60px 0 15px 0"
            borderRadius="lg"
            borderWidth="1px"
         >
            <Text
               fontFamily={"Work Sans"}
               fontSize={"4xl"}
               color={"black"}
               textAlign={'center'}
            >
               Talk-A-Tive
            </Text>
         </Box>
         <Box bg={"white"} w={"100%"} p={4} borderRadius={"lg"} borderWidth={"1px"} >
            <Tabs variant='soft-rounded'>
               <TabList>
                  <Tab width={"50%"}>Login</Tab>
                  <Tab width={"50%"}>Sign Up</Tab>
               </TabList>
               <TabPanels>
                  <TabPanel>
                     {<Login />}
                  </TabPanel>
                  <TabPanel>
                     {<Signup />}
                  </TabPanel>
               </TabPanels>
            </Tabs>
         </Box>
      </Container >
   )
}

export default Homepage