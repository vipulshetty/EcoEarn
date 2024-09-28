// Define the necessary elements from the DOM
const messagesDiv = document.getElementById('messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Function to add messages to the chat box
function addMessage(message, className) {
  const messageDiv = document.createElement('div');
  messageDiv.className = className;
  messageDiv.textContent = message;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}

// Function to send a message to the server
async function sendMessage() {
  const message = userInput.value.trim();

  if (message) {
    addMessage(`You: ${message}`, 'user-message');
    userInput.value = ''; // Clear input

    // Send the message to the server using fetch
    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await response.json();

      if (data.response) {
        addMessage(`AI: ${data.response}`, 'ai-message');
      } else {
        addMessage(`AI: Sorry, I couldn't process your request.`, 'ai-message');
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage('AI: An error occurred. Please try again.', 'ai-message');
    }
  }
}

// Add an event listener to the send button
sendBtn.addEventListener('click', sendMessage);

// Add 'Enter' key support
userInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});
