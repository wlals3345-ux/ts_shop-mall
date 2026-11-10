import { createContext, useContext } from "react";
import type {User, NewUser, LoginForm} from "../types/user"

// 회원 컨텍스트 타입 정의
// 서버에 물어봐야 하므로 signup · login은 Promise를 돌려줍니다.
interface UserContextType{
    users: User[];  // 회원목록
    currentUser: User | null;  // 로그인한 회원 (로그아웃 상태면 null)
    signup: (newUser: NewUser) => Promise<void>  // 회원가입
    login: (loginForm: LoginForm) => Promise<boolean>  // 로그인 (성공 여부 반환)
    logout: () => void  // 로그아웃
}

// 회원 컨텍스트 생성
export const UserContext = createContext<UserContextType | null>(null);

// 회원 컨텍스트 커스텀 Hook
export const useUser = () => {
    const context = useContext(UserContext);
    if(!context){
        throw new Error("useUser는 UserProvider 내부에서만 사용 가능합니다.")
    }
    return context
}