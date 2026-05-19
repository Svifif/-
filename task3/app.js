"use strict";

const SBOX = [
  0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
  0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
  0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
  0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
  0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
  0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
  0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
  0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
  0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
  0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
  0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
  0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
  0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
  0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
  0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
  0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
];

const INV_SBOX = [
  0x52,0x09,0x6a,0xd5,0x30,0x36,0xa5,0x38,0xbf,0x40,0xa3,0x9e,0x81,0xf3,0xd7,0xfb,
  0x7c,0xe3,0x39,0x82,0x9b,0x2f,0xff,0x87,0x34,0x8e,0x43,0x44,0xc4,0xde,0xe9,0xcb,
  0x54,0x7b,0x94,0x32,0xa6,0xc2,0x23,0x3d,0xee,0x4c,0x95,0x0b,0x42,0xfa,0xc3,0x4e,
  0x08,0x2e,0xa1,0x66,0x28,0xd9,0x24,0xb2,0x76,0x5b,0xa2,0x49,0x6d,0x8b,0xd1,0x25,
  0x72,0xf8,0xf6,0x64,0x86,0x68,0x98,0x16,0xd4,0xa4,0x5c,0xcc,0x5d,0x65,0xb6,0x92,
  0x6c,0x70,0x48,0x50,0xfd,0xed,0xb9,0xda,0x5e,0x15,0x46,0x57,0xa7,0x8d,0x9d,0x84,
  0x90,0xd8,0xab,0x00,0x8c,0xbc,0xd3,0x0a,0xf7,0xe4,0x58,0x05,0xb8,0xb3,0x45,0x06,
  0xd0,0x2c,0x1e,0x8f,0xca,0x3f,0x0f,0x02,0xc1,0xaf,0xbd,0x03,0x01,0x13,0x8a,0x6b,
  0x3a,0x91,0x11,0x41,0x4f,0x67,0xdc,0xea,0x97,0xf2,0xcf,0xce,0xf0,0xb4,0xe6,0x73,
  0x96,0xac,0x74,0x22,0xe7,0xad,0x35,0x85,0xe2,0xf9,0x37,0xe8,0x1c,0x75,0xdf,0x6e,
  0x47,0xf1,0x1a,0x71,0x1d,0x29,0xc5,0x89,0x6f,0xb7,0x62,0x0e,0xaa,0x18,0xbe,0x1b,
  0xfc,0x56,0x3e,0x4b,0xc6,0xd2,0x79,0x20,0x9a,0xdb,0xc0,0xfe,0x78,0xcd,0x5a,0xf4,
  0x1f,0xdd,0xa8,0x33,0x88,0x07,0xc7,0x31,0xb1,0x12,0x10,0x59,0x27,0x80,0xec,0x5f,
  0x60,0x51,0x7f,0xa9,0x19,0xb5,0x4a,0x0d,0x2d,0xe5,0x7a,0x9f,0x93,0xc9,0x9c,0xef,
  0xa0,0xe0,0x3b,0x4d,0xae,0x2a,0xf5,0xb0,0xc8,0xeb,0xbb,0x3c,0x83,0x53,0x99,0x61,
  0x17,0x2b,0x04,0x7e,0xba,0x77,0xd6,0x26,0xe1,0x69,0x14,0x63,0x55,0x21,0x0c,0x7d
];

const RCON = [0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];
const encoder = new TextEncoder();
const decoder = new TextDecoder();

const $ = (id) => document.getElementById(id);

function toHex(byte) {
  return byte.toString(16).padStart(2, "0").toUpperCase();
}

function bytesToHex(bytes) {
  return Array.from(bytes, toHex).join("");
}

function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function normalizeKey(text) {
  const raw = encoder.encode(text);
  const key = new Uint8Array(16);
  key.set(raw.slice(0, 16));
  return key;
}

function pkcs7Pad(bytes) {
  const pad = 16 - (bytes.length % 16 || 16);
  const finalPad = bytes.length % 16 === 0 ? 16 : pad;
  const out = new Uint8Array(bytes.length + finalPad);
  out.set(bytes);
  out.fill(finalPad, bytes.length);
  return out;
}

function pkcs7Unpad(bytes) {
  const pad = bytes[bytes.length - 1];
  if (pad < 1 || pad > 16) return bytes;
  return bytes.slice(0, bytes.length - pad);
}

function bytesToState(bytes) {
  const state = Array.from({ length: 4 }, () => Array(4).fill(0));
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) state[row][col] = bytes[col * 4 + row];
  }
  return state;
}

function stateToBytes(state) {
  const out = new Uint8Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) out[col * 4 + row] = state[row][col];
  }
  return out;
}

function cloneState(state) {
  return state.map((row) => row.slice());
}

function xtime(a) {
  return ((a << 1) ^ ((a & 0x80) ? 0x1b : 0)) & 0xff;
}

function gfMul(a, b) {
  let result = 0;
  while (b) {
    if (b & 1) result ^= a;
    a = xtime(a);
    b >>= 1;
  }
  return result;
}

function addRoundKey(state, keyBytes) {
  const out = cloneState(state);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) out[row][col] ^= keyBytes[col * 4 + row];
  }
  return out;
}

function subBytes(state, box = SBOX) {
  return state.map((row) => row.map((value) => box[value]));
}

function shiftRows(state) {
  return state.map((row, index) => row.slice(index).concat(row.slice(0, index)));
}

function invShiftRows(state) {
  return state.map((row, index) => row.slice(4 - index).concat(row.slice(0, 4 - index)));
}

function mixColumns(state) {
  const out = cloneState(state);
  for (let col = 0; col < 4; col++) {
    const a = [state[0][col], state[1][col], state[2][col], state[3][col]];
    out[0][col] = gfMul(a[0], 2) ^ gfMul(a[1], 3) ^ a[2] ^ a[3];
    out[1][col] = a[0] ^ gfMul(a[1], 2) ^ gfMul(a[2], 3) ^ a[3];
    out[2][col] = a[0] ^ a[1] ^ gfMul(a[2], 2) ^ gfMul(a[3], 3);
    out[3][col] = gfMul(a[0], 3) ^ a[1] ^ a[2] ^ gfMul(a[3], 2);
  }
  return out;
}

function invMixColumns(state) {
  const out = cloneState(state);
  for (let col = 0; col < 4; col++) {
    const a = [state[0][col], state[1][col], state[2][col], state[3][col]];
    out[0][col] = gfMul(a[0], 14) ^ gfMul(a[1], 11) ^ gfMul(a[2], 13) ^ gfMul(a[3], 9);
    out[1][col] = gfMul(a[0], 9) ^ gfMul(a[1], 14) ^ gfMul(a[2], 11) ^ gfMul(a[3], 13);
    out[2][col] = gfMul(a[0], 13) ^ gfMul(a[1], 9) ^ gfMul(a[2], 14) ^ gfMul(a[3], 11);
    out[3][col] = gfMul(a[0], 11) ^ gfMul(a[1], 13) ^ gfMul(a[2], 9) ^ gfMul(a[3], 14);
  }
  return out;
}

function rotWord(word) {
  return word.slice(1).concat(word[0]);
}

function subWord(word) {
  return word.map((b) => SBOX[b]);
}

