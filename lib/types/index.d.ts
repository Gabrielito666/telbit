import { EventEmitter } from "events";
import { AxiosError } from "axios";
import Telbit from "../telbit";
import Chat from "../chat";
import User from "../user";
import Message from "../message";

export type { default as Telbit } from "../telbit";
export type { default as Chat } from "../chat";
export type { default as User } from "../user";
export type { default as Message } from "../message";

export type ChatPermissions = {
    can_send_messages?: boolean;
    can_send_media_messages?: boolean;
    can_send_polls?: boolean;
    can_send_other_messages?: boolean;
    can_add_web_page_previews?: boolean;
    can_change_info?: boolean;
    can_invite_users?: boolean;
    can_pin_messages?: boolean;
};

export interface TelegramApiUser {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
    last_name?: string;
    language_code?: string;
}

export interface TelegramApiMessage {
    message_id: number;
    chat: {
        id: number;
        type: string;
        title?: string;
        username?: string;
    };
    text?: string;
    [key: string]: any;
}

export interface TelegramApiUpdate {
    update_id: number;
    message?: TelegramApiMessage;
    [key: string]: any;
}

export interface ApiMethods {
    sendMessage: (chatId: number, text: string) => Promise<TelegramApiMessage | null>;
    getMe: () => Promise<TelegramApiUser | null>;
    deleteMessage: (chatId: number, messageId: number) => Promise<TelegramApiMessage | null>;
    editMessage: (chatId: number, messageId: number, newText: string) => Promise<TelegramApiMessage | null>;
    banUser: (chatId: number, userId: number) => Promise<any>;
    unbanUser: (chatId: number, userId: number) => Promise<any>;
    kickUser: (chatId: number, userId: number) => Promise<any>;
    restrictUser: (chatId: number, userId: number, permissions: ChatPermissions) => Promise<any>;
    restrictChat: (chatId: number, permissions: ChatPermissions) => Promise<any>;
    listeners: () => {
        start: () => Promise<void>;
        stop: () => void;
        emitter: EventEmitter & {
            on(event: "update", listener: (update: TelegramApiUpdate) => void): void;
            on(event: "error", listener: (error: AxiosError | Error) => void): void;
        };
    };
}

export interface TelbitMessageConstructorParams{
    bot: Telbit;
    id: number;
    chat: Chat;
    text: string;
    user: User;
    date: number;
}

export interface TelbitChatConstructorParams{
    bot: Telbit;
    id: number;
}

export interface TelbitUserContructorParams{
    bot: Telbit;
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
}

export type telbitCallback = (message:Message, chat:Chat, user:User) => void