import React, { useState } from 'react';
import { FaMicrophone, FaExchangeAlt, FaStar, FaCopy } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import axios from "axios"

const Home = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [loading, setLoading] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false);

    const getTranslation = async (e) => {
        e.preventDefault();
        setOutputText("")
        setLoading(true)
        try {
            const response = await axios.get("http://localhost:5000/translation", {
                params: {
                    userQuestion: inputText,
                    folderName: "models",
                    sourceLan: "Awajun",
                    targetLan: "Spanish",
                },
            });
            setOutputText(response.data.analysis);
            setLoading(false)
        } catch (error) {
            console.error("Error fetching translation:", error);
            setOutputText("An error occurred while fetching the translation.");
            setLoading(false)
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(outputText).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
        }, (err) => {
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <div className="flex flex-col h-screen bg-white p-4">
            <div className="bg-gray-100 rounded-lg shadow-lg p-4 max-w-md mx-auto w-full">
                <h1 className="text-xl font-bold mb-4">Traductor</h1>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <span className="font-semibold">Awajun</span>
                    </div>
                    <FaExchangeAlt className="text-gray-500" />
                    <div className="flex items-center">
                        <span className="font-semibold">Español</span>
                    </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">Awajun</span>
                        <IoClose onClick={()=>setInputText("")} className="text-gray-500 cursor-pointer" />
                    </div>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full bg-white p-2 resize-none outline-none"
                        rows={6}
                    />
                    <div className="flex justify-between items-center mt-2">
                        <button onClick={(e) => getTranslation(e)} className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm">
                            Traducir
                        </button>
                    </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold">Español</span>
                    </div>
                    <div className="mb-2">{loading ? <div className='pt-6 flex justify-center'> <SpinningLoader /> </div> : <>{outputText}</>}</div>
                    <div className="flex justify-end space-x-2">
                        <div className="relative">
                            <FaCopy
                                className="text-gray-500 cursor-pointer"
                                onClick={handleCopy}
                            />
                            {copySuccess && (
                                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-2">
                                    Copied!
                                </span>
                            )}
                        </div>
                        <FaStar className="text-gray-500 cursor-pointer" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;

const SpinningLoader = ({ size = 'md', color = 'blue' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const colorClasses = {
        blue: 'border-blue-500',
        green: 'border-green-500',
        red: 'border-red-500',
        yellow: 'border-yellow-500'
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`${sizeClasses[size]} border-4 border-t-transparent rounded-full animate-spin ${colorClasses[color]}`}
            ></div>
        </div>
    );
};