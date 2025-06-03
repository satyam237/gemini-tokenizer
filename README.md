# Gemini Tokenizer

An accurate and flexible online tool to count tokens for various Google Gemini AI models. Easily understand the token usage of your text input across different Gemini models to optimize your prompts and manage API costs.

## ✨ Features

*   **Multi-Model Support:** Get accurate token counts for a range of Gemini models, including `gemini-1.5-flash`, `gemini-1.5-pro`, and other preview models.
*   **Accurate Counting:** Utilizes the official Google Gemini API for precise tokenization based on the selected model.(+-1 token on UI)
*   **Secure API Key Handling:** Uses a serverless function to keep your Gemini API key secure on the backend.
*   **Responsive UI:** A clean and easy-to-use interface built with React and Tailwind CSS.

## 🌐 Website

Access the live version of the Gemini Tokenizer at:
[www.gemini-tokenizer.site](https://www.gemini-tokenizer.site)

## 🚀 Technologies Used

*   Vite
*   TypeScript
*   React
*   shadcn-ui
*   Tailwind CSS
*   Vercel (for serverless functions and deployment)
*   Google Generative AI Node.js Client Library

## 🛠️ Local Development

To set up and run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/satyam237/gemini-tokenizer.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd gemini-tokenizer
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory and add your Gemini API key:
    ```env
    VITE_DEFAULT_API_KEY=YOUR_GEMINI_API_KEY
    ```
    Replace `YOUR_GEMINI_API_KEY` with your actual key (Note: For production deployment on Vercel, configure this environment variable directly in the Vercel dashboard).

5.  **Run the development server:**
    If you plan to deploy on Vercel and want to test the serverless function locally, use `vercel dev` (requires Vercel CLI installed and logged in):
    ```bash
    vercel dev
    ```
    Alternatively, for frontend development only:
    ```bash
    npm run dev
    ```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details (Note: You might want to add a LICENSE file if you don't have one).

---

Let me know if this content looks good, or if you'd like any adjustments. If you approve, I will replace the current content of `README.md` with this draft.
