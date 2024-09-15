const Groq = require('groq-sdk');

const groq = new Groq({apiKey: process.env.REACT_APP_API_KEY});

async function main() {
    const completion = await groq.chat.completions
        .create({
            messages: [
                {
                    role: "user",
                    content: "On walmart.ca, find options of white bread and list important information. Also, suggest other related ingredients.",
                },
            ],
            model: "llama3-70b-8192",
        })
        .then((chatCompletion) => {
            process.stdout.write(chatCompletion.choices[0]?.message?.content || "");
        });
}

main();
