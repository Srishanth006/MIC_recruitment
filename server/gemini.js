const{GoogleGenerativeAI}=require("@google/generative-ai");
const gemini=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateResponse(mood){
    try{
        const model=gemini.getGenerativeModel({model:"gemini-1.5-flash"});
        const prompt= `You are a music expert. For the user's mood: "${mood}", provide 3 relevant Tamil artist names and 2 relevant genre names. The genre names MUST be from Spotify's official list and formatted correctly: all lowercase, with spaces replaced by hyphens. For example: "kollywood", "tamil-pop", "indian-classical". Your entire response MUST BE ONLY a valid JSON object with no other text or markdown formatting. The format must be exactly: {"artists": ["artist_name_1", "artist_name_2"], "genres": ["valid-genre-1", "valid-genre-2"]}`;
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
                    genres: parsedData.genres || []
                };
            }catch(jsonerror){ 
                console.error("Error parsing JSON:",jsonstring);
                throw new Error("Gemini invalid JSON response");
                }
            }
            else{
                console.error("No JSON object found in the response",text);
                throw new Error("No JSON object found in the response");
        }
    }catch(error){
        console.error("Error generating response from Gemini API:",error.message);

        throw new Error("Failed to generate response from Gemini API");
    }
        
} 

module.exports={generateResponse};