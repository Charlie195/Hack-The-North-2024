import { ShoppingCartOutlined } from "@ant-design/icons"
import { Button, Divider, Input, List, Modal, Popover, Table, Tag, Space} from "antd"
import Groq from "groq-sdk"
import React, { useEffect, useState } from "react"
import { IoIosCheckmark } from "react-icons/io"
import { RiRobot2Line } from "react-icons/ri"
import Typewriter from "typewriter-effect"
import axios from "axios"
import { useAuth0 } from "@auth0/auth0-react"

import LoginButton from "../loginButton"
import LogoutButton from "../logoutButton"

const Home = () => {
  const [hideLogo, setHideLogo] = useState(false)

  const { user, isAuthenticated, isLoading } = useAuth0();


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
  const onAddToCart = async (i, itemName) => {
    console.log(itemName)
    const itemData = {
      name: itemName,
      cost: 7.99,
    }


    setOptionsSelected(optionsSelected.map((t, j) => (i === j ? true : t)))

    await axios.post("http://localhost:5001/addToCart", {
      email: user.email,
      name: user.name,
      itemData: itemData,
    })
  }
  const getCart = async (email) => {
    try {
      const response = await axios.post('http://localhost:5001/getCart', {
        email: user.email
      });
      const cartData = response.data;
      //console.log('Cart Data:', cartData);
      return cartData;
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  // shared cart
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
    console.log("ok clicked")
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  const [myCartData, setMyCartData] = useState([]);
  // shared cart table scroll stuff
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    }
  ];
  const data = [
    {
      name: 'John Brown'
    },
    {
      name: 'Jim Green'
    },
    {
      name: 'Joe Black'
    },
  ];

  const processString = (s) => {
    for (let i = s.length - 1; i >= 0; i--) {
      if (s.charAt(i) === ":") {
        return [s.substr(0, i + 1), s.substr(i + 2).split(",")]
      }
    }
    return ["Unable to retrieve a response. Tip: be specific.", []]
  }

  async function askGroq() {
    try {
      const chatCompletion = await getGroqChatCompletion()
      setChatHistory((chatHistory) => [
        ...(chatHistory ?? []),
        {
          value: processString(
            chatCompletion.choices[0]?.message?.content || ""
          )?.[0],
          type: "gpt",
        },
      ])
      setOptions(
        processString(chatCompletion.choices[0]?.message?.content || "")?.[1].slice(0, 3)
      )
    } catch (error) {
      console.log("error: " + error)
    }
  }

  async function getGroqChatCompletion() {
    setShowOptions(false)
    return groq.chat.completions.create({
      messages: [
        ...(chatHistory?.map((c) => ({
          role: "user",
          content: c.value,
        })) ?? []),
        {
          role: "user",
          content: `${prompt} ${input}`,
        },
      ],
      temperature: 0,
      model: "llama3-8b-8192",
    })
  }

  // useEffect(() => {
  //   console.log(chatHistory)
  // }, [chatHistory])

  useEffect(() => {
    const fetchCartData = async () => {
      if (isModalOpen) {
        const myCartData = await getCart();
        // if (Array.isArray(myCartData)) {
        //   console.log('myCartData is an array:', myCartData);
        // } else {
        //   console.log('myCartData is not an array:', myCartData);
        // }
        const formattedData = myCartData.map(item => ({
          name: item.name
        }));
        setMyCartData(formattedData);
        console.log("MYcartData:", myCartData[0].name);
      }
    };
    fetchCartData();
  }, [isModalOpen]);

  console.log("Is Loading: ", isLoading)
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  console.log("here: ", user)

  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      <div>
        <img src="CollabCartLogo.png" hidden={hideLogo} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" draggable={false}></img>
      </div>
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
          <Button
            onClick={showModal}
            className="ml-4 mt-4 h-12 bg-grey shadow-lg"
          >
            <ShoppingCartOutlined style={{ fontSize: "200%" }} />
          </Button>
          <Modal
            title="Shopping Cart"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <div>
            <Table columns={columns} dataSource={myCartData} pagination={false} />
            </div>
          </Modal>

          
          {!isLoading && <>
              <LoginButton />
              <LogoutButton />
          </>}
        </div>
        <div className="flex flex-col items-center max-h-[680px] overflow-y-scroll">
          {chatHistory?.map((c, i) => (
            <div className="flex items-end w-3/4 justify-around">
              {c.type === "gpt" && (
                <div className="w-10 h-10 bg-gray-400 mr-4 rounded-full flex justify-around items-center text-white mb-4">
                  <RiRobot2Line />
                </div>
              )}
              <div
                className={`flex-1 mt-2 w-3/4 flex flex-col items-center justify-around text-xl rounded-xl border-[1px] border-solid border-slate-200 p-6 ${
                  c.type === "gpt" ? "bg-slate-100" : "bg-white"
                }`}
              >
                {i === chatHistory.length - 1 && c.type === "gpt" ? (
                  <>
                    <div className="w-full">
                      <Typewriter
                        onInit={(typewriter) => {
                          typewriter
                            .typeString(c.value)
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
                            className={`flex items-center justify-around text-center text-slate-500 text-lg w-40 h-40 bg-slate-50 border-[1px] border-solid border-slate-300 rounded-lg duration-200 ${
                              optionsSelected[i]
                                ? "border-green-500 bg-white"
                                : "hover:bg-slate-100 hover:cursor-pointer hover:border-slate-500 hover:text-slate-800"
                            }`}
                            onClick={() => {
                              onAddToCart(i, o.trim().replace(/[.,]/g, ""))
                            }}
                          >
                            {optionsSelected[i] ? (
                              <IoIosCheckmark className="text-green-500 h-20 w-20" />
                            ) : (
                              o.trim().replace(/[.,]/g, "")
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-full">{c.value}</div>
                  </>
                )}
              </div>
              {c.type === "user" && (
                <div className="w-10 h-10 bg-green-400 ml-4 rounded-full flex justify-around items-center text-white mb-4">
                  M
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="py-8 px-4 flex justify-center">
        <Input
          placeholder="What fills your cart today?"
          className="h-10 w-1/2 shadow-lg"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              setInput("")
              setChatHistory((chatHistory) => [
                ...(chatHistory ?? []),
                { value: input, type: "user" },
              ])
              askGroq()
              setHideLogo(true)
            }
          }}
        />
      </div>
    </div>
  )
}

export default Home
