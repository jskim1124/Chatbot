import { Chat } from "@/components/Chat";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

export default function Home() {

  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
  };

  const handleSend =async (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages.slice(-6),
      }),
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    const result = await response.json();

    if (!result){
      return;
    }
    setLoading(false);
    setMessages((messages)=> [...messages, result]);
  };

  const handleReset = () => {
    setMessages([
      {
        role:"assistant",
        content:"하이루 방가방가",
      },
    ]);
  };

  useEffect(()=> {
    scrollToBottom();
  }, [messages]);

  useEffect(()=> {
    handleReset();
  }, []);

  return (
    <>
      <Head>
        <title>A Simple Chatbot</title>
        <meta name="description" content="A Simple Chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <div className="flex h-[50px] sm:h-[60px] border-b border-neutral-300 py-2 px-2 sm:px-8 items-center justify-between">
          <div className="font-bold text-3xl flex text-center">
            <a
              className="ml-2 hover:opacity-50"
              href="https://chatbot-jskim1124.vercel.app/"
            >
              A Simple Chatbot
            </a>
          </div>
        </div>

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={messages}
              loading={loading}
              onSendMessage={handleSend}
            />
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="flex h-[30px] sm:h-[50px] border-t border-neutral-300 py-2 px-8 items-center sm:justify-between justify-center"></div>
      </div>
    </>
  );
}