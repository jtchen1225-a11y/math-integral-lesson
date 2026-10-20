/* ============ 第 4 章　5-4 微積分基本定理 (新授課) ============
   節次：5-4.1 微分均值與積分均值定理、5-4.2 微積分基本定理與曲線面積
   教材來源：高三數學 (微積分教材 Ch05 p.240-249)
   教學動線：情境引入 → 動態探索 → 概念抽象 → 反例辨析 → 階梯典例 → 即堂檢測
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#d97706'; // 本章主題色：琥珀金
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  window.DECK.push({
    ch: 4,
    title: '5-4 微積分基本定理',
    color: C,
    sections: ['5-4.1 微分均值與積分均值定理', '5-4.2 微積分基本定理與曲線面積'],
    slides: [
      /* ---------- 5-4.1 第 1 頁：hook ---------- */
      {
        sec: '5-4.1', secName: '微分均值與積分均值定理',
        type: 'hook',
        title: '世紀之橋：微分與積分是如何奇蹟般相互逆轉的？',
        points: [
          '微分起源於幾何切線與瞬間速度（局部斜率極限）。',
          '積分起源於曲邊梯形求積與累積總量（全域黎曼和）。',
          '這兩大看似毫無關聯的分支，被牛頓與萊布尼茲以「基本定理」緊密相連！',
          '而連通兩座高峰的核心基石，正是「均值定理」。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '微分學 (Differential Calculus)', tex: '\\text{切線斜率} \\quad f\'(x) = \\lim_{\\Delta x \\to 0} \\frac{\\Delta y}{\\Delta x}', color: BLU, fill: '#eff6ff', size: 17 },
            { label: '微積分基本定理 (FTC 雙向橋樑)', tex: '\\frac{d}{dx} \\left[ \\int_a^x f(t)\\,dt \\right] = f(x) \\quad \\Longleftrightarrow \\quad \\int_a^b F\'(x)\\,dx = F(b) - F(a)', color: AMB, fill: '#fffbeb', size: 16 },
            { label: '積分學 (Integral Calculus)', tex: '\\text{面積總和} \\quad \\int_a^b f(x)\\,dx = \\lim_{\\|P\\| \\to 0} \\sum f(c_k)\\,\\Delta x_k', color: GRN, fill: '#f0fdf4', size: 17 }
          ]);
        },
        caption: '微積分基本定理（FTC）揭示求導與求積互為逆運算的世紀真理。'
      },

      /* ---------- 5-4.1 第 2 頁：explore ---------- */
      {
        sec: '5-4.1', secName: '微分均值與積分均值定理',
        type: 'explore',
        title: '動態探索：積分均值定理——尋找等面積矩形高 f(c)',
        inquiry: '請拖動取樣點 c 滑桿，觀察水平高度 f(c) 構成的矩形面積何時恰好等於曲線下面積！',
        points: [
          '積分均值定理：存在 \\(c\\) 使 \\(\\int_a^b f = f(c)(b-a)\\)。',
          '幾何本質是「削峰填谷」：凸出曲線面積恰好填補凹下空缺！'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>點 c 橫坐標 ＝ <span class="ival" id="cv3">1.00</span></label>
            <input type="range" id="cs3" min="0.1" max="2.9" step="0.05" value="1.00"></div></div>`;
          const draw = () => {
            const cVal = +h.querySelector('#cs3').value;
            h.querySelector('#cv3').textContent = cVal.toFixed(2);
            const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 3.5, ymin: -1, ymax: 9.5 });
            const fn = x => x * x;
            const curve = SV.func(P, fn, [0, 3], { color: '#64748b', w: 2 });
            const fc = fn(cVal);
            // 繪製矩形 [0, 3] × [0, f(c)]
            const rect = `<rect x="${P.X(0)}" y="${P.Y(fc)}" width="${P.X(3) - P.X(0)}" height="${P.Y(0) - P.Y(fc)}" fill="rgba(217,119,6,0.25)" stroke="${AMB}" stroke-width="1.8"/>`;
            const hLine = `<line x1="${P.X(0)}" y1="${P.Y(fc)}" x2="${P.X(3)}" y2="${P.Y(fc)}" stroke="${RED}" stroke-width="2" stroke-dasharray="4 3"/>`;
            const cDot = SV.dot(P.X(cVal), P.Y(fc), RED, 5);
            const exactC = Math.sqrt(3); // ≈ 1.732
            const rectArea = 3 * fc;
            const stats = `<text x="55" y="45" font-size="12.5" font-weight="700" fill="${AMB}">矩形面積 = 3 × ${fc.toFixed(2)} = ${rectArea.toFixed(2)}</text>` +
                          `<text x="55" y="65" font-size="12.5" font-weight="700" fill="${GRN}">真實面積 ∫₀³ x² dx = 9.00 (理論 c = √3 ≈ 1.73)</text>`;
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + rect + curve + hLine + cDot + stats);
          };
          h.querySelector('#cs3').oninput = draw; draw();
        },
        caption: '當 c = √3 ≈ 1.732 時，琥珀色矩形面積 9.00 恰好完全等於拋物線曲邊面積。'
      },

      /* ---------- 5-4.1 第 3 頁：concept ---------- */
      {
        sec: '5-4.1', secName: '微分均值與積分均值定理',
        type: 'concept',
        title: '積分均值定理與變上限積分函數',
        formula: {
          label: '積分均值定理與變上限函數',
          tex: 'f(c) = \\frac{1}{b-a}\\int_a^b f(x)\\,dx \\quad (c \\in (a,b)), \\quad G(x) = \\int_a^x f(t)\\,dt'
        },
        points: [
          '<b>平均值</b>：連續函數在 \\([a,b]\\) 的平均高度必在某點 \\(c\\) 取得。',
          '<b>變上限函數</b>：\\(G(x) = \\int_a^x f(t)dt\\) 記錄累積面積。',
          '微積分基本定理第一部分 (FTC-1)：導函數即被積函數 \\(G\'(x) = f(x)\\)！'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: 'FTC 第一部分 (求導逆運算)', tex: '\\frac{d}{dx}\\left[\\int_a^x f(t)\\,dt\\right] = f(x)', color: AMB, fill: '#fffbeb' },
            { label: '推論：反導函數必存在', tex: 'G(x) = \\int_a^x f(t)dt \\text{ 是 } f(x) \\text{ 的一個反導函數}', color: GRN, fill: '#f0fdf4' }
          ]);
        },
        caption: '變上限函數將面積累積與原函數存在性牢牢綁定在一起。'
      },

      /* ---------- 5-4.1 第 4 頁：pitfall ---------- */
      {
        sec: '5-4.1', secName: '微分均值與積分均值定理',
        type: 'pitfall',
        title: '概念辨析：變上限積分求導自變量與啞變數混淆',
        points: [
          '在 \\(\\int_a^x f(t)dt\\) 中，\\(t\\) 是被積內部啞變數。',
          '若積分上限為複合函數 \\(u(x)\\)，必須連鎖求導！',
          '複合上限：\\((\\int_a^{u(x)} f)\' = f(u(x)) \\cdot u\'(x)\\)。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '單變量上限', tex: '\\frac{d}{dx}\\int_a^x f(t)dt = f(x)', color: GRN, fill: '#f0fdf4' },
            { label: '複合上限（乘鏈式導數）', tex: '\\frac{d}{dx}\\int_a^{u(x)} f(t)dt = f(u(x))\\cdot u\'(x)', color: AMB, fill: '#fffbeb' },
            { label: '下限為變量（注意換負號）', tex: '\\frac{d}{dx}\\int_x^b f(t)dt = -\\frac{d}{dx}\\int_b^x f(t)dt = -f(x)', color: RED, fill: '#fff1f2' }
          ]);
        },
        quiz: {
          q: '求導式 \\(\\frac{d}{dx}\\int_0^{x^2} \\frac{2}{1+t^2}\\,dt\\) 的正確結果為？',
          options: [
            'A. \\(\\frac{2}{1+x^4}\\)',
            'B. \\(\\frac{4x}{1+x^4}\\)',
            'C. \\(\\frac{2}{1+x^2}\\)',
            'D. \\(\\frac{4x}{1+x^2}\\)'
          ],
          ans: 1,
          explain: '由連鎖律：\\(u=x^2, u\'=2x\\)。求導得 \\(f(u)\\cdot u\' = \\frac{2}{1+(x^2)^2}\\cdot 2x = \\frac{4x}{1+x^4}\\)。切忌漏乘上限導函數 \\(2x\\)！'
        }
      },

      /* ---------- 5-4.1 第 5 頁：example ---------- */
      {
        sec: '5-4.1', secName: '微分均值與積分均值定理',
        type: 'example',
        title: '典例剖析：變上限積分求導與連鎖律經典演練',
        example: {
          q: '利用微積分基本定理，求下列各式的導數：<br>(1) \\(\\frac{d}{dx}\\int_1^x \\cos t\\,dt\\)<br>(2) \\(\\frac{d}{dx}\\int_x^2 5t\\sin t\\,dt\\)<br>(3) \\(\\frac{d}{dx}\\int_1^{x^3+1} \\sin t\\,dt\\)',
          thinking: '直接套用 FTC-1；下限為自變量時先互換上下限添負號；上限為複合函數時連鎖求導。',
          hints: [
            '(1) 標準形式，直接將 \\(t\\) 換為 \\(x\\)。',
            '(2) 先改寫為 \\(-\\int_2^x 5t\\sin t dt\\)，再求導。',
            '(3) 令 \\(u = x^3+1\\)，求導後乘上 \\(u\' = 3x^2\\)。'
          ],
          steps: [
            '(1) \\(\\frac{d}{dx}\\int_1^x \\cos t\\,dt = \\cos x\\)',
            '(2) \\(\\frac{d}{dx}\\left(-\\int_2^x 5t\\sin t\\,dt\\right) = -5x\\sin x\\)',
            '(3) 令 \\(u=x^3+1\\)：\\(\\sin(x^3+1)\\cdot \\frac{d}{dx}(x^3+1) = 3x^2\\sin(x^3+1)\\)'
          ],
          ans: '(1) \\(\\cos x\\)；(2) \\(-5x\\sin x\\)；(3) \\(3x^2\\sin(x^3+1)\\)',
          variant: {
            q: '【即堂變式】若 \\(F(x) = \\int_0^x (t^2-4)dt\\)，求 \\(F(x)\\) 的極值點？',
            ans: '令 \\(F\'(x) = x^2-4 = 0 \\implies x = \\pm 2\\)。極大值點為 \\(x=-2\\)，極小值點為 \\(x=2\\)。'
          }
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '解題法則 1：直換', tex: '\\frac{d}{dx}\\int_a^x f(t)dt \\Longrightarrow f(x)', color: GRN, fill: '#f0fdf4' },
            { label: '解題法則 2：變號', tex: '\\frac{d}{dx}\\int_x^b f(t)dt \\Longrightarrow -f(x)', color: RED, fill: '#fff1f2' },
            { label: '解題法則 3：連鎖', tex: '\\frac{d}{dx}\\int_a^{u(x)} f(t)dt \\Longrightarrow f(u(x))\\cdot u\'(x)', color: AMB, fill: '#fffbeb' }
          ]);
        },
        caption: '變上限求導三部曲：辨識位置、處理符號、補齊鏈式導函數。'
      },

      /* ---------- 5-4.1 第 6 頁：practice ---------- */
      {
        sec: '5-4.1', secName: '微分均值與積分均值定理',
        type: 'practice',
        title: '隨堂即練：變上限積分求導綜合診斷',
        quiz: {
          q: '求導式 \\(\\frac{d}{dx}\\int_0^x (3t^2+2)\\,dt\\) 的結果為？',
          options: [
            'A. \\(6x\\)',
            'B. \\(3x^2 + 2\\)',
            'C. \\(x^3 + 2x\\)',
            'D. \\(6x + 2\\)'
          ],
          ans: 1,
          explain: '根據微積分基本定理第一部分，變上限函數求導只需將被積函數中的變量 \\(t\\) 直接換為 \\(x\\)，即為 \\(3x^2+2\\)。注意不是先求原函數再去二次求導！'
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '微積分基本定理 FTC-1', tex: '\\frac{d}{dx}\\left[ \\int_0^x (3t^2+2)dt \\right] = 3x^2 + 2', color: C, fill: '#fffbeb' },
            { label: '本質直觀', tex: '\\text{面積變化率} = \\text{當前邊界高度}', color: GRN, fill: '#f0fdf4' }
          ]);
        },
        caption: '切記：變上限求導可直接寫出答案，無須先繁瑣求積。'
      },

      /* ---------- 5-4.2 第 7 頁：hook ---------- */
      {
        sec: '5-4.2', secName: '微積分基本定理與曲線面積',
        type: 'hook',
        title: '終極突破：牛頓-萊布尼茲公式，告別繁瑣極限求和！',
        points: [
          '之前求拋物線面積，必須劃分 \\(n\\) 等分、套立方和公式再求極限。',
          '微積分基本定理第二部分 (FTC-2)：只需找到一個反導函數端點相減！',
          '\\(\\int_0^2 x^3 dx = [\\frac{x^4}{4}]_0^2 = 4\\)，告別繁瑣求和！'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '黎曼和古典解法（耗時 10 分鐘）', tex: '\\lim_{n\\to\\infty} \\sum_{k=1}^n \\frac{8k^3}{n^3}\\cdot\\frac{2}{n} = \\lim_{n\\to\\infty} \\frac{16}{n^4}\\left[\\frac{n(n+1)}{2}\\right]^2 = 4', color: RED, fill: '#fff1f2', size: 15 },
            { label: '牛頓-萊布尼茲公式（3 秒秒殺）', tex: '\\int_0^2 x^3\\,dx = \\left[ \\frac{x^4}{4} \\right]_0^2 = \\frac{2^4}{4} - 0 = 4', color: GRN, fill: '#f0fdf4', size: 21 }
          ]);
        },
        caption: '人類數學史上的壯麗飛躍：反導函數直接終結繁瑣的極限求和。'
      },

      /* ---------- 5-4.2 第 8 頁：explore ---------- */
      {
        sec: '5-4.2', secName: '微積分基本定理與曲線面積',
        type: 'explore',
        title: '動態探索：牛頓-萊布尼茲公式的端點增量直觀',
        inquiry: '請拖動積分上限 b 滑桿，觀察原函數高度差 F(b) - F(a) 如何精準等於累積面積！',
        points: [
          '公式：\\(\\int_a^b f(x)dx = F(b) - F(a) = [F(x)]_a^b\\)。',
          '幾何直觀：變化率的連續積分等於原函數在端點的增量！',
          '常數自然抵消：\\((F(b)+c) - (F(a)+c) = F(b) - F(a)\\)。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>積分上限 b ＝ <span class="ival" id="bv2">2.0</span></label>
            <input type="range" id="bs2" min="1.0" max="3.0" step="0.1" value="2.0"></div></div>`;
          const draw = () => {
            const b = +h.querySelector('#bs2').value;
            h.querySelector('#bv2').textContent = b.toFixed(1);
            const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: 0, xmax: 3.5, ymin: 0, ymax: 9.5 });
            const fn = x => x * x;
            const curve = SV.func(P, fn, [0.5, 3.2], { color: C, w: 2.5 });
            let pts = [[P.X(1), P.Y(0)]];
            const steps = 30;
            for (let i = 0; i <= steps; i++) {
              const x = 1 + (b - 1) * (i / steps);
              pts.push([P.X(x), P.Y(fn(x))]);
            }
            pts.push([P.X(b), P.Y(0)]);
            const areaPoly = SV.poly(pts, 'rgba(217,119,6,0.3)', AMB, 1.5);
            // 原函數差值 F(b) - F(1) = b^3/3 - 1/3
            const exactArea = (b * b * b - 1) / 3;
            const stats = `<text x="55" y="45" font-size="12.5" font-weight="700" fill="${AMB}">累積面積 ∫₁ᵇ x² dx = ${exactArea.toFixed(3)}</text>` +
                          `<text x="55" y="65" font-size="12.5" font-weight="700" fill="${GRN}">原函數高度差 F(b) - F(1) = ${exactArea.toFixed(3)}</text>`;
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + areaPoly + curve + stats);
          };
          h.querySelector('#bs2').oninput = draw; draw();
        },
        caption: '圖中陰影面積與原函數 F(x)=x³/3 的增量高度落差完全嚴格相等。'
      },

      /* ---------- 5-4.2 第 9 頁：concept ---------- */
      {
        sec: '5-4.2', secName: '微積分基本定理與曲線面積',
        type: 'concept',
        title: '牛頓-萊布尼茲公式與定積分求面積法則',
        formula: {
          label: '牛頓-萊布尼茲公式 (FTC-2)',
          tex: '\\int_a^b f(x)\\,dx = \\left[ F(x) \\right]_a^b = F(b) - F(a) \\quad (其中\\ F\'(x) = f(x))'
        },
        points: [
          '<b>求解兩部曲</b>：先求反導函數 \\(F(x)\\)，再代入端點作差 \\(F(b)-F(a)\\)。',
          '<b>平面面積求解</b>：先求零點劃分區間，再取各區間絕對值積分。',
          '夾角面積：\\(A = \\int_a^b (f_{\\text{上}} - g_{\\text{下}})dx\\)。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '多項式基本型', tex: '\\int_a^b x^n\\,dx = \\left[\\frac{x^{n+1}}{n+1}\\right]_a^b', color: C, fill: '#fffbeb' },
            { label: '三角函數基本型', tex: '\\int_0^\\pi \\sin x\\,dx = [-\\cos x]_0^\\pi = -(-1) - (-1) = 2', color: GRN, fill: '#f0fdf4' },
            { label: '指數基本型', tex: '\\int_0^1 e^x\\,dx = [e^x]_0^1 = e - 1', color: VIO, fill: '#faf5ff' }
          ]);
        },
        caption: '掌握反導函數求法與端點代入計算，便能暢行微積分求積。'
      },

      /* ---------- 5-4.2 第 10 頁：pitfall ---------- */
      {
        sec: '5-4.2', secName: '微積分基本定理與曲線面積',
        type: 'pitfall',
        title: '概念辨析：定積分求面積漏判交點符號的大坑',
        points: [
          '<b>致命失誤</b>：求「圖形所圍面積」時，若函數跨越橫軸，不可直接從頭積到尾！',
          '必須先令 \\(f(x)=0\\) 求出所有實根，分段計算各區間面積。',
          '否則上方正值與下方負值將互相抵消，導致算出的面積遠小於真實值。'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 2.5, ymin: -1.5, ymax: 3.5 });
          const curve = SV.func(P, x => x * x - 1, [0, 2.2], { color: RED, w: 2.2 });
          const a1 = SV.poly([[P.X(0), P.Y(0)], [P.X(0), P.Y(-1)], [P.X(1), P.Y(0)]], 'rgba(225,29,72,0.25)', RED, 1);
          const a2 = SV.poly([[P.X(1), P.Y(0)], [P.X(2), P.Y(3)], [P.X(2), P.Y(0)]], 'rgba(5,150,105,0.25)', GRN, 1);
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + a1 + a2 + curve +
            SV.vlabel(P.X(0.4), P.Y(-0.5), '負面積 (-2/3)', RED, 12, { fw: 700 }) +
            SV.vlabel(P.X(1.4), P.Y(1.2), '正面積 (+4/3)', GRN, 12, { fw: 700 }));
        },
        quiz: {
          q: '求 \\(y=x^2-1\\) 與 x 軸在 \\([0, 2]\\) 所圍成的區域總面積，正確的表達式為？',
          options: [
            'A. \\(\\int_0^2 (x^2-1)dx\\)',
            'B. \\(\\int_0^1 (1-x^2)dx + \\int_1^2 (x^2-1)dx\\)',
            'C. \\(\\int_0^1 (x^2-1)dx + \\int_1^2 (1-x^2)dx\\)',
            'D. \\(\\int_0^2 |x^2+1|dx\\)'
          ],
          ans: 1,
          explain: '零點為 \\(x=1\\)。在 \\([0,1]\\) 上 \\(x^2-1 \\le 0\\)，面積取相反數 \\(\\int_0^1 (1-x^2)dx = \\frac{2}{3}\\)；在 \\([1,2]\\) 上為正，面積為 \\(\\int_1^2 (x^2-1)dx = \\frac{4}{3}\\)。總面積為 \\(\\frac{2}{3}+\\frac{4}{3}=2\\)。直接積分只有 \\(\\frac{2}{3}\\)！'
        }
      },

      /* ---------- 5-4.2 第 11 頁：example ---------- */
      {
        sec: '5-4.2', secName: '微積分基本定理與曲線面積',
        type: 'example',
        title: '典例剖析：拋物線與正弦曲線所圍面積的標準步驟',
        example: {
          q: '(1) 求拋物線 \\(y=6-x-x^2\\) 與 x 軸所圍區域面積。<br>(2) 求 \\(y=\\sin x\\) 與 x 軸在 \\([0, \\frac{2\\pi}{3}]\\) 所圍面積。',
          thinking: '(1) 令 \\(y=0\\) 解出與 \\(x\\) 軸交點作為積分限，再利用 FTC 求定積分；(2) 在區間內 \\(\\sin x \\ge 0\\)，直接積分代端點。',
          hints: [
            '拋物線求根：\\(6-x-x^2 = 0 \\iff (x+3)(2-x)=0\\)，交點為 \\(x=-3\\) 與 \\(x=2\\)。',
            '反導函數：\\(F(x) = 6x - \\frac{x^2}{2} - \\frac{x^3}{3}\\)。',
            '正弦反導函數：\\(\\int \\sin x dx = -\\cos x\\)。'
          ],
          steps: [
            '(1) 面積 \\(A = \\int_{-3}^2 (6-x-x^2)dx = \\left[6x - \\frac{x^2}{2} - \\frac{x^3}{3}\\right]_{-3}^2\\)',
            '代入上限 2：\\(12 - 2 - \\frac{8}{3} = \\frac{22}{3}\\)',
            '代入下限 -3：\\(-18 - \\frac{9}{2} + 9 = -\\frac{27}{2}\\)',
            '相減作差：\\(\\frac{22}{3} - (-\\frac{27}{2}) = \\frac{44+81}{6} = \\frac{125}{6}\\)',
            '(2) \\(A = \\int_0^{2\\pi/3} \\sin x dx = [-\\cos x]_0^{2\\pi/3} = -\\cos\\frac{2\\pi}{3} - (-\\cos 0) = -(-\\frac{1}{2}) - (-1) = \\frac{3}{2}\\)'
          ],
          ans: '(1) 拋物線所圍面積為 \\(\\frac{125}{6}\\)；(2) 正弦曲線所圍面積為 \\(\\frac{3}{2}\\)',
          variant: {
            q: '【即堂變式】試求拋物線 \\(y=4-x^2\\) 與 x 軸所圍成的區域面積？',
            ans: '\\(\\int_{-2}^2 (4-x^2)dx = [4x - \\frac{x^3}{3}]_{-2}^2 = \\frac{16}{3} - (-\\frac{16}{3}) = \\frac{32}{3}\\)。'
          }
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '拋物線拱形面積', tex: 'A = \\int_{-3}^2 (6-x-x^2)\\,dx = \\frac{125}{6} \\approx 20.833', color: C, fill: '#fffbeb' },
            { label: '正弦拱形面積', tex: 'A = \\int_0^{\\frac{2\\pi}{3}} \\sin x\\,dx = \\left[-\\cos x\\right]_0^{\\frac{2\\pi}{3}} = \\frac{3}{2}', color: GRN, fill: '#f0fdf4' }
          ]);
        },
        caption: '熟練運用牛頓-萊布尼茲公式，平面解析幾何面積手到擒來。'
      },

      /* ---------- 5-4.2 第 12 頁：practice ---------- */
      {
        sec: '5-4.2', secName: '微積分基本定理與曲線面積',
        type: 'practice',
        title: '隨堂即練：微積分基本定理全章總結評量',
        quiz: {
          q: '計算定積分 \\(\\int_1^3 (3x^2 - 2x + 1)\\,dx\\) 的數值為？',
          options: ['A. 20', 'B. 22', 'C. 26', 'D. 18'],
          ans: 0,
          explain: '求被積函數的反導函數：\\(F(x) = x^3 - x^2 + x\\)。代入上限 3：\\(F(3) = 27 - 9 + 3 = 21\\)；代入下限 1：\\(F(1) = 1 - 1 + 1 = 1\\)。作差得 \\(F(3) - F(1) = 21 - 1 = 20\\)。'
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '反導函數', tex: 'F(x) = x^3 - x^2 + x', color: C, fill: '#fffbeb' },
            { label: '代入端點作差', tex: '\\left[x^3 - x^2 + x\\right]_1^3 = 21 - 1 = 20', color: GRN, fill: '#f0fdf4' }
          ]);
        },
        caption: '恭喜完成第五章「積分」全套核心新課探究學習！'
      }
    ]
  });
})();
