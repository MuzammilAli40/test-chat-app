import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from "axios";
import { useToast } from '@chakra-ui/react'
import { useHistory } from 'react-router-dom'

const Signup = () => {
   const [show, setshow] = useState()
   const [name, setname] = useState();
   const [email, setemail] = useState();
   const [password, setpassword] = useState();
   const [confirmpassword, setconfirmpassword] = useState();
   const [pic, setpic] = useState();
   const [loading, setloading] = useState(false)
   const history = useHistory();
   const toast = useToast()

   const HandleClick = () => setshow(!show);

   const postDetails = (pic) => {
      setloading(true)
      if (pic === undefined) {
         toast({
            title: 'Please select an image',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
         });
         return
      }

      if (pic.type === "image/jpeg" || pic.type === "image/png") {
         const data = new FormData();
         data.append("file", pic);
         data.append("upload_preset", "chat-app")
         data.append("cloud_name", "dsboj5voz")

         fetch("https://api.cloudinary.com/v1_1/dsboj5voz/image/upload", {
            method: "post",
            body: data,
         }).then((res) => res.json()).then(data => {
            setpic(data.url.toString());
            console.log(data.url.toString())
            setloading(false);
         }).catch((err) => {
            console.error(err);
            setloading(false);
         })
      } else {
         toast({
            title: 'Please select an image',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
         });
         setloading(false);
         return
      }
   }

   const submitHandler = async () => {
      setloading(true);
      if (!name || !email || !password || !confirmpassword) {
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

      if (password !== confirmpassword) {
         toast({
            title: 'Passwords does not match',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'bottom'
         });
         return;
      }

      try {
         const config = {
            headers: {
               "Content-type": "application/json"
            },
         };
         const data = await axios.post("/api/user", { name, email, password, pic }, config);

         toast({
            title: 'Registered Successfully',
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
         <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name' borderRadius={50} onChange={(e) => setname(e.target.value)} />
         </FormControl>
         <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Your Email' borderRadius={50} onChange={(e) => setemail(e.target.value)} />
         </FormControl>
         <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
               <Input placeholder='Enter Your password' borderRadius={50} type={show ? "text" : "password"} onChange={(e) => setpassword(e.target.value)} />

               <InputRightElement width={"4.5rem"} pr={3}>
                  <Button h={"1.75rem"} size={"sm"} onClick={HandleClick}>
                     {show ? "Hide" : "Show"}
                  </Button>
               </InputRightElement>
            </InputGroup>
         </FormControl>
         <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Passowrd</FormLabel>
            <InputGroup>
               <Input placeholder='Enter Your password' borderRadius={50} type={show ? "text" : "password"} onChange={(e) => setconfirmpassword(e.target.value)} />

               <InputRightElement width={"4.5rem"} pr={3}>
                  <Button h={"1.75rem"} size={"sm"} onClick={HandleClick}>
                     {show ? "Hide" : "Show"}
                  </Button>
               </InputRightElement>
            </InputGroup>
         </FormControl>

         <FormControl id="pic" isRequired>
            <FormLabel>Upload your Picture</FormLabel>
            <Input type='file' p={1.5} borderRadius={50} onChange={(e) => postDetails(e.target.files[0])} />
         </FormControl>

         <Button colorScheme='blue' width={"100%"} style={{ marginTop: 15 }} isLoading={loading} onClick={submitHandler} >
            Sign Up
         </Button>
      </VStack >
   )
}

export default Signup