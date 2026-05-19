"use strict";

const rowsInput = document.querySelector("#rowsInput");
const colsInput = document.querySelector("#colsInput");
const resizeButton = document.querySelector("#resizeButton");
const exampleButton = document.querySelector("#exampleButton");
const clearButton = document.querySelector("#clearButton");
const calculateButton = document.querySelector("#calculateButton");
const normalizeInput = document.querySelector("#normalizeInput");
const matrixTable = document.querySelector("#matrixTable");
const sumStatus = document.querySelector("#sumStatus");
const message = document.querySelector("#message");

const output = {
  jointEntropy: document.querySelector("#jointEntropy"),
  entropyA: document.querySelector("#entropyA"),
  entropyB: document.querySelector("#entropyB"),
  conditionalAGivenB: document.querySelector("#conditionalAGivenB"),
  conditionalBGivenA: document.querySelector("#conditionalBGivenA"),
  mutualInformation: document.querySelector("#mutualInformation"),
  marginalA: document.querySelector("#marginalA"),
  marginalB: document.querySelector("#marginalB")
};

const resultDefinitions = [
  {
    key: "jointEntropy",
    formula: "H(A,B) = -Σ_iΣ_j p_ij * log2(p_ij)"
  },
  {
    key: "entropyA",
    formula: "P(A_i) = Σ_j p_ij; H(A) = -Σ_i P(A_i) * log2(P(A_i))"
  },
  {
    key: "entropyB",
    formula: "P(B_j) = Σ_i p_ij; H(B) = -Σ_j P(B_j) * log2(P(B_j))"
  },
  {
    key: "conditionalAGivenB",
    formula: "H(A|B) = H(A,B) - H(B)"
  },
  {
    key: "conditionalBGivenA",
    formula: "H(B|A) = H(A,B) - H(A)"
  },
  {
    key: "mutualInformation",
    formula: "I(A;B) = H(A) + H(B) - H(A,B)"
  }
];

const resultDetails = {};
let lastCalculationDetails = {};

const exampleMatrix = [
  [0.10, 0.05, 0.05],
  [0.15, 0.20, 0.10],
  [0.05, 0.10, 0.20]
];

function clampSize(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 1;
  }
  return Math.min(12, Math.max(1, parsed));
}

function entropy(probabilities) {
  return probabilities.reduce((sum, probability) => {
    if (probability <= 0) {
      return sum;
    }
    return sum - probability * Math.log2(probability);
  }, 0);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  const normalized = Math.abs(value) < 1e-12 ? 0 : value;
  return normalized.toFixed(6);
}

function formatProbability(value) {
  return formatNumber(value);
}

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

function setupResultDetails() {
  for (const definition of resultDefinitions) {
    const valueElement = output[definition.key];
    const card = valueElement.closest("article");
    const actions = document.createElement("div");
    const panel = document.createElement("p");
    const formulaButton = document.createElement("button");
    const calculationButton = document.createElement("button");

    actions.className = "detail-actions";
    panel.className = "result-detail";
    panel.hidden = true;
    formulaButton.type = "button";
    calculationButton.type = "button";
    formulaButton.textContent = "Подробнее";
    calculationButton.textContent = "Вычисление";

    formulaButton.addEventListener("click", () => {
      panel.hidden = false;
      panel.textContent = lastCalculationDetails[definition.key]?.formula ?? definition.formula;
    });

    calculationButton.addEventListener("click", () => {
      panel.hidden = false;
      panel.textContent = lastCalculationDetails[definition.key]?.calculation ?? "Сначала выполните расчет.";
    });

    actions.appendChild(formulaButton);
    actions.appendChild(calculationButton);
    card.appendChild(actions);
    card.appendChild(panel);
    resultDetails[definition.key] = panel;
  }
}

function getMatrixInputs() {
  return [...matrixTable.querySelectorAll("input[data-row][data-col]")];
}

function readMatrix() {
  const rows = clampSize(rowsInput.value);
  const cols = clampSize(colsInput.value);
  const matrix = Array.from({ length: rows }, () => Array(cols).fill(0));

  for (const input of getMatrixInputs()) {
    const row = Number.parseInt(input.dataset.row, 10);
    const col = Number.parseInt(input.dataset.col, 10);
    const rawValue = input.value.trim().replace(",", ".");
    const value = rawValue === "" ? 0 : Number.parseFloat(rawValue);

    if (!Number.isFinite(value) || value < 0) {
      throw new Error("Все элементы матрицы должны быть неотрицательными числами.");
    }

    matrix[row][col] = value;
  }

  return matrix;
}

function matrixSum(matrix) {
  return matrix.flat().reduce((sum, value) => sum + value, 0);
}

