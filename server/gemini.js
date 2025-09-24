const{GoogleGenerativeAI}=require("@google/generative-ai");
const gemini=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateResponse(mood){
    try{
        const model=gemini.getGenerativeModel({model:"gemini-1.5-flash"});
        const prompt= `Imagine you are music expert and you know most of the tamil songs ,According to the users mood : "${mood}",generate around 5-8 songs across 3 tamil artists that would fit this mood for spotify playlist,Give only spotify ids of the artists ,format the response as a valid JSON object in the format mentioned below ,only this nothing else :{"songs": ["song1", "song2", "song3"], "artists": ["artist_id1", "artist_id2"]}`;
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
                    genres: parsedData.genres || [],
                    songs: parsedData.songs || [],
                    artists: parsedData.artists || [],
                };
            }catch(parseError){ 
                console.error("Error parsing JSON:",parseError);
                throw new Error("Failed to parse JSON from Gemini response");
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

