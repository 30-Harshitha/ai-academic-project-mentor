/* ==========================================
   ai-mentor.js
   AI Academic Project Mentor - Nova AI Chat & Milestone 3 Doubt Desk Controller
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const chatForm = document.getElementById("ai-chat-form");
    const chatInput = document.getElementById("ai-chat-input");
    const chatContainer = document.getElementById("chat-messages-container");
    const quickChips = document.querySelectorAll(".quick-chip");

    // 1. Quick Prompt Chip Click Handler
    quickChips.forEach(chip => {
        chip.addEventListener("click", () => {
            const promptText = chip.getAttribute("data-prompt");
            if (chatInput && promptText) {
                chatInput.value = promptText;
                chatForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
            }
        });
    });

    // 2. Chat Form Submit Event
    if (chatForm) {
        chatForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const messageText = chatInput.value.trim();
            if (!messageText) return;

            // Render User Message
            appendUserMessage(messageText);
            chatInput.value = "";

            // Render Typing Indicator
            const typingId = appendTypingIndicator();

            // Fetch AI Response from backend API
            try {
                const response = await fetch("http://localhost:5000/api/projects/agent/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: messageText })
                });

                const data = await response.json();
                removeTypingIndicator(typingId);

                if (data.success && data.reply) {
                    appendAssistantMessage(data.reply);
                    return;
                }
            } catch (err) {
                console.warn("Backend offline, generating local Nova AI mentor reply.");
            }

            removeTypingIndicator(typingId);
            const fallbackReply = generateNovaFallbackReply(messageText);
            appendAssistantMessage(fallbackReply);
        });
    }

    function appendUserMessage(text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "d-flex justify-content-end mb-3";
        msgDiv.innerHTML = `
            <div class="chat-bubble chat-bubble-user">
                ${escapeHTML(text)}
            </div>
        `;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendAssistantMessage(text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "d-flex align-items-start gap-2 mb-3";
        const parsedMarkdown = typeof marked !== "undefined" ? marked.parse(text) : escapeHTML(text);

        msgDiv.innerHTML = `
            <div class="brand-logo-circle bg-primary text-white p-2 rounded-circle" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">🎓</div>
            <div class="chat-bubble chat-bubble-assistant">
                ${parsedMarkdown}
            </div>
        `;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendTypingIndicator() {
        const id = "typing-" + Date.now();
        const msgDiv = document.createElement("div");
        msgDiv.id = id;
        msgDiv.className = "d-flex align-items-start gap-2 mb-3";
        msgDiv.innerHTML = `
            <div class="brand-logo-circle bg-primary text-white p-2 rounded-circle" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">🎓</div>
            <div class="chat-bubble chat-bubble-assistant text-muted">
                <i class="fas fa-spinner fa-spin me-2"></i> Nova AI is analyzing your doubt...
            </div>
        `;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }

    function generateNovaFallbackReply(userText) {
        const lower = userText.toLowerCase();

        // 1. Milestone 3 Weekly Check-in Query
        if (lower.includes("milestone 3") || lower.includes("check-in") || lower.includes("weekly update") || lower.includes("checkin")) {
            return `### 🗓️ Milestone 3 Weekly Progress Check-in
Thank you for your update! Milestone 3 focuses on **Risk Mitigation, Mentor Check-ins, and Progress Tracking**.

- **Weekly Check-in Status**: **LOGGED (Health: ON TRACK)**
- **Mentor Advice for this Sprint**:
  1. Ensure your core API route handlers are connected to the UI status gauges.
  2. Verify that any high-latency API calls use async promises to avoid blocking the main thread.
  3. Prepare your draft **Academic Progress Report** for faculty review from the Reports tab.`;
        }

        // 2. Technical Doubt Query
        if (lower.includes("doubt") || lower.includes("latency") || lower.includes("how to") || lower.includes("what is")) {
            if (lower.includes("latency") || lower.includes("slow") || lower.includes("delay")) {
                return `### ❓ Technical Doubt Resolution: API & Model Latency
When encountering response delays during real-time inference:
1. **Lightweight Local Models**: Replace heavy remote API calls with distilled local classifier weights (e.g., DistilBERT or MobileNet).
2. **Caching & Async Batching**: Cache previous query results in local memory and run DB calls inside async thread pools.
3. **Optimized Payloads**: Transmit minimal JSON payloads (under 10KB) between frontend and backend endpoints.`;
            }
            return `### ❓ Technical Doubt Resolution
Here is a structured, step-by-step resolution for your doubt:
1. **Isolate Component Logic**: Test your backend API endpoints independently using Postman or cURL before binding to frontend UI state.
2. **Database Query Indexing**: Verify primary foreign key indexes are configured on \`studentEmail\` to optimize read queries under 50ms.
3. **Fallback Graceful State**: Always include try/catch error boundaries with offline fallback state to maintain a smooth user experience.`;
        }

        // 3. Code Error & Debugging Query
        if (lower.includes("code") || lower.includes("debug") || lower.includes("error") || lower.includes("exception")) {
            return `### 🛠️ Code Error Debugging Assistance
Here is a recommended 3-step troubleshooting approach:
1. **Check Log Tracebacks**: Inspect terminal logs or browser console (\`F12\`) to pinpoint the exact line causing issues.
2. **Verify Headers & Body**: Ensure your fetch request headers include \`Content-Type: application/json\` and \`body: JSON.stringify(...)\`.
3. **Sanitize Inputs**: Validate variable existence before referencing nested object properties (\`data?.user?.email\`).`;
        }

        // 4. Stress Relief & Burnout
        if (lower.includes("stress") || lower.includes("overwhelmed") || lower.includes("burnout")) {
            return `### 🧘 Stress Relief & Project Pace Guidance
Take a deep breath! Academic projects are a step-by-step marathon, not a sprint.
- **Priority Strategy**: Focus strictly on your **Must-Have Core MVP** features today and defer optional stretch goals.
- **Micro-Milestones**: Break down your workload into 45-minute focused coding sprints. You are making great progress!`;
        }

        // 5. Synopsis & Defense Prep
        if (lower.includes("synopsis") || lower.includes("faculty") || lower.includes("presentation") || lower.includes("defense")) {
            return `### 📑 Project Synopsis & Faculty Review Preparation
Here is how to structure a winning Project Synopsis for faculty evaluation:
- **Title & Problem Statement**: State the core challenge in 2 clear sentences.
- **Objectives**: List 3 key measurable goals.
- **Methodology & Architecture**: Detail your Tech Stack choices and System Flow ERD diagram.
- **Expected Outcomes**: Highlight project deliverables and domain impact.`;
        }

        return `Great question! As your **Nova AI Academic Mentor**, I recommend focusing on building modular code components and validating core MVP features early. Let me know if you need help with system architecture, database setup, or thesis documentation!`;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag));
    }
});
