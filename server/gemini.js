const{GoogleGenerativeAI}=require("@google/generative-ai");
const gemini=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateResponse(mood){
    try{
        const model=gemini.getGenerativeModel({model:"gemini-1.5-flash"});
        const prompt= `Imagine you are music expert and you know most of the tamil songs ,According to the users mood : "${mood}",generate around 5-8 songs across 3 tamil artists that would fit this mood for spotify playlist,format the response as a valid JSON object in the format mentioned below ,only this nothing else :{"songs": ["song1", "song2", "song3"], "artists": ["artist_id1", "artist_id2"]}`;
        const result = await model.generateContent(prompt);
        const responseText = await result.response;
        const text=responseText.text();
    }catch(error){
    console.error("Error generating songs from Gemini API:",error);
    throw new Error("Failed to generate response");
} 
}
module.exports={generateResponse};