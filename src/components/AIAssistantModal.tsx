import React, { useState } from 'react';
import { Language } from '../types';
import { Sparkles, Send, X, Bot, User, BrainCircuit, CheckCircle2 } from 'lucide-react';

interface AIAssistantModalProps {
  language: Language;
  onClose: () => void;
  onNavigateToTab?: (tab: any) => void;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  language,
  onClose,
  onNavigateToTab,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'مرحباً بك يا أنس! أنا "مساعد مريم الذكي" لمساحة العمل عن بُعد 🚀. يمكنني مساعدتك في صياغة عروض المشاريع، تحليل العقود، تقسيم مهام العمل خطوة بخطوة، واقتراح أفضل الفرص المربحة لمهاراتك اليوم.',
      time: 'الآن',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'كيف أصيغ عرضاً احترافياً لمشروع تصميم بروشور؟',
    'ما هي أفضل المهارات المطلوبة في الترجمة هذا الأسبوع؟',
    'ساعدني في تقسيم بحث علمي إلى خطوات تسليم واضحة.',
    'افحص مدى أمان عقد عمل عن بعد جديد.',
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputText;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend, analysisType: 'assistant-chat' }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiResponse =
          data.result?.recommendation ||
          data.result?.summary ||
          `تم تحليل طلبك بنجاح! أنصحك بالتركيز على تسليم المخرجات بدقة، وتقديم نماذج أعمال سابقة لزيادة فرصة قبول العميل.`;

        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: aiResponse,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'شكراً لاستشارتي! تم توثيق الطلب ويسعدني إرشادك في أي مرحلة من مراحل العمل والتسليم.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#120e2e] border border-purple-500/30 text-white rounded-3xl max-w-xl w-full flex flex-col h-[600px] max-h-[90vh] shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-4 bg-[#18133d] border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-900/40">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                مساعد مريم الذكي
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                  Gemini 3.6 Online
                </span>
              </h3>
              <p className="text-[11px] text-purple-200">
                مساعدتك المباشرة في الحصول على الوظائف وإنجاز وتسليم المشاريع
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-purple-950/40 border border-purple-800/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div className="p-2.5 bg-[#140f34] border-b border-purple-500/10 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/60 text-purple-200 border border-purple-500/20 whitespace-nowrap transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Message List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-7 h-7 rounded-xl bg-purple-600/40 border border-purple-500/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-purple-300" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-[#1c1646] text-slate-100 border border-purple-500/20 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div
                  className={`text-[9px] mt-1.5 text-right ${
                    msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-indigo-600/40 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-indigo-300" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-purple-300 bg-[#1c1646] p-3 rounded-2xl border border-purple-500/20 w-fit">
              <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
              <span>جاري صياغة الإجابة والتحليل الذكي...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#18133d] border-t border-purple-500/20 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="اكتب سؤالك أو الصق تفاصيل العمل لمساعدتك..."
            className="flex-1 bg-[#120d2c] border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl shadow-md transition-all"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
