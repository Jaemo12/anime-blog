'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaHeart, FaReply, FaChevronDown } from 'react-icons/fa';
import GradientText from '../ui/GradientText';

interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string;
}

interface Comment {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onAddComment?: (postId: string, content: string, parentId?: string) => Promise<void>;
  onLikeComment?: (commentId: string) => Promise<void>;
  className?: string;
}

export default function CommentSection({
  postId,
  comments,
  onAddComment,
  onLikeComment,
  className = ''
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});
  const [showReplyForm, setShowReplyForm] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayedComments, setDisplayedComments] = useState(comments.slice(0, 5));
  const [showLoadMore, setShowLoadMore] = useState(comments.length > 5);
  
  // Toggle reply form
  const toggleReplyForm = (commentId: string) => {
    setShowReplyForm(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };
  
  // Toggle replies visibility
  const toggleReplies = (commentId: string) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };
  
  // Handle comment submission
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !onAddComment || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onAddComment(postId, commentText);
      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle reply submission
  const handleSubmitReply = async (parentId: string) => {
    const content = replyText[parentId];
    
    if (!content?.trim() || !onAddComment || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onAddComment(postId, content, parentId);
      
      // Clear reply text and close form
      setReplyText(prev => ({
        ...prev,
        [parentId]: ''
      }));
      
      setShowReplyForm(prev => ({
        ...prev,
        [parentId]: false
      }));
      
      // Show replies after successful reply
      setShowReplies(prev => ({
        ...prev,
        [parentId]: true
      }));
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Like a comment
  const handleLikeComment = async (commentId: string) => {
    if (onLikeComment) {
      try {
        await onLikeComment(commentId);
      } catch (error) {
        console.error('Error liking comment:', error);
      }
    }
  };
  
  // Load more comments
  const loadMoreComments = () => {
    const currentLength = displayedComments.length;
    const nextComments = comments.slice(currentLength, currentLength + 5);
    
    setDisplayedComments(prev => [...prev, ...nextComments]);
    
    if (currentLength + 5 >= comments.length) {
      setShowLoadMore(false);
    }
  };
  
  // Render a single comment with replies
  const renderComment = (comment: Comment, isReply = false) => (
    <div 
      key={comment.id} 
      className={`flex gap-4 ${isReply ? 'ml-8 mt-4' : 'mt-6'}`}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0">
        {comment.author.avatar ? (
          <Image
            src={comment.author.avatar}
            alt={comment.author.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#8b5cf6] to-[#e879f9] flex items-center justify-center text-white">
            <FaUser />
          </div>
        )}
      </div>
      
      <div className="flex-grow">
        <div className="flex items-center mb-2">
          <h4 className="font-medium text-[#8b5cf6]">{comment.author.name}</h4>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-xs text-gray-500">{comment.createdAt}</span>
        </div>
        
        <div className="p-4 rounded-lg bg-white/50 backdrop-blur-sm">
          <p className="text-gray-700 text-sm">{comment.content}</p>
        </div>
        
        <div className="flex items-center mt-2 text-xs text-gray-500 space-x-4">
          <button 
            className="flex items-center hover:text-[#8b5cf6] transition-colors"
            onClick={() => handleLikeComment(comment.id)}
          >
            <FaHeart className="mr-1" /> {comment.likes}
          </button>
          
          {!isReply && (
            <button 
              className="hover:text-[#8b5cf6] transition-colors"
              onClick={() => toggleReplyForm(comment.id)}
            >
              <span className="flex items-center">
                <FaReply className="mr-1" /> Reply
              </span>
            </button>
          )}
        </div>
        
        {/* Reply Form */}
        <AnimatePresence>
          {showReplyForm[comment.id] && (
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/20 flex-shrink-0 flex items-center justify-center text-[#8b5cf6]">
                  <FaUser />
                </div>
                
                <div className="flex-grow">
                  <textarea 
                    placeholder="Write a reply..."
                    value={replyText[comment.id] || ''}
                    onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-md bg-white/80 backdrop-blur-sm border border-[#d8b4fe]/30 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 resize-none h-24 text-sm"
                  ></textarea>
                  
                  <div className="flex justify-end mt-2">
                    <motion.button 
                      className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#e879f9] text-white text-sm font-medium rounded-md"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSubmitReply(comment.id)}
                      disabled={isSubmitting || !replyText[comment.id]?.trim()}
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        'Post Reply'
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3">
            <button 
              className="text-xs flex items-center text-[#8b5cf6]"
              onClick={() => toggleReplies(comment.id)}
            >
              <FaChevronDown 
                className={`mr-1 transition-transform ${showReplies[comment.id] ? 'rotate-180' : ''}`} 
              /> 
              {showReplies[comment.id] ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
            
            <AnimatePresence>
              {showReplies[comment.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {comment.replies.map(reply => renderComment(reply, true))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
  
  return (
    <div className={`p-8 rounded-xl bg-white/80 backdrop-blur-sm shadow-md ${className}`}>
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold">
          <GradientText>Comments</GradientText>
        </h2>
        <div className="h-px flex-grow bg-gradient-to-r from-[#8b5cf6]/50 to-transparent ml-4"></div>
      </div>
      
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-[#8b5cf6]/20 flex-shrink-0 flex items-center justify-center text-[#8b5cf6]">
            <FaUser />
          </div>
          
          <div className="flex-grow">
            <textarea 
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-white/80 backdrop-blur-sm border border-[#d8b4fe]/30 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/30 resize-none h-24"
            ></textarea>
            
            <div className="flex justify-end mt-2">
              <motion.button 
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[#8b5cf6] to-[#e879f9] text-white font-medium rounded-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting || !commentText.trim()}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Post Comment'
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </form>
      
      {/* Comments List */}
      <div className="space-y-2">
        {displayedComments.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Be the first to comment!</p>
        ) : (
          displayedComments.map(comment => renderComment(comment))
        )}
      </div>
      
      {/* Load More Button */}
      {showLoadMore && (
        <div className="flex justify-center mt-8">
          <motion.button 
            className="px-6 py-3 bg-transparent backdrop-blur-sm border-2 border-[#8b5cf6] text-[#6d28d9] rounded-md font-medium hover:bg-[#8b5cf6]/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMoreComments}
          >
            Load More Comments
          </motion.button>
        </div>
      )}
    </div>
  );
}