function expandKey(key) {
  const words = [];
  for (let i = 0; i < 4; i++) words[i] = Array.from(key.slice(i * 4, i * 4 + 4));
  for (let i = 4; i < 44; i++) {
    let temp = words[i - 1].slice();
    if (i % 4 === 0) {
      temp = subWord(rotWord(temp));
      temp[0] ^= RCON[i / 4];
    }
    words[i] = words[i - 4].map((value, index) => value ^ temp[index]);
  }
  const roundKeys = [];
  for (let round = 0; round <= 10; round++) {
    roundKeys.push(new Uint8Array(words.slice(round * 4, round * 4 + 4).flat()));
  }
  return roundKeys;
}

function wordHex(word) {
  return word.map(toHex).join(" ");
}

function keyExpansionDetails(key) {
  const words = [];
  const rows = [];
  for (let i = 0; i < 4; i++) {
    words[i] = Array.from(key.slice(i * 4, i * 4 + 4));
    rows.push({
      index: i,
      source: `w${i} = байты исходного ключа`,
      formula: `w${i}`,
      value: wordHex(words[i])
    });
  }

  for (let i = 4; i < 44; i++) {
    const previous = words[i - 1].slice();
    let temp = previous.slice();
    let source = `temp = w${i - 1}`;
    if (i % 4 === 0) {
      const rotated = rotWord(temp);
      const substituted = subWord(rotated);
      temp = substituted.slice();
      temp[0] ^= RCON[i / 4];
      source = `RotWord(w${i - 1}) = ${wordHex(rotated)}; SubWord = ${wordHex(substituted)}; Rcon${i / 4} = ${toHex(RCON[i / 4])}`;
    }
    words[i] = words[i - 4].map((value, index) => value ^ temp[index]);
    rows.push({
      index: i,
      source,
      formula: `w${i} = w${i - 4} XOR temp`,
      value: wordHex(words[i])
    });
  }

  return { words, rows };
}

function keyExpansionHtml(key, roundKeys) {
  const details = keyExpansionDetails(key);
  const roundMap = roundKeys.map((roundKey, index) => `
    <div class="key-mini">
      <strong>K${index} = w${index * 4}..w${index * 4 + 3}</strong>
      ${matrixHtml(bytesToState(roundKey))}
    </div>
  `).join("");
  const rows = details.rows.map((row) => `
    <tr>
      <td>w${row.index}</td>
      <td>${escapeHtml(row.formula)}</td>
      <td>${escapeHtml(row.source)}</td>
      <td><code>${row.value}</code></td>
    </tr>
  `).join("");

  return `
    <p>KeyExpansion - это не отдельный секретный ключ, а детерминированное расширение введенного ключа. AES режет ключ на 4-байтовые слова <code>w0..w3</code>, затем строит слова <code>w4..w43</code>.</p>
    <div class="math-line">\\[
      w_i =
      \\begin{cases}
        w_{i-4}\\oplus SubWord(RotWord(w_{i-1}))\\oplus Rcon_{i/4}, & i\\equiv0\\pmod4 \\\\
        w_{i-4}\\oplus w_{i-1}, & иначе
      \\end{cases}
    \\]</div>
    <p>Каждый раундовый ключ собирается из четырех соседних слов: <code>K0 = w0..w3</code>, <code>K1 = w4..w7</code>, ..., <code>K10 = w40..w43</code>.</p>
    <div class="key-strip">${roundMap}</div>
    <details class="key-expansion" open>
      <summary>Показать построение всех слов w0..w43</summary>
      <div class="key-table-wrap">
        <table class="key-table">
          <thead><tr><th>Слово</th><th>Формула</th><th>Что сделали</th><th>Значение HEX</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </details>
  `;
}

function encryptBlock(block, roundKeys, collect = false) {
  let state = bytesToState(block);
  const steps = [];
  if (collect) steps.push({ title: "Исходный блок", note: "16 байт текста записываются в матрицу 4x4 по столбцам.", state: cloneState(state) });

  state = addRoundKey(state, roundKeys[0]);
  if (collect) steps.push({ title: "Раунд 0: AddRoundKey", note: "Каждая ячейка XOR с байтом начального раундового ключа.", state: cloneState(state) });

  for (let round = 1; round <= 9; round++) {
    state = subBytes(state);
    if (collect) steps.push({ title: `Раунд ${round}: SubBytes`, note: "Нелинейная замена каждого байта по таблице S-box.", state: cloneState(state) });
    state = shiftRows(state);
    if (collect) steps.push({ title: `Раунд ${round}: ShiftRows`, note: "Строки циклически сдвигаются на 0, 1, 2 и 3 позиции.", state: cloneState(state) });
    state = mixColumns(state);
    if (collect) steps.push({ title: `Раунд ${round}: MixColumns`, note: "Каждый столбец умножается на фиксированную матрицу в поле GF(2^8).", state: cloneState(state) });
    state = addRoundKey(state, roundKeys[round]);
    if (collect) steps.push({ title: `Раунд ${round}: AddRoundKey`, note: "Результат смешивается с ключом текущего раунда через XOR.", state: cloneState(state) });
  }

  state = subBytes(state);
  if (collect) steps.push({ title: "Раунд 10: SubBytes", note: "Финальная замена байтов.", state: cloneState(state) });
  state = shiftRows(state);
  if (collect) steps.push({ title: "Раунд 10: ShiftRows", note: "Финальный сдвиг строк.", state: cloneState(state) });
  state = addRoundKey(state, roundKeys[10]);
  if (collect) steps.push({ title: "Раунд 10: AddRoundKey", note: "Последний XOR с раундовым ключом. MixColumns в 10 раунде не выполняется.", state: cloneState(state) });

  return { bytes: stateToBytes(state), steps };
}

function decryptBlock(block, roundKeys) {
  let state = bytesToState(block);
  state = addRoundKey(state, roundKeys[10]);
  state = invShiftRows(state);
  state = subBytes(state, INV_SBOX);
  for (let round = 9; round >= 1; round--) {
    state = addRoundKey(state, roundKeys[round]);
    state = invMixColumns(state);
    state = invShiftRows(state);
    state = subBytes(state, INV_SBOX);
  }
  state = addRoundKey(state, roundKeys[0]);
  return stateToBytes(state);
}

function encryptMessage(text, keyText) {
  const key = normalizeKey(keyText);
  const roundKeys = expandKey(key);
  const padded = pkcs7Pad(encoder.encode(text));
  const encrypted = new Uint8Array(padded.length);
  let firstSteps = [];

  for (let offset = 0; offset < padded.length; offset += 16) {
    const result = encryptBlock(padded.slice(offset, offset + 16), roundKeys, offset === 0);
    encrypted.set(result.bytes, offset);
    if (offset === 0) firstSteps = result.steps;
  }

  const decrypted = new Uint8Array(encrypted.length);
  for (let offset = 0; offset < encrypted.length; offset += 16) {
    decrypted.set(decryptBlock(encrypted.slice(offset, offset + 16), roundKeys), offset);
  }

  return {
    cipher: encrypted,
    decrypted: decoder.decode(pkcs7Unpad(decrypted)),
    roundKeys,
    firstSteps,
    blockCount: padded.length / 16,
    key
  };
}

function matrixHtml(state) {
  return `<div class="matrix">${state.flatMap((row, rowIndex) =>
    row.map((value, colIndex) => `<span class="cell col${colIndex}" title="row ${rowIndex}, col ${colIndex}">${toHex(value)}</span>`)
  ).join("")}</div>`;
}

function renderTabs(steps) {
  const tabs = $("roundTabs");
  tabs.innerHTML = "";
  steps.forEach((step, index) => {
    const button = document.createElement("button");
    button.className = `tab${index === 0 ? " active" : ""}`;
    button.textContent = index === 0 ? "Старт" : String(index);
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      renderRound(step);
    });
    tabs.appendChild(button);
  });
  renderRound(steps[0]);
}

