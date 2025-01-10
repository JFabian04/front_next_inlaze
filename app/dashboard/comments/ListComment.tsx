import React, { useEffect, useState, useRef } from 'react';
import { createComment, getComments } from '@/app/services/commentService';
import { Comment, CommentCreate } from '@/app/types/comment';
import { Task } from '@/app/types/task';

interface ChatProps {
    task?: Task | null;
    onClose: () => void;
}

const ListComment: React.FC<ChatProps> = ({ task, onClose }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [newComment, setNewComment] = useState<string>('');
    const [myId, setMyId] = useState<string | null>(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setMyId(userId);
    }, []);

    useEffect(() => {
        if (!task || !myId) return;

        const loadComments = async () => {
            setLoading(true);
            try {
                const limit = 10;
                const resp = await getComments({
                    id: task.id,
                    page: page.toString(),
                    limit: limit.toString(),
                });
                const newComments = resp.data || [];

                setComments((prev) => [...prev, ...newComments]);
                setHasMore(newComments.length == limit);
            } catch (error) {
                console.error('Error fetching comments', error);
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [task, myId, page]);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [comments]);

    const handleScroll = () => {
        if (!containerRef.current || loading || !hasMore) return;

        const { scrollTop } = containerRef.current;
        if (scrollTop == 0) {
            setPage((prev) => prev + 1);
        }
    };

    const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (newComment.trim() === '') return;

        const tempComment: Comment = {
            id: Date.now().toString(),
            user: { id: myId?.toString() },
            content: newComment,
            created_at: new Date().toISOString(),
        };

        // Insertar comentario visuialmente 
        setComments((prev) => [tempComment, ...prev]);
        setNewComment('');

        try {
            //registrar comentario
            await createComment({
                user: Number(myId),
                task: Number(task?.id),
                content: newComment,
            });

        } catch (error) {
            console.error('Error creando comentario:', error);
        }
    };

    if (!task) return null;

    return (
        <div
            ref={containerRef}
            className="fixed bottom-5 right-5 w-[50%] h-[80%] bg-white shadow-lg rounded-lg overflow-y-auto"
            onScroll={handleScroll}
        >
            {/* Header */}
            <div className="sticky top-0 bg-green-400 p-4 z-10 flex justify-between items-center border-b">
                <h2 className="text-lg font-bold">Comentarios - {task.title} </h2>
                <button
                    onClick={onClose}
                    className="text-white text-4xl hover:bg-white/90 hover:text-gray-700 rounded-full p-1"
                    aria-label="Cerrar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>

                </button>
            </div>

            <div className="flex flex-col-reverse p-4  bg-gradient-to-b from-green-200 to-blue-200 h-full">
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        className={`flex ${myId == comment.user?.id ? 'justify-end' : 'justify-start'
                            } mb-2`}
                    >
                        <div
                            className={`max-w-xs p-3 ${myId == comment.user?.id
                                ? 'bg-green-700 text-white rounded-tl-xl rounded-bl-xl rounded-br-xl'
                                : 'bg-gray-200 text-black rounded-tr-xl rounded-br-xl rounded-bl-xl'
                                }`}
                        >
                            <strong>{myId != comment.user?.id ? comment.user?.name : ''}</strong>
                            <p>{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <div className="text-center">Cargando...</div>}

            {/* form comentarios enviar */}
            <form className="sticky bottom-0 bg-gray-100 p-4 z-10 border-t flex items-center" onSubmit={handleAddComment}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="flex-1 border rounded-md px-3 py-2 mr-2"
                />
                <button
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" type="submit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                    </svg>

                </button>
            </form>
        </div>
    );
};

export default ListComment;
