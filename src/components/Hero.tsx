import { site } from "../data/site";

export function Hero() {
  return (
    <section className="hero-corporate">
      <video
        className="hero-video-bg"
        src={site.media.heroVideo}
        poster={site.media.heroPosterFallback}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="dk-container hero-layout">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span />
            DAEKWANG TECH MANUFACTURING
          </p>
          <h1 className="keep-ko">
            자동차 유압부품
            <br />
            전문 제조기업
            <br />
            대광테크
          </h1>
          <p className="keep-ko">
            대광테크는 자동차 유압 시스템에 필요한
            <br />
            가공 부품과 장비 구성품을 사양 확인,
            <br />
            가공, 검사, 출하 흐름으로 대응합니다.
          </p>
          <a href="#/company" className="hero-primary">
            회사소개 보기
          </a>
          <a href="#/products" className="hero-secondary">
            제품 카탈로그
          </a>
          <div className="hero-proof-strip">
            <span>도면 기준 확인</span>
            <span>정밀 가공 대응</span>
            <span>출하 전 검수</span>
          </div>
        </div>
      </div>
      <div className="hero-region-bar">
        <div className="dk-container">
          <strong>제조 대응 범위</strong>
          <span>유압 피팅</span>
          <span>유압 밸브</span>
          <span>실린더 부품</span>
          <span>주문형 가공</span>
          <a href="#/support">방문 정보 입력 예정</a>
        </div>
      </div>
    </section>
  );
}
