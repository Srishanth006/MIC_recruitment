const{GoogleGenerativeAI}=require("@google/generative-ai");
const gemini=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateResponse(mood){
    try{
        const model=gemini.getGenerativeModel({model:"gemini-1.5-flash"});
        const prompt= `Imagine you are music expert and you know most of the tamil songs ,According to the users mood : "${mood}",give 3 tamil artists that would fit this mood for a spotify playlist,Give only spotify names of the artists ,format the response as a valid JSON object in the format mentioned below ,only this nothing else dont give markdown formatting like \`\`\`json:{"artists": ["artist_name1", "artist_name2","artist_name3"]}`;
        const result = await model.generateContent(prompt);
        const responseText = await result.response;
        let text = responseText.text();
        const startindex=text.indexOf('{');
        const endindex=text.lastIndexOf('}');
        if (startindex !== -1 && endindex !== -1) {
            const jsonstring=text.substring(startindex, endindex + 1);
            try{
                const parsedData=JSON.parse(jsonstring);
                return {
                    artists: parsedData.artists || [],
                };
            }catch(jsonerror){ 
                console.error("Error parsing JSON:",jsonstring);
                throw new Error("Gemini invalid JSON response");
                }
            }
            else{
                console.error("No JSON object found in the response");
                throw new Error("No JSON object found in the response");
        }
    }catch(error){
        console.error("Error generating response from Gemini API:",error.message);

        throw new Error("Failed to generate response from Gemini API");
    }
        
} 

module.exports={generateResponse};

