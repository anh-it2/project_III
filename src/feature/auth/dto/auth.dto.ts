// client send to server

export interface LoginRequestDTO {
  username: string;
  password: string;
}

// server send to client

export interface LoginResponseDTO {
  status: number;
  message: string;
  data?: {
    userId: string;
    username: string;
    token: string;
  };
}
