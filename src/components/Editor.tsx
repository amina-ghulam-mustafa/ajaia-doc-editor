'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
} from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function Editor({ content, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Underline,
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Toolbar */}
      <div className="bg-gray-50 p-2 border-b border-gray-200 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('bold') ? 'bg-gray-200 font-bold text-blue-600' : 'text-gray-700'
          }`}
          title="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('italic') ? 'bg-gray-200 font-bold text-blue-600' : 'text-gray-700'
          }`}
          title="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('underline') ? 'bg-gray-200 font-bold text-blue-600' : 'text-gray-700'
          }`}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </button>
        <div className="w-[1px] h-6 bg-gray-300 my-auto mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 font-bold text-blue-600' : 'text-gray-700'
          }`}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 font-bold text-blue-600' : 'text-gray-700'
          }`}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </button>
        <div className="w-[1px] h-6 bg-gray-300 my-auto mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('bulletList') ? 'bg-gray-200 font-bold text-blue-600' : 'text-gray-700'
          }`}
          title="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-200 transition ${
            editor.isActive('orderedList') ? 'bg-gray-200 font-bold text-blue-600' : 'text-gray-700'
          }`}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </button>
      </div>

      {/* Content Editor area */}
      <div className="p-4 min-h-[300px] cursor-text [&_.ProseMirror]:outline-none [&_.ProseMirror]:border-none [&_.ProseMirror]:min-h-[260px] [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}