function renderRound(step) {
  $("roundDetails").innerHTML = `
    <div class="round-grid">
      <article class="step">
        <h3>${step.title}</h3>
        <p>${step.note}</p>
        ${matrixHtml(step.state)}
      </article>
    </div>
  `;
}

function renderKeySchedule(roundKeys) {
  $("keySchedule").innerHTML = roundKeys.map((key, index) => `
    <article class="key-card">
      <h3>K${index}</h3>
      ${matrixHtml(bytesToState(key))}
    </article>
  `).join("");
}

function renderCases() {
  if (!$("cases")) return;
  const cases = [
    { title: "Кириллица и emoji", text: "Шифр 🔐 проверка", key: "Ключ-16-байт!" },
    { title: "Ровно 16 байт", text: "1234567890ABCDEF", key: "Sixteen byte key" },
    { title: "Длинный текст", text: "AES работает блоками, поэтому эта строка занимает несколько блоков.", key: "multi block key" }
  ];

  $("cases").innerHTML = cases.map((item) => {
    const result = encryptMessage(item.text, item.key);
    const ok = result.decrypted === item.text;
    return `
      <article class="case-card">
        <h3>${item.title}</h3>
        <div class="${ok ? "case-ok" : "case-warn"}">${ok ? "Расшифровка совпала" : "Есть ошибка"}</div>
        <p class="hint">Блоков: ${result.blockCount}</p>
        <code>${bytesToHex(result.cipher)}</code>
      </article>
    `;
  }).join("");
}

function run() {
  const text = $("plainText").value;
  const keyText = $("keyText").value;
  const result = encryptMessage(text, keyText);

  $("cipherHex").textContent = bytesToHex(result.cipher);
  $("cipherBase64").textContent = bytesToBase64(result.cipher);
  $("decryptedText").textContent = result.decrypted;
  $("status").textContent = `Обработано блоков: ${result.blockCount}. Нормализованный ключ: ${bytesToHex(result.key)}.`;

  renderTabs(result.firstSteps);
  renderKeySchedule(result.roundKeys);
  renderCases();
}

const MIX_MATRIX = [
  [0x02, 0x03, 0x01, 0x01],
  [0x01, 0x02, 0x03, 0x01],
  [0x01, 0x01, 0x02, 0x03],
  [0x03, 0x01, 0x01, 0x02]
];

let flowIndex = 0;
let decryptIndex = 0;

function step(title, note, formula, state, options = {}) {
  return {
    title,
    note,
    formula,
    state,
    inputState: options.inputState,
    inputName: options.inputName,
    operationName: options.operationName,
    operationText: options.operationText,
    operationState: options.operationState,
    keyState: options.keyState,
    keyName: options.keyName,
    outputName: options.outputName || "A",
    extraHtml: options.extraHtml || ""
  };
}

function renderMath(root = document.body) {
  if (!window.renderMathInElement) return;
  renderMathInElement(root, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    throwOnError: false
  });
}

function matrixTitle(name, detail = "") {
  return `<h4>${escapeHtml(name)}${detail ? `<span>${escapeHtml(detail)}</span>` : ""}</h4>`;
}

function operationCard(stepData) {
  if (stepData.operationState) {
    return `<div class="operator-card">${matrixTitle(stepData.operationName || "Операция")}${matrixHtml(stepData.operationState)}</div>`;
  }
  return `<div class="operator-card text-op">${matrixTitle(stepData.operationName || "Операция")}<strong>${escapeHtml(stepData.operationText || "")}</strong></div>`;
}

function expressionHtml(stepData) {
  const input = stepData.inputState
    ? `<div>${matrixTitle(stepData.inputName || "До операции")}${matrixHtml(stepData.inputState)}</div>`
    : "";
  return `
    <div class="operation-row">
      ${input || operationCard(stepData)}
      ${input ? `<span class="op-sign">${stepData.keyState ? "⊕" : "×"}</span>${stepData.keyState ? `<div>${matrixTitle(stepData.keyName)}${matrixHtml(stepData.keyState)}</div>` : operationCard(stepData)}` : ""}
      <span class="op-sign">=</span>
      <div>${matrixTitle(stepData.outputName, "результат")}${matrixHtml(stepData.state)}</div>
    </div>
  `;
}

function sboxTableHtml(inputState) {
  const used = new Set((inputState || []).flat());
  const header = Array.from({ length: 16 }, (_, i) => `<th>${i.toString(16).toUpperCase()}</th>`).join("");
  const rows = Array.from({ length: 16 }, (_, row) => {
    const cells = Array.from({ length: 16 }, (_, col) => {
      const index = row * 16 + col;
      const value = SBOX[index];
      return `<td class="${used.has(index) ? "hit" : ""}" title="S-box[${toHex(index)}] = ${toHex(value)}">${toHex(value)}</td>`;
    }).join("");
    return `<tr><th>${row.toString(16).toUpperCase()}</th>${cells}</tr>`;
  }).join("");
  return `
    <details class="sbox-panel" open>
      <summary>Таблица S-box для этого шага</summary>
      <p>Байт читается как два HEX-разряда: первый выбирает строку, второй столбец. Например, для байта 9F берем строку 9 и столбец F.</p>
      <div class="sbox-scroll"><table class="sbox-table"><thead><tr><th></th>${header}</tr></thead><tbody>${rows}</tbody></table></div>
    </details>
  `;
}

function pushEncryptStep(steps, title, note, formula, before, after, fromIndex, toIndex, options = {}) {
  steps.push(step(title, note, formula, cloneState(after), {
    inputState: before ? cloneState(before) : undefined,
    inputName: before ? `A${fromIndex}` : undefined,
    outputName: `A${toIndex}`,
    ...options
  }));
}

