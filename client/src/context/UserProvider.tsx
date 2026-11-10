import { useEffect, useState } from "react"
import { UserContext } from "./UserContext"
import type {User, NewUser, LoginForm} from "../types/user"
import { createUser, getUsers, requestLogin } from "../api/users";

// UserProvider는 회원 저장소(repository) 역할
const UserProvider = ({children} : {children: React.ReactNode}) => {
    // 처음에는 빈 배열로 시작하고, 서버에서 받아 오면 채웁니다.
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // 화면이 처음 그려질 때 한 번 회원 목록을 불러옵니다.
    useEffect(() => {
        getUsers()
            .then(setUsers)
            .catch((err) => console.log('회원 목록 조회 오류!', err));
    }, []);

    // 회원가입 함수: 서버(DB)에 저장한 뒤, DB가 만든 id를 받기 위해 목록을 다시 불러옵니다.
    const signup = async (newUser: NewUser) => {
        await createUser(newUser);
        setUsers(await getUsers());
    }

    // 로그인 함수 (성공하면 true, 실패하면 false 반환)
    // 서버가 회원 정보를 돌려주면 성공, 오류(401 등)가 나면 실패입니다.
    const login = async (loginForm: LoginForm) => {
        try {
            const user = await requestLogin(loginForm);
            setCurrentUser(user);
            return true;
        } catch {
            return false;
        }
    }

    // 로그아웃 함수
    const logout = () => {
        setCurrentUser(null);
    }

    return(
        <UserContext.Provider value={{
            users, 
            currentUser, 
            signup, 
            login, 
            logout
        }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider