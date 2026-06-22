import React, { memo } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Message } from '../../types';
import { Avatar } from '../ui/Avatar';
import { findUserById } from '../../data/users';

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = memo(
  ({ message, isCurrentUser }) => {
    const user = findUserById(message.senderId);

    if (!user) return null;

    const timestamp = message.timestamp
      ? new Date(message.timestamp)
      : new Date();

    const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

    return (
      <div
        className={`flex ${
          isCurrentUser ? 'justify-end' : 'justify-start'
        } mb-4 animate-fade-in`}
      >
        {!isCurrentUser && (
          <Avatar
            src={user.avatarUrl || ''}
            alt={user.name || 'User'}
            size="sm"
            className="mr-2 self-end"
          />
        )}

        <div
          className={`flex flex-col ${
            isCurrentUser ? 'items-end' : 'items-start'
          }`}
        >
          <div
            className={`max-w-xs sm:max-w-md px-4 py-2 rounded-lg break-words ${
              isCurrentUser
                ? 'bg-primary-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-800 rounded-bl-none'
            }`}
            role="article"
            aria-label={`Message from ${user.name}`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>

          <span className="text-xs text-gray-500 mt-1">
            {timeAgo}
          </span>
        </div>

        {isCurrentUser && (
          <Avatar
            src={user.avatarUrl || ''}
            alt={user.name || 'User'}
            size="sm"
            className="ml-2 self-end"
          />
        )}
      </div>
    );
  }
);

ChatMessage.displayName = 'ChatMessage';
