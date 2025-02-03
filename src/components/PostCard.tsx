import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { theme } = useTheme();
  
  return (
    <article className="group py-8 first:pt-0 border-b border-stone-100/50 dark:border-stone-800/30 last:border-0">
      <Link to={`/post/${post.id}`} className="block group-hover:opacity-70 transition-opacity">
        <h2 className="text-2xl font-serif mb-2">{post.title}</h2>
        <div className="text-sm text-stone-400 dark:text-stone-500 mb-3 flex items-center gap-2">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readingTime}</span>
          <span>·</span>
          <span>{post.author}</span>
        </div>
        <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{post.excerpt}</p>
      </Link>
    </article>
  );
};

export default PostCard;