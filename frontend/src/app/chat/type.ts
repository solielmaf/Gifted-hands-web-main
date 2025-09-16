
export interface Message {
    id:number;
    message:string;
    is_admin: boolean;
    created_at:string;
    user_id?:number;
}


export interface Conversation {
    user_id: number;
    user_name: string;
    last_message: string;

}

export interface User {
    id:number;
    name?: string;
    email?:string;
    role?: string;
}