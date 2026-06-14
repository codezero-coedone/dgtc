import { useState } from "react";
import { site } from "../data/site";

export function Hero() {
  const [isVideoFailed, setIsVideoFailed] = useState(false);

  return (
    <section className={`hero-corporate${isVideoFailed ? " is-video-failed" : ""}`}>
      {!isVideoFailed && (
        <video
          className="hero-video-bg"
          poster={site.media.heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onError={() => setIsVideoFailed(true)}
        >
          <source src={site.media.heroVideo} type="video/mp4" />
        </video>
      )}
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="dk-container hero-layout">
        <div className="hero-copy">
          <p className="hero-eyebrow">
            <span />
            {site.company.nameEn} CNC TURNING
          </p>
          <h1 className="keep-ko">
            CNC 자동선반 기반
            <br />
            정밀 부품 가공업체
            <br />
            {site.company.nameKo}
          </h1>
          <p className="keep-ko">
            {site.company.nameKo}는 자동차·유압·전자부품에 필요한
            <br />
            소형 정밀 가공 부품을 사양 확인,
            <br />
            가공, 검사, 출하 흐름으로 대응합니다.
          </p>
          <a href="#/company" className="hero-primary">
            회사소개
          </a>
          <a href="#/products" className="hero-secondary">
            제품소개
          </a>
          <div className="hero-proof-strip">
            <span>자동차부품</span>
            <span>유압부품</span>
            <span>전자부품</span>
          </div>
        </div>
      </div>
      <div className="hero-region-bar">
        <div className="dk-container">
          <strong>제조 대응 범위</strong>
          <span>자동차부품</span>
          <span>유압부품</span>
          <span>전자부품</span>
          <span>CNC 자동선반</span>
          <a href="#/support">회사위치</a>
        </div>
      </div>
    </section>
  );
}
