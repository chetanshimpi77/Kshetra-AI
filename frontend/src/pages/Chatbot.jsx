import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import api from "../api/app";
import { Card, CardBody } from "../components/Card";

const suggestions = [
  "Which fields need irrigation today?",
  "Show me yield forecast for Cotton",
  "What's the weather impact this week?",
  "Summarize moisture stress alerts",
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello Rajesh! I'm your AI Farm Assistant. Ask me about crop health, irrigation, yield forecasts or alerts." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput("");
    setMessages(m => [...m, { role: "user", content: msg }]);
    setLoading(true);
    const res = await api.sendChatMessage({ message: msg });
    setMessages(m => [...m, { role: "assistant", content: res.reply }]);
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-success grid place-items-center text-white">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl">AI Farm Assistant</h2>
          <p className="text-sm text-muted-foreground">Ask questions about your fields, crops and operations</p>
        </div>
      </div>

      <Card>
        <CardBody className="pt-5 flex flex-col h-[65vh]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-9 h-9 shrink-0 rounded-full grid place-items-center ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-success/15 text-success"}`}>
                  {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-success/15 text-success grid place-items-center"><Bot className="w-4 h-4" /></div>
                <div className="bg-muted px-4 py-3 rounded-2xl flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:.15s]" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:.3s]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length < 3 && (
            <div className="flex gap-2 flex-wrap mt-4">
              {suggestions.map(s => (
                <button key={s} onClick={() => send(s)} className="px-3 py-1.5 text-xs border border-border rounded-full hover:bg-muted">
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mt-4 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about your farm..."
              className="flex-1 px-4 py-2.5 border border-border rounded-xl bg-background text-sm" />
            <button type="submit" disabled={loading} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-60">
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
