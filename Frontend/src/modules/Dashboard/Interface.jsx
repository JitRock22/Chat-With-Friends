import React, { useEffect, useState } from 'react'
import '../../stylesheets/Interface.css'
import women from '../../assets/cropped_image.png'
import men from '../../assets/cropped_image (1).png'
import Contacts from '../../components/Contacts';
import { useNavigate } from 'react-router-dom';
const Interface = () => {

    useEffect(() => {
        const userDetail = localStorage.getItem('user:detail');
        console.log("User detail is-->", userDetail);
        if (userDetail) {
            const loggedInUser = JSON.parse(localStorage.getItem('user:detail'));
            // setUser(loggedInUser); // Set the user state
            console.log("User id:-->", loggedInUser.id)
            const fetchconversation = async () => {
                const res = await fetch(`http://localhost:3000/api/conversation/${loggedInUser?.id}`, {
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

    const contactsArray = Object.values(Contacts); // This is the key change
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')))
    const [conversation, setConversation] = useState({ conversationUserData: [] })
    const navigate = useNavigate();
    // navigate(0);
    const conArray = conversation.conversationUserData;
    // console.log('user:-->', user);
    // console.log('conversations:-->', conversation);
    // console.log("this is:", conversation.conversationUserData);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState();
    const fetchMessage = async (conversationId, user) => {
        const res = await fetch(`http://localhost:3000/api/messages/${conversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const resData = await res.json()
        console.log('Response Data >>', resData);
        setMessages({ messages: resData, receiver: user, conversationId });
        console.log("Messages>>", messages);
    }
    const sendMessage = async (e) => {
        const res = await fetch(`http://localhost:3000/api/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'},
                body: JSON.stringify({
                    conversationId: messages?.conversationId,
                    senderId: user?.id,
                    message,
                    receiverId: messages?.receiver?.receiverId
                })
            
        })
        const resData = await res.json();
        console.log('new Data >>', resData);
        sendMessage('')
    }
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
                                        <div key={index} className=" receiver h-auto  max-w-[40%] bg-sky-400 text-white rounded-b-xl rounded-tl-xl">{message}</div>
                                    )
                                } else {
                                    return (
                                        <div key={index} className=" sender h-auto max-w-[40%] bg-gray-200 rounded-b-xl rounded-tr-xl">{message}</div>

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

                        <input type="text" className="chat-input rounded-full" placeholder='type a message...' onChange={(e) => setMessage(e.target.value)} />
                        <span className={`material-symbols-outlined send ${!message && 'pointer-events-none'}`} onClick={() => sendMessage()}>
                            send
                        </span>
                        <span className="material-symbols-outlined send circle">
                            add_circle
                        </span>

                    </div>
                }




            </div>
            <div className="w-[25%]  h-screen "></div>
        </div>
    )
}

export default Interface
