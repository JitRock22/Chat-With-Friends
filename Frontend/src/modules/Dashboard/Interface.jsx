import React, { useEffect, useState, useRef } from 'react'
import '../../stylesheets/Interface.css'
import women from '../../assets/cropped_image.png'
import men from '../../assets/cropped_image (1).png'
import Contacts from '../../components/Contacts';
import { io } from 'socket.io-client'
import { useNavigate } from 'react-router-dom';
const Interface = () => {
    // const baseUrl = 'http://localhost:3000/api';
    const baseUrl='https://chat-with-friends-gzc4.onrender.com/api'
    useEffect(() => {
        const userDetail = localStorage.getItem('user:detail');
        console.log("User detail is-->", userDetail);
        if (userDetail) {
            const loggedInUser = JSON.parse(localStorage.getItem('user:detail'));
            // setUser(loggedInUser); // Set the user state
            console.log("User id:-->", loggedInUser.id)
            const fetchconversation = async () => {
                const res = await fetch(`${baseUrl}/conversation/${loggedInUser?.id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const resData = await res.json();
                console.log('resData-->', resData);
                setConversation(resData);

            };
            fetchconversation();
        } else {
            console.log('user details not found in local storage')
        }
    }, []);

    const [users, setUsers] = useState([])
    useEffect(() => {
        const fetchUsers = async () => {
            const res = await fetch(`${baseUrl}/users/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const resData = await res.json()
            setUsers(resData)

        }
        fetchUsers()
    }, []);

    const contactsArray = Object.values(Contacts); // This is the key change
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
    const [conversation, setConversation] = useState({ conversationUserData: [] })
    const [socket, setSocket] = useState(null)
    const navigate = useNavigate();
    const conArray = conversation.conversationUserData;
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState();
    const messageRef = useRef(null);
    console.log("Messages are:>>>>", messages);
    //socket.io
    // useEffect(() => {
    //     setSocket(io(process.env.VITE_SOCKET_URL))
    // }, [])
    useEffect(() => {
        setSocket(io(import.meta.env.VITE_SOCKET_URL));
    }, []);

    useEffect(() => {
        messageRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages?.messages])

    useEffect(() => {
        socket?.emit('addUser', user?.id)
        socket?.on('getUsers', users => {
            console.log('activeUsers :>>>', users)
        })
        socket?.on('getMessage', data => {
            console.log('Message Received :>>>', data)
            setMessages(prev => ({
                ...prev,
                messages: [...prev.messages, { user: data.user, message: data.message }]
            }))
        })
    }, [socket])

    const fetchMessage = async (conversationId, receiver) => {
        const res = await fetch(`${baseUrl}/messages/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const resData = await res.json()
        console.log('Response Data >>', resData);
        setMessages({ messages: resData, receiver, conversationId });
        console.log("Messages>>", messages);
    }
    const sendMessage = async (e) => {
        socket?.emit('sendMessage', {
            senderId: user?.id,
            receiverId: messages?.receiver?.receiverId,
            message,
            conversationId: messages?.conversationId
        })
        console.log("message>>>>>", message, messages?.conversationId, user?.id, messages?.receiver?.receiverId);
        const res = await fetch(`${baseUrl}/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                conversationId: messages?.conversationId,
                senderId: user?.id,
                message,
                receiverId: messages?.receiver?.receiverId
            })

        })
        const resData = await res.json();
        console.log('new Data >>', resData);
        setMessage('')
    }
    console.log("users are:>>>>>>>", users)
    return (
        <div className=" w-screen flex ">
            <div className="header w-[25%] bg-blue-100 border-black h-screen cursor-pointer">
                <div className="header-child bg-white rounded-lg">
                    <div className=" topper flex justify-center items-center gap-5">
                        <img src={men} alt="Profile Picture" width={60} height={60} className=" rounded-full" />
                        <div className="">
                            <h3 className=" text-2xl font-bold">{user.fullname}</h3>
                            <p className=" font-light text-sky-500">My Account</p>

                        </div>
                    </div>

                </div>
                <hr />
                <div className=" text-center text-2xl font-bold text-blue-400 message">Messages</div>
                <div className=" flex flex-col gap-4">
                    {conArray.length > 0 ?
                        conArray.map(({ conversationId, user }, index) => (
                            <Contacts
                                key={index}
                                name={user?.fullname}
                                status={user?.email}
                                image={men}
                                onClick={() => fetchMessage(conversationId, user)}
                            />
                        )) :
                        (<div className=" text-lg mt-24 font-semibold text-center">No conversations is there</div>)
                    }

                </div>
            </div>
            <div className="w-[50%] h-screen flex flex-col items-center">
                {
                    messages?.receiver?.fullname &&
                    <div className="chat w-[75%] gap-8 bg-blue-100 h-[70px] rounded-full flex items-center mt-[20px]">
                        <img src={men} width={40} height={40} alt="" className=" chat-img" />
                        <div className="chat-head ">
                            <h3 className="  font-medium">{messages?.receiver?.fullname}</h3>
                            <p className=" text-xm text-green-700 ">online</p>
                        </div>
                        <div>
                            <span className="material-symbols-outlined">
                                phone_in_talk
                            </span>
                        </div>
                    </div>

                }




                <div className="chat-body h-[65%] w-full overflow-auto rounded-lg">
                    <div className="person-chat h-[800px]">

                        {messages?.messages?.length > 0 ?
                            messages.messages.map(({ message, user: { id } = {} }, index) => {
                                if (id === user?.id) {
                                    return (
                                        <>
                                            <div key={index} className=" receiver h-auto  max-w-[40%] bg-sky-400 text-white rounded-b-xl rounded-tl-xl">{message}</div>
                                            <div ref={messageRef}></div>
                                        </>
                                    )
                                } else {
                                    return (
                                        <>
                                            <div key={index} className=" sender h-auto max-w-[40%] bg-gray-200 rounded-b-xl rounded-tr-xl">{message}</div>
                                            <div ref={messageRef}></div>
                                        </>

                                    )
                                }
                            }) :
                            (<div className=" text-lg mt-24 font-semibold text-center">No conversations selected or no messages there</div>)
                        }

                    </div>
                </div>

                {
                    messages?.receiver?.fullname &&
                    <div className=" w-[100%] flex justify-center items-center">

                        <input type="text" className="chat-input rounded-full" value={message} placeholder='type a message...' onChange={(e) => setMessage(e.target.value)} />
                        <span className={`material-symbols-outlined send ${!message && 'pointer-events-none'}`} onClick={(e) => sendMessage(e)}>
                            send
                        </span>
                        <span className="material-symbols-outlined send circle">
                            add_circle
                        </span>

                    </div>
                }




            </div>
            <div className="w-[25%]  h-screen overflow-auto">
                <div className=" text-center text-2xl font-bold text-blue-400 message">Peoples</div>
                {users.length > 0 ?
                    users.map(({ userId, user }, index) => (
                        <Contacts
                            key={index}
                            name={user?.fullname}
                            status={user?.email}
                            image={men}
                            onClick={() => fetchMessage('new', user)}
                        />
                    )) :
                    (<div className=" text-lg mt-24 font-semibold text-center">No conversations is there</div>)
                }
            </div>
        </div>
    )
}

export default Interface
