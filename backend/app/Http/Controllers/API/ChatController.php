<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateChatMessageRequest;
use App\Http\Requests\CreateChatSessionRequest;
use App\Http\Requests\UpdateChatSessionRequest;
use App\Services\ChatService;
use App\Services\ResponseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    /**
     * @var ChatService
     */
    protected $chatService;

    /**
     * ChatController constructor.
     *
     * @param ChatService $chatService
     */
    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Get all chat sessions
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getAllSessions(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $sessions = $this->chatService->getAllSessions($perPage);

        return ResponseService::success($sessions);
    }

    /**
     * Get a single chat session
     *
     * @param int $id
     * @return JsonResponse
     */
    public function getSession(int $id): JsonResponse
    {
        $session = $this->chatService->getSessionById($id);

        if (!$session) {
            return ResponseService::error('Chat session not found', null, 404);
        }

        return ResponseService::success($session);
    }

    /**
     * Create a new chat session
     *
     * @param CreateChatSessionRequest $request
     * @return JsonResponse
     */
    public function createSession(CreateChatSessionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $session = $this->chatService->createSession($data);

        return ResponseService::success($session, 'Chat session created successfully', 201);
    }

    /**
     * Update a chat session
     *
     * @param UpdateChatSessionRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateSession(UpdateChatSessionRequest $request, int $id): JsonResponse
    {
        $data = $request->validated();
        $session = $this->chatService->updateSession($id, $data);

        if (!$session) {
            return ResponseService::error('Chat session not found', null, 404);
        }

        return ResponseService::success($session, 'Chat session updated successfully');
    }

    /**
     * Close a chat session
     *
     * @param int $id
     * @return JsonResponse
     */
    public function closeSession(int $id): JsonResponse
    {
        $result = $this->chatService->closeSession($id);

        if (!$result) {
            return ResponseService::error('Chat session not found', null, 404);
        }

        return ResponseService::success(null, 'Chat session closed successfully');
    }

    /**
     * Get messages by session ID
     *
     * @param int $sessionId
     * @return JsonResponse
     */
    public function getMessages(int $sessionId): JsonResponse
    {
        $messages = $this->chatService->getMessagesBySessionId($sessionId);

        return ResponseService::success($messages);
    }

    /**
     * Send a new chat message
     *
     * @param CreateChatMessageRequest $request
     * @param int $sessionId
     * @return JsonResponse
     */
    public function sendMessage(CreateChatMessageRequest $request, int $sessionId): JsonResponse
    {
        $data = $request->validated();
        $message = $this->chatService->sendMessage($sessionId, $data);

        if (!$message) {
            return ResponseService::error('Failed to send message or chat session not found', null, 404);
        }

        return ResponseService::success($message, 'Message sent successfully', 201);
    }

    /**
     * Mark all messages in a session as read
     *
     * @param int $sessionId
     * @return JsonResponse
     */
    public function markMessagesAsRead(int $sessionId): JsonResponse
    {
        $result = $this->chatService->markMessagesAsRead($sessionId);

        if (!$result) {
            return ResponseService::error('Chat session not found', null, 404);
        }

        return ResponseService::success(null, 'Messages marked as read successfully');
    }

    /**
     * Get unread messages count
     *
     * @return JsonResponse
     */
    public function getUnreadCount(): JsonResponse
    {
        $count = $this->chatService->getUnreadCount();

        return ResponseService::success(['count' => $count]);
    }
}
