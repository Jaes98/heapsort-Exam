window.addEventListener("load", start);

const arr = [1, 4, 1, 2, 7, 5, 2, 4, 8];
const originalArray = [...arr];
let delayValue = document.getElementById("speedSlider").value;

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
  displayArrayAsBars(arr, "arrayDisplay");
  //   displayArrayAsBoxes(countArr, "countingArrayDisplay");
  //   displayIndexLabels(countArr.length, "countingArrayIndexDisplay");
  //   displayArrayAsBoxes(arr, "originalArrayDisplay");
}

async function heapSort(array) {
  let size = array.length;

  for (let i = Math.floor(size / 2 - 1); i >= 0; i--) {
    heapify(array, size, i);
    visualizeStep(array, `Heapify at index ${i}`, "heapify", i);
    await delayDuration(delayValue);
  }

  // set the last element as the largest element
  for (let i = size - 1; i >= 0; i--) {
    // temp to store the first element which is the largest element
    let temp = array[0];
    // set the first element as the last element
    array[0] = array[i];
    // set the last element as the largest
    array[i] = temp;
    // i = size of the array, 0 = root node
    visualizeStep(array, `Swap root node with last element`, "swap", i);
    await delayDuration(delayValue);

    heapify(array, i, 0);

    visualizeStep(array, `Heapify root ${i}`, "heapify", i);
    await delayDuration(delayValue);
  }
}

function heapify(array, size, i) {
  // max = 0, root node
  let max = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  // if left child is greater than root, set left as max
  if (left < size && array[left] > array[max]) max = left;

  // if right child is greater than root, set right as max
  if (right < size && array[right] > array[max]) max = right;

  // if max is not root, swap root with max
  if (max != i) {
    // temp = root
    let temp = array[i];
    // set last element = max
    array[i] = array[max];
    // set max to root
    array[max] = temp;

    // recursively heapify the affected sub-tree because the root has been changed
    heapify(array, size, max);
  }
}

function handleArrayInput() {
  const arrayInput = document.getElementById("arrayInput").value;
  const newArray = arrayInput.split(",").map(Number);

  if (newArray.some(isNaN)) {
    alert("Please enter a valid array of numbers separated by commas.");
    return;
  }

  arr.splice(0, arr.length, ...newArray);
  originalArray.splice(0, originalArray.length, ...newArray);
  countArr = new Array(Math.max(...newArray) + 1).fill(0);

  clearDisplays();

  // TODO: display as tree/heap
  displayArrayAsBars(newArray, "arrayDisplay");
  //   displayArrayAsBoxes(countArr, "countingArrayDisplay");
  //   displayIndexLabels(countArr.length, "countingArrayIndexDisplay");
  //   displayArrayAsBoxes(newArray, "originalArrayDisplay");
}

async function handleStartClicked(arr) {
  await heapSort(arr);
}

function handleResetClicked() {
  resetFlag = true;

  arr.splice(0, arr.length, ...originalArray);

  countArr = new Array(Math.max(...originalArray) + 1).fill(0);

  clearDisplays();

  // TODO: display as tree/heap
  //   displayArrayAsBars(originalArray, "arrayDisplay");
  //   displayArrayAsBoxes(countArr, "countingArrayDisplay");
  //   displayIndexLabels(countArr.length, "countingArrayIndexDisplay");
}

function delayDuration(ms) {
  // Delays the sorting algorithm based on ms value
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// TODO display as tree/heap
function visualizeStep(array, message, type, highlightIndex) {
  if (resetFlag) return;

  displayArrayAsBars(array, "arrayDisplay");
  displayAsTree(array, "treeDisplay");
  //   if (type === "counting") {
  //     displayArrayAsBoxes(array, "countingArrayDisplay", highlightIndex);
  //     displayIndexLabels(array.length, "countingArrayIndexDisplay");
  //   } else if (type === "sorting") {
  //     displayArrayAsBars(array, "arrayDisplay", highlightIndex);
  //   } else if (type === "originalCounting") {
  //     displayArrayAsBars(array, "arrayDisplay", highlightIndex);
  //   } else if (type === "original") {
  //     displayArrayAsBars(array, "arrayDisplay", -1);
  //   }
  document.getElementById("steps").innerHTML = message;
}

function clearContainer(containerId) {
  const clearedContainer = document.getElementById(containerId);
  clearedContainer.innerHTML = "";
  return clearedContainer;
}

function clearDisplays() {
  document.getElementById("arrayDisplay").innerHTML = "";
  document.getElementById("steps").innerHTML = "";
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

function displayArrayAsBars(array, containerId, highlightIndex) {
  const barContainer = clearContainer(containerId);

  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 20}px`;
    bar.style.backgroundColor = index === highlightIndex ? "#FF4949" : "#2e63e9";

    const label = document.createElement("label");
    label.classList.add("bar-label");
    label.innerHTML = value;
    bar.appendChild(label);

    barContainer.appendChild(bar);
  });
}
