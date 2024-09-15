import { Input, Popover } from "antd"
import Groq from "groq-sdk"
import React, { useState } from "react"
import { IoIosCheckmark } from "react-icons/io"
import Typewriter from "typewriter-effect"
import { Button, Modal } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { Avatar, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';

const Home = () => {
  // const { user } = useAuth0()
  const prompt =
    "Respond to this prompt. Then, at the end, give a list of three COMMON-SEPARATED (IT MUST BE COMMA SEPARATED) products that the user could buy. NO EXPLANATION, NO RECEIPE. NO text other than the three items (THIS IS A MUST)."
  const [chatHistory, setChatHistory] = useState()
  const groq = new Groq({
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  })
  const [showOptions, setShowOptions] = useState(true)
  const [options, setOptions] = useState()
  const [optionsSelected, setOptionsSelected] = useState([false, false, false])
  const [input, setInput] = useState("")
  const onAddToCart = (i) => {
    setOptionsSelected(optionsSelected.map((t, j) => (i === j ? true : t)))
  }
  // shared cart
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // shared cart table scroll stuff
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    loadMoreData();
  }, []);

  const processString = (s) => {
    for (let i = s.length - 1; i >= 0; i--) {
      if (s.charAt(i) === ":") {
        return [s.substr(0, i + 1), s.substr(i + 2).split(",")]
      }
    }
    return ["Unable to retrieve a response. Tip: be specific.", []]
  }

  async function askGroq() {
    const chatCompletion = await getGroqChatCompletion()
    setChatHistory([
      ...(chatHistory ?? []),
      processString(chatCompletion.choices[0]?.message?.content || "")?.[0],
    ])
    setOptions(
      processString(chatCompletion.choices[0]?.message?.content || "")?.[1]
    )
  }

  async function getGroqChatCompletion() {
    setShowOptions(false)
    return groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `${prompt} ${input}`,
        },
      ],
      temperature: 0,
      model: "llama3-8b-8192",
    })
  }

  return (
    <div className="flex flex-col bg-gray-300 min-h-screen">
      <div className="flex-1 overflow-auto">
        <div className="flex justify-between">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12 m-4 p-2 bg-white rounded-lg shadow-lg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg> */}
          <Button onClick={showModal} className="ml-4 mt-4 h-12 bg-grey shadow-lg">
            <ShoppingCartOutlined style={{ fontSize: '200%'}}/>
          </Button>
          <Modal title="Shopping Cart" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <div
              id="scrollableDiv"
              style={{
                height: 400,
                overflow: 'auto',
                padding: '0 16px',
                border: '1px solid rgba(140, 140, 140, 0.35)',
              }}
            >
              <InfiniteScroll
                dataLength={data.length}
                next={loadMoreData}
                hasMore={data.length < 50}
                loader={
                  <Skeleton
                    avatar
                    paragraph={{
                      rows: 1,
                    }}
                    active
                  />
                }
                endMessage={<Divider plain>End of everything</Divider>}
                scrollableTarget="scrollableDiv"
              >
                <List
                  dataSource={data}
                  renderItem={(item) => (
                    <List.Item key={item.email}>
                      <List.Item.Meta
                        avatar="icon"
                        title="food name"
                        description="desc."
                      />
                      <div>remove</div>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </Modal>

          <Popover
            content={
              <div className="w-52 h-96 bg-white rounded-lg">
                {/* <div className="text-xs text-slate-400">{user.email}</div> */}
                <div></div>
              </div>
            }
            trigger="click"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-12 m-4 p-2 bg-white rounded-lg shadow-lg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </Popover>
        </div>

        {chatHistory?.map((c, i) => (
          <div className="mt-10 w-3/4 flex flex-col items-center justify-around ml-40 text-xl">
            {i === chatHistory.length - 1 ? (
              <>
                <div className="w-full">
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(c)
                        .callFunction(() => {
                          setShowOptions(true)
                          setOptionsSelected([false, false, false])
                        })
                        .start()
                    }}
                    options={{
                      autoStart: true,
                      delay: 5,
                      cursor: null,
                      loop: false,
                      deleteSpeed: 10000,
                    }}
                  />
                </div>
                {showOptions && (
                  <div className="flex w-fit space-x-10 mt-4">
                    {options?.map((o, i) => (
                      <div
                        className={`flex items-center justify-around text-center text-slate-800 text-lg w-40 h-40 bg-slate-50 border-[1px] border-solid border-slate-300 rounded-lg duration-200 ${
                          optionsSelected[i]
                            ? "border-green-500 bg-white"
                            : "hover:bg-slate-100 hover:cursor-pointer hover:border-green-500"
                        }`}
                        onClick={() => {
                          onAddToCart(i)
                        }}
                      >
                        {optionsSelected[i] ? (
                          <IoIosCheckmark className="text-green-500 h-20 w-20" />
                        ) : (
                          o
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="w-full">{c}</div>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="py-8 px-4 flex justify-center">
        <Input
          placeholder="Enter your request"
          className="md:w-2/3 1/2 shadow-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setInput("")
              askGroq()
            }
          }}
        />
      </div>
    </div>
  )
}

export default Home
