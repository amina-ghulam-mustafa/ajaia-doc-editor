'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Document {
  id: string;
  title: string;
  content: string;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState<'owned' | 'shared'>('owned');
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error('Failed to fetch documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreateNew = async () => {
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Document', content: '' }),
      });
      if (res.ok) {
        const newDoc = await res.json();
        router.push(`/documents/${newDoc.id}`);
      }
    } catch (err) {
      console.error('Failed to create document', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const title = file.name.replace(/\.[^/.]+$/, '');
    const reader = new FileReader();

    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const formattedContent = `<p>${content.replace(/\n/g, '<br/>')}</p>`;

      try {
        const res = await fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content: formattedContent }),
        });
        if (res.ok) {
          const newDoc = await res.json();
          router.push(`/documents/${newDoc.id}`);
        }
      } catch (err) {
        console.error('Failed to import file', err);
      }
    };

    reader.readAsText(file);
  };

  const filteredDocs = documents.filter((doc) =>
    activeTab === 'shared' ? doc.isShared : !doc.isShared
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">
            A
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Ajaia Document Editor
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <label className="cursor-pointer border border-slate-300 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
            Upload (.txt, .md)
            <input
              type="file"
              accept=".txt,.md"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
          >
            + New Document
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto p-6">
        {/* Navigation Tabs */}
        <div className="bg-slate-200/70 p-1 rounded-xl inline-flex gap-1 mb-6">
          <button
            onClick={() => setActiveTab('owned')}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'owned'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Documents
          </button>
          <button
            onClick={() => setActiveTab('shared')}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'shared'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shared with Me
          </button>
        </div>

        {/* Document Cards Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-500">Loading documents...</div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-xl p-8 text-slate-500">
            No documents found in this view.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => router.push(`/documents/${doc.id}`)}
                className="group cursor-pointer bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-500 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-36"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 truncate transition-colors">
                      {doc.title || 'Untitled Document'}
                    </h3>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        doc.isShared
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {doc.isShared ? 'Shared' : 'Owned'}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 flex items-center justify-between pt-3 border-t border-slate-100">
                  <span>Owner: {doc.isShared ? 'Shared User' : 'You'}</span>
                  <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}