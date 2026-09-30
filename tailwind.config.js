/** 洋平トレーニング：色はCSS変数（index.html の :root）に接続。ビルド: npm run build:css */
module.exports={
  content:['./index.html','./app.js','./actual.js','./theme.js','./voice.js','./study.js','./auth.js','./plan.js','./exercises.js'],
  safelist:[{pattern:/^k-(genie|goltore|run|gym|pilates|off|event|prep)$/}],
  theme:{extend:{
    colors:{bg:"var(--bg)",surface:"var(--surface)",fg:"var(--fg)",muted:"var(--muted)",line:"var(--line)",accent:"var(--accent)","accent-soft":"var(--accent-soft)",sand:"var(--sand)","sand-soft":"var(--sand-soft)",sky:"var(--sky)","sky-soft":"var(--sky-soft)",plum:"var(--plum)","plum-soft":"var(--plum-soft)",warn:"var(--warn)","warn-soft":"var(--warn-soft)",photo:"var(--photo)",field:"var(--field)"},
    fontFamily:{display:['"Dela Gothic One"','"Zen Kaku Gothic New"','"Hiragino Sans"','sans-serif'],body:['"Zen Kaku Gothic New"','"Hiragino Sans"','"Yu Gothic"','sans-serif'],mono:['"IBM Plex Mono"','ui-monospace','Menlo','monospace']}
  }}
};
