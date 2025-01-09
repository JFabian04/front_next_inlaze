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

    const handleAddComment = async () => {
        if (newComment.trim() === '') return;
    
        const tempComment: Comment = {
            id: Date.now().toString(),
            user: { id: myId?.toString() },
            content: newComment,
            created_at: new Date().toISOString(),
        };
    
        // Insertar comentario localmente 
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
            {/* Header fijo */}
            <div className="sticky top-0 bg-gray-100 p-4 z-10 flex justify-between items-center border-b">
                <h2 className="text-lg font-bold">Comentarios Tarea - {task.title} </h2>
                <button
                    onClick={onClose}
                    className="text-red-600 text-xl hover:text-red-800"
                    aria-label="Cerrar"
                >
                    ✖️
                </button>
            </div>

            {/* Lista de comentarios */}
            <div className="flex flex-col-reverse p-4">
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
                            <strong>{myId != comment.user?.id ?  comment.user?.name : ''}</strong>
                            <p>{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <div className="text-center">Cargando...</div>}

            {/* Input para nuevo comentario */}
            <div className="sticky bottom-0 bg-gray-100 p-4 z-10 border-t flex items-center">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="flex-1 border rounded-md px-3 py-2 mr-2"
                />
                <button
                    onClick={handleAddComment}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

export default ListComment;
