# 🖼️ AI Image Generator (Stable Diffusion + React + Express.js)

A full-stack **AI Image Generator** web application that lets users generate high-quality images using **Stable Diffusion** via the **Replicate API**.  
Built with **React (frontend)** and **Node.js + Express (backend)**.

---

## 🚀 Features

- Generate images using **Stable Diffusion / Stable Diffusion XL**
- Clean and modern **React UI**
- Input prompt → AI-generated image
- Node.js backend connected to **Replicate API**
- Fully responsive UI
- CORS enabled
- dotenv for environment variables  
- Beginner-friendly folder structure

---

## 🛠 Tech Stack

### **Frontend**
- React.js  
- JavaScript  
- CSS (or Tailwind if added)

### **Backend**
- Node.js  
- Express.js  
- Replicate API  
- dotenv  

### **AI Model**
- Stable Diffusion 2.1 / Stable Diffusion XL

---

## 📁 Project Structure




## 🔧 Setup Instructions

### 1️⃣ Clone the repository

git clone https://github.com/akmgr51299-sketch/Image-generation.git


### 2️⃣ Install backend dependencies

cd backend
npm install


### 3️⃣ Add your Replicate API key  
Create a `.env` file inside backend:

REPLICATE_API_TOKEN=your_api_key_here


### 4️⃣ Start backend server

node server.js


### 5️⃣ Install frontend dependencies

cd ../frontend
npm install


### 6️⃣ Start frontend

npm start


---

## 🎨 How It Works

1. User enters a **prompt**
2. Frontend sends request → `/generate` API
3. Backend calls **Replicate Stable Diffusion model**
4. AI generates the image
5. Frontend displays the output

---

## 📷 Sample Output

> “A futuristic cyberpunk city at night, neon lights, ultra-detailed.”

*(You can add sample generated images here)*

---

## 🔐 Environment Variables

Backend `.env` contains:

REPLICATE_API_TOKEN=your_api_key_here


Get API key from: https://replicate.com/account

---

## 🧩 API Endpoint

### `POST /generate`
**Request:**
```json
{
  "prompt": "your imagination..."
}

Response:

{
  "image": "generated_image_url"
}

🤝 Contributing

Pull requests and improvements are welcome.
Feel free to open issues for:

    UI improvements

    New AI models

    Additional features

🧑‍💻 Author

Ashish Kumar
GitHub: https://github.com/akmgr51299-sketch
⭐ Support

If you like this project:

    ⭐ Give a star on GitHub

    🍴 Fork it

    📝 Open an issue for suggestions


---

If you want, I can also add:  
✅ Badges (license, stars, tech stack)  
✅ Project logo  
✅ Demo GIF / screenshots  
