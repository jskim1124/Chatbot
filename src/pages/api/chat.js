import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const systemPrompt = "시스템 설정";

export default async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).json({error: "Method not allowed"});
        return;
    }
    const {messages} =  req.body;

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens:512,
        messages:[
            {role:"system", content:systemPrompt},
            ...messages.slice(-6),
        ],
    });

    res.status(200).json({
        role: "assistant",
        content: completion.data.choices[0].message.content,
    });
};