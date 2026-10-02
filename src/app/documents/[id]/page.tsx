'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';

export default function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const res = await fetch(`/api/documents/${id}`);
        const data = await res.json();
        if (data) {
          setTitle(data.title);
          setContent(data.content);
          setIsShared(data.isShared || false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, isShared }),
    });
    setSaving(false);
  };

  const toggleShare = async () => {
    const updatedShared = !isShared;
    setIsShared(updatedShared);
    await fetch(`/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, isShared: updatedShared }),
    });
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this document?')) {
      await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      router.push('/');
    }
  };

  if (loading) return <p className="p-6">Loading editor...</p>;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <button onClick={() => router.push('/')} className="text-sm text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </button>
        <div className="flex gap-2">
          <button
            onClick={toggleShare}
            className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
              isShared
                ? 'bg-purple-50 text-purple-700 border-purple-300'
                : 'bg-gray-50 text-gray-700 border-gray-300'
            }`}
          >
            {isShared ? 'Shared' : 'Share'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-3xl font-bold p-2 border-b focus:outline-none"
        placeholder="Document Title"
      />

      <Editor content={content} onChange={(newContent) => setContent(newContent)} />
    </main>
  );
}