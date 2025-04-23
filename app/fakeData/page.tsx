'use client';
import React, { useState, useEffect } from 'react';
import { createPost } from '@/app/lib/blogServices';
import { motion, AnimatePresence } from 'framer-motion';

// Define anime-related categories
const ANIME_CATEGORIES = [
  'action', 'adventure', 'comedy', 'drama', 'fantasy', 'horror', 'mecha',
  'music', 'mystery', 'psychological', 'romance', 'sci-fi', 'slice-of-life',
  'sports', 'studio-ghibli', 'seinen', 'shonen', 'shojo', 'isekai',
  'cyberpunk', 'akira', 'ghost-in-the-shell', 'miyazaki', 'film-analysis',
  'animation', 'neo-tokyo', 'visual-analysis', 'fight-scenes', 'soundtracks'
];

// Define anime-related blog titles
const BLOG_TITLES = [
  "The Evolution of Mecha Anime: From Gundam to Darling in the Franxx",
  "Why Spirited Away Remains Studio Ghibli's Masterpiece",
  "Exploring the Psychological Depth of Neon Genesis Evangelion",
  "Breaking Down the Animation Techniques in Demon Slayer",
  "The Cultural Impact of Akira on Western Animation",
  "How One Piece Redefined the Shonen Genre",
  "The Philosophy Behind Ghost in the Shell",
  "Comparing Manga and Anime Adaptations: Attack on Titan",
  "The Rise of Isekai: Why Transported-to-Another-World Stories Dominate Anime",
  "Analyzing the Soundtrack of Cowboy Bebop",
  "The Visual Storytelling in Violet Evergarden",
  "How Hayao Miyazaki's Films Address Environmentalism",
  "The Revolutionary Fight Choreography in Jujutsu Kaisen",
  "Understanding the Appeal of Slice-of-Life Anime",
  "The Impact of Your Name on Modern Anime Cinema",
  "Exploring Character Development in Fullmetal Alchemist: Brotherhood",
  "The Artistic Evolution of Studio Trigger",
  "Why Hunter x Hunter's Chimera Ant Arc Changed Shonen Forever",
  "The Cyberpunk Elements in Serial Experiments Lain",
  "How Anime Portrays Mental Health: A Look at March Comes in Like a Lion"
];

