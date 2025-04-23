// components/ui/RichTextEditor.tsx
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with TinyMCE
const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-900/50 border border-gray-700 rounded-md p-4 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder = 'Start writing your post...' }: RichTextEditorProps) => {
  const [editorKey, setEditorKey] = useState(Date.now());
  const [isMounted, setIsMounted] = useState(false);

  // Make sure we're only rendering the editor on the client side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Custom cyberpunk theme for TinyMCE
  const contentStyle = `
    body {
      font-family: 'Inter', sans-serif;
      margin: 16px;
      color: #e2e8f0;
      background-color: #1a202c;
    }
    
    h1, h2, h3, h4, h5, h6 {
      color: #a78bfa;
      margin-top: 1em;
      margin-bottom: 0.5em;
    }
    
    h1 { font-size: 2.25em; }
    h2 { font-size: 1.75em; }
    h3 { font-size: 1.5em; }
    h4 { font-size: 1.25em; }
    
    p {
      margin-bottom: 1em;
      line-height: 1.6;
    }
    
    a {
      color: #ec4899;
      text-decoration: none;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    blockquote {
      border-left: 3px solid #7c3aed;
      margin-left: 1em;
      padding-left: 1em;
      color: #a78bfa;
      font-style: italic;
    }
    
    code {
      font-family: monospace;
      background-color: #2d3748;
      padding: 2px 4px;
      border-radius: 4px;
    }
    
    pre {
      background-color: #2d3748;
      padding: 1em;
      border-radius: 4px;
      overflow-x: auto;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 1em;
    }
    
    th, td {
      border: 1px solid #4a5568;
      padding: 8px;
      text-align: left;
    }
    
    th {
      background-color: #2d3748;
    }
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
    }
    
    hr {
      border: 0;
      height: 1px;
      background-image: linear-gradient(to right, rgba(124, 58, 237, 0.2), rgba(124, 58, 237, 0.6), rgba(124, 58, 237, 0.2));
      margin: 2em 0;
    }
    
    ul, ol {
      margin-left: 1.5em;
      margin-bottom: 1em;
    }
  `;

  if (!isMounted) {
    return (
      <div className="h-96 bg-gray-900/50 border border-gray-700 rounded-md p-4 flex items-center justify-center">
        <div className="animate-pulse w-full h-full bg-gray-800/50 rounded-md"></div>
      </div>
    );
  }

  return (
    <div className="rich-text-editor">
      <Editor
        key={editorKey}
        apiKey="your-tinymce-api-key" // Replace with your actual TinyMCE API key
        init={{
          height: 500,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'codesample'
          ],
          toolbar:
            'undo redo | formatselect | bold italic forecolor backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | codesample | help',
          skin: 'oxide-dark',
          content_css: 'dark',
          content_style: contentStyle,
          placeholder: placeholder,
          branding: false,
          resize: true,
          promotion: false,
          images_upload_handler: (blobInfo: { blob: () => Blob; }, progress: any) => {
            return new Promise((resolve, reject) => {
              // In a real implementation, you would upload to Firebase Storage here
              // For now, we'll create a data URL as a placeholder
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result as string);
              };
              reader.onerror = () => {
                reject('Image upload failed');
              };
              reader.readAsDataURL(blobInfo.blob());
            });
          },
          // Add custom CSS for the editor UI
          setup: (editor: { on: (arg0: string, arg1: () => void) => void; }) => {
            editor.on('init', () => {
              // Apply custom styling to editor UI elements if needed
            });
          }
        }}
        value={value}
        onEditorChange={(content: string) => onChange(content)}
      />
    </div>
  );
};

export default RichTextEditor;