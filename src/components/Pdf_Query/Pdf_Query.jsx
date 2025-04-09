import { useRef, useState } from "react";


const Pdf_Query = ({ chatHistory, setChatHistory, loading, setLoading}) => {
    const [question, setQuestion] = useState("");
    const inputText = useRef("");
    // const [loading, setLoading] = useState(false);
    const postQuestion = async (e) => {
        e.preventDefault();
        const questionData = { question }
        const userText = inputText.current.value.trim()
        if (!userText) return;
        inputText.current.value = ""
        setChatHistory(history => [...history, { role: "user", text: userText }])
        setLoading(true);
        const instantAnswer = {questionData, text:'Thinking...'}
        setChatHistory((prev) =>[instantAnswer,...prev])
        try {
            const response = await fetch("http://localhost:3000/api/v1/users/ask", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(questionData),
            });
            console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Response data:", data);
            
            if (data.answer) {
                setChatHistory((prev) =>{
                    const updateResponse = [...prev]
                    updateResponse[0] = {...updateResponse[0],text:data.answer}
                    return updateResponse
                })
                setChatHistory(updateResponse => [...updateResponse, { role: "chatbot", text: data.answer }])
            } else {
                console.log("No answer received from the server.");
            }
        } catch (err) {
            console.log("Request failed: ", err);
        } finally {
            setLoading(false);
            // setTimeout(() => setLoading(false), 500); 
        }
    }
    return (
        <>
            <form action="" onSubmit={postQuestion}>
                <div className="flex mx-auto my-0">
                    <input ref={inputText} className="shadow appearance-none border rounded rounded-[8px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required type="text" name="" id="" placeholder="Type your Query..." onChange={(e) => { setQuestion(e.target.value) }} />
                    {/* <button className="bg-green-700 hover:White text-white font-bold py-2 px-8 rounded-full ml-[10px]">Submit</button> */}
                    {/* {!loading ? (
                    <button className="bg-green-700 hover:White text-white font-bold py-2 px-8 rounded-full ml-[10px]">Submit</button>
                ) : (
                    // Show loading message or spinner when loading
                    <button className="bg-green-700 hover:White text-white font-bold py-2 px-8 rounded-full ml-[10px]">Loading...</button>
                )} */}
                    {/* {!loading ? (
                        <button
                            className="bg-green-700 hover:white text-white font-bold py-2 px-8 rounded-[8px] ml-[10px]"
                            type="submit"  // Ensure it's a submit button
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            className="bg-green-700 hover:white text-white font-bold py-2 px-8 rounded-full ml-[10px]"
                            disabled  // Disable button when loading
                        >
                            
                            <div className="flex items-center justify-center">
                                <div className="spinner"></div> 
                                Loading...
                            </div>
                        </button>
                    )} */}
                     <button 
                    className={`bg-green-700 text-white font-bold py-2 px-8 rounded-[8px] ml-[10px] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                    type="submit" 
                    disabled={loading} // Disable when loading
                >
                    {loading ? "Loading..." : "Submit"}
                </button>
                </div>
            </form>
        </>
    );
};

export default Pdf_Query