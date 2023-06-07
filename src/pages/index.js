import { Chat } from "@/components/Chat";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import  App  from "@/components/Graph"

import {db} from "@/firebase";
import {
    collection,
    query,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    orderBy,
    getDoc,
} from "firebase/firestore";


export default function Home() {

  const [messages, setMessages] = useState([]);
  const [res, setRes] = useState([50,50,50,50,50,50,50]);

  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const chatCollection = collection(db, "chats");
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
  };

  const handleSend = async (message) => {
    const newtime = {...message, time:Date.now()};
    addDoc(chatCollection,newtime);
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
    const startPos = result.content.indexOf('{'); // JSON 문자열 시작 위치 찾기
    const endPos = result.content.lastIndexOf('}'); // JSON 문자열 끝 위치 찾기
    const jsonStr = result.content.substring(startPos, endPos + 1); // JSON 문자열 추출
    const resValues = JSON.parse(jsonStr);
    if (Object.keys(resValues).length === 7) {
      const updatedGraphData = res.map((value, index) => value + resValues[Object.keys(resValues)[index]]);
      setRes(updatedGraphData);
    }
    const ntime = {...result, time:Date.now()};
    addDoc(chatCollection,ntime);
  };

  const handleReset = async () => {
    const defaultChat = {
        role:"assistant",
        content:"학교생활기록부를 바탕으로 영역별 창의성을 진단해드립니다. \n생활기록부에 기재된 활동을 입력하세요.",

      };

    const q = query(
      chatCollection,
      orderBy("time","asc")
      );

    const results = await getDocs(q);

    const newChats = [];

    results.docs.forEach((doc)=> {
      const { time, ...dataWithoutTime } = doc.data();
      newChats.push(dataWithoutTime);
    });

    const lastDoc = results.docs[results.docs.length - 1];
    if (lastDoc && lastDoc.exists && lastDoc.data().role === "user") {
      await deleteDoc(doc(chatCollection, lastDoc.id));
        newChats.pop();
    }

    setMessages([defaultChat, ... newChats]);
    console.log(newChats);
  };

  const handleResetClick = async () => {
    const confirmed = window.confirm("정말 초기화하시겠습니까? 이후에는 복구하실 수 없습니다");

    if (confirmed) {
      const q = query(chatCollection);
      const results = await getDocs(q);
      for (const doc of results.docs) {
        await deleteDoc(doc.ref);
      }  
      handleReset();
    }
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
        <title>LoG-In Program : School Record Based Creativity Measurement</title>
        <meta name="description" content="LoG-In Program : School Record Based Creativity Measurement" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <div className="flex h-[50px] sm:h-[60px] max-w-[1100px] mx-auto border-b border-neutral-300 py-2 px-2 sm:px-8 items-center justify-between">
          <div className="font-bold text-3xl flex text-center">
            <a
              className="hover:opacity-50"
              href="https://chatbot-jskim1124.vercel.app/"
            >
              LoG-In Program : School Record Based Creativity Measurement
            </a>
          </div>
        </div>

        <div className="flex-1 sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[1000px] mx-auto mt-4">
            <div className="flex">
              <App
              res = {res}
              />
              <Chat
              messages={messages}
              loading={loading}
              onSendMessage={handleSend}
              />
            </div>
            <div className="flex justify-end">
              <button className="mt-3 py-1.5 w-32 p-1 bg-gray-400 text-white rounded hover:bg-red-500 hover:text-white-500 justify-end "
              onClick={handleResetClick}
              >
                초기화하기
              </button>
            </div>
          </div>

        </div>

        <div className="flex h-[30px] sm:h-[50px] border-t border-neutral-300 py-2 px-8 items-center sm:justify-between justify-center"></div>
      </div>
    </>
  );
}