import { Input } from "antd"
import Groq from "groq-sdk"
import React, { useState } from "react"
import { IoIosCheckmark } from "react-icons/io"
import Typewriter from "typewriter-effect"

const Home = () => {
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

  const processString = (s) => {
    for (let i = s.length - 1; i >= 0; i--) {
      if (s.charAt(i) === ":") {
        return [s.substr(0, i + 1), s.substr(i + 2).split(",")]
      }
    }
  }

  async function askGroq() {
    const chatCompletion = await getGroqChatCompletion()
    setChatHistory([
      ...(chatHistory ?? []),
      processString(chatCompletion.choices[0]?.message?.content || "")[0],
    ])
    setOptions(
      processString(chatCompletion.choices[0]?.message?.content || "")[1]
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
          <button aria-label="Open Shopping Cart" onclick="handleButtonClick()">
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
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>

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
        </div>
        {chatHistory?.map((c, i) => (
          <div className="mt-10 w-full flex flex-col items-center">
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
                    {options.map((o, i) => (
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
                <div>{c}</div>
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
