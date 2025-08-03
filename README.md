# 🚑 SwiftEMS – AI-Powered Emergency Response Platform

SwiftEMS is a real-time emergency communication system designed to replace traditional 911 calls with **live video**, **instant location sharing**, and **real-time transcription**. The platform allows individuals in distress to **visually connect with emergency personnel**, enabling faster and more accurate decision-making during critical moments.

---

## 🚨 Have You Ever Been in an Emergency Call?

What did it feel like?  
Panic? Fear? Confusion?

In those critical moments, every second matters.

### 🧠 What Did the Emergency Responder Do to Help You?

Were they able to fully understand your situation?  
Did you feel heard?  
Was the response fast enough?

> A significant number of emergency calls — sometimes up to **19%** — are categorized as **"unclear problem"**, where the caller’s description doesn’t easily fit into defined categories like chest pain or breathing difficulties.  
> Many fatal outcomes are caused by **unclear communication**, agents not fully **grasping the situation**, or arriving **too late** due to a **wrong or vague address**.

### 🤔 Could a Better Grasp of the Situation Help Save Lives?

When callers are guided by clear, AI-assisted insights, they can act more confidently while waiting for help — and responders can arrive better prepared.

---

## ✅ What SwiftEMS Does

SwiftEMS bridges communication and context gaps by providing:

- **📹 Live video calls** between the caller and dispatcher  
- **🗺️ Automatic location sharing** with map overlays and AI tagging  
- **📝 Real-time AI-powered transcription** and summarization using Gemini AI  
- **🧑‍⚕️ On-screen visual instructions**, such as CPR or safety procedures  
- **📊 Dashboard for both dispatchers and callers**, improving instruction flow and clarity  
- **🔄 Responsive interface**: large video for emergency scene, smaller video for the dispatcher  
- **📌 Dedicated transcript panel** for accessibility without interfering with the UI  

---

## 💡 Powered by Gemini AI

At the heart of SwiftEMS is **Gemini AI**, used for:

- 🧠 **Situational video analysis** — detecting visible injuries, hazards, and severity  
- 📝 **Transcription summarization** — highlighting main points and urgent issues  
- 🗣️ **Natural language understanding** — reducing loss of information due to panic or language barriers  

---

## 🌟 Future Updates

We're building SwiftEMS to become smarter and more scalable. Planned improvements include:

- 🌍 **Multilingual transcription and translation**  
- ⌚ **Wearable integration** (e.g., fall alerts from smartwatches)  
- 📦 **Auto-fetching medical profiles** (opt-in) from health records  
- 📞 **Offline voice guidance** when network is limited  
- 🧠 **Edge AI** for local analysis during poor connectivity  

---

## 🧰 Built With

- **Next.js** – Frontend framework  
- **TypeScript** – Strong typing for maintainable code  
- **Tailwind CSS** – For fast and responsive UI styling  
- **Python** – (Optional) AI service integrations  
- **Gemini AI** – Google’s large language model for video, text, and context analysis  
- **WebRTC** – Real-time video streaming  
- **Socket.IO** – Real-time communication  
- **Leaflet / Mapbox** – Interactive maps for location tracking  
- **Vercel** – Hosting frontend  
- **Railway / Render / Heroku** – For optional serverless or AI service endpoints  

---

## 🔧 Installation

To run the EMS demo locally:

1. **Clone the repository**
   ```sh
   git clone https://github.com/duketheduck1/SwiftEMS.git
   ```

2. **Install frontend dependencies**
   ```sh
   npm install
   ```

3. **Start the development server**
   ```sh
   npm run dev
   ```

4. **(Optional) Backend setup**
   - The backend is built with Django. See the `/backend` folder for setup instructions.
   - Install Python dependencies:
     ```sh
     pip install -r requirements.txt
     ```
   - Run the Django server:
     ```sh
     python manage.py runserver
     ```

5. **Access the app**
   - Open [http://localhost:5173](http://localhost:5173) in your browser for the frontend.
   - Backend runs on [http://localhost:8000](http://localhost:8000) by default.

---
