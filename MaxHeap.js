export default class MaxHeap {
  constructor(array = []) {
    this.heap = array;
    this.buildHeap();
  }

  buildHeap() {
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.heapify(this.heap.length, i);
    }
  }

  heapify(size, i) {
    let max = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < size && this.heap[left] > this.heap[max]) {
      max = left;
    }

    if (right < size && this.heap[right] > this.heap[max]) {
      max = right;
    }

    if (max !== i) {
      [this.heap[i], this.heap[max]] = [this.heap[max], this.heap[i]];
      this.heapify(size, max);
    }
  }

  extractMax() {
    if (this.heap.length === 0) return null;
    const max = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapify(this.heap.length, 0);
    }
    return max;
  }

  toArray() {
    return [...this.heap];
  }
}
