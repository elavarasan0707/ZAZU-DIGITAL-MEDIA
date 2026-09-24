import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  TrendingUp,
  Tag,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { collection, onSnapshot, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { INITIAL_PROJECTS } from '../firebase/seed';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';

export const PortfolioPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Admin Project Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'projects'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Project[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as Project);
          });
          setProjects(list);
        }
      },
      (err) => {
        console.warn('Realtime projects listener note:', err);
      }
    );

    return () => unsub();
  }, []);

  const categories = ['All', 'SEO', 'Social Media', 'PPC & Ads', 'Branding', 'Web Development', 'Strategy'];

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this case study?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
      if (selectedProject?.id === id) setSelectedProject(null);
    } catch (err) {
      console.error('Delete project error:', err);
      handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
    }
  };

  const handleOpenAdd = () => {
    setEditingProject({
      title: '',
      clientName: '',
      category: 'SEO',
      service: 'Search Engine Optimization (SEO)',
      description: '',
      results: '',
      metrics: '',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      tags: ['Growth', 'ROI'],
      featured: false,
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsEditorOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setLoadingAction(true);

    try {
      const payload = {
        title: editingProject.title || 'Untitled Case Study',
        clientName: editingProject.clientName || 'Confidential Client',
        category: editingProject.category || 'SEO',
        service: editingProject.service || 'Growth Marketing',
        description: editingProject.description || '',
        results: editingProject.results || '',
        metrics: editingProject.metrics || '',
        imageUrl: editingProject.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        tags: Array.isArray(editingProject.tags) ? editingProject.tags : ['Growth', 'Strategy'],
        featured: Boolean(editingProject.featured),
        updatedAt: new Date().toISOString(),
      };

      if (editingProject.id) {
        await updateDoc(doc(db, 'projects', editingProject.id), payload);
      } else {
        await addDoc(collection(db, 'projects'), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
      }

      setIsEditorOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.error('Save project error:', err);
      handleFirestoreError(err, editingProject.id ? OperationType.UPDATE : OperationType.CREATE, 'projects');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-left max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#1E56A0] bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
              Agency Projects & Case Studies
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#1E252D] mt-3 tracking-tight">
              Featured Client Projects & Quantifiable Results
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
              Explore our real-world portfolio of high-impact marketing, development, and branding projects engineered for enterprise scale and explosive ROI.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1E56A0] text-white font-bold text-xs sm:text-sm hover:bg-[#164280] shadow-md transition-all whitespace-nowrap self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 ml-1 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#1E56A0] text-white shadow-md'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image showcase */}
                <div className="relative aspect-video overflow-hidden bg-stone-100">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#1E252D]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                    {project.category}
                  </div>

                  {project.featured && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white p-1 rounded-full shadow-md">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-2 font-medium">
                    <span>Client: {project.clientName}</span>
                    <span className="text-[#1E56A0] font-semibold">{project.service}</span>
                  </div>

                  <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D] group-hover:text-[#1E56A0] transition-colors line-clamp-2 leading-snug mb-3">
                    {project.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed mb-4">
                    {project.description}
                  </p>

                  {/* Highlight Metric Badge */}
                  {project.metrics && (
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-100/80 flex items-center gap-2.5 text-xs font-bold text-[#1E56A0]">
                      <TrendingUp className="w-4 h-4 shrink-0" />
                      <span className="line-clamp-1">{project.metrics}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 bg-stone-50/60 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#1E56A0] inline-flex items-center gap-1 group-hover:underline">
                  <span>View Full Case Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>

                {isAdmin && (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleOpenEdit(project, e)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-blue-600 hover:bg-stone-200"
                      title="Edit Case Study"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(project.id, e)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50"
                      title="Delete Case Study"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-3xl bg-[#FAF8F5] border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto text-left">
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800"
              >
                ✕
              </button>

              <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 bg-stone-100">
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-stone-800 shadow-md">
                  {selectedProject.category} • {selectedProject.clientName}
                </div>
              </div>

              <span className="text-xs font-bold text-[#1E56A0] uppercase tracking-wider">
                {selectedProject.service}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-[#1E252D] mt-1 mb-4">
                {selectedProject.title}
              </h2>

              <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs mb-6">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Quantified Performance Metrics
                </p>
                <p className="text-base font-black text-[#1E56A0] font-['Outfit']">
                  {selectedProject.metrics}
                </p>
              </div>

              <div className="space-y-4 text-stone-700 text-sm leading-relaxed mb-6">
                <div>
                  <h4 className="font-bold text-stone-900 mb-1">The Challenge & Strategy</h4>
                  <p>{selectedProject.description}</p>
                </div>

                {selectedProject.results && (
                  <div>
                    <h4 className="font-bold text-stone-900 mb-1">The Result & Impact</h4>
                    <p>{selectedProject.results}</p>
                  </div>
                )}
              </div>

              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-200">
                  <span className="text-xs text-stone-400 font-semibold mr-1">Tags:</span>
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-stone-200/70 text-stone-700 text-xs font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100"
                >
                  Close Case Study
                </button>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    onNavigate('contact');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#1E56A0] text-white font-bold text-xs hover:bg-[#164280] shadow-md"
                >
                  Request Similar Growth Plan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Add/Edit Modal */}
        {isEditorOpen && editingProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
              <h3 className="text-2xl font-bold font-['Outfit'] text-stone-900 mb-4">
                {editingProject.id ? 'Edit Case Study' : 'Add New Case Study'}
              </h3>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={editingProject.clientName || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, clientName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                    <select
                      value={editingProject.category || 'SEO'}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                    >
                      {categories.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Service Label</label>
                  <input
                    type="text"
                    value={editingProject.service || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, service: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Metrics Highlight</label>
                  <input
                    type="text"
                    placeholder="+420% Organic Traffic | 6.8x ROAS"
                    value={editingProject.metrics || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, metrics: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={editingProject.imageUrl || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Description / Strategy</label>
                  <textarea
                    rows={3}
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Business Impact / Results</label>
                  <textarea
                    rows={2}
                    value={editingProject.results || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, results: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
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
                    {loadingAction ? 'Saving...' : 'Save Case Study'}
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
