import React, { useState, useEffect } from 'react';
import { Clock, User, Plus, Edit2, Trash2, ArrowRight, BookOpen, Tag } from 'lucide-react';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { INITIAL_BLOGS } from '../firebase/seed';
import { BlogPost } from '../types';
import { useAuth } from '../context/AuthContext';

export const BlogPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { isAdmin } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Partial<BlogPost> | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'blogPosts'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: BlogPost[] = [];
          snapshot.forEach((d) => {
            list.push({ id: d.id, ...d.data() } as BlogPost);
          });
          setBlogs(list);
        }
      },
      (err) => {
        console.warn('Realtime blogs note:', err);
      }
    );
    return () => unsub();
  }, []);

  const handleOpenAdd = () => {
    setEditingPost({
      title: '',
      slug: 'new-growth-insights',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
      authorName: 'ZaZu Strategy Lab',
      authorRole: 'Senior Marketing Director',
      category: 'SEO & Performance',
      readTime: '5 min read',
      published: true,
      publishedAt: new Date().toISOString().split('T')[0],
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPost(post);
    setIsEditorOpen(true);
  };

  const handleDeletePost = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      await deleteDoc(doc(db, 'blogPosts', id));
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      if (selectedPost?.id === id) setSelectedPost(null);
    } catch (err) {
      console.error('Delete blog error:', err);
      handleFirestoreError(err, OperationType.DELETE, `blogPosts/${id}`);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;
    setLoadingAction(true);

    try {
      const payload = {
        title: editingPost.title || 'Untitled Post',
        slug:
          editingPost.slug ||
          (editingPost.title || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: editingPost.excerpt || '',
        content: editingPost.content || '',
        coverImage: editingPost.coverImage || 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
        authorName: editingPost.authorName || 'ZaZu Team',
        authorRole: editingPost.authorRole || 'Digital Specialist',
        category: editingPost.category || 'Digital Strategy',
        readTime: editingPost.readTime || '4 min read',
        published: Boolean(editingPost.published),
        publishedAt: editingPost.publishedAt || new Date().toISOString().split('T')[0],
      };

      if (editingPost.id) {
        await updateDoc(doc(db, 'blogPosts', editingPost.id), payload);
      } else {
        await addDoc(collection(db, 'blogPosts'), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
      }
      setIsEditorOpen(false);
      setEditingPost(null);
    } catch (err) {
      console.error('Save blog error:', err);
      handleFirestoreError(err, editingPost.id ? OperationType.UPDATE : OperationType.CREATE, 'blogPosts');
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
              Agency Perspectives & Case Intel
            </span>
            <h1 className="text-3xl sm:text-5xl font-black font-['Outfit'] text-[#1E252D] mt-3 tracking-tight">
              Marketing Playbooks & Industry Insights
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-3 leading-relaxed">
              Actionable guides, algorithmic breakdown reports, and data-backed tactics curated by
              ZaZu's media directors.
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1E56A0] text-white font-bold text-xs sm:text-sm hover:bg-[#164280] shadow-md transition-all whitespace-nowrap self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Blog Post</span>
            </button>
          )}
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {blogs.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-stone-100">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#1E252D]/85 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-white uppercase tracking-wider">
                    {post.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#1E56A0]" />
                      <span>{post.readTime}</span>
                    </span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <h3 className="text-xl font-bold font-['Outfit'] text-[#1E252D] group-hover:text-[#1E56A0] transition-colors line-clamp-2 leading-snug mb-3">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 bg-stone-50/60 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-[#1E56A0] flex items-center justify-center font-bold text-[10px]">
                    {post.authorName?.charAt(0) || 'Z'}
                  </div>
                  <span className="text-xs text-stone-700 font-semibold truncate max-w-[120px]">
                    {post.authorName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#1E56A0] flex items-center gap-1 group-hover:underline">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>

                  {isAdmin && (
                    <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleOpenEdit(post, e)}
                        className="p-1 rounded-md text-stone-400 hover:text-blue-600"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeletePost(post.id, e)}
                        className="p-1 rounded-md text-stone-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Article Full Reader Modal */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-3xl bg-[#FAF8F5] border border-stone-200 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto text-left">
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800"
              >
                ✕
              </button>

              <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-stone-100">
                <img
                  src={selectedPost.coverImage}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-3 text-xs text-stone-500 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-blue-100 text-[#1E56A0] font-bold">
                  {selectedPost.category}
                </span>
                <span>•</span>
                <span>{selectedPost.publishedAt}</span>
                <span>•</span>
                <span>{selectedPost.readTime}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-['Outfit'] text-[#1E252D] leading-tight mb-4">
                {selectedPost.title}
              </h1>

              <div className="flex items-center gap-3 py-3 border-y border-stone-200 mb-6">
                <div className="w-9 h-9 rounded-full bg-[#1E56A0] text-white flex items-center justify-center font-bold text-xs">
                  {selectedPost.authorName?.charAt(0) || 'Z'}
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-900">{selectedPost.authorName}</p>
                  <p className="text-[11px] text-stone-500">{selectedPost.authorRole}</p>
                </div>
              </div>

              <div className="prose prose-stone max-w-none text-stone-700 text-sm leading-relaxed space-y-4 whitespace-pre-line">
                {selectedPost.content}
              </div>

              <div className="mt-10 pt-6 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100"
                >
                  Close Article
                </button>
                <button
                  onClick={() => {
                    setSelectedPost(null);
                    onNavigate('contact');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#1E56A0] text-white font-bold text-xs hover:bg-[#164280]"
                >
                  Discuss Implementing This Strategy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Post Editor Modal */}
        {isEditorOpen && editingPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-[#FAF8F5] border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto text-left">
              <h3 className="text-2xl font-bold font-['Outfit'] text-stone-900 mb-4">
                {editingPost.id ? 'Edit Article' : 'Create Article'}
              </h3>

              <form onSubmit={handleSavePost} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={editingPost.title || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Category</label>
                    <input
                      type="text"
                      value={editingPost.category || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Read Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 6 min read"
                      value={editingPost.readTime || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Author Name</label>
                    <input
                      type="text"
                      value={editingPost.authorName || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, authorName: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      value={editingPost.coverImage || ''}
                      onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                      className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Short Excerpt *</label>
                  <textarea
                    rows={2}
                    required
                    value={editingPost.excerpt || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Article Body *</label>
                  <textarea
                    rows={6}
                    required
                    value={editingPost.content || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-sm font-mono text-xs"
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
                    {loadingAction ? 'Publishing...' : 'Publish Article'}
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