function updateSumStatus() {
  try {
    const sum = matrixSum(readMatrix());
    sumStatus.textContent = `Сумма вероятностей: ${formatNumber(sum)}`;
    sumStatus.style.color = Math.abs(sum - 1) <= 1e-9 ? "var(--ok)" : "var(--muted)";
  } catch (error) {
    sumStatus.textContent = "Сумма вероятностей: ошибка ввода";
    sumStatus.style.color = "var(--danger)";
  }
}

function createMatrix(rows, cols, values = []) {
  rowsInput.value = rows;
  colsInput.value = cols;
  matrixTable.innerHTML = "";

  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  headRow.appendChild(document.createElement("th"));

  for (let col = 0; col < cols; col += 1) {
    const th = document.createElement("th");
    th.textContent = `B${col + 1}`;
    headRow.appendChild(th);
  }

  head.appendChild(headRow);
  matrixTable.appendChild(head);

  const body = document.createElement("tbody");
  for (let row = 0; row < rows; row += 1) {
    const tr = document.createElement("tr");
    const rowHead = document.createElement("th");
    rowHead.textContent = `A${row + 1}`;
    tr.appendChild(rowHead);

    for (let col = 0; col < cols; col += 1) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      const value = values[row]?.[col] ?? 0;

      input.type = "number";
      input.min = "0";
      input.step = "0.000001";
      input.inputMode = "decimal";
      input.dataset.row = String(row);
      input.dataset.col = String(col);
      input.value = value === 0 ? "" : String(value);
      input.setAttribute("aria-label", `P(A${row + 1}, B${col + 1})`);
      input.addEventListener("input", updateSumStatus);

      td.appendChild(input);
      tr.appendChild(td);
    }

    body.appendChild(tr);
  }

  matrixTable.appendChild(body);
  resetResults();
  updateSumStatus();
  setMessage("Введите вероятности совместных состояний. Сумма должна быть равна 1.");
}

function resetResults() {
  output.jointEntropy.textContent = "-";
  output.entropyA.textContent = "-";
  output.entropyB.textContent = "-";
  output.conditionalAGivenB.textContent = "-";
  output.conditionalBGivenA.textContent = "-";
  output.mutualInformation.textContent = "-";
  output.marginalA.innerHTML = "";
  output.marginalB.innerHTML = "";
  lastCalculationDetails = {};

  for (const panel of Object.values(resultDetails)) {
    panel.hidden = true;
    panel.textContent = "";
  }
}

function normalizeMatrix(matrix, sum) {
  return matrix.map((row) => row.map((value) => value / sum));
}

function marginalByRows(matrix) {
  return matrix.map((row) => row.reduce((sum, value) => sum + value, 0));
}

function marginalByCols(matrix) {
  const cols = matrix[0]?.length ?? 0;
  return Array.from({ length: cols }, (_, col) =>
    matrix.reduce((sum, row) => sum + row[col], 0)
  );
}

function renderMarginalList(list, element, prefix) {
  element.innerHTML = "";
  list.forEach((value, index) => {
    const item = document.createElement("li");
    item.textContent = `${prefix}${index + 1}) = ${formatNumber(value)}`;
    element.appendChild(item);
  });
}

function writeNormalizedValues(matrix) {
  for (const input of getMatrixInputs()) {
    const row = Number.parseInt(input.dataset.row, 10);
    const col = Number.parseInt(input.dataset.col, 10);
    input.value = formatNumber(matrix[row][col]);
  }
}

function entropySubstitution(probabilities, label, result) {
  const nonZero = probabilities.filter((probability) => probability > 0);
  if (nonZero.length === 0) {
    return `${label} = 0 бит`;
  }

  const terms = nonZero.map((probability) => {
    const value = formatProbability(probability);
    return `${value} * log2(${value})`;
  });

  return `${label} = -(${terms.join(" + ")}) = ${formatNumber(result)} бит`;
}

function rowSumsSubstitution(matrix, marginalA) {
  return matrix.map((row, index) => {
    const terms = row.map(formatProbability).join(" + ");
    return `P(A${index + 1}) = ${terms} = ${formatNumber(marginalA[index])}`;
  });
}

function colSumsSubstitution(matrix, marginalB) {
  return marginalB.map((value, col) => {
    const terms = matrix.map((row) => formatProbability(row[col])).join(" + ");
    return `P(B${col + 1}) = ${terms} = ${formatNumber(value)}`;
  });
}

