'use strict';

const usernamePage = document.querySelector('#username-page');
const chatPage = document.querySelector('#chat-page');
const usernameForm = document.querySelector('#usernameForm');
const messageForm = document.querySelector('#messageForm');
const messageInput = document.querySelector('#message');
const messageArea = document.querySelector('#messageArea');
const connectingElement = document.querySelector('.connecting');
const fileInput = document.querySelector('#imageUpload');
const customFileBtn = document.getElementById('customFileBtn');

let stompClient = null;
let username = null;

const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

// Resize and compress image before sending
function resizeImage(file, maxWidth, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement("canvas");
            const scale = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7);
            callback(resizedBase64);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// Connect to WebSocket
function connect(event) {
    username = document.querySelector('#name').value.trim();

    if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }

    event.preventDefault();
}

// On connected
function onConnected() {
    stompClient.subscribe('/topic/public', onMessageReceived);

    stompClient.send("/app/chat.addUser", {}, JSON.stringify({
        sender: username,
        type: 'JOIN'
    }));

    connectingElement.classList.add('hidden');
}

// Handle errors
function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

// Send message (text or image)
function sendMessage(event) {
    event.preventDefault();

    const messageContent = messageInput.value.trim();
    const file = fileInput.files[0];

    // If image selected
    if (file && stompClient) {
        resizeImage(file, 500, function (resizedBase64) {
            const chatMessage = {
                sender: username,
                content: resizedBase64,
                type: 'CHAT'
            };
            stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));

            fileInput.value = '';
            messageInput.value = '';
            // Reset image button
            customFileBtn.textContent = 'Image';
            customFileBtn.style.backgroundColor = '';
        });
    }
    // If text message
    else if (messageContent && stompClient) {
        const chatMessage = {
            sender: username,
            content: messageContent,
            type: 'CHAT'
        };
        stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
}

// Show received message
function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    const messageElement = document.createElement('li');

    if (message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = `${message.sender} joined!`;
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = `${message.sender} left!`;
    } else {
        messageElement.classList.add('chat-message');

        const avatarElement = document.createElement('i');
        const avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style.backgroundColor = getAvatarColor(message.sender);
        messageElement.appendChild(avatarElement);

        const usernameElement = document.createElement('span');
        usernameElement.textContent = message.sender;
        messageElement.appendChild(usernameElement);
    }

    const textElement = document.createElement('p');

    // Show image if base64
    if (typeof message.content === 'string' && message.content.startsWith('data:image/')) {
        const image = document.createElement('img');
        image.src = message.content;
        image.style.maxWidth = '200px';
        image.style.borderRadius = '8px';
        image.style.marginTop = '8px';
        textElement.appendChild(image);
    } else {
        textElement.textContent = message.content;
    }

    messageElement.appendChild(textElement);
    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

// Generate avatar color
function getAvatarColor(sender) {
    let hash = 0;
    for (let i = 0; i < sender.length; i++) {
        hash = 31 * hash + sender.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
}

// Listeners
usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);

// Open file chooser on button click
customFileBtn.addEventListener('click', () => fileInput.click());

// Change button to red and say "Uploaded" after choosing image
fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
        customFileBtn.textContent = 'Uploaded';
        customFileBtn.style.backgroundColor = 'red';
    } else {
        customFileBtn.textContent = 'Image';
        customFileBtn.style.backgroundColor = '';
    }
});
