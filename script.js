window.addEventListener("load", start);

const array = [1, 4, 1, 2, 7, 5, 2, 4, 8];
const originalArray = [...array];
let delayValue = document.getElementById("speedSlider").value;

let steps = [];
let currentStep = 0;

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
  displayIndexLabels(countArr.length, "indexCounterDisplay");
  displayArrayAsBoxes(array, "originalArrayDisplay");
}

// async function heapSort(array) {
//   let size = array.length;
//   console.log(size);

//   console.log("Heap sort started");

//   for (let i = Math.floor(size / 2 - 1); i >= 0; i--) {
//     heapify(array, size, i);
//     visualizeStep(array, `Heapify at index ${i}`, "heapify", i);
//     await delayDuration(delayValue);
//   }

//   // set the last element as the largest element
//   for (let i = size - 1; i >= 0; i--) {
//     // temp to store the first element which is the largest element
//     let temp = array[0];
//     // set the first element as the last element
//     array[0] = array[i];
//     // set the last element as the largest
//     array[i] = temp;
//     // i = size of the array, 0 = root node
//     visualizeStep(array, `Swap root node with last element`, "swap", i);
//     await delayDuration(delayValue);

//     heapify(array, i, 0);

//     visualizeStep(array, `Heapify root ${i}`, "heapify", i);
//     await delayDuration(delayValue);
//   }
// }

async function heapSort(array) {
  let size = array.length;
  console.log(size);

  console.log("Heap sort started");

  for (let i = Math.floor(size / 2 - 1); i >= 0; i--) {
    visualizeStep(array, `Heapify at index ${i}`, "heapify", [i]);
    heapify(array, size, i);
    await delayDuration(delayValue);
  }

  for (let i = size - 1; i >= 0; i--) {
    let temp = array[0];
    array[0] = array[i];
    array[i] = temp;
    visualizeStep(array, `Swapped parent index 0 [root node] with child index ${i}.`, "swap", [0, i]);
    await delayDuration(delayValue);

    visualizeStep(array, `Heapify root ${i}`, "heapify", [0, 2 * 0 + 1, 2 * 0 + 2]);
    heapify(array, i, 0);
    await delayDuration(delayValue);
  }
}

// function heapify(array, size, i) {
//   // max = 0, root node
//   let max = i;
//   let left = 2 * i + 1;
//   let right = 2 * i + 2;

//   // if left child is greater than root, set left as max
//   if (left < size && array[left] > array[max]) max = left;

//   // if right child is greater than root, set right as max
//   if (right < size && array[right] > array[max]) max = right;

//   // if max is not root, swap root with max
//   if (max != i) {
//     // temp = root
//     let temp = array[i];
//     // set last element = max
//     array[i] = array[max];
//     // set max to root
//     array[max] = temp;

//     // recursively heapify the affected sub-tree because the root has been changed
//     heapify(array, size, max);
//   }
// }

function heapify(array, size, i) {
  let max = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < size && array[left] > array[max]) {
    max = left;
    visualizeStep(array, `Left child ${left} is greater than parent ${i}.`, "compare", [left]);
  }

  if (right < size && array[right] > array[max]) {
    max = right;
    visualizeStep(array, `Right child ${right} is greater than parent ${i}.`, "compare", [right]);
  }

  if (max != i) {
    let temp = array[i];
    array[i] = array[max];
    array[max] = temp;

    visualizeStep(array, `Swapped parent index ${i} with child index ${max}.`, "swap", [i, max]);

    heapify(array, size, max);
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

  // TODO: display as tree/heap
  displayArrayAsBars(originalArray, "arrayDisplay");
  //   displayArrayAsBoxes(countArr, "countingArrayDisplay");
  //   displayIndexLabels(countArr.length, "countingArrayIndexDisplay");
}

function delayDuration(ms) {
  // Delays the sorting algorithm based on ms value
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function visualizeStep(array, message, type, highlightIndices = []) {
  if (resetFlag) return;

  displayArrayAsBars(array, "arrayDisplay", highlightIndices, type);
  if (type === "heapify" || type === "swap") {
    displayIndexLabels(array.length, "indexCounterDisplay");
  }

  document.getElementById("stepsTaken").innerHTML = message;
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

function displayArrayAsBars(array, containerId, highlightIndices = [], type = null) {
  const barContainer = clearContainer(containerId);

  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 20}px`;

    if (highlightIndices.includes(index)) {
      let color = "#FF4949"; // Default highlight color

      if (type === "swap") {
        // Assign red to the first index and green to the second index being swapped
        const swapIndex = highlightIndices.indexOf(index);
        color = swapIndex === 0 ? "#FF4949" : "#00FF00"; // Red and Green
      } else if (type === "compare") {
        color = "#0000FF"; // Blue for comparison
      }

      bar.style.backgroundColor = color;
    } else {
      bar.style.backgroundColor = "#2e63e9"; // Default bar color
    }

    const label = document.createElement("label");
    label.classList.add("bar-label");
    label.innerHTML = value;
    bar.appendChild(label);

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
