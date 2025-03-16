
import React from 'react';
import { FaGithub, FaEnvelope } from "react-icons/fa";

export const PageFooter: React.FC = () => {
    return (
        <footer className="mt-10 text-center text-sm text-gray-500">
            <p>Made with <span className="font-bold">lovable.ai</span> by Satyam Jadhav | <a href="mailto:satyam2373@gmail.com" className="text-blue-500 hover:underline">satyam2373@gmail.com</a></p>
            <div className="flex justify-center space-x-4 mt-2">
                <a href="https://github.com/satyam237" target="_blank" rel="noopener noreferrer">
                    <FaGithub className="w-5 h-5 text-gray-600 hover:text-black" />
                </a>
                <a href="mailto:satyam2373@gmail.com">
                    <FaEnvelope className="w-5 h-5 text-gray-600 hover:text-red-600" />
                </a>
            </div>
            <p className="mt-2">Feel free to contribute!</p>
        </footer>
    );
};
