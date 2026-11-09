import express from "express"
import mysql from "mysql2"
import cors from 'cors'

// app 객체 생성
const app = express();
const PORT = 8000;

//cors(Cross-Origin Resource Sharing, 교차출처 리소스 공유)
// 브라우저가 보안상의 이유로 api 요청을 차단 방지 라이브러리
app.use(cors({
    origin: "http://localhost:5173",
}))

// mysql 연결 설정
// host
const db = mysql.createConnection({
    host: "localhost",
    user: "jsuser",
    password: "pwjs",
    database: "jsdb"
});

// mysql dbms에 연결
db.connect((err) => {
    if(err){
        console.error("DB 연결 오류!!", err);
        return;
    }
    console.log("데이터베이스에 연결했습니다.")
});

// 기본 라우트 설정
app.get('/', (req, res) => {
    res.send("<h1>API 서버와 DB 연동</h1>")
})

// 상품 목록 조회
// db.query(sql, 데이터, 콜백함수)
app.get("/api/products", (req, res) => {
    const sql = "SELECT * FROM product";
    db.query(sql, (err, results) => {
        if(err){
            console.log("상품 조회 오류!! ", err);
            res.send("상품 조회 중 오류 발생!!");
            return;
        }
        res.json(results); //json 형태로 응답
    });
});

// 본문 요청 파싱
app.use(express.json());

// 상품 등록
app.post("/api/products", (req, res) => {
    const {productName, price, description} = req.body; // 요청한 속성 데이터
    const sql = "INSERT INTO product(product_name, price, description) VALUES (?, ?, ?)";
    db.query(sql, [productName, price, description], (err) => {
        if(err){
            console.log("상품 조회 오류!! ", err);
            res.send("상품 조회 중 오류 발생!!");
            return;
        }
        res.send("상품 등록 완료!!");
    } );
})

// 상품 상세 보기(1건)
app.get("/api/products/:id", (req, res) => {
    const productId = req.params.id;
    const sql = "SELECT * FROM product WHERE id = ?"
    db.query(sql, [productId], (err, results) => {
        if(err){
            console.log("상품 조회 에러: ", err);
            res.send("상품 조회 중 오류가 발생했습니다.");
            return;
        }
        res.json(results[0]);  //1건(맨 앞)
    });
})

// 상품 삭제(1건)
// app.delete(경로, 콜백함수)
app.delete("/api/products/:id", (req, res) => {
    const productId = req.params.id;
    const sql = "DELETE FROM product WHERE id = ?";
    db.query(sql, [productId], (err) => {
        if(err){
            console.log("상품 조회 에러: ", err);
            res.send("상품 조회 중 오류가 발생했습니다.");
            return;
        }
        res.send("상품이 성공적으로 삭제되었습니다.");
    });
})

// 상품 수정
// app.put(경로, 콜백함수)
app.put("/api/products/:id", (req, res) => {
    // 수정하려면 이미 존재하는 상품(id)을 가져오기
    const productId = req.params.id;
    const {productName, price, description} = req.body; //수정된 데이터를 가져옴
    const sql = "UPDATE product SET product_name=?, price=?, description=? WHERE id=?";
    db.query(sql, [productName, price, description, productId], (err) => {
        if(err){
            console.log("상품 조회 에러: ", err);
            // 500: 코드 오류, 404: 페이지 없음, 200: 정상
            res.status(501).send("상품 조회 중 오류가 발생했습니다.");
            return;
        }
        res.status(200).send("상품이 성공적으로 수정되었습니다.");
    })
})

// 회원 API 개발(REST API)
// 이전 통신방식(get, post)
// REST API - get, post, put, delete
// 회원 목록
app.get("/api/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, results) => {
        if(err){
            console.log("회원 조회 에러: ", err);
            // 500: 코드 오류, 404: 페이지 없음, 200: 정상
            res.send("회원 조회 중 오류가 발생했습니다.");
            return;
        }
        res.json(results);  // 프런트(요청)에 반환
    })
});

// 회원 가입
app.post("/api/users", (req, res) => {
    const {username, password, email} = req.body; //요청 본문의 데이터
    const sql = "insert into users(username, password, email) values (?, ?, ?)";
    db.query(sql, [username, password, email], (err) => {
        if(err){
            console.log("회원 가입 에러: ", err);
            res.send("회원 가입 중 오류가 발생했습니다.");
            return;
        }
        res.send("회원이 성공적으로 가입되었습니다.");
    });
});

// 회원 조회(로그인)
app.get("/api/users/:username", (req, res) => {
    const username = req.params.username; //요청한 아이디
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], (err, results) => {
        if(err){
            console.log("회원 조회 에러: ", err);
            res.send("회원 조회 중 오류가 발생했습니다.");
            return;
        }
        res.json(results[0]);  //요청한 곳으로 반환(응답)
    });
})


// 서버 실행
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}에서 서버 실행중...`);
})