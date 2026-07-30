export interface UserResponse {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface SignInRequest {
  login: string;
  password: string;
}

export interface UserUpdateRequest {
  first_name?: string;
  second_name?: string;
  display_name?: string;
  login?: string;
  email?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChatLastMessage {
  user: UserResponse;
  time: string;
  content: string;
}

export interface ChatListItem {
  id: number;
  title: string;
  avatar: string;
  message: string;
  time: string;
  unreadCount: number;
  selected: boolean;
}

export interface Chat {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  last_message: ChatLastMessage;
}

export interface ChatUsersResponse {
  id: number;
  avatar: string;
  display_name: string;
  first_name: string;
  second_name: string;
  role: string;
  login: string;
}
