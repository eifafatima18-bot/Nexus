import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ChatConversation } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { findUserById } from '../../data/users';
import { useAuth } from '../../context/AuthContext';

interface ChatUserListProps {
  conversations: ChatConversation[];
}

export const ChatUserList: React.FC<ChatUserListProps> = ({ conversations }) => {
  const navigate = useNavigate();
  const { userId: activeUserId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();

  if (!currentUser) return null;

  const handleSelectUser = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  if (!conversations.length) {
    return (
      <div className="bg-white border-r border-gray-200 w-full md:w-64 flex items-center justify-center">
        <p className="text-sm text-gray-500">No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white border-r border-gray-200 w-full md:w-64 overflow-y-auto h-full">
      <div className="py-4">
        <h2 className="px-4 text-lg font-semibold text-gray-800 mb-4">
          Messages
        </h2>

        <div className="space-y-1">
          {conversations.map((conversation) => {
            const otherParticipantId = conversation.participants.find(
              (id) => id !== currentUser.id
            );

            if (!otherParticipantId) return null;

            const otherUser = findUserById(otherParticipantId);
            if (!otherUser) return null;

            const lastMessage = conversation.lastMessage;
            const isActive = activeUserId === otherParticipantId;
            const isUnread =
              lastMessage &&
              !lastMessage.isRead &&
              lastMessage.senderId !== currentUser.id;

            return (
              <div
                key={conversation.id}
                onClick={() => handleSelectUser(otherUser.id)}
                className={`px-4 py-3 flex cursor-pointer transition-all duration-200 border-l-4 ${
                  isActive
                    ? 'bg-blue-50 border-blue-600'
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <Avatar
                  src={otherUser.avatarUrl}
                  alt={otherUser.name}
                  size="md"
                  status={otherUser.isOnline ? 'online' : 'offline