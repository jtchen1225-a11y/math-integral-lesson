/* ============ 第 3 章　5-3 定積分及其性質 (新授課) ============
   節次：5-3.1 定積分的定義與幾何代數和、5-3.2 幾何圖形求值與定積分五大性質
   教材來源：高三數學 (微積分教材 Ch05 p.230-237)
   教學動線：情境引入 → 動態探索 → 概念抽象 → 反例辨析 → 階梯典例 → 即堂檢測
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#059669'; // 本章主題色：翡翠綠
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  window.DECK.push({
    ch: 3,
    title: '5-3 定積分及其性質',
    color: C,
    sections: ['5-3.1 定積分的定義與幾何代數和', '5-3.2 幾何圖形求值與定積分五大性質'],
    slides: [
      /* ---------- 5-3.1 第 1 頁：hook ---------- */
      {
        sec: '5-3.1', secName: '定積分的定義與幾何代數和',
        type: 'hook',
        title: '記號革新：萊布尼茲如何將「求和」昇華為「積分號」',
        points: [
          '1675 年萊布尼茲將拉丁文 Summa 首字母 S 拉長為 \\(\\int\\)。',
          '\\(\\Delta x \\to dx\\)，離散和 \\(\\sum\\) 躍遷為 \\(\\int_a^b\\)。',
          '定積分不僅是面積，更代表累積量與代數和！'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '離散求和 (Riemann Sum)', tex: '\\sum_{k=1}^n f(c_k)\\,\\Delta x_k', color: BLU, fill: '#eff6ff', size: 19 },
            { label: '極限躍遷 (\\|P\\| \\to 0)', tex: '\\lim_{\\|P\\| \\to 0} \\sum \\dots \\quad \\Downarrow', color: RED, fill: '#fff1f2', size: 16 },
            { label: '連續定積分 (Leibniz Integral)', tex: '\\int_a^b f(x)\\,dx', color: GRN, fill: '#f0fdf4', size: 22 }
          ]);
        },
        caption: '拉丁文 Summa (和) 的 S 拉長為積分號 ∫，dx 代表無限小區間寬度。'
      },

      /* ---------- 5-3.1 第 2 頁：explore ---------- */
      {
        sec: '5-3.1', secName: '定積分的定義與幾何代數和',
        type: 'explore',
        title: '動態探索：定積分是「有向代數和」而非單純面積',
        inquiry: '請拖動右端點上限 b 滑桿，觀察當曲線穿過 x 軸時，定積分值與幾何面積的變化！',
        points: [
          '在 \\(x\\) 軸上方（\\(f(x)>0\\)），積分值為正，代表正面積。',
          '在 \\(x\\) 軸下方（\\(f(x)<0\\)），高為負值，定積分數值為負！',
          '定積分計算的是：<b>上方正面積減去下方負面積</b>的「淨代數和」。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>積分上限 b ＝ <span class="ival" id="bv">2.0</span></label>
            <input type="range" id="bs" min="-2.5" max="3.0" step="0.25" value="2.0"></div></div>`;
          const draw = () => {
            const b = +h.querySelector('#bs').value;
            h.querySelector('#bv').textContent = b.toFixed(2);
            const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -3.5, xmax: 3.5, ymin: -3.5, ymax: 3.5 });
            const line = SV.func(P, x => x, [-3.2, 3.2], { color: '#475569', w: 2 });
            // 下方負面積 ([-3, 0])
            let negPoly = '';
            if (b > -3) {
              const xEnd = Math.min(0, b);
              negPoly = SV.poly([[P.X(-3), P.Y(0)], [P.X(-3), P.Y(-3)], [P.X(xEnd), P.Y(xEnd)], [P.X(xEnd), P.Y(0)]], 'rgba(225,29,72,0.25)', RED, 1);
            }
            // 上方正面積 ([0, b])
            let posPoly = '';
            if (b > 0) {
              posPoly = SV.poly([[P.X(0), P.Y(0)], [P.X(b), P.Y(0)], [P.X(b), P.Y(b)]], 'rgba(5,150,105,0.25)', GRN, 1);
            }
            const intVal = 0.5 * (b * b - 9); // ∫_{-3}^b x dx = b^2/2 - 4.5
            const stats = `<text x="55" y="45" font-size="13" font-weight="700" fill="${C}">定積分值 ∫ x dx = ${intVal.toFixed(2)}</text>` +
                          `<text x="55" y="65" font-size="12" font-weight="600" fill="#64748b">綠色為正 (+), 紅色為負 (-)</text>`;
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + negPoly + posPoly + line + stats);
          };
          h.querySelector('#bs').oninput = draw; draw();
        },
        caption: '下方紅色區域帶負號，上方綠色區域帶正號，兩者相互抵消。'
      },

      /* ---------- 5-3.1 第 3 頁：concept ---------- */
      {
        sec: '5-3.1', secName: '定積分的定義與幾何代數和',
        type: 'concept',
        title: '定積分的定義與幾何面積轉化準則',
        formula: {
          label: '定積分定義式',
          tex: '\\int_a^b f(x)\\,dx = \\lim_{\\|P\\| \\to 0} \\sum_{k=1}^n f(c_k)\\,\\Delta x_k'
        },
        points: [
          '若 \\(f(x)\\ge 0\\)，圖形面積 \\(A = \\int_a^b f(x)\\,dx\\)。',
          '若 \\(f(x)\\le 0\\)，圖形面積 \\(A = -\\int_a^b f(x)\\,dx\\)。',
          '若有正有負，幾何面積為絕對值積分 \\(A = \\int_a^b |f(x)|\\,dx\\)。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '定積分（代數和）', tex: '\\int_a^b f(x)\\,dx = A_{\\text{上}} - A_{\\text{下}}', color: C, fill: '#f0fdf4' },
            { label: '幾何面積（全正實數）', tex: '\\text{面積} = A_{\\text{上}} + A_{\\text{下}} = \\int_a^b |f(x)|\\,dx', color: RED, fill: '#fff1f2' }
          ]);
        },
        caption: '計算面積必須分段取絕對值，避免正負面積相消。'
      },

      /* ---------- 5-3.1 第 4 頁：pitfall ---------- */
      {
        sec: '5-3.1', secName: '定積分的定義與幾何代數和',
        type: 'pitfall',
        title: '概念辨析：定積分值為 0，是否代表圖形面積為 0？',
        points: [
          '<b>經典陷阱</b>：許多學生誤認為積分為 0 等同於圖形沒有面積。',
          '典型反例：奇函數 \\(f(x)=x^3\\) 在對稱區間 \\([-1, 1]\\) 上。',
          '因奇函數正負對稱相消，\\(\\int_{-1}^1 x^3 dx = 0\\)，但面積為 \\(0.5\\)！'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -1.5, xmax: 1.5, ymin: -1.5, ymax: 1.5 });
          const curve = SV.func(P, x => x * x * x, [-1.2, 1.2], { color: C, w: 2.2 });
          const leftArea = SV.poly([[P.X(-1), P.Y(0)], [P.X(-1), P.Y(-1)], [P.X(0), P.Y(0)]], 'rgba(225,29,72,0.25)', RED, 1);
          const rightArea = SV.poly([[P.X(0), P.Y(0)], [P.X(1), P.Y(1)], [P.X(1), P.Y(0)]], 'rgba(5,150,105,0.25)', GRN, 1);
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + leftArea + rightArea + curve +
            SV.vlabel(P.X(-0.8), P.Y(-0.4), '面積 = 1/4 (-)', RED, 12, { fw: 700 }) +
            SV.vlabel(P.X(0.4), P.Y(0.6), '面積 = 1/4 (+)', GRN, 12, { fw: 700 }));
        },
        quiz: {
          q: '定積分 \\(\\int_{-1}^1 x^3\\,dx\\) 與該曲線與 x 軸在 \\([-1,1]\\) 所圍面積分別為？',
          options: [
            'A. 定積分為 0，面積為 0',
            'B. 定積分為 0，面積為 \\(\\frac{1}{2}\\)',
            'C. 定積分為 \\(\\frac{1}{2}\\)，面積為 \\(\\frac{1}{2}\\)',
            'D. 定積分為 0，面積為 1'
          ],
          ans: 1,
          explain: '奇函數在對稱區間定積分正負相消為 0。幾何面積為 \\(\\int_{-1}^0 (-x^3)dx + \\int_0^1 x^3 dx = \\frac{1}{4} + \\frac{1}{4} = \\frac{1}{2}\\)。'
        }
      },

      /* ---------- 5-3.1 第 5 頁：example ---------- */
      {
        sec: '5-3.1', secName: '定積分的定義與幾何代數和',
        type: 'example',
        title: '典例剖析：利用定積分定義嚴格計算一次函數定積分',
        example: {
          q: '利用定積分的極限定義，分別計算：<br>(1) \\(\\int_0^3 x\\,dx\\)<br>(2) \\(\\int_{-3}^0 x\\,dx\\)',
          thinking: '進行 \\(n\\) 等分割，取右端點採樣，利用等差數列求和公式 \\(\\sum_{k=1}^n k = \\frac{n(n+1)}{2}\\) 計算極限。',
          hints: [
            '第(1)小題：\\(\\Delta x = \\frac{3}{n}\\)，\\(c_k = \\frac{3k}{n}\\)，黎曼和為 \\(\\sum \\frac{3k}{n}\\cdot \\frac{3}{n}\\)。',
            '第(2)小題：\\(\\Delta x = \\frac{3}{n}\\)，\\(c_k = -3 + \\frac{3k}{n}\\)。'
          ],
          steps: [
            '(1) \\(S_n = \\sum_{k=1}^n \\frac{9k}{n^2} = \\frac{9}{n^2} \\cdot \\frac{n(n+1)}{2} = \\frac{9}{2}\\left(1 + \\frac{1}{n}\\right)\\)。取極限得 \\(\\frac{9}{2}\\)。',
            '(2) \\(S_n = \\sum_{k=1}^n \\left(-3 + \\frac{3k}{n}\\right)\\frac{3}{n} = -9 + \\frac{9}{2}\\left(1 + \\frac{1}{n}\\right)\\)。取極限得 \\(-9 + \\frac{9}{2} = -\\frac{9}{2}\\)。'
          ],
          ans: '(1) \\(\\frac{9}{2}\\)；(2) \\(-\\frac{9}{2}\\) (幾何意義上為底 3、高 3 的直角三角形，下方帶負號)',
          variant: {
            q: '【即堂變式】根據上述結論，求 \\(\\int_{-3}^3 x\\,dx\\) 的值？',
            ans: '由區間可加性：\\(\\int_{-3}^3 x dx = -\\frac{9}{2} + \\frac{9}{2} = 0\\)。'
          }
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '第一部分 [0, 3]', tex: '\\int_0^3 x\\,dx = +\\frac{1}{2}\\times 3 \\times 3 = +\\frac{9}{2}', color: GRN, fill: '#f0fdf4' },
            { label: '第二部分 [-3, 0]', tex: '\\int_{-3}^0 x\\,dx = -\\frac{1}{2}\\times 3 \\times 3 = -\\frac{9}{2}', color: RED, fill: '#fff1f2' }
          ]);
        },
        caption: '直線函數的定積分精確對應幾何直角三角形的代數符號面積。'
      },

      /* ---------- 5-3.1 第 6 頁：practice ---------- */
      {
        sec: '5-3.1', secName: '定積分的定義與幾何代數和',
        type: 'practice',
        title: '隨堂即練：絕對值函數的幾何面積定積分',
        quiz: {
          q: '定積分 \\(\\int_{-1}^1 |x|\\,dx\\) 的計算值為？',
          options: ['A. 0', 'B. 1', 'C. 2', 'D. \\(\\frac{1}{2}\\)'],
          ans: 1,
          explain: '\\(|x|\\) 圖形在 \\([-1,0]\\) 與 \\([0,1]\\) 上構成兩個底為 1、高為 1 的直角三角形。各面積為 \\(\\frac{1}{2}\\times 1 \\times 1 = \\frac{1}{2}\\)，總和為 \\(\\frac{1}{2} + \\frac{1}{2} = 1\\)。'
        },
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -1.5, xmax: 1.5, ymin: -0.5, ymax: 1.5 });
          const curve = SV.func(P, x => Math.abs(x), [-1.2, 1.2], { color: C, w: 2.2 });
          const area = SV.poly([[P.X(-1), P.Y(0)], [P.X(-1), P.Y(1)], [P.X(0), P.Y(0)], [P.X(1), P.Y(1)], [P.X(1), P.Y(0)]], 'rgba(5,150,105,0.25)', GRN, 1);
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + area + curve +
            SV.vlabel(P.X(0), P.Y(0.7), 'y = |x|，面積 = 1/2 + 1/2 = 1', C, 12, { fw: 700 }));
        },
        caption: '絕對值圖形恆在 x 軸上方，左右兩塊三角形面積相加。'
      },

      /* ---------- 5-3.2 第 7 頁：hook ---------- */
      {
        sec: '5-3.2', secName: '幾何圖形求值與定積分五大性質',
        type: 'hook',
        title: '巧妙化簡：利用基礎幾何面積免求反導函數',
        points: [
          '許多被積函數的幾何圖形是規則的幾何形狀（長方形、梯形、半圓）。',
          '例如遇見 \\(\\int_{-3}^3 \\sqrt{9-x^2}\\,dx\\)，不需要三角代換！',
          '一眼看出被積函數是半徑為 3 的上半圓，直接用面積公式秒殺！'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -4, xmax: 4, ymin: -1, ymax: 4 });
          const curve = SV.func(P, x => Math.sqrt(Math.max(0, 9 - x * x)), [-3, 3], { color: C, w: 2.5 });
          let arcPts = [[P.X(-3), P.Y(0)]];
          for (let i = -30; i <= 30; i++) {
            const x = i / 10;
            arcPts.push([P.X(x), P.Y(Math.sqrt(Math.max(0, 9 - x * x)))]);
          }
          arcPts.push([P.X(3), P.Y(0)]);
          const semi = SV.poly(arcPts, 'rgba(5,150,105,0.25)', GRN, 1);
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + semi + curve +
            SV.vlabel(P.X(0), P.Y(1.5), '上半圓面積 = (1/2)π(3)² = 9π/2', C, 13, { fw: 800 }));
        },
        caption: '利用圓的幾何方程，將看似複雜的根式定積分秒級求出。'
      },

      /* ---------- 5-3.2 第 8 頁：explore ---------- */
      {
        sec: '5-3.2', secName: '幾何圖形求值與定積分五大性質',
        type: 'explore',
        title: '動態探索：定積分五大基本性質——區間可拆性',
        inquiry: '請拖動分界點 c 滑桿，觀察區間拆分 ∫_a^b = ∫_a^c + ∫_c^b 的面積無縫拼接！',
        points: [
          '區間可加性：\\(\\int_a^b f = \\int_a^c f + \\int_c^b f\\)。',
          '不論分點 \\(c\\) 位於區間內部或外部，等式始終成立！'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>分界點 c ＝ <span class="ival" id="cv2">2.0</span></label>
            <input type="range" id="cs2" min="1.0" max="4.0" step="0.2" value="2.0"></div></div>`;
          const draw = () => {
            const cVal = +h.querySelector('#cs2').value;
            h.querySelector('#cv2').textContent = cVal.toFixed(1);
            const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: 0, xmax: 5.5, ymin: 0, ymax: 5 });
            const fn = x => 0.5 * x + 1;
            const line = SV.func(P, fn, [0.5, 5.2], { color: '#334155', w: 2 });
            const poly1 = SV.poly([[P.X(1), P.Y(0)], [P.X(1), P.Y(fn(1))], [P.X(cVal), P.Y(fn(cVal))], [P.X(cVal), P.Y(0)]], 'rgba(37,99,235,0.25)', BLU, 1);
            const poly2 = SV.poly([[P.X(cVal), P.Y(0)], [P.X(cVal), P.Y(fn(cVal))], [P.X(5), P.Y(fn(5))], [P.X(5), P.Y(0)]], 'rgba(5,150,105,0.25)', GRN, 1);
            const stats = `<text x="55" y="45" font-size="12.5" font-weight="700" fill="${BLU}">左段 [1, ${cVal.toFixed(1)}]</text>` +
                          `<text x="180" y="45" font-size="12.5" font-weight="700" fill="${GRN}">右段 [${cVal.toFixed(1)}, 5]</text>` +
                          `<text x="55" y="65" font-size="12.5" font-weight="700" fill="${C}">總和 ∫₁⁵ = ∫₁ᶜ + ∫_c⁵ (守恆)</text>`;
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + poly1 + poly2 + line + stats);
          };
          h.querySelector('#cs2').oninput = draw; draw();
        },
        caption: '藍色區間與綠色區間拼接，總面積恆等於整體區間積分。'
      },

      /* ---------- 5-3.2 第 9 頁：concept ---------- */
      {
        sec: '5-3.2', secName: '幾何圖形求值與定積分五大性質',
        type: 'concept',
        title: '定積分五大核心運算性質手冊',
        formula: {
          label: '線性性質與區間可加性',
          tex: '\\int_a^b [\\alpha f(x) + \\beta g(x)]\\,dx = \\alpha \\int_a^b f(x)\\,dx + \\beta \\int_a^b g(x)\\,dx'
        },
        points: [
          '<b>性質 1</b>：\\(\\int_a^a f(x)dx = 0\\)（上下限相同，區間長度為 0）。',
          '<b>性質 2</b>：\\(\\int_b^a f(x)dx = -\\int_a^b f(x)dx\\)（顛倒積分方向反號）。',
          '<b>性質 3</b>：\\(\\int_a^b f = \\int_a^c f + \\int_c^b f\\)（區間拼接性）。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '性質 1 & 2：界限規則', tex: '\\int_a^a = 0,\\quad \\int_a^b = -\\int_b^a', color: C, fill: '#f0fdf4' },
            { label: '性質 3：區間拼接', tex: '\\int_a^b = \\int_a^c + \\int_c^b \\quad (任意\\ c\\ 皆成立)', color: BLU, fill: '#eff6ff' },
            { label: '性質 4 & 5：線性組合', tex: '\\int kf = k\\int f,\\quad \\int(f\\pm g) = \\int f \\pm \\int g', color: VIO, fill: '#faf5ff' }
          ]);
        },
        caption: '定積分的五大基本代數性質，是後續繁複計算化繁為簡的利器。'
      },

      /* ---------- 5-3.2 第 10 頁：pitfall ---------- */
      {
        sec: '5-3.2', secName: '幾何圖形求值與定積分五大性質',
        type: 'pitfall',
        title: '概念辨析：區間可拆性中，分界點 c 必須在 a 與 b 之間嗎？',
        points: [
          '<b>普遍誤區</b>：直覺以為必須滿足 \\(a \\le c \\le b\\) 才能拆分。',
          '事實上：由 \\(\\int_c^b = -\\int_b^c\\)，即使 \\(c\\) 在外部亦恆成立！',
          '外插亦恆等：\\(\\int_1^2 = \\int_1^5 - \\int_2^5\\)。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '內部插值情況', tex: '1 < c < 5 \\implies \\int_1^5 = \\int_1^c + \\int_c^5 \\quad (直觀)', color: GRN, fill: '#f0fdf4' },
            { label: '外部點 c = 8 情況', tex: '\\int_1^5 = \\int_1^8 + \\int_8^5 = \\int_1^8 - \\int_5^8 \\quad (依舊恆等！)', color: RED, fill: '#fff1f2' }
          ]);
        },
        quiz: {
          q: '已知 \\(\\int_1^3 f(x)dx = 5\\)，\\(\\int_2^3 f(x)dx = 3\\)，則 \\(\\int_1^2 f(x)dx\\) 等於？',
          options: ['A. 2', 'B. 8', 'C. -2', 'D. 15'],
          ans: 0,
          explain: '由區間可加性：\\(\\int_1^3 f dx = \\int_1^2 f dx + \\int_2^3 f dx\\)。代入已知數值：\\(5 = \\int_1^2 f dx + 3 \\implies \\int_1^2 f dx = 5 - 3 = 2\\)。'
        }
      },

      /* ---------- 5-3.2 第 11 頁：example ---------- */
      {
        sec: '5-3.2', secName: '幾何圖形求值與定積分五大性質',
        type: 'example',
        title: '典例剖析：半圓面積求積分與已知定積分的線性組合',
        example: {
          q: '求下列定積分：<br>(1) \\(\\int_{-3}^3 \\sqrt{9-x^2}\\,dx\\)<br>(2) 已知 \\(\\int_1^3 x^2 dx = \\frac{26}{3}, \\int_3^5 x^2 dx = \\frac{98}{3}\\)，求 \\(\\int_1^5 3x^2 dx\\)。',
          thinking: '(1) 被積函數為圓心在原點、半徑 3 之上半圓；(2) 區間拼接後提出常數倍 3。',
          hints: [
            '半圓半徑為 3，面積公式為 \\(\\frac{1}{2}\\pi r^2 = \\frac{1}{2}\\pi (3)^2 = \\frac{9\\pi}{2}\\)。',
            '區間拼接：\\(\\int_1^5 x^2 dx = \\int_1^3 x^2 dx + \\int_3^5 x^2 dx = \\frac{26}{3} + \\frac{98}{3} = \\frac{124}{3}\\)。',
            '常數倍：\\(\\int_1^5 3x^2 dx = 3\\int_1^5 x^2 dx\\)。'
          ],
          steps: [
            '(1) 幾何法：\\(y=\\sqrt{9-x^2} \\ge 0 \\implies x^2+y^2=9\\)，面積為 \\(\\frac{1}{2}\\pi(3)^2 = \\frac{9\\pi}{2}\\)。',
            '(2) 區間可加性：\\(\\int_1^5 x^2 dx = \\frac{26+98}{3} = \\frac{124}{3}\\)。',
            '常數倍提外：\\(\\int_1^5 3x^2 dx = 3\\times \\frac{124}{3} = 124\\)。'
          ],
          ans: '(1) \\(\\frac{9\\pi}{2}\\)；(2) 124',
          variant: {
            q: '【即堂變式】試求 \\(\\int_{-2}^2 (x^3 + \\sqrt{4-x^2})\\,dx\\) 的值？',
            ans: '\\(x^3\\) 為奇函數定積分為 0，剩餘半徑為 2 的半圓面積 \\(\\frac{1}{2}\\pi(2)^2 = 2\\pi\\)。'
          }
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '幾何半圓定積分', tex: '\\int_{-r}^r \\sqrt{r^2-x^2}\\,dx = \\frac{1}{2}\\pi r^2', color: C, fill: '#f0fdf4' },
            { label: '線性運算技巧', tex: '\\int 3x^2 dx = 3 \\left(\\int_1^3 + \\int_3^5\\right) = 3\\times \\frac{124}{3} = 124', color: BLU, fill: '#eff6ff' }
          ]);
        },
        caption: '幾何形狀面積法與代數性質聯手，大幅精簡解題步驟。'
      },

      /* ---------- 5-3.2 第 12 頁：practice ---------- */
      {
        sec: '5-3.2', secName: '幾何圖形求值與定積分五大性質',
        type: 'practice',
        title: '隨堂即練：分段函數幾何面積求定積分',
        quiz: {
          q: '設 \\(f(x)\\) 在 \\([-2, 2]\\) 為上半圓 \\(y=\\sqrt{4-x^2}\\)，在 \\([2, 4]\\) 為直線連接 \\((2,0)\\) 與 \\((4,2)\\)。則 \\(\\int_{-2}^4 f(x)\\,dx\\) 等於？',
          options: ['A. \\(2\\pi + 2\\)', 'B. \\(4\\pi + 2\\)', 'C. \\(2\\pi + 4\\)', 'D. \\(\\pi + 2\\)'],
          ans: 0,
          explain: '拆為兩部分：\\([-2,2]\\) 半圓面積為 \\(\\frac{1}{2}\\pi (2)^2 = 2\\pi\\)；\\([2,4]\\) 為底 2、高 2 的直角三角形，面積為 \\(\\frac{1}{2}\\times 2\\times 2 = 2\\)。總和為 \\(2\\pi + 2\\)。'
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '半圓區域 [-2, 2]', tex: 'A_1 = \\frac{1}{2}\\pi(2)^2 = 2\\pi', color: C, fill: '#f0fdf4' },
            { label: '三角形區域 [2, 4]', tex: 'A_2 = \\frac{1}{2}\\times 2 \\times 2 = 2', color: AMB, fill: '#fffbeb' },
            { label: '全域總和', tex: '\\int_{-2}^4 f(x)dx = A_1 + A_2 = 2\\pi + 2', color: BLU, fill: '#eff6ff' }
          ]);
        },
        caption: '分段幾何函數分塊求積，再行累加。'
      }
    ]
  });
})();
