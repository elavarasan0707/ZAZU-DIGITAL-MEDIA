import React, { useState, useEffect } from 'react';
import { Check, Sparkles, Plus, Edit2, Trash2, ArrowRight } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { INITIAL_PRICING } from '../firebase/seed';
import { PricingPlan } from '../types';
import { useAuth } from '../context/AuthContext';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const PricingPage: React.FC<{
  onSelectPlan: (planName: string) => void;
  onNavigate: (page: string) => void;
}> = ({ onSelectPlan, onNavigate }) => {
  const { isAdmin } = useAuth();
  const [plans, setPlans] = useState<PricingPlan[]>(INITIAL_PRICING);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<PricingPlan> | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'pricing'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PricingPlan[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as PricingPlan);
          });
          list.sort((a, b) => (a.order || 0) - (b.order || 0));
          setPlans(list);
        }
      },
      (err) => {
        console.warn('Realtime pricing note:', err);
      }
    );
    return () => unsub();
  }, []);

  const handleOpenAdd = () => {
    setEditingPlan({
      name: '',
      planType: '',
      price: '$1,999',
      billingPeriod: '/month',
      description: '',
      features: ['SEO Audit', 'Social Media', 'Ad Campaign Management'],
      popular: false,
      isCustom: false,
      order: plans.length + 1,
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (plan: PricingPlan, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPlan(plan);
    setIsEditorOpen(true);
  };

  const handleDeletePlan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this pricing package?')) return;
    try {
      await deleteDoc(doc(db, 'pricing', id));
      setPlans((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Delete pricing error:', err);
      handleFirestoreError(err, OperationType.DELETE, `pricing/${id}`);
    }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    setLoadingAction(true);

    try {
      const payload = {
        name: editingPlan.name || 'Custom Plan',
        planType: editingPlan.planType || 'Growth Tier',
        price: editingPlan.price || '$1,500',
        billingPeriod: editingPlan.billingPeriod || '/month',
        description: editingPlan.description || '',
        features: Array.isArray(editingPlan.features) ? editingPlan.features : [],
        popular: Boolean(editingPlan.popular),
        isCustom: Boolean(editingPlan.isCustom),
        order: Number(editingPlan.order || 1),
      };

      if (editingPlan.id) {
        await updateDoc(doc(db, 'pricing', editingPlan.id), payload);
      } else {
        await addDoc(collection(db, 'pricing'), payload);
      }
      setIsEditorOpen(false);
      setEditingPlan(null);
    } catch (err) {
      console.error('Save pricing error:', err);
      handleFirestoreError(err, editingPlan.id ? OperationType.UPDATE : OperationType.CREATE, 'pricing');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-left max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              Clear Value & High Return
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#1E252D] mt-3 tracking-tight">
              Transparent Growth Retainers
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
              No hidden agency fees or surprise markups. Every tier includes dedicated strategists,
              weekly execution sprints, and real-time ROI tracking.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1E56A0] text-white font-bold text-xs sm:text-sm hover:bg-[#164280] shadow-md transition-all whitespace-nowrap self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Pricing Plan</span>
            </button>
          )}
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left items-stretch">
          {plans.map((plan) => {
            const isHighlight = plan.popular;
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isHighlight
                    ? 'bg-white border-2 border-[#1E56A0] shadow-2xl shadow-blue-900/10 scale-100 lg:-translate-y-2'
                    : 'bg-white border border-stone-200/90 shadow-sm hover:shadow-xl'
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#1E56A0] text-white text-[11px] uppercase tracking-wider font-extrabold px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Most Popular Growth Retainer</span>
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-black font-['Outfit'] text-[#1E252D]">
                        {plan.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#1E56A0] mt-1">
                        {plan.planType}
                      </p>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleOpenEdit(plan, e)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-blue-600 hover:bg-stone-100"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeletePlan(plan.id, e)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-stone-600 mt-4 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="my-6 py-4 border-y border-stone-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black font-['Outfit'] text-[#1E252D]">
                        {plan.price}
                      </span>
                      <span className="text-stone-500 text-xs font-semibold">
                        {plan.billingPeriod}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                      Included In This Plan:
                    </p>
                    {plan.features?.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700">
                        <div className="w-4 h-4 rounded-full bg-blue-50 text-[#1E56A0] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <button
                    onClick={() => onSelectPlan(plan.name)}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm flex items-center justify-center gap-2 ${
                      isHighlight
                        ? 'bg-[#1E56A0] hover:bg-[#164280] text-white shadow-md'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    <span>Choose {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <WhatsAppButton
                    variant="button"
                    className="w-full py-2.5 rounded-xl text-xs"
                    label="Discuss On WhatsApp"
                    message={`Hi ZaZu Digital Media, I want to discuss the ${plan.name} pricing tier.`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Guarantee */}
        <div className="mt-16 p-8 rounded-3xl bg-white border border-stone-200 text-center max-w-3xl mx-auto shadow-sm">
          <h4 className="text-lg font-bold font-['Outfit'] text-stone-900 mb-2">
            Need a Custom Enterprise Allocation?
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 mb-4 leading-relaxed">
            For conglomerates, multi-location franchises, or ad budgets exceeding $50k/month, we
            construct custom dedicated growth teams with performance-based milestones.
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-2.5 bg-[#1E56A0] hover:bg-[#164280] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Request Custom Enterprise Proposal
          </button>
        </div>

        {/* Admin Plan Modal */}
        {isEditorOpen && editingPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
              <h3 className="text-2xl font-bold font-['Outfit'] text-stone-900 mb-4">
                {editingPlan.id ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
              </h3>

              <form onSubmit={handleSavePlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Plan Name *</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.name || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Price *</label>
                    <input
                      type="text"
                      required
                      value={editingPlan.price || ''}
                      onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Billing Period</label>
                    <input
                      type="text"
                      value={editingPlan.billingPeriod || '/month'}
                      onChange={(e) => setEditingPlan({ ...editingPlan, billingPeriod: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Target Audience / Subtitle</label>
                  <input
                    type="text"
                    value={editingPlan.planType || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, planType: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingPlan.description || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Features (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={editingPlan.features?.join('\n') || ''}
                    onChange={(e) =>
                      setEditingPlan({
                        ...editingPlan,
                        features: e.target.value.split('\n').filter((f) => f.trim().length > 0),
                      })
                    }
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div className="flex items-center gap-4 py-2">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingPlan.popular)}
                      onChange={(e) => setEditingPlan({ ...editingPlan, popular: e.target.checked })}
                      className="rounded text-[#1E56A0]"
                    />
                    <span>Mark as Highlighted / Most Popular</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-bold text-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loadingAction}
                    className="px-6 py-2 bg-[#1E56A0] text-white font-bold rounded-xl text-xs shadow-md disabled:opacity-50"
                  >
                    {loadingAction ? 'Saving...' : 'Save Pricing Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
