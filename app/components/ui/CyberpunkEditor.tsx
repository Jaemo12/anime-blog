// components/ui/CyberpunkEditor.tsx
"use client";

import { useState, useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

// Custom toolbar button component with pastel styling
const ToolbarButton = ({ 
  icon, 
  action, 
  isActive = false,
  tooltip
}: { 
  icon: React.ReactNode; 
  action: () => void; 
  isActive?: boolean;
  tooltip: string;
}) => (
  <button
    onClick={action}
    className={`p-2 rounded-lg transition-all duration-200 relative group ${
      isActive 
        ? 'bg-gradient-to-r from-pink-400 to-purple-400 text-white shadow-sm' 
        : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-purple-500'
    }`}
    title={tooltip}
  >
    {icon}
    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-800 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
      {tooltip}
    </span>
  </button>
);

// Custom separator component for toolbar
const Separator = () => (
  <div className="h-6 w-px bg-slate-200 mx-1" />
);

interface CyberpunkEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const CyberpunkEditor = ({ content, onChange, placeholder = 'Start writing your amazing blog post...' }: CyberpunkEditorProps) => {
  const [isMounted, setIsMounted] = useState(false);
  
  // Initialize the editor
  const lowlight = createLowlight(common)
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-pink-500 underline hover:text-pink-600 transition-colors',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full border border-slate-200',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'border-b border-slate-200',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-slate-200 p-2',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'bg-slate-50 font-bold border border-slate-200 p-2',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-slate-800 text-white rounded-md p-4 font-mono text-sm my-4 overflow-x-auto',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none p-4 min-h-[300px] text-slate-700',
        placeholder,
      },
    },
  });

  // Set up editor with initial content when mounted
  useEffect(() => {
    setIsMounted(true);
    
    return () => {
      editor?.destroy();
    };
  }, []);

  // Ensure editor only runs on client side
  if (!isMounted) {
    return (
      <div className="border border-slate-200 rounded-lg bg-white min-h-[300px] animate-pulse">
        <div className="h-12 bg-slate-50 rounded-t-lg"></div>
        <div className="p-4 h-[290px]"></div>
      </div>
    );
  }

  // Handle image upload
  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Handle link insertion
  const setLink = () => {
    if (!editor) return;
    
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl);
    
    // cancelled
    if (url === null) return;
    
    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Insert table
  const insertTable = () => {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm">
      {/* Editor toolbar */}
      <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap items-center gap-1">
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path></svg>} 
          action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          tooltip="Heading 1"
        />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path></svg>} 
          action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          tooltip="Heading 2"
        />
        <Separator />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M4 6h16"></path><path d="M4 12h16"></path><path d="M4 18h16"></path></svg>} 
          action={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          tooltip="Paragraph"
        />
        <Separator />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M15 7H3"></path><path d="M15 11H3"></path><path d="M15 15H3"></path><path d="M19 7l-4 10"></path></svg>} 
          action={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          tooltip="Bold"
        />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M10 4H8.5a2.5 2.5 0 0 0 0 5H10"></path><path d="M8.5 9H10v5"></path><path d="M16 4h-4v10"></path><path d="M16 14h-4"></path></svg>} 
          action={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          tooltip="Italic"
        />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M6 18h12"></path><path d="M6 14h12"></path><path d="M6 10h12"></path><path d="M6 6h12"></path></svg>} 
          action={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          tooltip="Strike"
        />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>} 
          action={setLink}
          isActive={editor.isActive('link')}
          tooltip="Link"
        />
        <Separator />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path></svg>} 
          action={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          tooltip="Bullet List"
        />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M10 6h11"></path><path d="M10 12h11"></path><path d="M10 18h11"></path><path d="M4 6h1"></path><path d="M4 18h1"></path><path d="M3 12h2"></path></svg>} 
          action={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          tooltip="Ordered List"
        />
        <Separator />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M8 21H16"></path><path d="M12 21V3"></path><path d="m17 8-5-5-5 5"></path></svg>} 
          action={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          tooltip="Align Left"
        />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M21 6H3"></path><path d="M17 12H7"></path><path d="M19 18H5"></path></svg>} 
          action={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          tooltip="Align Center"
        />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M21 6H3"></path><path d="M21 12H7"></path><path d="M21 18H5"></path></svg>} 
          action={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          tooltip="Align Right"
        />
        <Separator />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"></path><path d="m3 8 9 6 9-6"></path></svg>} 
          action={addImage}
          isActive={false}
          tooltip="Insert Image"
        />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M3 3h18v18H3z"></path></svg>} 
          action={insertTable}
          isActive={editor.isActive('table')}
          tooltip="Insert Table"
        />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M17 13v-3a4 4 0 0 0-4-4H7V3"></path><path d="m7 3-4 4 4 4"></path><path d="M7 21v-3a4 4 0 0 1 4-4h6v-3"></path><path d="m17 11 4 4-4 4"></path></svg>} 
          action={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          tooltip="Code Block"
        />
        <Separator />
        <ToolbarButton 
          icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M21 12H3"></path></svg>} 
          action={() => editor.chain().focus().setHorizontalRule().run()}
          isActive={false}
          tooltip="Horizontal Rule"
        />
        <div className="ml-auto">
          <ToolbarButton 
            icon={<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M3 12h18"></path><path d="M3 6h18"></path><path d="M3 18h18"></path></svg>} 
            action={() => editor.chain().focus().clearNodes().run()}
            isActive={false}
            tooltip="Clear Formatting"
          />
        </div>
      </div>

      {/* Bubble menu that appears when text is selected */}
      {editor && (
        <BubbleMenu 
          className="bg-white border border-pink-200 rounded-lg shadow-lg overflow-hidden flex"
          tippyOptions={{ duration: 150 }}
          editor={editor}
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 transition-colors ${editor.isActive('bold') ? 'bg-pink-400 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-pink-500'}`}
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M15 7H3"></path><path d="M15 11H3"></path><path d="M15 15H3"></path><path d="M19 7l-4 10"></path></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 transition-colors ${editor.isActive('italic') ? 'bg-pink-400 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-pink-500'}`}
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M10 4H8.5a2.5 2.5 0 0 0 0 5H10"></path><path d="M8.5 9H10v5"></path><path d="M16 4h-4v10"></path><path d="M16 14h-4"></path></svg>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 transition-colors ${editor.isActive('strike') ? 'bg-pink-400 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-pink-500'}`}
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M6 18h12"></path><path d="M6 14h12"></path><path d="M6 10h12"></path><path d="M6 6h12"></path></svg>
          </button>
          <button
            onClick={setLink}
            className={`p-2 transition-colors ${editor.isActive('link') ? 'bg-pink-400 text-white' : 'text-slate-600 hover:bg-slate-50 hover:text-pink-500'}`}
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
          </button>
        </BubbleMenu>
      )}

      {/* Floating menu that appears when editor is empty */}
      {editor && (
        <FloatingMenu
          className="bg-white border border-purple-200 rounded-lg shadow-lg p-1 flex flex-col gap-1"
          tippyOptions={{ duration: 150 }}
          editor={editor}
        >
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="p-2 text-sm text-left flex items-center gap-2 rounded hover:bg-slate-50 transition-colors text-slate-600 hover:text-purple-500"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path></svg>
            <span>Heading 1</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="p-2 text-sm text-left flex items-center gap-2 rounded hover:bg-slate-50 transition-colors text-slate-600 hover:text-purple-500"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M4 7V4h16v3"></path><path d="M9 20h6"></path><path d="M12 4v16"></path></svg>
            <span>Heading 2</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="p-2 text-sm text-left flex items-center gap-2 rounded hover:bg-slate-50 transition-colors text-slate-600 hover:text-purple-500"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path></svg>
            <span>Bullet List</span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className="p-2 text-sm text-left flex items-center gap-2 rounded hover:bg-slate-50 transition-colors text-slate-600 hover:text-purple-500"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em"><path d="M17 13v-3a4 4 0 0 0-4-4H7V3"></path><path d="m7 3-4 4 4 4"></path><path d="M7 21v-3a4 4 0 0 1 4-4h6v-3"></path><path d="m17 11 4 4-4 4"></path></svg>
            <span>Code Block</span>
          </button>
        </FloatingMenu>
      )}

      {/* Main editor content */}
      <div className="relative min-h-[300px] bg-white">
        <div className="absolute inset-0 pointer-events-none" style={{ 
          backgroundImage: 'linear-gradient(45deg, rgba(249, 250, 251, 0.5) 25%, transparent 25%, transparent 50%, rgba(249, 250, 251, 0.5) 50%, rgba(249, 250, 251, 0.5) 75%, transparent 75%, transparent)',
          backgroundSize: '20px 20px',
          opacity: 0.5,
          zIndex: -1
        }}></div>
        
        <EditorContent editor={editor} className="w-full" />
      </div>
    </div>
  );
};

export default CyberpunkEditor;