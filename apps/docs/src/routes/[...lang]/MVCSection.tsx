import { component$ } from "@builder.io/qwik";
import { css } from "~/styled-system/css";

export const MVCSection = component$(() => {
  return (
    <section
      class={css({
        display: "flex",
        flexDirection: {
          base: "column",
          smDown: "column",
        },
        gap: 4,
      })}
    >
      <div>
        <h3>Mission</h3>
        <div>日々の煩わしさから解放します。</div>
      </div>
      <div>
        <h3>Vision</h3>
        <div>
          Web技術を活用し、人々の生活の質を高め、より豊かなものとします。
        </div>
      </div>
      <div>
        <h3>Value</h3>
        <ul>
          <li>ユーザーファースト</li>
          <ul>
            <li>ユーザーのニーズと期待を最優先に考え、価値を提供します。</li>
          </ul>
          <li>言語化</li>
          <ul>
            <li>複雑な問題も明瞭かつ正確に表現し、理解を深め、共有します。</li>
          </ul>
          <li>シンプルイズベスト</li>
          <ul>
            <li>
              シンプルで直感的なデザインと機能で、使いやすさを追求します。
            </li>
          </ul>
          <li>QCD</li>
          <ul>
            <li>状況に応じて、QCDのバランスを考慮し、最適な判断をします。</li>
          </ul>
        </ul>
      </div>
    </section>
  );
});
