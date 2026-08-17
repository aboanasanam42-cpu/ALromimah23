import React, { useState } from 'react';
import { Opportunity, Language, ProposalTemplate } from '../types';
import { Sparkles, Copy, Check, X, Send, DollarSign, Clock, HelpCircle, FileText } from 'lucide-react';

interface ProposalModalProps {
  opportunity: Opportunity;
  language: Language;
  onClose: () => void;
  onSubmitApplication: (oppId: string, customPrice: number) => void;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  opportunity,
  language,
  onClose,
  onSubmitApplication,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [proposedPrice, setProposedPrice] = useState<number>(opportunity.reward ?? opportunity.rawPayoutUSD);
  const [deliveryDays, setDeliveryDays] = useState<number>(opportunity.executionDurationDays || 3);
  const [coverLetter, setCoverLetter] = useState<string>(
    `مرحباً ${opportunity.company || 'عزيزي العميل'}،\n\nأتقدم إليكم بعرض لتنفيذ مشروع "${opportunity.title}" باحترافية عالية وتسليم في الموعد المحدد. أمتلك خبرة عملية مثبتة في مهارات: ${opportunity.requiredSkills.join('، ')}.\n\nسأضمن لكم مخرجات عالية الجودة مع إمكانية التعديل والمراجعة حتى الرضا التام.\n\nبانتظار تواصلكم للبدء الفوري.`
  );

  const handleGenerateAIProposal = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/proposal/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityTitle: opportunity.title,
          category: opportunity.category,
          client: opportunity.company,
          reward: proposedPrice,
          description: opportunity.description,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.proposal?.coverLetter) {
          setCoverLetter(data.proposal.coverLetter);
          if (data.proposal.proposedPrice) setProposedPrice(data.proposal.proposedPrice);
          if (data.proposal.deliveryDays) setDeliveryDays(data.proposal.deliveryDays);
        }
      }
    } catch (e) {
      console.warn('AI Proposal generation fallback used');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#120e2e] border border-purple-500/30 text-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-fadeIn max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-purple-500/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[11px] font-bold">
                {opportunity.category}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
                تطابق {opportunity.matchScore || opportunity.score || 94}%
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-1.5">
              تجهيز وتقديم عرض للعمل: {opportunity.title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              العميل: <strong className="text-slate-200">{opportunity.company}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-purple-950/40 border border-purple-800/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Quick Generator Button */}
        <div className="flex items-center justify-between bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-3.5 rounded-2xl border border-purple-500/30">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <div className="text-xs font-extrabold text-white">توليد العرض بالذكاء الاصطناعي (Gemini)</div>
              <div className="text-[11px] text-purple-200">يكتب عرضاً احترافياً ومقنعاً مخصصاً لهذا العمل</div>
            </div>
          </div>
          <button
            onClick={handleGenerateAIProposal}
            disabled={isGenerating}
            className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'جاري التوليد...' : 'توليد ذكي'}</span>
          </button>
        </div>

        {/* Price & Duration Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#1b1542] p-3 rounded-2xl border border-purple-500/20 space-y-1">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>السعر المقترح (USD)</span>
            </label>
            <input
              type="number"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(Number(e.target.value))}
              className="w-full bg-[#120d2c] border border-purple-500/30 rounded-xl px-3 py-1.5 text-sm font-extrabold text-emerald-400 focus:outline-none focus:border-purple-400"
            />
          </div>

          <div className="bg-[#1b1542] p-3 rounded-2xl border border-purple-500/20 space-y-1">
            <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>مدة التسليم (أيام)</span>
            </label>
            <input
              type="number"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(Number(e.target.value))}
              className="w-full bg-[#120d2c] border border-purple-500/30 rounded-xl px-3 py-1.5 text-sm font-extrabold text-sky-400 focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Cover Letter Text Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-400" />
              <span>نص العرض التقديمي (Cover Letter)</span>
            </label>
            <button
              onClick={handleCopy}
              className="text-[11px] text-purple-300 hover:text-white flex items-center gap-1 px-2 py-0.5 bg-purple-900/40 rounded-lg border border-purple-500/20"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ النص'}</span>
            </button>
          </div>
          <textarea
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            rows={6}
            className="w-full bg-[#161239] border border-purple-500/30 rounded-2xl p-3.5 text-xs text-slate-100 leading-relaxed focus:outline-none focus:border-purple-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-purple-500/20">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all"
          >
            إلغاء
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 bg-[#1f194e] hover:bg-[#292265] text-purple-200 text-xs font-bold rounded-xl border border-purple-500/30 flex items-center gap-1.5 transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>نسخ للتقديم الخارجي</span>
            </button>
            <button
              onClick={() => {
                onSubmitApplication(opportunity.id, proposedPrice);
                onClose();
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-900/40 flex items-center gap-1.5 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>تقديم وقبول العمل فوراً</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