// Define authors
const AUTHORS = [
  { name: "Miyazaki Hayato", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { name: "Rei Ayanami", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { name: "Spike Spiegel", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { name: "Motoko Kusanagi", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" },
  { name: "Satoshi Kon", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" }
];

// Define anime-related content generators
const generateExcerpt = () => {
  const excerpts = [
    "An in-depth analysis of the visual storytelling techniques used in modern anime and how they've evolved over the decades.",
    "Exploring the thematic elements that make this series resonate with audiences worldwide and its cultural significance.",
    "A deep dive into the character development, animation quality, and narrative structure that sets this anime apart.",
    "Examining how this groundbreaking work continues to influence the industry and captivate fans years after its release.",
    "Analyzing the unique artistic vision and storytelling approach that revolutionized the anime landscape.",
    "Breaking down the philosophical concepts and existential questions posed by this thought-provoking series.",
    "A comprehensive look at how traditional Japanese aesthetics blend with modern animation techniques in this acclaimed work.",
    "Investigating the cultural impact and global reception of this iconic anime that transcended cultural boundaries.",
    "Examining the technical innovations and creative decisions that made this work a landmark in animation history.",
    "Dissecting the narrative complexity and character dynamics that have made this series a fan favorite."
  ];
  
  return excerpts[Math.floor(Math.random() * excerpts.length)];
};

const generateContent = (title) => {
  return `
# ${title}

## Introduction

Anime has evolved dramatically over the decades, transforming from a niche interest into a global cultural phenomenon. This article explores the artistic development, narrative innovations, and cultural impact that have shaped modern anime storytelling.

## Historical Context

The origins of anime can be traced back to early 20th century Japanese animation, but it was the post-war period that saw the emergence of the aesthetic and storytelling approaches we recognize today. Pioneers like Osamu Tezuka revolutionized the industry, establishing many of the conventions that would define the medium.

## Artistic Evolution

### Visual Storytelling

Modern anime employs a diverse range of visual techniques to convey emotion and narrative. From the detailed backgrounds of Studio Ghibli films to the dynamic action sequences in shonen battle series, animation studios have developed distinctive approaches to visual storytelling.

The use of color, composition, and camera movement creates immersive worlds that captivate viewers and convey complex emotions without relying on dialogue.

### Animation Techniques

The technical aspects of anime production have advanced significantly. While traditional hand-drawn animation remains important, digital tools have expanded the possibilities for animators. Techniques such as:

- Dynamic camera movement
- Integration of 2D and 3D elements
- Advanced lighting and color effects
- Fluid character animation

These innovations have allowed studios to create increasingly sophisticated visual experiences while maintaining the distinctive aesthetic that makes anime unique.

## Thematic Depth

Contemporary anime tackles a wide range of themes and philosophical questions. From existential crises in psychological dramas to explorations of environmental issues in fantasy adventures, creators use the medium to examine complex ideas in accessible ways.

The flexibility of animation allows directors to visualize abstract concepts and emotional states, making anime particularly well-suited to stories that explore the human condition.

## Global Impact

The international reach of anime has grown exponentially in the digital age. Streaming platforms have made anime more accessible than ever, introducing new audiences to the art form and creating global communities of fans.

This increased visibility has influenced Western animation and live-action filmmaking, with directors citing anime as inspiration for their visual style and storytelling approaches.

## Conclusion

As anime continues to evolve, it maintains a delicate balance between tradition and innovation. The industry faces challenges, from production issues to changing audience expectations, but the creative spirit that has defined anime from its beginnings continues to drive the medium forward.

The future of anime will likely be shaped by new technologies, cross-cultural collaboration, and the ongoing dialogue between creators and their increasingly global audience.
  `;
};

// Unsplash anime-related image collections
const UNSPLASH_COLLECTIONS = [
  "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // anime figure
  "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // anime street
  "https://images.unsplash.com/photo-1565310022184-f23a884f29da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // anime convention
  "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // anime poster
  "https://images.unsplash.com/photo-1559981421-3e0c0d156f6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // manga collection
  "https://images.unsplash.com/photo-1560972550-aba3456b5564?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // tokyo street
  "https://images.unsplash.com/photo-1503252947848-7338d3f92f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // tokyo night
  "https://images.unsplash.com/photo-1580835239846-5bb9ce3f5973?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // tokyo alley
  "https://images.unsplash.com/photo-1533050487297-09b450131914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80", // japanese shrine
  "https://images.unsplash.com/photo-1605556816125-a1b2341a3046?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"  // futuristic
];

// Generate a random selection of categories for a post
const getRandomCategories = () => {
  const shuffled = [...ANIME_CATEGORIES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 4) + 1); // 1-4 categories
};

// Generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-');
};

// Generate a random blog post
const generateBlogPost = (index) => {
  const title = BLOG_TITLES[index];
  const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
  const coverImage = UNSPLASH_COLLECTIONS[Math.floor(Math.random() * UNSPLASH_COLLECTIONS.length)];
  
  return {
    title,
    slug: generateSlug(title),
    content: generateContent(title),
    excerpt: generateExcerpt(),
    coverImage,
    categories: getRandomCategories(),
    author,
    published: Math.random() > 0.3, // 70% chance of being published
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

const FakeDataGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPost, setPreviewPost] = useState(null);

  // Generate all posts
  const generatePosts = () => {
    const posts = [];
    for (let i = 0; i < BLOG_TITLES.length; i++) {
      posts.push(generateBlogPost(i));
    }
    setGeneratedPosts(posts);
  };

  // Load posts on initial render
  useEffect(() => {
    generatePosts();
  }, []);

  // Add posts to database
  const addPostsToDatabase = async () => {
    if (loading) return;

    try {
      setLoading(true);
      setSuccess(false);
      setError(null);
      setProgress(0);

      for (let i = 0; i < generatedPosts.length; i++) {
        await createPost(generatedPosts[i]);
        setProgress(((i + 1) / generatedPosts.length) * 100);
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(`Failed to add posts: ${err.message}`);
      setLoading(false);
    }
  };

  // Preview a post
  const handlePreview = (post) => {
    setPreviewPost(post);
    setShowPreview(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-4 cinematic-text"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
              AnimeVerse Fake Data Generator
            </span>
          </motion.h1>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-full mx-auto mb-8"
          ></motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-xl text-white/80 max-w-2xl mx-auto"
          >
            Populate your blog with anime-related fake data with one click
          </motion.p>
        </div>

        {/* Notification area */}
        <div className="mb-8 space-y-4">
          {error && (
            <div className="p-4 bg-rose-900/60 backdrop-blur-md border border-rose-600/50 rounded-xl flex justify-between items-center">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-rose-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-rose-200">{error}</span>
              </div>
              <button 
                onClick={() => setError(null)} 
                className="text-rose-400 hover:text-rose-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}
          
          {success && (
            <div className="p-4 bg-emerald-900/60 backdrop-blur-md border border-emerald-600/50 rounded-xl flex justify-between items-center">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-emerald-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-emerald-200">All posts have been successfully added to the database!</span>
              </div>
              <button 
                onClick={() => setSuccess(false)} 
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Main action area */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden mb-12 border border-white/20">
          <div className="flex justify-between items-center p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold text-white">
              Ready to Populate Your Blog
            </h2>
            <div className="text-white/70">
              {generatedPosts.length} posts available
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-white">One-Click Blog Population</h3>
                <p className="text-white/70 max-w-lg">
                  This will add {generatedPosts.length} anime-themed blog posts to your database. 
                  Each post includes a title, content, excerpt, cover image, categories, and author information.
                </p>
              </div>
              
              <button
                onClick={addPostsToDatabase}
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium text-lg min-w-[200px] flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Adding Posts...</span>
                  </div>
                ) : (
                  <span>Populate Database</span>
                )}
              </button>
            </div>
            
            {/* Progress bar */}
            {loading && (
              <div className="mb-8">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-right text-white/70 text-sm">
                  {Math.round(progress)}% complete
                </div>
              </div>
            )}
            
            {/* Post preview grid */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4 text-white">Preview Generated Posts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedPosts.slice(0, 6).map((post, index) => (
                  <div 
                    key={index}
                    className="bg-white/5 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 p-4 z-20">
                        <div className="flex gap-2 flex-wrap mb-2">
                          {post.categories.slice(0, 2).map((cat, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 text-xs bg-purple-600/70 rounded-full text-white"
                            >
                              {cat}
                            </span>
                          ))}
                          {post.categories.length > 2 && (
                            <span className="px-2 py-1 text-xs bg-white/20 rounded-full text-white">
                              +{post.categories.length - 2}
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg font-bold text-white line-clamp-2">
                          {post.title}
                        </h4>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-white/70 text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
                            <img 
                              src={post.author.image} 
                              alt={post.author.name}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <span className="ml-2 text-xs text-white/70">
                            {post.author.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handlePreview(post)}
                          className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {generatedPosts.length > 6 && (
                <div className="text-center mt-6 text-white/60">
                  + {generatedPosts.length - 6} more posts
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Go back link */}
        <div className="text-center">
          <a 
            href="/admin/posts" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Post Manager
          </a>
        </div>
      </div>
      
      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && previewPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-gradient-to-b from-indigo-900 to-purple-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-indigo-900/95 backdrop-blur-md z-10">
                <h3 className="text-xl font-bold text-white">Post Preview</h3>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="text-white/70 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                {/* Cover image */}
                <div className="h-64 relative rounded-xl overflow-hidden mb-6">
                  <img 
                    src={previewPost.coverImage} 
                    alt={previewPost.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                {/* Title and meta */}
                <div className="mb-8">
                  <div className="flex gap-2 flex-wrap mb-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      previewPost.published 
                        ? 'bg-green-600/30 text-green-400'
                        : 'bg-amber-600/30 text-amber-400'
                    }`}>
                      {previewPost.published ? 'Published' : 'Draft'}
                    </span>
                    
                    {previewPost.categories.map((cat, idx) => (
                      <span 
                        key={idx}
                        className="px-2 py-1 text-xs bg-purple-600/30 text-purple-400 rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  
                  <h1 className="text-3xl font-bold text-white mb-3">
                    {previewPost.title}
                  </h1>
                  
                  <div className="flex items-center gap-4 text-white/70 text-sm">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 mr-2">
                        <img 
                          src={previewPost.author.image} 
                          alt={previewPost.author.name}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <span>{previewPost.author.name}</span>
                    </div>
                    
                    <span>
                      {new Date(previewPost.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* Excerpt */}
                <div className="mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
                  <h2 className="text-sm uppercase tracking-wider text-white/50 mb-2">Excerpt</h2>
                  <p className="text-white/90 italic">
                    {previewPost.excerpt}
                  </p>
                </div>
                
                {/* Content preview */}
                <div className="prose prose-invert prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: previewPost.content.replace(/\n/g, '<br>') }} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FakeDataGenerator;