function buildCalculationDetails(values) {
  const {
    matrix,
    marginalA,
    marginalB,
    jointEntropy,
    entropyA,
    entropyB,
    conditionalAGivenB,
    conditionalBGivenA,
    mutualInformation
  } = values;

  return {
    jointEntropy: {
      formula: "Совместная энтропия: H(A,B) = -Σ_iΣ_j p_ij * log2(p_ij). В сумме используются все элементы исходной матрицы вероятностей.",
      calculation: entropySubstitution(matrix.flat(), "H(A,B)", jointEntropy)
    },
    entropyA: {
      formula: "Энтропия системы A: сначала считаются P(A_i) как суммы строк матрицы, затем H(A) = -Σ_i P(A_i) * log2(P(A_i)).",
      calculation: `${rowSumsSubstitution(matrix, marginalA).join("; ")}. ${entropySubstitution(marginalA, "H(A)", entropyA)}`
    },
    entropyB: {
      formula: "Энтропия системы B: сначала считаются P(B_j) как суммы столбцов матрицы, затем H(B) = -Σ_j P(B_j) * log2(P(B_j)).",
      calculation: `${colSumsSubstitution(matrix, marginalB).join("; ")}. ${entropySubstitution(marginalB, "H(B)", entropyB)}`
    },
    conditionalAGivenB: {
      formula: "Условная энтропия A при известной B: H(A|B) = H(A,B) - H(B).",
      calculation: `H(A|B) = ${formatNumber(jointEntropy)} - ${formatNumber(entropyB)} = ${formatNumber(conditionalAGivenB)} бит`
    },
    conditionalBGivenA: {
      formula: "Условная энтропия B при известной A: H(B|A) = H(A,B) - H(A).",
      calculation: `H(B|A) = ${formatNumber(jointEntropy)} - ${formatNumber(entropyA)} = ${formatNumber(conditionalBGivenA)} бит`
    },
    mutualInformation: {
      formula: "Взаимная информация показывает зависимость систем: I(A;B) = H(A) + H(B) - H(A,B).",
      calculation: `I(A;B) = ${formatNumber(entropyA)} + ${formatNumber(entropyB)} - ${formatNumber(jointEntropy)} = ${formatNumber(mutualInformation)} бит`
    }
  };
}

function calculate() {
  try {
    let matrix = readMatrix();
    let sum = matrixSum(matrix);

    if (sum <= 0) {
      throw new Error("Сумма вероятностей должна быть больше нуля.");
    }

    if (Math.abs(sum - 1) > 1e-9) {
      if (!normalizeInput.checked) {
        throw new Error("Сумма вероятностей должна быть равна 1. Включите нормирование или исправьте матрицу.");
      }
      matrix = normalizeMatrix(matrix, sum);
      writeNormalizedValues(matrix);
      sum = 1;
    }

    const probabilities = matrix.flat();
    const marginalA = marginalByRows(matrix);
    const marginalB = marginalByCols(matrix);
    const jointEntropy = entropy(probabilities);
    const entropyA = entropy(marginalA);
    const entropyB = entropy(marginalB);
    const conditionalAGivenB = jointEntropy - entropyB;
    const conditionalBGivenA = jointEntropy - entropyA;
    const mutualInformation = entropyA + entropyB - jointEntropy;

    output.jointEntropy.textContent = `${formatNumber(jointEntropy)} бит`;
    output.entropyA.textContent = `${formatNumber(entropyA)} бит`;
    output.entropyB.textContent = `${formatNumber(entropyB)} бит`;
    output.conditionalAGivenB.textContent = `${formatNumber(conditionalAGivenB)} бит`;
    output.conditionalBGivenA.textContent = `${formatNumber(conditionalBGivenA)} бит`;
    output.mutualInformation.textContent = `${formatNumber(mutualInformation)} бит`;
    renderMarginalList(marginalA, output.marginalA, "P(A");
    renderMarginalList(marginalB, output.marginalB, "P(B");
    lastCalculationDetails = buildCalculationDetails({
      matrix,
      marginalA,
      marginalB,
      jointEntropy,
      entropyA,
      entropyB,
      conditionalAGivenB,
      conditionalBGivenA,
      mutualInformation
    });

    for (const panel of Object.values(resultDetails)) {
      panel.hidden = true;
      panel.textContent = "";
    }

    updateSumStatus();
    setMessage(`Расчет выполнен. Использована сумма вероятностей: ${formatNumber(sum)}.`, "ok");
  } catch (error) {
    resetResults();
    updateSumStatus();
    setMessage(error.message, "error");
  }
}

resizeButton.addEventListener("click", () => {
  createMatrix(clampSize(rowsInput.value), clampSize(colsInput.value));
});

exampleButton.addEventListener("click", () => {
  createMatrix(3, 3, exampleMatrix);
  calculate();
});

clearButton.addEventListener("click", () => {
  createMatrix(clampSize(rowsInput.value), clampSize(colsInput.value));
});

calculateButton.addEventListener("click", calculate);

setupResultDetails();
createMatrix(3, 3, exampleMatrix);
calculate();
