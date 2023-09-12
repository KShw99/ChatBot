import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textContent = '';

    loadInterval = setInterval(() => {
        element.textContent += '.';

        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0;

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

function idGenerator() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return `
       <div class="wrapper ${isAi && 'ai'}">
          <div class="chat">
              <div class="profile">
                  <img 
                  src="${isAi ? bot : user}" 
                  alt="${isAi ? 'bot' : 'user'}"
                  />
              </div>
              <div class="message" id="${uniqueId}">${value}</div>
          </div>
       </div>
    `;
}

async function processUserInput(keyword) {
    // Display user's question
    chatContainer.innerHTML += chatStripe(false, keyword);
    form.reset();

    const uniqueId = idGenerator();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    // Scroll to the bottom of the chat container
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);

    try {
        // Make an API request to your server.js
        const response = await fetch(`/predict/${keyword}`);
        if (!response.ok) {
            throw new Error(`Request to backend failed with status: ${response.status}`);
        }
        const responseData = await response.json();

        // Display the AI's response
        clearInterval(loadInterval);
        messageDiv.textContent = ''; 
        typeText(messageDiv, responseData.response);
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = 'An error occurred while fetching the response.';
    }
}

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const keyword = data.get('prompt');
    await processUserInput(keyword);
};

form.addEventListener('submit', handleSubmit);

form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
});
