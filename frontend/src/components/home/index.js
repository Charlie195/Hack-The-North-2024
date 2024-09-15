import Groq from "groq-sdk"
import React, { useState } from "react"
import { IoIosCheckmark } from "react-icons/io"
import Typewriter from "typewriter-effect"

const Home = () => {
  const prompt =
    "Respond to this prompt. Then, at the end, give a list of three comma-separated products that the user could buy. with no explanation. no text other than the three items (THIS IS A MUST)."
  const [chatHistory, setChatHistory] = useState()
  const groq = new Groq({
    apiKey: process.env.REACT_APP_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
  })
  const [showOptions, setShowOptions] = useState(true)
  const [options, setOptions] = useState()
  const [optionsSelected, setOptionsSelected] = useState([false, false, false])

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
    setTimeout(() => {
      setShowOptions(true)
      setOptionsSelected([false, false, false])
    }, chatCompletion.choices[0]?.message?.content.length * 10 ?? 0)
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
          content: `current shopping cart:
          i want to make a avocado smoothie yes
          ${prompt}`,
        },
      ],
      temperature: 0,
      model: "llama3-8b-8192",
    })
  }

  return (
    <>
      <div
        onClick={() => {
          askGroq()
        }}
      >
        Click
      </div>
      {chatHistory?.map((c, i) => (
        <div className="mt-10 w-full flex flex-col items-center">
          {i === chatHistory.length - 1 ? (
            <>
              <div className="w-full">
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter.typeString(c).start()
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
                      className={`flex items-center justify-around text-slate-800 text-lg w-40 h-40 bg-slate-50 border-[1px] border-solid border-slate-300 rounded-lg duration-200 ${
                        optionsSelected[i]
                          ? "border-green-500 bg-transparent"
                          : "hover:bg-transparent hover:cursor-pointer hover:border-green-500"
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
    </>
  )
}
export default Home