function encryptBlockDetailed(block, roundKeys, collect = false) {
  let state = bytesToState(block);
  const steps = [];
  let index = 0;

  if (collect) {
    steps.push(step(
      "Шаг 1. Выбранный блок -> матрица A0",
      "AES шифрует один блок за раз. На сайте отслеживается первый блок: 16 байт записываются в матрицу 4x4 по столбцам.",
      "\\[A_0[i,j]=block[4j+i]\\]",
      cloneState(state),
      { outputName: "A0", operationName: "Запись байтов", operationText: "16 байт -> 4x4" }
    ));
  }

  let before = cloneState(state);
  state = addRoundKey(state, roundKeys[0]);
  index += 1;
  if (collect) {
    pushEncryptStep(
      steps,
      "Шаг 2. Раунд 0: AddRoundKey",
      "Берем A0 и начальный ключ K0. В каждой ячейке выполняется XOR: одинаковые биты дают 0, разные биты дают 1.",
      `\\[A_${index}[i,j]=A_${index - 1}[i,j]\\oplus K_0[i,j]\\]`,
      before,
      state,
      index - 1,
      index,
      { keyState: bytesToState(roundKeys[0]), keyName: "K0", operationName: "XOR" }
    );
  }

  for (let round = 1; round <= 9; round++) {
    before = cloneState(state);
    state = subBytes(state);
    index += 1;
    if (collect) {
      pushEncryptStep(
        steps,
        `Шаг ${index + 1}. Раунд ${round}: SubBytes`,
        "Каждый байт заменяется по таблице S-box. Таблица нужна для нелинейности: после нее изменение одного бита входа меняет результат уже не как простая арифметика.",
        `\\[A_${index}[i,j]=SBox(A_${index - 1}[i,j])\\]`,
        before,
        state,
        index - 1,
        index,
        { operationName: "S-box", operationText: "замена байтов", extraHtml: sboxTableHtml(before) }
      );
    }

    before = cloneState(state);
    state = shiftRows(state);
    index += 1;
    if (collect) {
      pushEncryptStep(
        steps,
        `Шаг ${index + 1}. Раунд ${round}: ShiftRows`,
        "Строка 0 остается на месте, строка 1 сдвигается влево на 1 байт, строка 2 на 2 байта, строка 3 на 3 байта.",
        `\\[A_${index}[i,j]=A_${index - 1}[i,(j+i)\\bmod 4]\\]`,
        before,
        state,
        index - 1,
        index,
        { operationName: "ShiftRows", operationText: "сдвиг строк 0,1,2,3" }
      );
    }

    before = cloneState(state);
    state = mixColumns(state);
    index += 1;
    if (collect) {
      pushEncryptStep(
        steps,
        `Шаг ${index + 1}. Раунд ${round}: MixColumns`,
        "Каждый столбец A умножается на фиксированную матрицу M в поле GF(2^8). Поэтому один выходной байт зависит сразу от четырех байтов своего столбца.",
        `\\[A_${index}[:,j]=M\\cdot A_${index - 1}[:,j],\\quad M=\\begin{bmatrix}02&03&01&01\\\\01&02&03&01\\\\01&01&02&03\\\\03&01&01&02\\end{bmatrix}\\]`,
        before,
        state,
        index - 1,
        index,
        { operationName: "M", operationState: MIX_MATRIX }
      );
    }

    before = cloneState(state);
    state = addRoundKey(state, roundKeys[round]);
    index += 1;
    if (collect) {
      pushEncryptStep(
        steps,
        `Шаг ${index + 1}. Раунд ${round}: AddRoundKey`,
        `К результату предыдущего шага применяется ключ раунда K${round}. Операция снова XOR по каждой ячейке.`,
        `\\[A_${index}[i,j]=A_${index - 1}[i,j]\\oplus K_${round}[i,j]\\]`,
        before,
        state,
        index - 1,
        index,
        { keyState: bytesToState(roundKeys[round]), keyName: `K${round}`, operationName: "XOR" }
      );
    }
  }

  before = cloneState(state);
  state = subBytes(state);
  index += 1;
  if (collect) {
    pushEncryptStep(steps, `Шаг ${index + 1}. Раунд 10: SubBytes`, "Финальная замена байтов по той же таблице S-box.", `\\[A_${index}[i,j]=SBox(A_${index - 1}[i,j])\\]`, before, state, index - 1, index, { operationName: "S-box", operationText: "замена байтов", extraHtml: sboxTableHtml(before) });
  }

  before = cloneState(state);
  state = shiftRows(state);
  index += 1;
  if (collect) {
    pushEncryptStep(steps, `Шаг ${index + 1}. Раунд 10: ShiftRows`, "Последний сдвиг строк перед финальным ключом.", `\\[A_${index}[i,j]=A_${index - 1}[i,(j+i)\\bmod 4]\\]`, before, state, index - 1, index, { operationName: "ShiftRows", operationText: "сдвиг строк 0,1,2,3" });
  }

  before = cloneState(state);
  state = addRoundKey(state, roundKeys[10]);
  index += 1;
  if (collect) {
    pushEncryptStep(
      steps,
      `Шаг ${index + 1}. Раунд 10: AddRoundKey`,
      `Это последний шаг шифрования. Матрица A${index} читается по столбцам и становится шифртекстом выбранного блока.`,
      `\\[A_${index}[i,j]=A_${index - 1}[i,j]\\oplus K_{10}[i,j]\\]`,
      before,
      state,
      index - 1,
      index,
      { keyState: bytesToState(roundKeys[10]), keyName: "K10", operationName: "XOR" }
    );
  }

  return { bytes: stateToBytes(state), steps };
}

function decryptBlockDetailed(block, roundKeys, collect = false) {
  let state = bytesToState(block);
  const steps = [];
  let index = 0;
  if (collect) {
    steps.push(step(
      "Дешифрование 1. Шифртекст -> A0",
      "Берем первый блок шифртекста и записываем его в матрицу A0 по столбцам.",
      "\\[A_0[i,j]=cipherBlock[4j+i]\\]",
      cloneState(state),
      { outputName: "A0", operationName: "Запись байтов", operationText: "16 байт -> 4x4" }
    ));
  }

  let before = cloneState(state);
  state = addRoundKey(state, roundKeys[10]);
  index += 1;
  if (collect) steps.push(step("Дешифрование 2. Убираем K10", "XOR обратим: если X XOR K = Y, то Y XOR K = X.", `\\[A_${index}[i,j]=A_${index - 1}[i,j]\\oplus K_{10}[i,j]\\]`, cloneState(state), { inputState: before, inputName: `A${index - 1}`, keyState: bytesToState(roundKeys[10]), keyName: "K10", outputName: `A${index}`, operationName: "XOR" }));

  before = cloneState(state);
  state = invShiftRows(state);
  index += 1;
  if (collect) steps.push(step("Дешифрование 3. InvShiftRows", "Сдвигаем строки обратно вправо: это обратный шаг к ShiftRows.", `\\[A_${index}[i,j]=A_${index - 1}[i,(j-i)\\bmod 4]\\]`, cloneState(state), { inputState: before, inputName: `A${index - 1}`, outputName: `A${index}`, operationName: "InvShiftRows", operationText: "обратный сдвиг строк" }));

  before = cloneState(state);
  state = subBytes(state, INV_SBOX);
  index += 1;
  if (collect) steps.push(step("Дешифрование 4. InvSubBytes", "Каждый байт возвращается через обратную таблицу S-box.", `\\[A_${index}[i,j]=InvSBox(A_${index - 1}[i,j])\\]`, cloneState(state), { inputState: before, inputName: `A${index - 1}`, outputName: `A${index}`, operationName: "InvSBox", operationText: "обратная замена" }));

  for (let round = 9; round >= 1; round--) {
    state = addRoundKey(state, roundKeys[round]);
    state = invMixColumns(state);
    state = invShiftRows(state);
    state = subBytes(state, INV_SBOX);
  }
  state = addRoundKey(state, roundKeys[0]);
  index += 1;
  if (collect) steps.push(step("Дешифрование финал. Получили исходный блок", "После обратных раундов и K0 снова получаются байты исходного текста с PKCS#7 padding.", `\\[A_${index}=InvAES(A_0,K_0..K_{10})\\]`, cloneState(bytesToState(stateToBytes(state))), { outputName: `A${index}`, operationName: "InvAES", operationText: "все обратные раунды" }));
  return { bytes: stateToBytes(state), steps };
}

