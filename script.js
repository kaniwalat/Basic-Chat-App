const socket = io();

const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

setTimeout(() => {
    alert('Welcome to Chat App')
}, 1000)

// Function to add a message to the chat box
function addMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `<span>${message.sender}</span>: <p>${message.text}</p>`;
    chatBox.appendChild(messageElement);
    // Scroll to bottom of chat box
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Event listener for send keydown enter
messageInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter') {
        const message = messageInput.value.trim();
        // Emit message to server
        socket.emit('message', { sender: 'User', text: message });
        // Clear input field
        messageInput.value = ''
    }
});

// Event listener for send click button
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    // Emit message to server
    socket.emit('message', { sender: 'User', text: message });
    // Clear input field
    messageInput.value = ''
});

// Event listener for receiving messages from server
socket.on('message', (message) => {
    addMessage(message);
});