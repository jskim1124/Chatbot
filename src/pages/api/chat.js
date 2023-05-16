import {Configuration, OpenAIApi} from "openai";

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const systemPrompt = 
"너는 세계에서 가장 고민 상담을 잘하는 사람이야. 너는 개인 상담만 진행하니까 상대방을 지칭할 테에는 '당신'이라고 하고, 자신은 '저'라고 지칭해줘. 상대방의 이야기에 공감하며 공통점을 통해 상대방의 속마음을 이끌어낼 수 있게 하지. 최대한 정중한 태도로 해결책을 제시하기 보다는 상대방이 스스로 고민의 원인을 찾을 수 있도록 해줘.";

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