function encryptMessage(text, keyText) {
  const inputBytes = encoder.encode(text);
  const key = normalizeKey(keyText);
  const roundKeys = expandKey(key);
  const padded = pkcs7Pad(inputBytes);
  const encrypted = new Uint8Array(padded.length);
  let firstSteps = [];

  for (let offset = 0; offset < padded.length; offset += 16) {
    const result = encryptBlockDetailed(padded.slice(offset, offset + 16), roundKeys, offset === 0);
    encrypted.set(result.bytes, offset);
    if (offset === 0) firstSteps = result.steps;
  }

  const decrypted = new Uint8Array(encrypted.length);
  let decryptSteps = [];
  for (let offset = 0; offset < encrypted.length; offset += 16) {
    const result = decryptBlockDetailed(encrypted.slice(offset, offset + 16), roundKeys, offset === 0);
    decrypted.set(result.bytes, offset);
    if (offset === 0) decryptSteps = result.steps;
  }

  return {
    inputBytes,
    padded,
    firstBlock: padded.slice(0, 16),
    cipher: encrypted,
    firstCipherBlock: encrypted.slice(0, 16),
    decryptedBytes: pkcs7Unpad(decrypted),
    decrypted: decoder.decode(pkcs7Unpad(decrypted)),
    roundKeys,
    firstSteps,
    decryptSteps,
    blockCount: padded.length / 16,
    key
  };
}

function spacedHex(bytes) {
  return Array.from(bytes, toHex).join(" ");
}

