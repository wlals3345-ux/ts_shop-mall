-- postgres(계정)/postgres(db)접속 확인

-- 계정은 jsuser 사용

-- tsdb 생성(jsuser를 소유자로 지정)
CREATE DATABASE tstb OWNER jsuser;

DROP DATABASE tstb;

CREATE DATABASE tsdb OWNER jsuser;