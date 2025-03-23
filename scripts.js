const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');
const API_KEY = "AIzaSyD0uBeb0tnuMQNlYmkkxOBkBlTs6_ai_6I";

async function getIAResponse() {
    const mensaje = messageInput.value;
    messageInput.value = ""; // Limpiar el input
    try {
        const respuesta = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + API_KEY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: mensaje }] }],
            }),
        });
        const datos = await respuesta.json();
        const textoRespuesta = datos.candidates[0].content.parts[0].text;
        return textoRespuesta;
    } catch (error) {
        console.error("Error:", error);
        return `Mensaje del usuario: ${mensaje}\nError: No se pudo obtener la respuesta.`;
    }

}

function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user-message' : 'ia-message');
    messageDiv.textContent = message;
    chatMessages.prepend(messageDiv); //  <--  CAMBIO:  Usamos append

    setTimeout(() => {
        messageDiv.classList.add('show');
        // Scroll al final (ya no necesitamos cálculos complicados)
        chatMessages.scrollTop = chatMessages.scrollHeight; // <-- SIMPLIFICADO
    }, 0);
}

async function sendMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    addMessage(message, true);

    try {
        const iaResponse = await getIAResponse();
        messageInput.value = '';
        messageInput.disabled = true;
        sendButton.disabled = true;
        addMessage(iaResponse, false);
    } catch (error) {
        addMessage("Error al obtener la respuesta.", false);
    } finally {
        messageInput.disabled = false;
        sendButton.disabled = false;
        messageInput.focus();
    }
}

sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});
/*
messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.ctrlKey) {
        messageInput.
    }
});*/