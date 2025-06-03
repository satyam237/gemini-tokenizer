
import React from 'react';
import { FaGithub, FaEnvelope, FaStar } from "react-icons/fa";

export const PageFooter: React.FC = () => {
    return (
        <footer className="mt-10 text-center text-base text-gray-500">
            <p>Made with <span className="font-bold">lovable.ai</span> by Satyam Jadhav | <a href="mailto:satyam2373@gmail.com" className="text-blue-500 hover:underline">satyam2373@gmail.com</a></p>
            <div className="flex justify-center space-x-4 mt-2">
                <a href="https://github.com/satyam237" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="w-6 h-6 text-gray-600 hover:text-black" />
                </a>
                <a href="mailto:satyam2373@gmail.com">
                    <FaEnvelope className="w-6 h-6 text-gray-600 hover:text-red-600" />
                </a>
            </div>
            <p className="mt-2">Feel free to contribute!</p>
            <div className="mt-3 flex justify-center items-center space-x-2">
                <FaStar className="w-4 h-4 text-yellow-500" />
                <a 
                    href="https://github.com/satyam237/gemini-tokenizer" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-base"
                >
                    Give this project a star on GitHub!
                </a>
                <FaStar className="w-4 h-4 text-yellow-500" />
            </div>
        </footer>
    );
};
