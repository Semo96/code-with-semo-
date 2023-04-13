// import bot from './assets/bot.svg';
// import user from './assets/user.svg';


// const form = document.querySelector('form');
// const chatContainer = document.querySelector('#chat_container');

// let loadInterval;

// // THIS FUNCTION IS FOR LOAD AND ANIMATE THE DOTE (...)

// function loader(element){
//   element.textContent = '';

//   loadInterval = setInterval(() => {
//     element.textContent += '.';

//     if(element.textContent ==='....'){
//       element.textContent = '';
//     }
//   }, 300)

// }

// // THIS FUNCTION TO ANIMAT THE ANSWER TEXT 

// function typeText(element,text){
//   let index = 0;

//   let interval = setInterval(() => {
//     if (index < text.lenght){
//       element.innerHTML += text.charAt(index);
//       index++;
//     }else{
//       clearInterval(interval);
//     }
//   },20)
// }


// function generateUniqueId(){
//   const timestamp = Date.now();
//   const randomNumber = Math.random();
//   const hexadecimalSrting = randomNumber.toString(16);

//   return `id-${timestamp}-${hexadecimalSrting}`;
// }

// // THIS FUNCTION TO CREATE CHAT STRIPE

// function chatStripe  (isAi, value, uniqueId){
//   return (
//     `
//       <div class="wrapper ${isAi && 'ai'}">

//         <div class="chat">
//           <div class="profile">
//             <img 
//               src="${isAi ? bot : user}"
//               alt="${isAi ? 'bot' : 'user'}"
//              />
//           </div>
//           <div class="message" id=${uniqueId}>${value}</div>
//         </div>

//       </div>
//       `
    
//   )

// }


// const handleSubmit = async (e) => {
//   e.preventDefault();

//   const data = new FormData(form);

// // users chatstripe

// chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

// // cleare textarea input 

// form.reset();

// // bots chatstripe

// const uniqueId = generateUniqueId();
// chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

// chatContainer.scrollTop = chatContainer.scrollHeight;

// const messageDiv = document.getElementById(uniqueId)

// loader(messageDiv);

// // fetch the data from server -> bots response 

// const response = await fetch('http://localhost:5000', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({
//     prompt: data.get('prompt')
//   })
// })

// clearInterval(loadInterval);
// messageDiv.innerHTML= '';

// if(response.ok){
//   const data = await response.json();
//   const parsedData = data.bot.trim();

//   typeText(messageDiv, parsedData);    
// } else {
//   const err = await response.text();

//   messageDiv.innerHTML = "something went wrong";

//   alert(err);
//   }
// }


// // funtion to supmet message by click submet or enter

// form.addEventListener('submit', handleSubmit);
// form.addEventListener('keyup', (e) =>{
//   if(e.keyCode === 13){
//     handleSubmit(e);
//   }
// })

import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval


function loader(element) {
  element.textContent = '...';

  loadInterval = setInterval(() => {

    // Update the text content of the loading indicator
    element.textContent += '.';

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === '....') {
      element.textContent = '';
    }
  }, 300);
  
  return () => {
    clearInterval(loadInterval);
    element.textContent = '';
  };
}

function typeText(element, text) {
  let index = 0

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 10)}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}" />
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const prompt = data.get('prompt');

  // Add user's chat stripe
  const userUniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(false, prompt, userUniqueId);
  form.reset();

  // Add bot's chat stripe
  const botUniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", botUniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(botUniqueId);
  const restoreContent = loader(messageDiv);

  // Fetch the data from the server -> bot's response
  try {
    let response = await fetch('https://ask-semo.onrender.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt
      })
    });

    restoreContent();

    if (response.ok) {
      const { bot } = await response.json();
      const parsedData = bot.trim();
      typeText(messageDiv, parsedData);
    } else {
      const err = await response.text();
      messageDiv.innerHTML = 'Something went wrong';
      alert(err);
    }
  } catch (error) {
    restoreContent();
    messageDiv.innerHTML = 'Something went wrong';
    console.error(error);
  }
};

// Function to submit message by clicking submit or pressing enter
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});