function textToBytesRows(text, bytes) {
  const chars = Array.from(text);
  const rows = [];
  let offset = 0;
  for (const ch of chars) {
    const part = encoder.encode(ch);
    rows.push(`<tr><td>${escapeHtml(ch)}</td><td>${spacedHex(part)}</td><td>${offset}..${offset + part.length - 1}</td></tr>`);
    offset += part.length;
  }
  return rows.join("") || `<tr><td>пустая строка</td><td></td><td></td></tr>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}

function blockListHtml(bytes) {
  const blocks = [];
  for (let offset = 0; offset < bytes.length; offset += 16) {
    blocks.push(`<div class="block-chip ${offset === 0 ? "active" : ""}"><strong>Блок ${offset / 16 + 1}</strong><span>${spacedHex(bytes.slice(offset, offset + 16))}</span></div>`);
  }
  return blocks.join("");
}

function flowSteps(result, text, keyText) {
  return [
    {
      title: "Шаг 0. Что делает AES",
      body: `
        <p>AES-128 шифрует не слово целиком, а блоки по 16 байт. Каждый блок превращается в матрицу 4x4, затем 10 раундов меняют ее через SubBytes, ShiftRows, MixColumns и AddRoundKey.</p>
        <details class="formula-details">
          <summary>Раскрыть только формулы</summary>
          <div class="math-stack">
            <p>\\[A_0=bytesToState(block)\\]</p>
            <p>\\[A_1=A_0\\oplus K_0\\]</p>
            <p>\\[A_{t+1}=AddRoundKey(MixColumns(ShiftRows(SubBytes(A_t))),K_r)\\]</p>
            <p>\\[A_{last}=AddRoundKey(ShiftRows(SubBytes(A_t)),K_{10})\\]</p>
          </div>
        </details>
      `
    },
    {
      title: "Шаг 1. Берем слово и ключ",
      body: `
        <p>Открытый текст: <strong>${escapeHtml(text || "пустая строка")}</strong></p>
        <p>Ключ пользователя: <strong>${escapeHtml(keyText)}</strong></p>
      `
    },
    {
      title: "Шаг 2. Переводим символы в байты UTF-8",
      body: `
        <table class="byte-table"><thead><tr><th>Символ</th><th>Байты HEX</th><th>Позиции</th></tr></thead><tbody>${textToBytesRows(text, result.inputBytes)}</tbody></table>
        <p class="formula">Все байты текста: ${spacedHex(result.inputBytes)}</p>
      `
    },
    {
      title: "Шаг 3. Добавляем PKCS#7 padding",
      body: `
        <p>PKCS#7 - это правило дополнения последнего блока. Если до 16 байт не хватает n байт, добавляем n байт со значением n. Если длина уже кратна 16, добавляем целый блок из 16 байт со значением 10 в HEX.</p>
        <p class="formula">После PKCS#7: ${spacedHex(result.padded)}</p>
      `
    },
    {
      title: "Шаг 4. Делим данные на блоки и выбираем первый",
      body: `
        <p>Все данные режутся на блоки по 16 байт. Ниже показаны все блоки; дальше сайт подробно отслеживает блок 1.</p>
        <div class="blocks">${blockListHtml(result.padded)}</div>
        <div class="matrix-pair"><div>${matrixTitle("A0", "выбранный блок 1")}${matrixHtml(bytesToState(result.firstBlock))}</div></div>
      `
    },
    {
      title: "Шаг 5. Нормализуем ключ AES-128",
      body: `
        <p>AES-128 требует ключ ровно 16 байт. Если пользовательский ключ короче, добавляются 00; если длиннее, берутся первые 16 байт.</p>
        <p class="formula">K0 bytes = ${spacedHex(result.key)}</p>
        <div class="matrix-pair"><div>${matrixTitle("K0", "начальный ключ")}${matrixHtml(bytesToState(result.roundKeys[0]))}</div></div>
      `
    },
    {
      title: "Шаг 6. Получаем шифртекст",
      body: `
        <p>После всех раундов последняя матрица A читается по столбцам. Эти байты становятся шифртекстом.</p>
        <p class="formula">cipher HEX = ${bytesToHex(result.cipher)}</p>
      `
    }
  ];
}

function renderDataFlow(result, text, keyText) {
  const steps = flowSteps(result, text, keyText);
  flowIndex = Math.min(flowIndex, steps.length - 1);
  const item = steps[flowIndex];
  $("dataFlow").innerHTML = `
    <article class="flow-step">
      <div class="step-head">
        <h3>${item.title}</h3>
        <span>${flowIndex + 1} / ${steps.length}</span>
      </div>
      ${item.body}
      <div class="step-nav">
        <button type="button" id="flowPrev" ${flowIndex === 0 ? "disabled" : ""}>Назад</button>
        <button type="button" id="flowNext" ${flowIndex === steps.length - 1 ? "disabled" : ""}>Дальше</button>
      </div>
    </article>
  `;
  $("flowPrev").addEventListener("click", () => { flowIndex -= 1; renderDataFlow(result, text, keyText); });
  $("flowNext").addEventListener("click", () => { flowIndex += 1; renderDataFlow(result, text, keyText); });
  renderMath($("dataFlow"));
}

function renderRound(stepData) {
  $("roundDetails").innerHTML = `
    <article class="step">
      <h3>${stepData.title}</h3>
      <p>${stepData.note}</p>
      <div class="math-line">${stepData.formula}</div>
      ${expressionHtml(stepData)}
      <p class="formula">Байты этой матрицы по столбцам: ${spacedHex(stateToBytes(stepData.state))}</p>
      ${stepData.extraHtml}
    </article>
  `;
  renderMath($("roundDetails"));
}

function renderTabs(steps) {
  const tabs = $("roundTabs");
  tabs.innerHTML = "";
  steps.forEach((stepData, index) => {
    const button = document.createElement("button");
    button.className = `tab${index === 0 ? " active" : ""}`;
    button.textContent = index === 0 ? "Старт" : `Шаг ${index + 1}`;
      button.addEventListener("click", () => {
      tabs.querySelectorAll(".tab").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      renderRound(stepData);
    });
    tabs.appendChild(button);
  });
  renderRound(steps[0]);
}

function renderDecryptFlow(steps, result) {
  const finalStep = {
    title: "Дешифрование: убираем PKCS#7",
    note: "Последний байт показывает, сколько добавленных байтов нужно удалить. Затем оставшиеся байты UTF-8 переводятся обратно в текст.",
    formula: `\\[plainText=UTF8^{-1}(removePKCS7(A))\\]`,
    state: bytesToState(result.firstBlock),
    outputName: "Текст",
    extraHtml: `<p class="formula">${spacedHex(result.decryptedBytes)} -> ${escapeHtml(result.decrypted)}</p>`
  };
  const allSteps = steps.concat(finalStep);
  decryptIndex = Math.min(decryptIndex, allSteps.length - 1);
  const item = allSteps[decryptIndex];
  $("decryptFlow").innerHTML = `
    <article class="step">
      <div class="step-head">
        <h3>${item.title}</h3>
        <span>${decryptIndex + 1} / ${allSteps.length}</span>
      </div>
      <p>${item.note}</p>
      <div class="math-line">${item.formula}</div>
      ${item.inputState || item.operationName ? expressionHtml(item) : ""}
      ${item.extraHtml || ""}
      <div class="step-nav">
        <button type="button" id="decryptPrev" ${decryptIndex === 0 ? "disabled" : ""}>Назад</button>
        <button type="button" id="decryptNext" ${decryptIndex === allSteps.length - 1 ? "disabled" : ""}>Дальше</button>
      </div>
    </article>
  `;
  $("decryptPrev").addEventListener("click", () => { decryptIndex -= 1; renderDecryptFlow(steps, result); });
  $("decryptNext").addEventListener("click", () => { decryptIndex += 1; renderDecryptFlow(steps, result); });
  renderMath($("decryptFlow"));
}

function renderCases() {
  const cases = [
    { title: "Кириллица и emoji", text: "Шифр 🔐 проверка", key: "Ключ-16-байт!" },
    { title: "Ровно 16 ASCII-байт", text: "1234567890ABCDEF", key: "Sixteen byte key" },
    { title: "Длинный текст", text: "AES работает блоками, поэтому эта строка занимает несколько блоков.", key: "multi block key" }
  ];

  $("cases").innerHTML = cases.map((item) => {
    const result = encryptMessage(item.text, item.key);
    const ok = result.decrypted === item.text;
    return `
      <article class="case-card">
        <h3>${item.title}</h3>
        <div class="${ok ? "case-ok" : "case-warn"}">${ok ? "Расшифровка совпала" : "Есть ошибка"}</div>
        <p class="hint">Блоков: ${result.blockCount}</p>
        <code>${bytesToHex(result.cipher)}</code>
      </article>
    `;
  }).join("");
}

const appState = {
  mode: "encrypt",
  result: null,
  rounds: [],
  roundIndex: 0,
  operationIndex: 0,
  duckTimer: null
};

function isVisible(node) {
  return !node.classList.contains("hidden");
}

function setVisible(id, visible) {
  $(id).classList.toggle("hidden", !visible);
}

function hexToBytes(hex) {
  const clean = hex.replace(/[^0-9a-f]/gi, "");
  if (!clean || clean.length % 2) throw new Error("HEX должен содержать пары символов: например DA 01 58.");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16);
  if (bytes.length % 16 !== 0) throw new Error("Шифртекст AES должен делиться на блоки по 16 байт.");
  return bytes;
}

function compactText(text) {
  return escapeHtml(text || "пустая строка");
}

function addOperation(round, title, note, formula, before, after, fromName, toName, options = {}) {
  round.operations.push(step(title, note, formula, cloneState(after), {
    inputState: before ? cloneState(before) : undefined,
    inputName: fromName,
    outputName: toName,
    ...options
  }));
}

function buildEncryption(text, keyText) {
  const inputBytes = encoder.encode(text);
  const key = normalizeKey(keyText);
  const roundKeys = expandKey(key);
  const padded = pkcs7Pad(inputBytes);
  const encrypted = new Uint8Array(padded.length);
  const rounds = [];
  let firstCipherBlock = null;

  for (let offset = 0; offset < padded.length; offset += 16) {
    let state = bytesToState(padded.slice(offset, offset + 16));
    if (offset === 0) {
      rounds.push({
        title: "Подготовка",
        summary: "До раундов AES подготавливает данные и ключ: слово становится байтами, байты дополняются, режутся на блоки, а из ключа строятся K0..K10.",
        operations: [
          step(
            "1. Перевод слова",
            "Символы нельзя шифровать напрямую. Сначала каждый символ переводится в байты UTF-8.",
            "\\[text \\rightarrow UTF8(text)\\]",
            cloneState(state),
            {
              outputName: "A0",
              operationName: "UTF-8",
              operationText: "слово -> байты",
              extraHtml: `
                <p>Слово: <strong>${compactText(text)}</strong></p>
                <table class="byte-table"><thead><tr><th>Символ</th><th>Байты HEX</th><th>Позиции</th></tr></thead><tbody>${textToBytesRows(text, inputBytes)}</tbody></table>
                <p class="formula">UTF-8 байты: ${spacedHex(inputBytes)}</p>
              `
            }
          ),
          step(
            "2. Дополнение PKCS#7",
            "AES требует блоки ровно по 16 байт. PKCS#7 добавляет недостающие байты: если не хватает n байт, добавляется n байт со значением n.",
            "\\[padded=UTF8(text)\\,||\\,[n,n,...,n]\\]",
            cloneState(state),
            {
              outputName: "A0",
              operationName: "PKCS#7",
              operationText: "добить до 16 байт",
              extraHtml: `<p class="formula">После PKCS#7: ${spacedHex(padded)}</p>`
            }
          ),
          step(
            "3. Деление на блоки",
            "Подготовленные байты режутся на куски по 16 байт. Каждый блок шифруется отдельно теми же раундами AES.",
            "\\[blocks=padded/16\\]",
            cloneState(state),
            {
              outputName: "A0",
              operationName: "Блоки",
              operationText: "по 16 байт",
              extraHtml: `<div class="blocks">${blockListHtml(padded)}</div>`
            }
          ),
          step(
            "4. Выбор отслеживаемого блока",
            "Чтобы не перегружать экран, дальше подробно показывается блок 1. Его 16 байт записываются в матрицу A0 по столбцам.",
            "\\[A_0[i,j]=block_1[4j+i]\\]",
            cloneState(state),
            {
              outputName: "A0",
              operationName: "State",
              operationText: "блок 1 -> 4x4",
              extraHtml: `<p class="formula">Блок 1: ${spacedHex(padded.slice(0, 16))}</p>`
            }
          ),
          step(
            "5. Расширение ключа",
            "Пользователь вводит один ключ, но AES нужен отдельный ключ для каждого раунда. Ниже показано, как KeyExpansion строит слова w0..w43 и собирает из них K0..K10.",
            "\\[K_0..K_{10}=KeyExpansion(key)\\]",
            cloneState(state),
            {
              outputName: "A0",
              operationName: "KeyExpansion",
              operationText: "ключ -> K0..K10",
              extraHtml: `
                <p class="formula">Нормализованный ключ: ${spacedHex(key)}</p>
                ${keyExpansionHtml(key, roundKeys)}
              `
            }
          )
        ]
      });

      let stepIndex = 0;
      let before = cloneState(state);
      state = addRoundKey(state, roundKeys[0]);
      stepIndex += 1;
      const round0 = {
        title: "Раунд 0",
        summary: "Начальное смешивание с ключом. K0 - первые 16 байт подготовленного ключа.",
        operations: []
      };
      addOperation(
        round0,
        "AddRoundKey",
        "В каждой ячейке A0 выполняется XOR с K0. Это привязывает блок к ключу еще до основных раундов.",
        "\\[A_1[i,j]=A_0[i,j]\\oplus K_0[i,j]\\]",
        before,
        state,
        "A0",
        "A1",
        { keyState: bytesToState(roundKeys[0]), keyName: "K0", operationName: "XOR" }
      );
      rounds.push(round0);

      for (let roundNumber = 1; roundNumber <= 9; roundNumber++) {
        const round = {
          title: `Раунд ${roundNumber}`,
          summary: `Раунд ${roundNumber} состоит из SubBytes, ShiftRows, MixColumns и AddRoundKey. K${roundNumber} - раундовый ключ, полученный из исходного ключа алгоритмом расширения ключа.`,
          operations: []
        };

        before = cloneState(state);
        state = subBytes(state);
        stepIndex += 1;
        addOperation(round, "SubBytes", "Каждый байт заменяется по таблице S-box. Это делает зависимость между входом и выходом нелинейной.", `\\[A_${stepIndex}[i,j]=SBox(A_${stepIndex - 1}[i,j])\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { operationName: "S-box", operationText: "табличная замена", extraHtml: sboxTableHtml(before) });

        before = cloneState(state);
        state = shiftRows(state);
        stepIndex += 1;
        addOperation(round, "ShiftRows", "Это не случайная перестановка. Строка 0 не двигается, строка 1 сдвигается на 1 байт влево, строка 2 на 2, строка 3 на 3.", `\\[A_${stepIndex}[i,j]=A_${stepIndex - 1}[i,(j+i)\\bmod 4]\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { operationName: "ShiftRows", operationText: "0, 1, 2, 3 байта влево" });

        before = cloneState(state);
        state = mixColumns(state);
        stepIndex += 1;
        addOperation(round, "MixColumns", "Каждый столбец умножается на фиксированную матрицу M в GF(2^8). Один новый байт зависит от всех четырех байтов столбца.", `\\[A_${stepIndex}[:,j]=M\\cdot A_${stepIndex - 1}[:,j],\\quad M=\\begin{bmatrix}02&03&01&01\\\\01&02&03&01\\\\01&01&02&03\\\\03&01&01&02\\end{bmatrix}\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { operationName: "M", operationState: MIX_MATRIX });

        before = cloneState(state);
        state = addRoundKey(state, roundKeys[roundNumber]);
        stepIndex += 1;
        addOperation(round, "AddRoundKey", `K${roundNumber} - ключ именно этого раунда. Он не вводится пользователем вручную, а вычисляется из исходного ключа AES.`, `\\[A_${stepIndex}[i,j]=A_${stepIndex - 1}[i,j]\\oplus K_${roundNumber}[i,j]\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { keyState: bytesToState(roundKeys[roundNumber]), keyName: `K${roundNumber}`, operationName: "XOR" });

        rounds.push(round);
      }

      const round10 = {
        title: "Раунд 10",
        summary: "Финальный раунд похож на обычный, но без MixColumns.",
        operations: []
      };

      before = cloneState(state);
      state = subBytes(state);
      stepIndex += 1;
      addOperation(round10, "SubBytes", "Финальная замена байтов по S-box.", `\\[A_${stepIndex}[i,j]=SBox(A_${stepIndex - 1}[i,j])\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { operationName: "S-box", operationText: "табличная замена", extraHtml: sboxTableHtml(before) });

      before = cloneState(state);
      state = shiftRows(state);
      stepIndex += 1;
      addOperation(round10, "ShiftRows", "Последний фиксированный сдвиг строк: 0, 1, 2, 3 байта влево.", `\\[A_${stepIndex}[i,j]=A_${stepIndex - 1}[i,(j+i)\\bmod 4]\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { operationName: "ShiftRows", operationText: "0, 1, 2, 3 байта влево" });

      before = cloneState(state);
      state = addRoundKey(state, roundKeys[10]);
      stepIndex += 1;
      addOperation(round10, "AddRoundKey", "Последний XOR с K10. Полученная матрица читается по столбцам и становится шифртекстом блока.", `\\[A_${stepIndex}[i,j]=A_${stepIndex - 1}[i,j]\\oplus K_{10}[i,j]\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { keyState: bytesToState(roundKeys[10]), keyName: "K10", operationName: "XOR" });
      rounds.push(round10);
      firstCipherBlock = stateToBytes(state);
      encrypted.set(firstCipherBlock, offset);
    } else {
      encrypted.set(encryptBlockDetailed(padded.slice(offset, offset + 16), roundKeys).bytes, offset);
    }
  }

  return { mode: "encrypt", inputBytes, padded, cipher: encrypted, firstCipherBlock, key, roundKeys, rounds, blockCount: padded.length / 16 };
}

function decryptWhole(cipher, roundKeys) {
  const decrypted = new Uint8Array(cipher.length);
  for (let offset = 0; offset < cipher.length; offset += 16) {
    decrypted.set(decryptBlock(cipher.slice(offset, offset + 16), roundKeys), offset);
  }
  return pkcs7Unpad(decrypted);
}

function buildDecryption(cipherHex, keyText) {
  const cipher = hexToBytes(cipherHex);
  const key = normalizeKey(keyText);
  const roundKeys = expandKey(key);
  const rounds = [];
  let state = bytesToState(cipher.slice(0, 16));
  let stepIndex = 0;

  rounds.push({
    title: "Подготовка",
    summary: "Берется первый блок шифртекста и записывается в A0 по столбцам.",
    operations: [step("Шифртекст -> A0", "Дальше показывается дешифрование первого блока.", "\\[A_0[i,j]=cipherBlock[4j+i]\\]", cloneState(state), { outputName: "A0", operationName: "Блок 1", operationText: "HEX -> 16 байт", extraHtml: `<div class="blocks">${blockListHtml(cipher)}</div>` })]
  });

  const round10 = { title: "Раунд 10 назад", summary: "Начинаем с последнего ключа и обратных операций.", operations: [] };
  let before = cloneState(state);
  state = addRoundKey(state, roundKeys[10]);
  stepIndex += 1;
  addOperation(round10, "AddRoundKey", "XOR обратим: повторный XOR с тем же ключом убирает ключ.", `\\[A_${stepIndex}=A_${stepIndex - 1}\\oplus K_{10}\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { keyState: bytesToState(roundKeys[10]), keyName: "K10", operationName: "XOR" });

  before = cloneState(state);
  state = invShiftRows(state);
  stepIndex += 1;
  addOperation(round10, "InvShiftRows", "Строки сдвигаются обратно вправо.", `\\[A_${stepIndex}[i,j]=A_${stepIndex - 1}[i,(j-i)\\bmod 4]\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { operationName: "InvShiftRows", operationText: "0, 1, 2, 3 байта вправо" });

  before = cloneState(state);
  state = subBytes(state, INV_SBOX);
  stepIndex += 1;
  addOperation(round10, "InvSubBytes", "Каждый байт заменяется по обратной S-box.", `\\[A_${stepIndex}=InvSBox(A_${stepIndex - 1})\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { operationName: "InvSBox", operationText: "обратная таблица" });
  rounds.push(round10);

  for (let roundNumber = 9; roundNumber >= 1; roundNumber--) {
    const round = { title: `Раунд ${roundNumber} назад`, summary: `Обратный порядок для раунда ${roundNumber}: AddRoundKey, InvMixColumns, InvShiftRows, InvSubBytes.`, operations: [] };
    before = cloneState(state);
    state = addRoundKey(state, roundKeys[roundNumber]);
    stepIndex += 1;
    addOperation(round, "AddRoundKey", `Убираем раундовый ключ K${roundNumber}.`, `\\[A_${stepIndex}=A_${stepIndex - 1}\\oplus K_${roundNumber}\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { keyState: bytesToState(roundKeys[roundNumber]), keyName: `K${roundNumber}`, operationName: "XOR" });

    before = cloneState(state);
    state = invMixColumns(state);
    stepIndex += 1;
    addOperation(round, "InvMixColumns", "Обратное умножение столбцов возвращает состояние до MixColumns.", `\\[A_${stepIndex}=M^{-1}\\cdot A_${stepIndex - 1}\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { operationName: "M^-1", operationText: "обратная матрица" });

    before = cloneState(state);
    state = invShiftRows(state);
    stepIndex += 1;
    addOperation(round, "InvShiftRows", "Строки возвращаются на прежние позиции.", `\\[A_${stepIndex}[i,j]=A_${stepIndex - 1}[i,(j-i)\\bmod 4]\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { operationName: "InvShiftRows", operationText: "сдвиг вправо" });

    before = cloneState(state);
    state = subBytes(state, INV_SBOX);
    stepIndex += 1;
    addOperation(round, "InvSubBytes", "Обратная таблица S-box возвращает байты.", `\\[A_${stepIndex}=InvSBox(A_${stepIndex - 1})\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { operationName: "InvSBox", operationText: "обратная таблица" });
    rounds.push(round);
  }

  const finalRound = { title: "Финал", summary: "Убираем K0, затем удаляем PKCS#7 padding.", operations: [] };
  before = cloneState(state);
  state = addRoundKey(state, roundKeys[0]);
  stepIndex += 1;
  const plainBytes = decryptWhole(cipher, roundKeys);
  addOperation(finalRound, "AddRoundKey и padding", "После K0 получаются байты исходного текста с PKCS#7. Padding удаляется, байты UTF-8 превращаются в слово.", `\\[plain=UTF8^{-1}(removePKCS7(A_${stepIndex}))\\]`, before, state, `A${stepIndex - 1}`, `A${stepIndex}`, { keyState: bytesToState(roundKeys[0]), keyName: "K0", operationName: "XOR", extraHtml: `<p class="formula">${spacedHex(plainBytes)} -> ${escapeHtml(decoder.decode(plainBytes))}</p>` });
  rounds.push(finalRound);

  return { mode: "decrypt", cipher, key, roundKeys, rounds, plainBytes, plainText: decoder.decode(plainBytes), blockCount: cipher.length / 16 };
}

function renderRoundExplorer() {
  if (!appState.rounds.length) return;
  const round = appState.rounds[appState.roundIndex];
  appState.operationIndex = Math.min(appState.operationIndex, round.operations.length - 1);
  const operation = round.operations[appState.operationIndex];

  $("roundTabs").innerHTML = appState.rounds.map((item, index) => `
    <button type="button" class="tab ${index === appState.roundIndex ? "active" : ""}" data-round="${index}">${item.title}</button>
  `).join("");
  $("operationTabs").innerHTML = round.operations.map((item, index) => `
    <button type="button" class="tab ${index === appState.operationIndex ? "active" : ""}" data-operation="${index}">${item.title}</button>
  `).join("");
  $("roundDetails").innerHTML = `
    <article class="step">
      <div class="step-head">
        <div>
          <h3>${round.title}: ${operation.title}</h3>
          <p>${round.summary}</p>
        </div>
        <span>${appState.roundIndex + 1} / ${appState.rounds.length}</span>
      </div>
      <p>${operation.note}</p>
      <div class="math-line">${operation.formula}</div>
      ${expressionHtml(operation)}
      <p class="formula">Результат по столбцам: ${spacedHex(stateToBytes(operation.state))}</p>
      ${operation.extraHtml || ""}
    </article>
  `;

  $("roundTabs").querySelectorAll("[data-round]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.roundIndex = Number(button.dataset.round);
      appState.operationIndex = 0;
      renderRoundExplorer();
    });
  });
  $("operationTabs").querySelectorAll("[data-operation]").forEach((button) => {
    button.addEventListener("click", () => {
      appState.operationIndex = Number(button.dataset.operation);
      renderRoundExplorer();
    });
  });
  renderMath($("stepsPanel"));
}

function showSteps() {
  if (!appState.result) encryptAction();
  setVisible("stepsPanel", true);
  $("stepsBtn").textContent = appState.mode === "encrypt" ? "Показать шаги шифрования" : "Показать шаги дешифрования";
  $("modeLabel").textContent = appState.mode === "encrypt" ? "Шифрование" : "Дешифрование";
  $("stepsTitle").textContent = appState.mode === "encrypt" ? "Раунды шифрования первого блока" : "Раунды дешифрования первого блока";
  renderRoundExplorer();
}

function encryptAction() {
  const result = buildEncryption($("plainText").value, $("keyText").value);
  appState.mode = "encrypt";
  appState.result = result;
  appState.rounds = result.rounds;
  appState.roundIndex = 0;
  appState.operationIndex = 0;
  $("cipherInput").value = spacedHex(result.cipher);
  $("decryptedText").textContent = "";
  $("status").textContent = `Шифр вычислен. Блоков: ${result.blockCount}. Первый блок: ${spacedHex(result.firstCipherBlock)}.`;
  $("stepsBtn").textContent = "Показать шаги шифрования";
  if (isVisible($("stepsPanel"))) showSteps();
}

function decryptAction() {
  try {
    const result = buildDecryption($("cipherInput").value, $("keyText").value);
    appState.mode = "decrypt";
    appState.result = result;
    appState.rounds = result.rounds;
    appState.roundIndex = 0;
    appState.operationIndex = 0;
    $("plainText").value = result.plainText;
    $("decryptedText").textContent = `Расшифровано: ${result.plainText}`;
    $("status").textContent = `Шифр расшифрован. Блоков: ${result.blockCount}.`;
    $("stepsBtn").textContent = "Показать шаги дешифрования";
    if (isVisible($("stepsPanel"))) showSteps();
  } catch (error) {
    $("status").textContent = error.message;
  }
}

function playQuack() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const gain = context.createGain();
  gain.connect(context.destination);
  gain.gain.setValueAtTime(0.0001, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.28);

  [260, 190].forEach((frequency, index) => {
    const osc = context.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(frequency, context.currentTime + index * 0.11);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.72, context.currentTime + index * 0.11 + 0.1);
    osc.connect(gain);
    osc.start(context.currentTime + index * 0.11);
    osc.stop(context.currentTime + index * 0.11 + 0.13);
  });
  setTimeout(() => context.close(), 450);
}

function toggleDuck() {
  const duck = $("duck");
  duck.classList.remove("hidden");
  playQuack();
  clearTimeout(appState.duckTimer);
  appState.duckTimer = setTimeout(() => duck.classList.add("hidden"), 1200);
}

$("encryptBtn").addEventListener("click", encryptAction);
$("decryptBtn").addEventListener("click", decryptAction);
$("stepsBtn").addEventListener("click", showSteps);
$("hideStepsBtn").addEventListener("click", () => setVisible("stepsPanel", false));
$("aboutBtn").addEventListener("click", () => setVisible("aboutPanel", true));
$("closeAboutBtn").addEventListener("click", () => setVisible("aboutPanel", false));
$("duckBtn").addEventListener("click", toggleDuck);
$("demoBtn").addEventListener("click", () => {
  $("plainText").value = "Сложный пример: AES, 2 блока, !?";
  $("keyText").value = "Demo AES key 128";
  encryptAction();
});

encryptAction();
