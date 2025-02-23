import React from 'react'
import '../../stylesheets/Interface.css'
import women from '../../assets/cropped_image.png'
import men from '../../assets/cropped_image (1).png'
import Contacts from '../../components/Contacts';
const Interface = () => {
    const contacts = {
        Ravi: {
            name: "Ravi",
            status: "Available",
            img: men
        },
        Kajal: {
            name: "Kajal",
            status: "Available",
            img: women
        },
        Aakash: {
            name: "Aakash",
            status: "Available",
            img: men
        },
        Prateek: {
            name: "Prateek",
            status: "Available",
            img: men
        },
        Ali: {
            name: "Ali",
            status: "Available",
            img: men
        },
        Raju: {
            name: "Raju",
            status: "Available",
            img: men
        },
        Joyesh: {
            name: "Joyesh",
            status: "Available",
            img: men
        },
        Riya: {
            name: "Riya",
            status: "Available",
            img: women
        },
    };
    const contactsArray = Object.values(contacts); // This is the key change
    return (
        <div className=" w-screen flex ">
            <div className="header w-[25%] bg-blue-100 border-black h-screen cursor-pointer">
                <div className="header-child bg-white rounded-lg">
                    <div className=" topper flex justify-center items-center gap-5">
                        <img src={men} alt="Profile Picture" width={60} height={60} className=" rounded-full" />
                        <div className="">
                            <h3 className=" text-2xl font-bold">Jit Das</h3>
                            <p className=" font-light text-sky-500">My Account</p>

                        </div>
                    </div>

                </div>
                <hr />
                <div className=" text-center text-2xl font-bold text-blue-400 message">Messages</div>
                <div className=" flex flex-col gap-4">
                    {contactsArray.map((contact) => (
                        < Contacts name={contact.name} status={contact.status} image={contact.img} />

                    ))}
                </div>
            </div>
            <div className="w-[50%] h-screen flex flex-col items-center">
                <div className="chat w-[75%] gap-8 bg-blue-100 h-[70px] rounded-full flex items-center mt-[20px]">
                    <img src={men} width={40} height={40} alt="" className=" chat-img" />
                    <div className="chat-head ">
                        <h3 className="  font-medium">Avimanyu</h3>
                        <p className=" text-xm text-green-700 ">online</p>
                    </div>
                    <div>
                        <span class="material-symbols-outlined">
                            phone_in_talk
                        </span>
                    </div>
                </div>
                <div className="chat-body h-[65%] w-full overflow-auto rounded-lg">
                    <div className="person-chat h-[800px]">
                        <div className=" sender h-auto max-w-[52%] bg-gray-200 rounded-b-xl rounded-tr-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                        <div className=" receiver h-auto  max-w-[50%] bg-sky-400 text-white rounded-b-xl rounded-tl-xl"> Lorem ipsum dolor sit amet.</div>
                        <div className=" sender h-auto max-w-[52%] bg-gray-200 rounded-b-xl rounded-tr-xl">Lorem ipsum dolor sit..</div>
                        <div className=" receiver h-auto  max-w-[50%] bg-sky-400 text-white rounded-b-xl rounded-tl-xl">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque possimus facilis nostrum!.</div>
                        <div className=" sender h-auto max-w-[52%] bg-gray-200 rounded-b-xl rounded-tr-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                        <div className=" receiver h-auto  max-w-[50%] bg-sky-400 text-white rounded-b-xl rounded-tl-xl">Lorem ipsum dolor sit amet.</div>
                        <div className=" sender h-auto max-w-[52%] bg-gray-200 rounded-b-xl rounded-tr-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                        <div className=" receiver h-auto  max-w-[50%] bg-sky-400 text-white rounded-b-xl rounded-tl-xl"> Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                        <div className=" sender h-auto max-w-[52%] bg-gray-200 rounded-b-xl rounded-tr-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                        <div className=" receiver h-auto  max-w-[50%] bg-sky-400 text-white rounded-b-xl rounded-tl-xl"> Lorem ipsum dolor sit amet.</div>
                        <div className=" sender h-auto max-w-[52%] bg-gray-200 rounded-b-xl rounded-tr-xl">Lorem ipsum dolor sit..</div>
                        <div className=" receiver h-auto  max-w-[50%] bg-sky-400 text-white rounded-b-xl rounded-tl-xl">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Doloremque possimus facilis nostrum!.</div>
                        <div className=" sender h-auto max-w-[52%] bg-gray-200 rounded-b-xl rounded-tr-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                        <div className=" receiver h-auto  max-w-[50%] bg-sky-400 text-white rounded-b-xl rounded-tl-xl">Lorem ipsum dolor sit amet.</div>
                        <div className=" sender h-auto max-w-[52%] bg-gray-200 rounded-b-xl rounded-tr-xl">Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                        <div className=" receiver h-auto  max-w-[50%] bg-sky-400 text-white rounded-b-xl rounded-tl-xl"> Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
                    </div>
                </div>
                <div className=" w-[100%] flex justify-center items-center">
                    <input type="text" className="chat-input rounded-full" placeholder='type a message...' />
                    <span class="material-symbols-outlined send">
                        send
                    </span>
                    <span class="material-symbols-outlined send circle">
                        add_circle
                    </span>
                </div>
            </div>
            <div className="w-[25%]  h-screen "></div>
        </div>
    )
}

export default Interface
