import { Interface } from "readline";
import { Task } from "./task";
import { User } from "./user";

export interface Comment {
    id?: string;
    content?: string;
    deleted_at?: Date | string;
    updated_at?: Date | string;
    created_at?: Date | string;
    user?: User;
    task?: Task;
}

export interface CommentCreate {
    content?: string;
    user?: number;
    task?: number;
}
