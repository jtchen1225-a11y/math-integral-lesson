/* ============ 第 1 章　5-1 反導函數與不定積分 (新授課) ============
   節次：5-1.1 反導函數與基本法則、5-1.2 自由落體與半衰期模型
   教材來源：高三數學 (微積分教材 Ch05 p.214-220)
   教學動線：情境引入 → 動態探索 → 概念抽象 → 反例辨析 → 階梯典例 → 即堂檢測
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#2563eb'; // 本章主題色：科技藍
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  window.DECK.push({
    ch: 1,
    title: '5-1 反導函數與不定積分',
    color: C,
    sections: ['5-1.1 反導函數與基本法則', '5-1.2 自由落體與半衰期模型'],
    slides: [
      /* ---------- 5-1.1 第 1 頁：hook ---------- */
      {
        sec: '5-1.1', secName: '反導函數與基本法則',
        type: 'hook',
        title: '已知速度求位移？從「微分」反向追尋「原函數」',
        points: [
          '微分是已知位置求速度：\\(v(t) = s\'(t)\\)。',
          '逆向思考：若已知速度 \\(v(t)=3t^2\\)，位移函數是什麼？',
          '我們發現 \\(t^3\\)、\\(t^3+5\\)、\\(t^3-8\\) 的導數皆為 \\(3t^2\\)！',
          '如何用嚴謹數學語言，完整描述這一整群原函數？'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -2.5, xmax: 2.5, ymin: -4, ymax: 6 });
          const c1 = SV.func(P, x => 0.5 * x * x * x + 2, [-2, 2], { color: BLU, w: 2 });
          const c2 = SV.func(P, x => 0.5 * x * x * x, [-2, 2], { color: GRN, w: 2 });
          const c3 = SV.func(P, x => 0.5 * x * x * x - 2, [-2, 2], { color: AMB, w: 2 });
          const l1 = SV.tangent(P, x => 0.5 * x * x * x + 2, x => 1.5 * x * x, 1, { color: RED, label: 'k=1.5' });
          const l2 = SV.tangent(P, x => 0.5 * x * x, x => 1.5 * x * x, 1, { color: RED, label: 'k=1.5' });
          const l3 = SV.tangent(P, x => 0.5 * x * x * x - 2, x => 1.5 * x * x, 1, { color: RED, label: 'k=1.5' });
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + c1 + c2 + c3 + l1.svg + l2.svg + l3.svg +
            SV.vlabel(P.X(1.1), P.Y(4.5), 'x = 1 處切線皆平行！', RED, 13, { fw: 700 }));
        },
        caption: '垂直平移不改變各點切線斜率，所有曲線的導函數完全相同。'
      },

      /* ---------- 5-1.1 第 2 頁：explore ---------- */
      {
        sec: '5-1.1', secName: '反導函數與基本法則',
        type: 'explore',
        title: '動態探索：反導函數族群與常數 C 的平移不變性',
        inquiry: '請拖動下方常數 C 滑桿，觀察曲線垂直平移時在 x=1 處的切線斜率！',
        points: [
          '垂直平移時，曲線在同一橫坐標處的切線始終保持平行。',
          '這表明：同一導函數對應著無窮多個彼此相差常數的原函數。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>積分常數 C ＝ <span class="ival" id="cv">1.0</span></label>
            <input type="range" id="cs" min="-3.0" max="3.0" step="0.2" value="1.0"></div></div>`;
          const draw = () => {
            const Cval = +h.querySelector('#cs').value;
            h.querySelector('#cv').textContent = Cval.toFixed(1);
            const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -2.5, xmax: 2.5, ymin: -4, ymax: 6 });
            const fn = x => 0.5 * x * x + Cval;
            const curve = SV.func(P, fn, [-2.4, 2.4], { color: C, w: 2.5 });
            const tan = SV.tangent(P, fn, x => x, 1.0, { color: RED, label: `k=1.0 (恆定)` });
            const pDot = SV.dot(P.X(1), P.Y(fn(1)), RED, 5);
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + curve + tan.svg + pDot);
          };
          h.querySelector('#cs').oninput = draw; draw();
        },
        caption: '不論常數 C 為何值，曲線在 x=1 處的切線斜率永遠為 1.0。'
      },

      /* ---------- 5-1.1 第 3 頁：concept ---------- */
      {
        sec: '5-1.1', secName: '反導函數與基本法則',
        type: 'concept',
        title: '反導函數與不定積分的形式化定義',
        formula: {
          label: '不定積分定義式',
          tex: '\\int f(x)\\,dx = F(x) + c \\quad \\Longleftrightarrow \\quad F\'(x) = f(x)'
        },
        points: [
          '若 \\(F\'(x)=f(x)\\)，稱 \\(F(x)\\) 為 \\(f(x)\\) 的一個<b>反導函數</b>。',
          '所有反導函數的集合記為 \\(\\int f(x)\\,dx\\)，稱為<b>不定積分</b>。',
          '\\(\\int\\) 為積分號，\\(f(x)\\) 為被積函數，\\(c\\) 為<b>積分常數</b>。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '常數函數積分', tex: '\\int k\\,dx = kx + c', color: C, fill: '#f8fafc' },
            { label: '冪函數冪次法則', tex: '\\int x^n\\,dx = \\frac{1}{n+1}x^{n+1} + c \\quad (n \\ne -1)', color: GRN, fill: '#f0fdf4' },
            { label: '三角函數積分', tex: '\\int \\cos x\\,dx = \\sin x + c,\\quad \\int \\sin x\\,dx = -\\cos x + c', color: AMB, fill: '#fffbeb' },
            { label: '指數與對數積分', tex: '\\int e^x\\,dx = e^x + c,\\quad \\int \\frac{1}{x}\\,dx = \\ln|x| + c', color: VIO, fill: '#faf5ff' }
          ]);
        },
        caption: '基本積分法則由常見導數公式逆推而得，冪次法則分母不能為零。'
      },

      /* ---------- 5-1.1 第 4 頁：pitfall ---------- */
      {
        sec: '5-1.1', secName: '反導函數與基本法則',
        type: 'pitfall',
        title: '概念辨析：冪次法則為何排除 n = -1？',
        points: [
          '代入 \\(n=-1\\) 時，分母出現 \\(\\frac{1}{0}\\) 數學上無意義。',
          '事實上 \\(x^{-1} = \\frac{1}{x}\\) 的反導函數是對數 \\(\\ln|x|+c\\)。',
          '定義域涵蓋負數時，真數必須加上絕對值保護。'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -4, xmax: 4, ymin: -3, ymax: 4 });
          const cPos = SV.func(P, x => 1 / x, [0.25, 3.8], { color: RED, w: 2.2 });
          const cNeg = SV.func(P, x => 1 / x, [-3.8, -0.25], { color: RED, w: 2.2 });
          const lnPos = SV.func(P, x => Math.log(x), [0.1, 3.8], { color: BLU, w: 2, dash: '4 3' });
          const lnNeg = SV.func(P, x => Math.log(-x), [-3.8, -0.1], { color: BLU, w: 2, dash: '4 3' });
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + cPos + cNeg + lnPos + lnNeg +
            SV.vlabel(P.X(2), P.Y(1.2), 'y = 1/x', RED, 13, { fw: 700 }) +
            SV.vlabel(P.X(2.2), P.Y(0.4), 'y = ln|x|', BLU, 13, { fw: 700 }));
        },
        quiz: {
          q: '求不定積分 \\(\\int \\frac{1}{x^2}\\,dx\\) 的正確結果為？',
          options: [
            'A. \\(\\ln(x^2) + c\\)',
            'B. \\(-\\frac{1}{x} + c\\)',
            'C. \\(\\frac{1}{x} + c\\)',
            'D. \\(-\\frac{1}{3x^3} + c\\)'
          ],
          ans: 1,
          explain: '注意 \\(\\frac{1}{x^2} = x^{-2}\\)。套用冪次公式：\\(\\int x^{-2}dx = \\frac{x^{-1}}{-1}+c = -\\frac{1}{x}+c\\)。只有一次分母 \\(n=-1\\) 才對應對數函數。'
        }
      },

      /* ---------- 5-1.1 第 5 頁：example ---------- */
      {
        sec: '5-1.1', secName: '反導函數與基本法則',
        type: 'example',
        title: '典例剖析：代數化簡、根式拆項與三角恆等式求積',
        example: {
          q: '試求下列各不定積分：<br>(1) \\(\\int (5x^3 + 2x^2 + 3x - 4)\\,dx\\)<br>(2) \\(\\int \\frac{x^{\\frac{3}{2}}+2}{\\sqrt{x}}\\,dx\\)<br>(3) \\(\\int \\frac{\\sin x}{1-\\sin^2 x}\\,dx\\)',
          thinking: '多項式逐項求積；分式先拆項化為冪函數；三角函數利用 \\(\\cos^2 x + \\sin^2 x = 1\\) 化為已知積分形。',
          hints: [
            '第(1)小題直接套用冪函數積分法則 \\(\\int x^n dx = \\frac{1}{n+1}x^{n+1}\\)。',
            '第(2)小題拆為兩項：\\(\\frac{x^{3/2}}{x^{1/2}} = x\\)，\\(\\frac{2}{x^{1/2}} = 2x^{-1/2}\\)。',
            '第(3)小題分母化為 \\(\\cos^2 x\\)，拆為 \\(\\frac{\\sin x}{\\cos x}\\cdot \\frac{1}{\\cos x} = \\tan x \\sec x\\)。'
          ],
          steps: [
            '(1) 逐項積分：\\(\\frac{5}{4}x^4 + \\frac{2}{3}x^3 + \\frac{3}{2}x^2 - 4x + c\\)',
            '(2) 拆項化簡：\\(\\int (x + 2x^{-1/2})dx = \\frac{1}{2}x^2 + 2\\cdot \\frac{x^{1/2}}{1/2} + c = \\frac{1}{2}x^2 + 4\\sqrt{x} + c\\)',
            '(3) 三角化簡：\\(\\int \\frac{\\sin x}{\\cos^2 x}dx = \\int \\sec x \\tan x\\,dx = \\sec x + c\\)'
          ],
          ans: '(1) \\(\\frac{5}{4}x^4+\\frac{2}{3}x^3+\\frac{3}{2}x^2-4x+c\\)；(2) \\(\\frac{1}{2}x^2+4\\sqrt{x}+c\\)；(3) \\(\\sec x + c\\)',
          variant: {
            q: '【即堂變式】試求不定積分 \\(\\int (\\sqrt{x}+1)^2\\,dx\\)。',
            ans: '展開得 \\(\\int (x + 2\\sqrt{x} + 1)dx = \\frac{1}{2}x^2 + \\frac{4}{3}x^{\\frac{3}{2}} + x + c\\)。'
          }
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '步驟 1：代數結構分解', tex: '\\frac{A+B}{C} = \\frac{A}{C} + \\frac{B}{C}', color: BLU, fill: '#eff6ff' },
            { label: '步驟 2：還原為冪函數標準型', tex: 'x^a / x^b = x^{a-b}', color: GRN, fill: '#f0fdf4' },
            { label: '步驟 3：套用積分公式補常數 C', tex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + c', color: AMB, fill: '#fffbeb' }
          ]);
        },
        caption: '面對複雜積分式，優先進行代數拆項或三角化簡。'
      },

      /* ---------- 5-1.1 第 6 頁：practice ---------- */
      {
        sec: '5-1.1', secName: '反導函數與基本法則',
        type: 'practice',
        title: '隨堂即練：指數型與三角複合型不定積分辨析',
        quiz: {
          q: '求不定積分 \\(\\int (e^{3x} + \\cot x)\\,dx\\) 的正確結果為？',
          options: [
            'A. \\(3e^{3x} - \\csc^2 x + c\\)',
            'B. \\(\\frac{1}{3}e^{3x} + \\ln|\\sin x| + c\\)',
            'C. \\(e^{3x} + \\ln|\\cos x| + c\\)',
            'D. \\(\\frac{1}{3}e^{3x} - \\ln|\\sin x| + c\\)'
          ],
          ans: 1,
          explain: '由複合求導逆運算：\\(\\frac{d}{dx}(\\frac{1}{3}e^{3x}) = e^{3x}\\)；又 \\(\\cot x = \\frac{\\cos x}{\\sin x} = \\frac{(\\sin x)\'}{\\sin x}\\)，故其積分為 \\(\\ln|\\sin x| + c\\)。'
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '逆向連鎖律要點', tex: '\\int e^{kx}\\,dx = \\frac{1}{k}e^{kx} + c', color: C, fill: '#f8fafc' },
            { label: '對數導函數型態', tex: '\\int \\frac{g\'(x)}{g(x)}\\,dx = \\ln|g(x)| + c', color: GRN, fill: '#f0fdf4' }
          ]);
        },
        caption: '熟悉常見導數形，能一眼看出反導函數。'
      },

      /* ---------- 5-1.2 第 7 頁：hook ---------- */
      {
        sec: '5-1.2', secName: '自由落體與半衰期模型',
        type: 'hook',
        title: '現實情境：自由落體與放射性元素的衰變規律',
        points: [
          '物理運動學中，已知加速度可積分求速度，再積分求位移。',
          '核化學中，放射性原子衰變速率與現存核數量成正比：\\(f\'(t) = -kf(t)\\)。',
          '兩者皆透過「反導函數」與「初始條件」精確預測未來狀態！'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 9, ymin: -50, ymax: 350, step: 50 });
          const hCurve = SV.func(P, t => 313.6 - 4.9 * t * t, [0, 8], { color: RED, w: 2.5 });
          const ground = SV.func(P, t => 0, [0, 8.5], { color: '#64748b', dash: '3 3' });
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + hCurve + ground +
            SV.vlabel(P.X(0.2), P.Y(320), 'h(0) = 313.6 m', RED, 13, { fw: 700 }) +
            SV.vlabel(P.X(8), P.Y(15), 't = 8 s 著地', RED, 13, { fw: 700 }));
        },
        caption: '物體自 313.6 米高空落下，高度按二次拋物線規律衰減。'
      },

      /* ---------- 5-1.2 第 8 頁：explore ---------- */
      {
        sec: '5-1.2', secName: '自由落體與半衰期模型',
        type: 'explore',
        title: '動態探索：自由落體的速度、高度與著地時間',
        inquiry: '請拖動時間 t 滑桿，觀察物體在重力加速度 9.8 下的速度與離地高度！',
        points: [
          '加速度恆為 \\(9.8\\text{ m/s}^2\\)，速度線性增加：\\(v(t) = 9.8t\\)。',
          '下落位移 \\(d(t) = 4.9t^2\\)，離地高度 \\(h(t) = 313.6 - 4.9t^2\\)。',
          '當 \\(h(t)=0\\) 時著地，解得時間恰好為 \\(t=8\\) 秒。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>時間 t ＝ <span class="ival" id="tv">0.0</span> 秒</label>
            <input type="range" id="ts" min="0.0" max="8.0" step="0.2" value="0.0"></div></div>`;
          const draw = () => {
            const t = +h.querySelector('#ts').value;
            h.querySelector('#tv').textContent = t.toFixed(1);
            const v = 9.8 * t;
            const height = Math.max(0, 313.6 - 4.9 * t * t);
            const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 8.5, ymin: -20, ymax: 350, step: 50 });
            const curve = SV.func(P, x => 313.6 - 4.9 * x * x, [0, 8], { color: C, w: 2 });
            const pDot = SV.dot(P.X(t), P.Y(height), RED, 6);
            const ground = `<line x1="${P.X(0)}" y1="${P.Y(0)}" x2="${P.X(8.2)}" y2="${P.Y(0)}" stroke="#64748b" stroke-width="2"/>`;
            const stats = `<text x="210" y="55" font-size="13" font-weight="700" fill="${C}">速度 v = ${v.toFixed(1)} m/s</text>` +
                          `<text x="210" y="75" font-size="13" font-weight="700" fill="${RED}">高度 h = ${height.toFixed(1)} m</text>`;
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + ground + curve + pDot + stats);
          };
          h.querySelector('#ts').oninput = draw; draw();
        },
        caption: '隨時間推進，速度線性攀升，下落高度加速衰減至零。'
      },

      /* ---------- 5-1.2 第 9 頁：concept ---------- */
      {
        sec: '5-1.2', secName: '自由落體與半衰期模型',
        type: 'concept',
        title: '半衰期微分方程與指數衰變模型',
        formula: {
          label: '放射性衰變公式',
          tex: 'f(t) = f(0) \\cdot 2^{-\\frac{t}{T}} \\quad \\left( 半衰期\\ T = \\frac{\\ln 2}{k} \\right)'
        },
        points: [
          '由 \\(f\'/f = -k\\) 積分得 \\(\\ln(f/f_0) = -kt\\)。',
          '質量呈指數衰減規律：\\(f(t) = f(0)e^{-kt}\\)。',
          '半衰期 \\(T\\) 使質量減半：\\(T = \\frac{\\ln 2}{k}\\)。'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 4.5, ymin: -10, ymax: 110, step: 20 });
          const decay = SV.func(P, t => 100 * Math.pow(0.5, t), [0, 4.2], { color: VIO, w: 2.5 });
          const p0 = SV.dot(P.X(0), P.Y(100), RED, 5);
          const p1 = SV.dot(P.X(1), P.Y(50), RED, 5);
          const p2 = SV.dot(P.X(2), P.Y(25), RED, 5);
          const p3 = SV.dot(P.X(3), P.Y(12.5), RED, 5);
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + decay + p0 + p1 + p2 + p3 +
            SV.vlabel(P.X(1), P.Y(55), '1T (50%)', RED, 11, { fw: 700 }) +
            SV.vlabel(P.X(2), P.Y(30), '2T (25%)', RED, 11, { fw: 700 }) +
            SV.vlabel(P.X(3), P.Y(18), '3T (12.5%)', RED, 11, { fw: 700 }));
        },
        caption: '每經過一個半衰期 T，剩餘質量恰好縮減為前一時段的 50%。'
      },

      /* ---------- 5-1.2 第 10 頁：pitfall ---------- */
      {
        sec: '5-1.2', secName: '自由落體與半衰期模型',
        type: 'pitfall',
        title: '概念辨析：初值條件在決定唯一特解中的作用',
        points: [
          '不定積分給出的是含有任意常數 \\(c\\) 的「通解」。',
          '在真實物理與工程情境中，必須根據「初始條件」確定常數。',
          '若遺漏初值條件，將無法唯一鎖定運動軌跡或剩餘質量。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '通解 (General Solution)', tex: 's(t) = \\int v(t)dt = 4.9t^2 + c_2', color: C, fill: '#f8fafc' },
            { label: '代入初始條件 (t=0, s=0)', tex: 's(0) = 4.9(0)^2 + c_2 = 0 \\implies c_2 = 0', color: GRN, fill: '#f0fdf4' },
            { label: '特解 (Particular Solution)', tex: 's(t) = 4.9t^2 \\quad (唯一確定)', color: RED, fill: '#fff1f2' }
          ]);
        },
        quiz: {
          q: '質點加速度 \\(a(t) = 6t\\)，初速度 \\(v(0)=4\\)，初始位置 \\(s(0)=2\\)，則位移函數 \\(s(t)\\) 為？',
          options: [
            'A. \\(s(t) = 3t^2 + 4t + 2\\)',
            'B. \\(s(t) = t^3 + 4t + 2\\)',
            'C. \\(s(t) = t^3 + 2\\)',
            'D. \\(s(t) = 2t^3 + 4t + 2\\)'
          ],
          ans: 1,
          explain: '積分一次求速度：\\(v(t) = \\int 6t dt = 3t^2 + c_1\\)，由 \\(v(0)=4\\) 得 \\(c_1=4\\)。再積分求位移：\\(s(t) = \\int (3t^2+4)dt = t^3 + 4t + c_2\\)，由 \\(s(0)=2\\) 得 \\(c_2=2\\)。故 \\(s(t) = t^3 + 4t + 2\\)。'
        }
      },

      /* ---------- 5-1.2 第 11 頁：example ---------- */
      {
        sec: '5-1.2', secName: '自由落體與半衰期模型',
        type: 'example',
        title: '典例剖析：鐳元素半衰期模型與殘留質量計算',
        example: {
          q: '已知鐳的半衰期為 1600 年，目前質量為 100 mg。<br>(1) 歷經 \\(t\\) 年後其質量為何？<br>(2) 多少年後純鐳質量剩下 20 mg？',
          thinking: '建立以 2 為底的半衰期模型 \\(f(t) = 100 \\cdot 2^{-t/1600}\\)，令 \\(f(t)=20\\) 兩邊取對數解 \\(t\\)。',
          hints: [
            '半衰期模型公式：\\(f(t) = f(0)\\cdot 2^{-t/T}\\)，已知 \\(f(0)=100, T=1600\\)。',
            '令 \\(100\\cdot 2^{-t/1600} = 20\\)，化簡得 \\(2^{t/1600} = 5\\)。',
            '兩邊取常用對數：\\(\\frac{t}{1600}\\log 2 = \\log 5 = 1 - \\log 2\\)。'
          ],
          steps: [
            '(1) 質量函數為：\\(f(t) = 100\\cdot 2^{-\\frac{t}{1600}}\\) mg',
            '(2) 設 \\(t\\) 年後剩 20 mg：\\(100\\cdot 2^{-t/1600} = 20 \\implies 2^{t/1600} = 5\\)',
            '取對數：\\(t = \\frac{1600\\log 5}{\\log 2} = \\frac{1600(1-0.3010)}{0.3010} \\approx 3715\\) 年'
          ],
          ans: '(1) \\(f(t) = 100\\cdot 2^{-\\frac{t}{1600}}\\)；(2) 約 3715 年',
          variant: {
            q: '【即堂變式】若求放射物質衰變至原質量 25% 所需時間？',
            ans: '\\(25\\% = (1/2)^2\\)，恰為 2 個半衰期，即 \\(2 \\times 1600 = 3200\\) 年。'
          }
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '半衰期遞推規律', tex: '100\\text{ mg} \\xrightarrow{1600\\text{y}} 50\\text{ mg} \\xrightarrow{1600\\text{y}} 25\\text{ mg} \\xrightarrow{\\dots} 20\\text{ mg}', color: C, fill: '#f8fafc' },
            { label: '精確對數解析式', tex: 't = T \\cdot \\frac{\\log(f(0)/f(t))}{\\log 2} = 1600 \\cdot \\frac{\\log 5}{\\log 2} \\approx 3715', color: GRN, fill: '#f0fdf4' }
          ]);
        },
        caption: '指數方程兩邊取常用對數，能精確解出非整數倍半衰期時間。'
      },

      /* ---------- 5-1.2 第 12 頁：practice ---------- */
      {
        sec: '5-1.2', secName: '自由落體與半衰期模型',
        type: 'practice',
        title: '隨堂即練：地球地質年齡與半衰期估算',
        quiz: {
          q: '假設地球年齡約為 \\(10^{10}\\) 年，某元素半衰期為 \\(5\\times 10^9\\) 年，目前留存數量為原始量的百分之幾？',
          options: ['A. 50%', 'B. 25%', 'C. 12.5%', 'D. 6.25%'],
          ans: 1,
          explain: '衰變經歷的半衰期期數 \\(n = \\frac{10^{10}}{5\\times 10^9} = 2\\) 期。剩餘比例為 \\((\\frac{1}{2})^2 = \\frac{1}{4} = 25\\%\\)。'
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '期數計算', tex: 'n = \\frac{\\text{經歷時間}}{\\text{半衰期}} = \\frac{10^{10}}{5\\times 10^9} = 2', color: C, fill: '#f8fafc' },
            { label: '留存比例', tex: 'P = \\left(\\frac{1}{2}\\right)^n = \\left(\\frac{1}{2}\\right)^2 = 25\\%', color: GRN, fill: '#f0fdf4' }
          ]);
        },
        caption: '利用放射性定年法，可藉由同位素殘留比例測定岩石與地球地質年齡。'
      }
    ]
  });
})();
