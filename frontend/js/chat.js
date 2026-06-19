const chatEmpty    = document.getElementById('chatEmpty');
const chatMessages = document.getElementById('chatMessages');
const chatInput    = document.getElementById('chatInput');
const sendBtn      = document.getElementById('sendBtn');
const topbarTitle  = document.getElementById('topbarTitle');

// ===== INPUT =====

function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
}

chatInput.addEventListener('input', () => autoResize(chatInput));

chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

// Fill input from suggestion chips
document.querySelectorAll('.chat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
        chatInput.value = btn.textContent.trim();
        chatInput.focus();
        autoResize(chatInput);
    });
});

// ===== MESSAGES =====

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function addMessage(role, text) {
    const div = document.createElement('div');
    div.classList.add('message', `message--${role}`);

    if (role === 'user') {
        div.innerHTML = `<div class="message__content"><p>${escapeHtml(text)}</p></div>`;
    } else {
        div.innerHTML = `
            <img src="images/favicon_spiral.svg" alt="Socrates" class="message__avatar">
            <div class="message__body">
                <span class="message__name">Socrates</span>
                <div class="message__content"><p>${text}</p></div>
            </div>`;
    }

    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

function addTypingIndicator() {
    const div = document.createElement('div');
    div.classList.add('message', 'message--ai', 'message--typing');
    div.id = 'typingIndicator';
    div.innerHTML = `
        <img src="images/favicon_spiral.svg" alt="Socrates" class="message__avatar">
        <div class="message__body">
            <span class="message__name">Socrates</span>
            <div class="message__content">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        </div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

// ===== SEND =====

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || sendBtn.disabled) return;

    // First message: switch from empty state to messages view
    if (!chatMessages.classList.contains('visible')) {
        chatEmpty.classList.add('hidden');
        chatMessages.classList.add('visible');
        topbarTitle.textContent = text.length > 42 ? text.slice(0, 42) + '…' : text;
    }

    addMessage('user', text);
    chatInput.value = '';
    chatInput.style.height = 'auto';
    sendBtn.disabled = true;

    addTypingIndicator();

    // Placeholder — real Gemini API call will replace this
    await new Promise(r => setTimeout(r, 1300));
    removeTypingIndicator();
    addMessage('ai', 'A worthy thought. But before I respond — what exactly do you mean by that? Can you give me a concrete example from your own experience?');

    sendBtn.disabled = false;
    chatInput.focus();
}

// ===== NEW DIALOGUE =====

document.getElementById('newDialogueBtn').addEventListener('click', () => {
    chatMessages.innerHTML = '';
    chatMessages.classList.remove('visible');
    chatEmpty.classList.remove('hidden');
    chatInput.value = '';
    chatInput.style.height = 'auto';
    topbarTitle.textContent = 'New dialogue';
    closeSidebar();
});

// ===== SIDEBAR (mobile) =====

document.getElementById('menuBtn').addEventListener('click', toggleSidebar);
document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('visible');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('visible');
}
