# 💬 WhisprNet - Spring Boot WebSocket Chat App

WhisprNet is a real-time chat application built using **Spring Boot**, **WebSockets**, **STOMP**, and **SockJS**. It enables multiple users to join a public chatroom, exchange messages, and share images — all in real-time with a clean, responsive UI.

---

## 🚀 Features

- 🔁 Real-time messaging using WebSocket + STOMP protocol
- 👥 Username-based chatroom entry
- 🖼️ Image sharing with client-side resizing and compression
- 🎨 Responsive design with modern styling
- ⚠️ Graceful fallback for no-JavaScript browsers
- 📎 Clean footer with author credit

---

## 🛠️ Tech Stack

| Layer       | Technologies Used                                     |
|-------------|--------------------------------------------------------|
| Frontend    | HTML5, CSS3, JavaScript (Vanilla)                      |
| Backend     | Spring Boot, WebSocket, STOMP, SockJS                  |
| Protocol    | STOMP over WebSocket                                   |
| Build Tool  | Maven                                                  |

---

## 📂 Folder Structure

```bash
📦whisprnet
 ┣ 📂src
 ┃ ┣ 📂main
 ┃ ┃ ┣ 📂java
 ┃ ┃ ┃ ┗ 📂com.app.chat     # Java source files
 ┃ ┃ ┣ 📂resources
 ┃ ┃ ┃ ┗ 📂static
 ┃ ┃ ┃   ┣ 📂css
 ┃ ┃ ┃   ┃ ┗ main.css       # Styling
 ┃ ┃ ┃   ┗ index.html       # Web interface
 ┃ ┗ 📄 application.properties
 ┣ 📄 js/main.js             # WebSocket + STOMP logic
 ┣ 📄 pom.xml                # Project dependencies
