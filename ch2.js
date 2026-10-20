/* ============ 第 2 章　5-2 面積與黎曼和 (新授課) ============
   節次：5-2.1 曲邊梯形與分割逼近、5-2.2 黎曼和與極限定義
   教材來源：高三數學 (微積分教材 Ch05 p.221-229)
   教學動線：情境引入 → 動態探索 → 概念抽象 → 反例辨析 → 階梯典例 → 即堂檢測
   ============================================================ */
window.DECK = window.DECK || [];
(function () {
  const C = '#7c3aed'; // 本章主題色：典雅紫
  const RED = '#e11d48', GRN = '#059669', BLU = '#2563eb', VIO = '#7c3aed', AMB = '#d97706';

  function svg(vb, inner) {
    return `<div style="width:100%;text-align:center"><svg viewBox="${vb}" style="max-width:100%">${inner}</svg></div>`;
  }

  window.DECK.push({
    ch: 2,
    title: '5-2 面積與黎曼和',
    color: C,
    sections: ['5-2.1 曲邊梯形與分割逼近', '5-2.2 黎曼和與極限定義'],
    slides: [
      /* ---------- 5-2.1 第 1 頁：hook ---------- */
      {
        sec: '5-2.1', secName: '曲邊梯形與分割逼近',
        type: 'hook',
        title: '求積困境：從歐幾里得多邊形到「曲邊梯形」',
        points: [
          '古典幾何能精確計算矩形、三角形、多邊形等直線邊界圖形面積。',
          '但面對彎曲邊界（如拋物線 \\(y=x^2\\) 下方），古典公式束手無策！',
          '中國魏晉劉徽「割圓術」：割之彌細，所失彌少，割之又割，以至於不可割。',
          '微積分先驅的核心智慧：以直代曲、無限分割、積零成整！'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 3.5, ymin: -1, ymax: 9.5 });
          const curve = SV.func(P, x => x * x, [0, 3], { color: VIO, w: 2.5 });
          const r4 = SV.riemann(P, x => x * x, 0, 3, 4, { method: 'left', color: 'rgba(124,58,237,0.25)', stroke: VIO });
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + r4.svg + curve +
            SV.vlabel(P.X(1.5), P.Y(5), '曲邊梯形難題', VIO, 14, { fw: 800 }) +
            SV.vlabel(P.X(1.5), P.Y(1.5), '用長條小矩形拼湊逼近', RED, 12, { fw: 700 }));
        },
        caption: '將曲線下方區域切成數個長條小長方形，初步估算圖形面積。'
      },

      /* ---------- 5-2.1 第 2 頁：explore ---------- */
      {
        sec: '5-2.1', secName: '曲邊梯形與分割逼近',
        type: 'explore',
        title: '動態探索：矩形分割逼近曲邊梯形面積',
        inquiry: '請拖動分割段數 n 滑桿（2 至 30），觀察小矩形面積和如何逼近拋物線下方真實面積！',
        points: [
          '分割數 \\(n\\) 越大，小長方形寬度 \\(\\Delta x = \\frac{b-a}{n}\\) 越窄。',
          '長方形頂部突出的鋸齒空隙迅速縮小，面積和大膽逼近精確極限值 \\(9.0\\)。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>分割段數 n ＝ <span class="ival" id="nv">4</span></label>
            <input type="range" id="ns" min="2" max="30" step="1" value="4"></div></div>`;
          const draw = () => {
            const n = +h.querySelector('#ns').value;
            h.querySelector('#nv').textContent = n;
            const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 3.5, ymin: -1, ymax: 9.5 });
            const fn = x => x * x;
            const curve = SV.func(P, fn, [0, 3], { color: VIO, w: 2.5 });
            const r = SV.riemann(P, fn, 0, 3, n, { method: 'mid', color: 'rgba(124,58,237,0.3)', stroke: VIO });
            const info = `<text x="55" y="45" font-size="13" font-weight="700" fill="${VIO}">中點面積和 Sn = ${r.sum.toFixed(3)}</text>` +
                         `<text x="55" y="65" font-size="12" font-weight="600" fill="#64748b">寬度 Δx = ${(3 / n).toFixed(3)} (真實面積 = 9.000)</text>`;
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + r.svg + curve + info);
          };
          h.querySelector('#ns').oninput = draw; draw();
        },
        caption: '段數 n 增加時，中點黎曼和 Sn 與精確值 9.000 的差距迅速縮減。'
      },

      /* ---------- 5-2.1 第 3 頁：concept ---------- */
      {
        sec: '5-2.1', secName: '曲邊梯形與分割逼近',
        type: 'concept',
        title: '分割、範數與黎曼和 (Riemann Sum) 形式化定義',
        formula: {
          label: '黎曼和定義式',
          tex: 'S_n = \\sum_{k=1}^n f(c_k)\\,\\Delta x_k \\quad (c_k \\in [x_{k-1}, x_k])'
        },
        points: [
          '<b>分割</b>：將 \\([a,b]\\) 劃分為 \\(n\\) 個子區間 \\([x_{k-1}, x_k]\\)。',
          '<b>範數</b>：\\(\\|P\\|=\\max \\Delta x_k\\)；等分時為 \\(\\frac{b-a}{n}\\)。',
          '在每一子區間任取樣本點 \\(c_k\\)，矩形面積和稱為<b>黎曼和</b>。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '左端點法 (Left Sum)', tex: 'c_k = x_{k-1},\\quad L_n = \\sum_{k=1}^n f(x_{k-1})\\Delta x', color: BLU, fill: '#eff6ff' },
            { label: '右端點法 (Right Sum)', tex: 'c_k = x_k,\\quad U_n = \\sum_{k=1}^n f(x_k)\\Delta x', color: RED, fill: '#fff1f2' },
            { label: '中點法 (Midpoint Sum)', tex: 'c_k = \\frac{x_{k-1}+x_k}{2},\\quad M_n = \\sum_{k=1}^n f(c_k)\\Delta x', color: GRN, fill: '#f0fdf4' }
          ]);
        },
        caption: '樣本點取在左端點、右端點或中點，分別對應不同的矩形取高方式。'
      },

      /* ---------- 5-2.1 第 4 頁：pitfall ---------- */
      {
        sec: '5-2.1', secName: '曲邊梯形與分割逼近',
        type: 'pitfall',
        title: '概念辨析：左端點和、右端點和與中點和的精度比較',
        points: [
          '對嚴格遞增函數，左端點和必小於真實值（下和），右端點和必大於真實值（上和）。',
          '中點法在每個小區間矩形頂部「削峰填谷」，誤差正負抵消，精度極高！',
          '不論選取何種樣本點，極限狀態下均收斂至相同數值。'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: 0.5, xmax: 3.5, ymin: 0, ymax: 10 });
          const curve = SV.func(P, x => x * x, [1, 3], { color: VIO, w: 2.5 });
          const leftR = SV.riemann(P, x => x * x, 1, 3, 4, { method: 'left', color: 'rgba(37,99,235,0.2)', stroke: BLU });
          const rightR = SV.riemann(P, x => x * x, 1, 3, 4, { method: 'right', color: 'rgba(225,29,72,0.15)', stroke: RED });
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + rightR.svg + leftR.svg + curve +
            SV.vlabel(P.X(1.8), P.Y(9), '藍: 左端點 (下和) ｜ 紅: 右端點 (上和)', '#1e293b', 12, { fw: 700 }));
        },
        quiz: {
          q: '設 \\(f(x)\\) 在 \\([a,b]\\) 上嚴格單調遞減。若進行等分割，則下列何者必然成立？',
          options: [
            'A. 左端點黎曼和為上和，右端點黎曼和為下和',
            'B. 左端點黎曼和為下和，右端點黎曼和為上和',
            'C. 左端點和必等於中點和',
            'D. 無法判定'
          ],
          ans: 0,
          explain: '因函數單調遞減，子區間左端點取到最大值 \\(M_k\\)，右端點取到最小值 \\(m_k\\)。故左端點矩形和為上和，右端點為下和。'
        }
      },

      /* ---------- 5-2.1 第 5 頁：example ---------- */
      {
        sec: '5-2.1', secName: '曲邊梯形與分割逼近',
        type: 'example',
        title: '典例剖析：f(x) = x² 四等分割的左端點、右端點與中點和',
        example: {
          q: '設 \\(f(x)=x^2, x\\in[1,3]\\)，\\(P\\) 為 \\([1,3]\\) 的 4 等分割。<br>試求：(1) 左端點黎曼和；(2) 右端點黎曼和；(3) 取中點時的黎曼和。',
          thinking: '區間長度為 2，4 等分割則 \\(\\Delta x = \\frac{3-1}{4} = 0.5\\)。分點為 \\(1, 1.5, 2, 2.5, 3\\)。分別計算矩形高與面積和。',
          hints: [
            '左端點取值：\\(f(1)=1, f(1.5)=2.25, f(2)=4, f(2.5)=6.25\\)。',
            '右端點取值：\\(f(1.5)=2.25, f(2)=4, f(2.5)=6.25, f(3)=9\\)。',
            '中點取值點為 \\(1.25, 1.75, 2.25, 2.75\\)。'
          ],
          steps: [
            '(1) 左端點和：\\(0.5\\times (1 + \\frac{9}{4} + 4 + \\frac{25}{4}) = 0.5\\times \\frac{54}{4} = 6.75\\)',
            '(2) 右端點和：\\(0.5\\times (\\frac{9}{4} + 4 + \\frac{25}{4} + 9) = 0.5\\times \\frac{86}{4} = 10.75\\)',
            '(3) 中點和：\\(0.5\\times [(\\frac{5}{4})^2 + (\\frac{7}{4})^2 + (\\frac{9}{4})^2 + (\\frac{11}{4})^2] = 0.5\\times \\frac{276}{16} = 8.625\\)'
          ],
          ans: '(1) 6.75 (下和 \\(L_4\\))；(2) 10.75 (上和 \\(U_4\\))；(3) 8.625 (中點和，最逼近真實面積 26/3 ≈ 8.667)',
          variant: {
            q: '【即堂變式】若取 8 等分割，下和 \\(L_8\\) 與上和 \\(U_8\\) 各為多少？',
            ans: '\\(L_8 = \\frac{123}{16} = 7.6875\\)，\\(U_8 = \\frac{155}{16} = 9.6875\\)。差距顯著縮小！'
          }
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '下和 L₄ ＝ 6.75', tex: '6.75 \\le \\text{真實面積 } A \\le 10.75', color: BLU, fill: '#eff6ff' },
            { label: '中點和 M₄ ＝ 8.625', tex: '|M_4 - A| = |8.625 - 8.667| = 0.042', color: GRN, fill: '#f0fdf4' },
            { label: '上和 U₄ ＝ 10.75', tex: 'U_4 - L_4 = 4.0 \\xrightarrow{n=8} U_8 - L_8 = 2.0', color: RED, fill: '#fff1f2' }
          ]);
        },
        caption: '中點法誤差僅約 0.042，展現驚人的收斂優勢。'
      },

      /* ---------- 5-2.1 第 6 頁：practice ---------- */
      {
        sec: '5-2.1', secName: '曲邊梯形與分割逼近',
        type: 'practice',
        title: '隨堂即練：中點黎曼和逼近計算',
        quiz: {
          q: '設 \\(f(x)=x^2+3, x\\in[0,2]\\)，取 \\(n=4\\) 等分割並以中點法求面積近似值，結果為？',
          options: [
            'A. \\(\\frac{69}{8} = 8.625\\)',
            'B. \\(\\frac{35}{4} = 8.75\\)',
            'C. \\(8.667\\)',
            'D. \\(9.0\\)'
          ],
          ans: 0,
          explain: '\\(\\Delta x = \\frac{2-0}{4} = 0.5\\)。中點採樣點為 \\(0.25, 0.75, 1.25, 1.75\\)。函數值分別為 \\(3.0625, 3.5625, 4.5625, 6.0625\\)，總和為 \\(17.25\\)。乘以寬度 \\(0.5\\times 17.25 = 8.625 = \\frac{69}{8}\\)。'
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '中點採樣坐標', tex: 'c_k \\in \\{0.25,\\; 0.75,\\; 1.25,\\; 1.75\\}', color: C, fill: '#f8fafc' },
            { label: '求和展開式', tex: 'S_4 = 0.5 \\times \\sum_{k=1}^4 (c_k^2 + 3) = \\frac{69}{8}', color: GRN, fill: '#f0fdf4' }
          ]);
        },
        caption: '掌握子區間中點坐標與對應函數值的高效累加。'
      },

      /* ---------- 5-2.2 第 7 頁：hook ---------- */
      {
        sec: '5-2.2', secName: '黎曼和與極限定義',
        type: 'hook',
        title: '無限細分：當分割數 n → ∞ 時的精確面積',
        points: [
          '任何有限分割只能求得近似值，無法得到毫釐不差的真實面積。',
          '當分割越來越細（\\(\\|P\\| \\to 0\\) 即 \\(n \\to \\infty\\)），下和與上和會收斂嗎？',
          '若下和與上和被逼入同一個確定實數，面積難題即告終結！'
        ],
        visual: (h) => {
          const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 2.5, ymin: -1, ymax: 9 });
          const curve = SV.func(P, x => x * x * x, [0, 2], { color: VIO, w: 2.5 });
          h.innerHTML = svg('0 0 440 270', P.defs + P.svg + curve +
            SV.vlabel(P.X(1.1), P.Y(6), 'y = x³ 在 [0, 2]', VIO, 14, { fw: 800 }) +
            SV.vlabel(P.X(1.1), P.Y(2), '夾擠收斂：lim L_n = lim U_n = 面積！', GRN, 13, { fw: 700 }));
        },
        caption: '夾擠定理在此處扮演關鍵角色：上和向下壓，下和向上頂。'
      },

      /* ---------- 5-2.2 第 8 頁：explore ---------- */
      {
        sec: '5-2.2', secName: '黎曼和與極限定義',
        type: 'explore',
        title: '動態探索：夾擠定理——上和與下和的雙向包夾',
        inquiry: '請拖動滑桿增大分割數 n，觀察上和 Uₙ（紅）與下和 Lₙ（藍）差值如何趨於 0！',
        points: [
          '上和與下和的差值為 \\(U_n - L_n = \\frac{[f(b)-f(a)](b-a)}{n}\\)。',
          '當 \\(n \\to \\infty\\) 時，兩者差距嚴格趨於 0，黎曼和被夾擠至唯一精確值。'
        ],
        visual: (h) => {
          h.innerHTML = `<div style="width:100%"><div id="fig"></div>
            <div class="ictrl"><label>分割數 n ＝ <span class="ival" id="nv2">4</span></label>
            <input type="range" id="ns2" min="4" max="40" step="2" value="4"></div></div>`;
          const draw = () => {
            const n = +h.querySelector('#ns2').value;
            h.querySelector('#nv2').textContent = n;
            const P = SV.plane({ x0: 45, y0: 25, w: 350, h: 220, xmin: -0.5, xmax: 2.5, ymin: -1, ymax: 9 });
            const fn = x => x * x * x;
            const curve = SV.func(P, fn, [0, 2], { color: VIO, w: 2.5 });
            const rL = SV.riemann(P, fn, 0, 2, n, { method: 'left', color: 'rgba(37,99,235,0.25)', stroke: BLU });
            const rR = SV.riemann(P, fn, 0, 2, n, { method: 'right', color: 'rgba(225,29,72,0.15)', stroke: RED });
            const gap = rR.sum - rL.sum;
            const stats = `<text x="55" y="45" font-size="12.5" font-weight="700" fill="${BLU}">下和 L_n = ${rL.sum.toFixed(3)}</text>` +
                          `<text x="55" y="65" font-size="12.5" font-weight="700" fill="${RED}">上和 U_n = ${rR.sum.toFixed(3)}</text>` +
                          `<text x="55" y="85" font-size="12.5" font-weight="700" fill="${GRN}">差值 Gap = ${gap.toFixed(3)} → 0</text>`;
            h.querySelector('#fig').innerHTML = svg('0 0 440 270', P.defs + P.svg + rR.svg + rL.svg + curve + stats);
          };
          h.querySelector('#ns2').oninput = draw; draw();
        },
        caption: '隨著 n 增大，紅色上矩形與藍色下矩形間的空隙迅速消弭。'
      },

      /* ---------- 5-2.2 第 9 頁：concept ---------- */
      {
        sec: '5-2.2', secName: '黎曼和與極限定義',
        type: 'concept',
        title: '曲邊梯形面積的嚴謹極限定義',
        formula: {
          label: '曲邊梯形面積定義',
          tex: 'a(R) = \\lim_{\\|P\\| \\to 0} \\sum_{k=1}^n f(c_k)\\,\\Delta x_k'
        },
        points: [
          '若函數 \\(f(x)\\ge 0\\) 在 \\([a,b]\\) 連續，則黎曼和的極限保證唯一存在。',
          '極限值與分割方法、取樣點位置完全無關。',
          '這就是現代分析學對「平面區域幾何面積」的最高形式化定義。'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '必背自然數立方和公式', tex: '\\sum_{k=1}^n k^3 = 1^3+2^3+\\dots+n^3 = \\left[\\frac{n(n+1)}{2}\\right]^2', color: VIO, fill: '#faf5ff' },
            { label: '平方和與等差和公式', tex: '\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6},\\quad \\sum_{k=1}^n k = \\frac{n(n+1)}{2}', color: C, fill: '#f8fafc' }
          ]);
        },
        caption: '求多項式曲邊梯形面積極限時，自然數冪和公式是核心計算武器。'
      },

      /* ---------- 5-2.2 第 10 頁：pitfall ---------- */
      {
        sec: '5-2.2', secName: '黎曼和與極限定義',
        type: 'pitfall',
        title: '概念辨析：只要 n → ∞ 就一定能保證 ||P|| → 0 嗎？',
        points: [
          '<b>重大盲區</b>：若為非等分割，僅僅 \\(n \\to \\infty\\) 不代表 \\(\\|P\\| \\to 0\\)！',
          '反例：若只把區間左半邊無限細分，右半邊始終保持長度 1，則無法覆蓋全局。',
          '因此定義中必須嚴格要求<b>最大子區間長度範數</b> \\(\\|P\\| \\to 0\\)！'
        ],
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '等分割條件下', tex: '\\Delta x = \\frac{b-a}{n} \\xrightarrow{n \\to \\infty} 0 \\quad (成立)', color: GRN, fill: '#f0fdf4' },
            { label: '任意分割條件下', tex: '\\|P\\| = \\max_{1 \\le k \\le n} \\Delta x_k \\to 0 \\quad (定義嚴格要求)', color: RED, fill: '#fff1f2' }
          ]);
        },
        quiz: {
          q: '在定積分與黎曼和極限定義中，為何必須以「\\(\\|P\\| \\to 0\\)」作為條件？',
          options: [
            'A. 確保所有子區間的寬度都同時被壓縮至無限小',
            'B. 確保函數在端點的斜率為零',
            'C. 限制子區間數量必須是偶數',
            'D. 避免被積函數出現虛數'
          ],
          ans: 0,
          explain: '範數 \\(\\|P\\|\\) 代表所有子區間長度的最大值。最大值趨於 0，意味著所有小區間全部同時無限縮小，才能無死角覆蓋整個積分區間。'
        }
      },

      /* ---------- 5-2.2 第 11 頁：example ---------- */
      {
        sec: '5-2.2', secName: '黎曼和與極限定義',
        type: 'example',
        title: '典例剖析：利用立方和公式嚴密求解 y = x³ 的曲邊面積',
        example: {
          q: '試求 \\(f(x)=x^3\\) 的圖形與直線 \\(x=0, x=2, y=0\\) 所圍出的區域面積。',
          thinking: '將 \\([0,2]\\) 進行 \\(n\\) 等分割，取右端點採樣，寫出黎曼和展開式，利用 \\(\\sum k^3\\) 公式計算極限。',
          hints: [
            '等分割寬度 \\(\\Delta x = \\frac{2}{n}\\)，分點 \\(x_k = \\frac{2k}{n}\\)。',
            '右端點採樣值 \\(f(x_k) = (\\frac{2k}{n})^3 = \\frac{8k^3}{n^3}\\)。',
            '黎曼和展開式：\\(S_n = \\sum_{k=1}^n \\frac{8k^3}{n^3} \\cdot \\frac{2}{n} = \\frac{16}{n^4}\\sum_{k=1}^n k^3\\)。'
          ],
          steps: [
            '代入立方和公式：\\(S_n = \\frac{16}{n^4} \\left[\\frac{n(n+1)}{2}\\right]^2 = \\frac{16}{n^4} \\cdot \\frac{n^2(n+1)^2}{4} = 4\\left(\\frac{n+1}{n}\\right)^2\\)',
            '展開括號：\\(S_n = 4\\left(1 + \\frac{1}{n}\\right)^2\\)',
            '取極限：\\(\\lim_{n\\to\\infty} S_n = \\lim_{n\\to\\infty} 4\\left(1 + \\frac{1}{n}\\right)^2 = 4\\cdot (1+0)^2 = 4\\)'
          ],
          ans: '所圍曲邊梯形面積精確值為 4！',
          variant: {
            q: '【即堂變式】試求 \\(f(x)=x^2\\) 與直線 \\(x=0, x=a, y=0\\) 所圍面積極限？',
            ans: '代入平方和公式 \\(\\sum k^2\\)，極限結果為 \\(\\frac{a^3}{3}\\)。'
          }
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '黎曼和結構式', tex: 'S_n = \\frac{16}{n^4} \\cdot \\frac{n^2(n+1)^2}{4} = 4\\left(1+\\frac{1}{n}\\right)^2', color: VIO, fill: '#faf5ff' },
            { label: '取極限運算', tex: 'A = \\lim_{n\\to\\infty} S_n = 4', color: GRN, fill: '#f0fdf4' }
          ]);
        },
        caption: '運用極限思想，將原本看似不可能精確計算的曲邊面積化為常數 4。'
      },

      /* ---------- 5-2.2 第 12 頁：practice ---------- */
      {
        sec: '5-2.2', secName: '黎曼和與極限定義',
        type: 'practice',
        title: '隨堂即練：圓內接正 n 邊形面積的極限逼近',
        quiz: {
          q: '半徑為 \\(r\\) 的圓內接正 \\(n\\) 邊形面積為 \\(A_n = \\frac{1}{2} n r^2 \\sin \\frac{2\\pi}{n}\\)。當 \\(n \\to \\infty\\) 時，其極限面積為？',
          options: [
            'A. \\(2\\pi r\\)',
            'B. \\(\\pi r^2\\)',
            'C. \\(2\\pi r^2\\)',
            'D. \\(\\frac{1}{2}\\pi r^2\\)'
          ],
          ans: 1,
          explain: '利用著名三角極限 \\(\\lim_{\\theta \\to 0} \\frac{\\sin \\theta}{\\theta} = 1\\)。令 \\(\\theta = \\frac{2\\pi}{n}\\)，則 \\(A_n = \\pi r^2 \\cdot \\frac{\\sin(2\\pi/n)}{2\\pi/n} \\xrightarrow{n\\to\\infty} \\pi r^2 \\cdot 1 = \\pi r^2\\)。正 n 邊形無限逼近圓面積！'
        },
        visual: (h) => {
          h.innerHTML = SV.fbox([
            { label: '正 n 邊形分割', tex: 'A_n = n \\times (\\frac{1}{2} r^2 \\sin \\theta) = \\frac{1}{2}nr^2 \\sin\\frac{2\\pi}{n}', color: C, fill: '#f8fafc' },
            { label: '極限定理', tex: '\\lim_{n\\to\\infty} A_n = \\pi r^2 \\quad (劉徽割圓術與微積分同源)', color: GRN, fill: '#f0fdf4' }
          ]);
        },
        caption: '圓內接多邊形無限細分，完美驗證古今幾何極限定理的融會貫通。'
      }
    ]
  });
})();
