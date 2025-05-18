<?php

namespace App\Services;

use App\Models\ChatMessage;
use App\Models\ChatSession;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class ChatService
{
    /**
     * Get all chat sessions
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getAllSessions(int $perPage = 15): LengthAwarePaginator
    {
        return ChatSession::orderBy('last_message_time', 'desc')->paginate($perPage);
    }

    /**
     * Get a chat session by ID
     *
     * @param int $id
     * @return ChatSession|null
     */
    public function getSessionById(int $id): ?ChatSession
    {
        return ChatSession::find($id);
    }

    /**
     * Create a new chat session
     *
     * @param array $data
     * @return ChatSession
     */
    public function createSession(array $data): ChatSession
    {
        $session = new ChatSession();
        $session->name = $data['name'] ?? null;
        $session->email = $data['email'] ?? null;
        $session->user_id = Auth::id() ?? $data['user_id'] ?? null;
        $session->status = $data['status'] ?? 'active';
        $session->source = $data['source'] ?? 'website';
        $session->metadata = $data['metadata'] ?? null;
        $session->save();

        return $session;
    }

    /**
     * Update a chat session
     *
     * @param int $id
     * @param array $data
     * @return ChatSession|null
     */
    public function updateSession(int $id, array $data): ?ChatSession
    {
        $session = ChatSession::find($id);

        if (!$session) {
            return null;
        }

        if (isset($data['name'])) {
            $session->name = $data['name'];
        }
        
        if (isset($data['email'])) {
            $session->email = $data['email'];
        }
        
        if (isset($data['status'])) {
            $session->status = $data['status'];
        }
        
        if (isset($data['metadata'])) {
            $session->metadata = $data['metadata'];
        }
        
        $session->save();

        return $session;
    }

    /**
     * Close a chat session
     *
     * @param int $id
     * @return bool
     */
    public function closeSession(int $id): bool
    {
        $session = ChatSession::find($id);

        if (!$session) {
            return false;
        }

        $session->status = 'closed';
        return $session->save();
    }

    /**
     * Get messages by session ID
     *
     * @param int $sessionId
     * @return Collection
     */
    public function getMessagesBySessionId(int $sessionId): Collection
    {
        return ChatMessage::where('session_id', $sessionId)
            ->orderBy('created_at')
            ->get();
    }

    /**
     * Send a new message
     *
     * @param int $sessionId
     * @param array $data
     * @return ChatMessage|null
     */
    public function sendMessage(int $sessionId, array $data): ?ChatMessage
    {
        $session = ChatSession::find($sessionId);

        if (!$session) {
            return null;
        }

        // Create the message
        $message = new ChatMessage();
        $message->session_id = $sessionId;
        $message->content = $data['content'];
        $message->sender = $data['sender'];
        $message->read = $data['sender'] !== 'user'; // If it's from the user, mark as unread
        $message->metadata = $data['metadata'] ?? null;
        $message->attachments = $data['attachments'] ?? null;
        $message->save();

        // Update the session
        $session->last_message = $data['content'];
        $session->last_message_time = now();
        
        // Update unread count if the sender is the user
        if ($data['sender'] === 'user') {
            $session->unread = $session->unread + 1;
        }
        
        $session->save();

        return $message;
    }

    /**
     * Mark all messages in a session as read
     *
     * @param int $sessionId
     * @return bool
     */
    public function markMessagesAsRead(int $sessionId): bool
    {
        $session = ChatSession::find($sessionId);

        if (!$session) {
            return false;
        }

        // Update all unread messages
        ChatMessage::where('session_id', $sessionId)
            ->where('read', false)
            ->update(['read' => true]);

        // Reset the session unread count
        $session->unread = 0;
        return $session->save();
    }

    /**
     * Get the total unread message count
     *
     * @return int
     */
    public function getUnreadCount(): int
    {
        return ChatSession::sum('unread');
    }
}
