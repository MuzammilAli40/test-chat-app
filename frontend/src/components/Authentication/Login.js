import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

const Login = () => {
   const [show, setshow] = useState()
   const [email, setemail] = useState();
   const [password, setpassword] = useState();
   const [loading, setloading] = useState(false)


   const toast = useToast()
   const history = useHistory();

   const HandleClick = () => setshow(!show);

   const submitHandler = async () => {
      setloading(true);
      if (!email || !password) {
         toast({
            title: 'Please fill all the fields',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
         });
         setloading(false);
         return;
      }

      try {
         const config = {
            headers: {
               "Content-type": "application/json"
            },
         };
         const data = await axios.post("/api/user/login", { email, password }, config);

         toast({
            title: 'Login Successfully',
            status: "success",
            duration: 5000,
            isClosable: true,
            position: 'bottom'
         });

         localStorage.setItem('userInfo', JSON.stringify(data));
         setloading(false)

         history.push("/chats")

      } catch (error) {
         toast({
            title: "Error Occured",
            description: error.response.data.message,
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
         });
      }


   }

   return (
      <VStack spacing={"5px"}>
         <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Your Email' value={email} onChange={(e) => setemail(e.target.value)} borderRadius={50} />
         </FormControl>
         <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
               <Input placeholder='Enter Your password' value={password} type={show ? "text" : "password"} onChange={(e) => setpassword(e.target.value)} borderRadius={50} />

               <InputRightElement width={"4.5rem"} pr={3}>
                  <Button h={"1.75rem"} size={"sm"} onClick={HandleClick}>
                     {show ? "Hide" : "Show"}
                  </Button>
               </InputRightElement>
            </InputGroup>
         </FormControl>

         <Button colorScheme='blue' width={"100%"} style={{ marginTop: 15 }}
            onClick={submitHandler}
            isLoading={loading}>
            Login
         </Button>
         <Button variant={"solid"} colorScheme='red' width={"100%"}
            onClick={() => {
               setemail("guest@gmail.com");
               setpassword("12345678");
            }}
         >
            Login As a Guest
         </Button>
      </VStack >
   )
}

export default Login