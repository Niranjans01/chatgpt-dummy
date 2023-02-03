import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    apiKey: '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',
});
const openai = new OpenAIApi(configuration);

function MessageBox({ send }: { send: (context: string) => void }): JSX.Element {
    const [message, setMessage] = useState("");


    function handleEnterKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == "Enter") {
            send(message)
            setMessage("");
        };

    }

    return (
        <div className={`w-full mt-auto p-5`}>
            <div className="flex flex-row gap-4 items-center pb-2">
                <div
                    className="flex flex-row px-2 border-[1px] border-[#1FAEFF] bg-opacity-40
          text-[#303030] font-mont outline-none overflow-hidden rounded-[25px] w-full"
                >
                    <input
                        type="text"
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleEnterKey}
                        value={message}
                        className="w-full pl-5 py-3 focus:outline-none"
                        placeholder="Type your message here"
                    />
                    <button
                        className="flex flex-row justify-center items-center pr-2"
                        onClick={(e) => { send(message); setMessage("") }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

function Message({ text, isSender }: { text: string, isSender: boolean }): JSX.Element {
    return (
        <div className="relative w-full">
            <div
                className={`${isSender
                    ? "bg-[#2189FB] text-[#FFF] float-right mr-4"
                    : "bg-[#10a37f] text-[#FFF] float-left ml-4"
                    } 
        max-w-md py-3 px-8 rounded-[25px]`}
                dangerouslySetInnerHTML={{ __html: text || "" }}
            >
                {/* {} */}
            </div>
            <div
                className={`${isSender
                    ? "bg-[#2189FB] absolute right-0 top-2/3"
                    : "bg-[#10a37f] absolute left-0 top-2/3"
                    } p-[5px] mb-10 rounded-[25px]`}
            ></div>
        </div>
    );
}

interface Message {
    content: string;
    sender: string;
}

function MessageList({ messages }: { messages: Array<Message> }): JSX.Element {

    const uuid: string = "123";

    const list = messages?.map((msg, index) => (
        <Message text={msg.content} isSender={msg.sender == uuid} key={index} />
    ));

    return (
        <div className="flex flex-col-reverse overflow-y-auto pb-2 pt-10">
            <div className="flex flex-col p-2 space-y-3">{list}</div>
        </div>
    );
}

const MessageHeader = ({ recipient }: { recipient: string }) => {

    return (
        <>
            <div className="py-3 bg-[#FFFFFF] flex flex-row justify-between items-center px-8 shadow">
                <div className="flex flex-row items-center">
                    <div className="relative overflow-hidden w-12 h-12 rounded-full  mr-4">
                        <Image
                            objectFit="cover"
                            layout="fill"
                            alt="profile-img"
                            loader={({ src }) => src}
                            src={"/images/avatar.svg"}
                        />
                    </div>
                    <div className="text-ellipsis text-[#303030] font-semibold">
                        GPT Bot
                    </div>

                </div>
            </div>
        </>
    );
};

function Messages({ recipient }: { recipient: string }) {
    const [messages, setMessages] = useState<Array<{ content: string, sender: string }>>([]);

    const handleSendMessage = (context: string) => {
        let currentMessages = [...messages,
            {
                content: context,
                sender: "123",
            }];
        setMessages(currentMessages);

        setTimeout(async () => {
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: context,
                temperature: 0,
                max_tokens: 100,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: [" Human:", " AI:"],
            });
            console.log(response.data);
            setMessages([
                ...currentMessages,
                {
                    content: response.data.choices[0].text,
                    sender: "456",
                },
            ]);
        }, 1000);
    }


    return (
        <div className="flex flex-col w-1/3 h-[70vh] shadow overflow-hidden bg-[#FFFFFF] rounded-[25px]">
            <MessageHeader
                recipient={recipient}
            />
            <MessageList messages={messages} />
            <MessageBox send={handleSendMessage} />
        </div>
    );
}

export default React.memo(Messages);