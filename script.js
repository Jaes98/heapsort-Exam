window.addEventListener("load", start);

const array = [3, 5, 12, 5, 6, 11, 8, 10, 13, 2];
const originalArray = [...array];
const max = Math.max(...array);

let delayValue = document.getElementById("speedSlider").value;

// Reset flag to stop the sorting algorithm
let resetFlag = false;

// Global pause and resume variables
let isPaused = false;
let resumePromise;
let resumeFunction;

function start() {
  const submitArrayButton = document.getElementById("submitArrayButton");
  const startButton = document.getElementById("start_button");
  const pause_button = document.getElementById("pause_button");
  const resume_button = document.getElementById("resume_button");
  const resetButton = document.getElementById("reset_button");
  const speedSlider = document.getElementById("speedSlider");
  const speedValue = document.getElementById("speedValue");

  submitArrayButton.addEventListener("click", handleUserArrayInput);
  startButton.addEventListener("click", handleStartClicked);
  pause_button.addEventListener("click", handlePauseClicked);
  resume_button.addEventListener("click", handleResumeClicked);
  resetButton.addEventListener("click", handleResetClicked);

  speedSlider.addEventListener("input", function () {
    // Update the delay value between each step of the sorting algorithm
    // Delay value is inverted to match the intuitive feel of the slider
    delayValue = speedSlider.max - (this.value - speedSlider.min);
    speedValue.textContent = `Animation speed (ms): ${delayValue}`;
  });

  displayArrayAsBars(array, "arrayDisplay");
  displayArrayAsBoxes(array, "originalArrayDisplay");
}

async function heapSort(array) {
  if (isPaused) await pauseProcess();
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
    // temp variable to store the first element which is the largest element
    let temp = array[0];
    // set the root element to point to the last element
    array[0] = array[i];
    // set the last element as the largest to be placed at the end of the array
    array[i] = temp;

    visualizeStep(array, `Swapped parent at index [0] with child at index [${i}].`, "swap", [0, i]);
    await delayDuration(delayValue);

    visualizeStep(array, `Heapifying root at index [${i}]`, "heapify", [0, 2 * 0 + 1, 2 * 0 + 2]);
    await delayDuration(delayValue);

    // i = size of the array, 0 = root node
    await heapify(array, i, 0);
  }

  displayArrayAsBars(array, "arrayDisplay");
}

async function heapify(array, size, i) {
  if (isPaused) await pauseProcess();

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
    // set temp to root
    let temp = array[i];
    // moves the largest element to the root
    array[i] = array[max];
    // moves the original root to the largest element's previous position
    array[max] = temp;

    visualizeStep(array, `Swapped parent at index [${i}] with child at index [${max}].`, "swap", [i, max]);
    await delayDuration(delayValue);

    // recursively heapify the affected sub-tree because the root has been changed
    await heapify(array, size, max);
  }
}

function handleUserArrayInput() {
  const userArrayInput = document.getElementById("userArrayInput").value;
  const newArray = userArrayInput.split(",").map(Number);

  if (newArray.some(isNaN)) {
    alert("Please enter a valid array of numbers separated by commas.");
    return;
  }

  array.splice(0, array.length, ...newArray);
  originalArray.splice(0, originalArray.length, ...newArray);

  clearDisplays();

  displayArrayAsBars(newArray, "arrayDisplay");
}

async function handleStartClicked() {
  document.getElementById("status").innerHTML = "Program status: Running";
  await heapSort(array);
}

function handlePauseClicked() {
  isPaused = true;
  document.getElementById("status").innerHTML = "Program status: Paused";
}

function handleResumeClicked() {
  isPaused = false;
  document.getElementById("status").innerHTML = "Program status: Running";
  resumeFunction();
}

function handleResetClicked() {
  resetFlag = true;

  document.getElementById("status").innerHTML = "Program status: Not running";

  array.splice(0, array.length, ...originalArray);

  clearDisplays();

  displayArrayAsBars(originalArray, "arrayDisplay");
}

function delayDuration(ms) {
  // Delays the sorting algorithm based on ms value
  // Uses a promise to allow pausing the sorting algorithm by waiting for the promise to resolve
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pauseProcess() {
  // Uses a promise to pause the sorting algorithm until the resume button is clicked
  return new Promise((resolve) => {
    resumeFunction = resolve;
  });
}

async function visualizeStep(array, message, type, highlightIndex = []) {
  if (resetFlag) return;
  if (isPaused) await pauseProcess();

  displayArrayAsBars(array, "arrayDisplay", highlightIndex, type);
  document.getElementById("stepsTaken").innerHTML = message;

  // For displaying steps taken in console, since they disappear in UI
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

function displayArrayAsBars(array, containerId, highlightIndex = [], type = null) {
  const barContainer = clearContainer(containerId);

  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value * 20}px`;

    if (highlightIndex.includes(index)) {
      let color = "#FF4949"; // Default highlight color

      if (type === "swap") {
        // Assign colors to the index being swapped
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

    // array label
    const label = document.createElement("label");
    label.classList.add("bar-label");
    label.innerHTML = value;
    bar.appendChild(label);

    // append index label to bar
    const indexLabel = document.createElement("label");
    indexLabel.classList.add("bar-index-label");
    indexLabel.innerHTML = index;
    bar.appendChild(indexLabel);

    barContainer.appendChild(bar);
  });
}

// Original array displayed as boxes
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
