window.addEventListener("load", start);

const array = [3, 5, 12, 5, 6, 11, 8, 10, 13, 2];
const originalArray = [...array];
let delayValue = document.getElementById("speedSlider").value;

const max = Math.max(...array);
let countArr = Array(max + 1).fill(0);

let resetFlag = false;

function start() {
  console.log("JS running");

  const submitArrayButton = document.getElementById("submitArrayButton");
  const startButton = document.getElementById("start_button");
  const resetButton = document.getElementById("reset_button");
  const speedSlider = document.getElementById("speedSlider");
  const speedValue = document.getElementById("speedValue");

  submitArrayButton.addEventListener("click", handleArrayInput);
  startButton.addEventListener("click", handleStartClicked);
  resetButton.addEventListener("click", handleResetClicked);

  speedSlider.addEventListener("input", function () {
    delayValue = this.value;
    speedValue.textContent = `Animation speed (ms): ${delayValue}`;
  });

  // TODO display as tree/heap
  displayArrayAsBars(array, "arrayDisplay");
  // displayIndexLabels(countArr.length, "indexCounterDisplay");
  displayArrayAsBoxes(array, "originalArrayDisplay");
}

async function heapSort(array) {
  resetFlag = false;
  let size = array.length;

  for (let i = Math.floor(size / 2 - 1); i >= 0; i--) {
    if (resetFlag) return;

    visualizeStep(array, `Building heap at index [${i}]`, "heapify", [i]);
    await delayDuration(delayValue);
    await heapify(array, size, i);
  }

  // set the last element as the largest element
  for (let i = size - 1; i >= 0; i--) {
    // temp to store the first element which is the largest element
    let temp = array[0];
    // set the first element as the last element
    array[0] = array[i];
    // set the last element as the largest
    array[i] = temp;

    visualizeStep(array, `Swapped parent at index [0] with child index at index [${i}].`, "swap", [0, i]);
    await delayDuration(delayValue);

    visualizeStep(array, `Heapifying root at index [${i}]`, "heapify", [0, 2 * 0 + 1, 2 * 0 + 2]);
    await delayDuration(delayValue);

    // i = size of the array, 0 = root node
    await heapify(array, i, 0);
  }

  displayArrayAsBars(array, "arrayDisplay");
}

async function heapify(array, size, i) {
  // max = 0, root node
  let max = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  // if left child is greater than root, set left as max
  if (left < size && array[left] > array[max]) {
    max = left;
    visualizeStep(array, `Left child at index [${left}] is greater than parent at index [${i}].`, "compare", [left, i]);
    await delayDuration(delayValue);
  }

  // if right child is greater than root, set right as max
  if (right < size && array[right] > array[max]) {
    max = right;
    visualizeStep(array, `Right child at index [${right}] is greater than parent at index [${i}].`, "compare", [right, i]);
    await delayDuration(delayValue);
  }

  // if max is not root, swap root with max
  if (max != i) {
    // temp = root
    let temp = array[i];
    // set last element = max
    array[i] = array[max];
    // set max to root
    array[max] = temp;

    visualizeStep(array, `Swapped parent at index [${i}] with child at index [${max}].`, "swap", [i, max]);
    await delayDuration(delayValue);

    // recursively heapify the affected sub-tree because the root has been changed
    await heapify(array, size, max);
  }
}

function formatParentChild(parentIndex, childIndex) {
  return `Parent index ${parentIndex} with value ${array[parentIndex]} has child index ${childIndex} with value ${array[childIndex]}`;
}

function handleArrayInput() {
  const arrayInput = document.getElementById("arrayInput").value;
  const newArray = arrayInput.split(",").map(Number);

  if (newArray.some(isNaN)) {
    alert("Please enter a valid array of numbers separated by commas.");
    return;
  }

  array.splice(0, array.length, ...newArray);
  originalArray.splice(0, originalArray.length, ...newArray);
  countArr = new Array(Math.max(...newArray) + 1).fill(0);

  clearDisplays();

  // TODO: display as tree/heap
  displayArrayAsBars(newArray, "arrayDisplay");
  //   displayArrayAsBoxes(countArr, "countingArrayDisplay");
  //   displayIndexLabels(countArr.length, "countingArrayIndexDisplay");
  //   displayArrayAsBoxes(newArray, "originalArrayDisplay");
}

console.log(array);

async function handleStartClicked() {
  console.log(array);

  await heapSort(array);
}

function handleResetClicked() {
  resetFlag = true;

  array.splice(0, array.length, ...originalArray);

  countArr = new Array(Math.max(...originalArray) + 1).fill(0);

  clearDisplays();

  displayArrayAsBars(originalArray, "arrayDisplay");
}

function delayDuration(ms) {
  // Delays the sorting algorithm based on ms value
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function visualizeStep(array, message, type, highlightIndex = []) {
  if (resetFlag) return;

  displayArrayAsBars(array, "arrayDisplay", highlightIndex, type);
  document.getElementById("stepsTaken").innerHTML = message;

  console.log(message);
}

function clearContainer(containerId) {
  const clearedContainer = document.getElementById(containerId);
  clearedContainer.innerHTML = "";
  return clearedContainer;
}

function clearDisplays() {
  document.getElementById("arrayDisplay").innerHTML = "";
  document.getElementById("stepsTaken").innerHTML = "";
}

// function displayAsBars(array, containerId) {
//   const container = document.getElementById(containerId);
//   container.innerHTML = "";

//   array.forEach((value) => {
//     const bar = document.createElement("div");
//     bar.classList.add("bar");
//     bar.style.height = `${value * 20}px`; // Adjust the scaling as needed
//     container.appendChild(bar);
//   });
// }

function displayArrayAsBars(array, containerId, highlightIndex = [], type = null) {
  const barContainer = clearContainer(containerId);

  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 20}px`;

    if (highlightIndex.includes(index)) {
      let color = "#FF4949"; // Default highlight color

      if (type === "swap") {
        // Assign red to the first index and green to the second index being swapped
        const swapIndex = highlightIndex.indexOf(index);
        color = swapIndex === 0 ? "#FF4949" : "#00FF00"; // Red and Green
      } else if (type === "compare") {
        const compareIndex = highlightIndex.indexOf(index);
        color = compareIndex === 0 ? "#ff8000" : "#FFD700"; // Orange and Gold
      }

      bar.style.backgroundColor = color;
    } else {
      bar.style.backgroundColor = "#2e63e9"; // Default bar color
    }

    const label = document.createElement("label");
    label.classList.add("bar-label");
    label.innerHTML = value;
    bar.appendChild(label);

    const indexLabel = document.createElement("label");
    indexLabel.classList.add("bar-index-label");
    indexLabel.innerHTML = index;
    bar.appendChild(indexLabel);

    barContainer.appendChild(bar);
  });
}

function displayArrayAsBoxes(array, containerId, highlightIndex) {
  const boxContainer = clearContainer(containerId);

  array.forEach((value, index) => {
    const box = document.createElement("div");
    box.classList.add("box");
    box.style.backgroundColor = index === highlightIndex ? "#FF4949" : "#f0f0f0";

    const label = document.createElement("label");
    label.classList.add("box-label");
    label.innerHTML = value;
    box.appendChild(label);

    boxContainer.appendChild(box);
  });
}

function displayIndexLabels(length, containerId) {
  const indexContainer = clearContainer(containerId);

  for (let i = 0; i < length; i++) {
    const indexLabel = document.createElement("div");

    indexLabel.classList.add("index-label");
    indexLabel.innerHTML = i;

    indexContainer.appendChild(indexLabel);
  }
}
