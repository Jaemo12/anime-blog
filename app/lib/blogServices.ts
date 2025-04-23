// lib/blogService.ts
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    QuerySnapshot,
  } from 'firebase/firestore';
  import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
  } from 'firebase/storage';
  import { db, storage } from './firebase';
  
  // Blog post type
  export interface BlogPost {
    id?: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    categories: string[];
    author: {
      name: string;
      image: string;
    };
    published: boolean;
    viewCount?: number;
    createdAt?: any;
    updatedAt?: any;
  }
  
  // Get all blog posts
  export const getAllPosts = async (publishedOnly: boolean = false): Promise<BlogPost[]> => {
    try {
      let postsQuery;
      
      if (publishedOnly) {
        postsQuery = query(
          collection(db, 'posts'),
          where('published', '==', true),
          orderBy('createdAt', 'desc')
        );
      } else {
        postsQuery = query(
          collection(db, 'posts'),
          orderBy('createdAt', 'desc')
        );
      }
      
      const querySnapshot = await getDocs(postsQuery);
      
      const posts: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      
      return posts;
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  };
  
  // Get featured posts
  export const getFeaturedPosts = async (limit_count: number = 4): Promise<BlogPost[]> => {
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('published', '==', true),
        orderBy('viewCount', 'desc'),
        limit(limit_count)
      );
      
      const querySnapshot = await getDocs(postsQuery);
      
      const posts: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      
      return posts;
    } catch (error) {
      console.error('Error getting featured posts:', error);
      throw error;
    }
  };
  
  // Get post by slug
  export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('slug', '==', slug),
        limit(1)
      );
      
      const querySnapshot = await getDocs(postsQuery);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as BlogPost;
    } catch (error) {
      console.error('Error getting post by slug:', error);
      throw error;
    }
  };
  
  // Get post by ID
  export const getPostById = async (id: string): Promise<BlogPost | null> => {
    try {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return { id: docSnap.id, ...docSnap.data() } as BlogPost;
    } catch (error) {
      console.error('Error getting post by ID:', error);
      throw error;
    }
  };
  
  // Create a new post
  export const createPost = async (postData: Omit<BlogPost, 'id'>): Promise<string> => {
    try {
      const data = {
        ...postData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        viewCount: 0
      };
      
      const docRef = await addDoc(collection(db, 'posts'), data);
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };
  
  // Update an existing post
  export const updatePost = async (id: string, postData: Partial<BlogPost>): Promise<void> => {
    try {
      const data = {
        ...postData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(doc(db, 'posts', id), data);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };
  
  // Delete a post
  export const deletePost = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'posts', id));
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  };
  
  // Increment view count
  export const incrementViewCount = async (id: string): Promise<void> => {
    try {
      const postRef = doc(db, 'posts', id);
      const postSnap = await getDoc(postRef);
      
      if (postSnap.exists()) {
        const currentViews = postSnap.data().viewCount || 0;
        await updateDoc(postRef, {
          viewCount: currentViews + 1
        });
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
      throw error;
    }
  };
  
  // Get posts by category
  export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('published', '==', true),
        where('categories', 'array-contains', category),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(postsQuery);
      
      const posts: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() } as BlogPost);
      });
      
      return posts;
    } catch (error) {
      console.error('Error getting posts by category:', error);
      throw error;
    }
  };
  
  // Get all categories
  export const getAllCategories = async (): Promise<string[]> => {
    try {
      const postsQuery = query(
        collection(db, 'posts'),
        where('published', '==', true)
      );
      
      const querySnapshot = await getDocs(postsQuery);
      
      const categoriesSet = new Set<string>();
      
      querySnapshot.forEach((doc) => {
        const post = doc.data() as BlogPost;
        if (post.categories && Array.isArray(post.categories)) {
          post.categories.forEach(category => categoriesSet.add(category));
        }
      });
      
      return Array.from(categoriesSet);
    } catch (error) {
      console.error('Error getting all categories:', error);
      throw error;
    }
  };
  
  // Upload image to Firebase Storage
  export const uploadImage = async (file: File, folder: string = 'blog-images'): Promise<string> => {
    try {
      const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };
  
  // Delete image from Firebase Storage
  export const deleteImage = async (imageUrl: string): Promise<void> => {
    if (!imageUrl || !imageUrl.includes('firebasestorage')) return;
    
    try {
      // Extract the path from the URL
      const urlObj = new URL(imageUrl);
      const pathMatch = urlObj.pathname.match(/\/o\/(.+?)(?:\?|$)/);
      
      if (pathMatch && pathMatch[1]) {
        const decodedPath = decodeURIComponent(pathMatch[1]);
        const imageRef = ref(storage, decodedPath);
        await deleteObject(imageRef);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  };