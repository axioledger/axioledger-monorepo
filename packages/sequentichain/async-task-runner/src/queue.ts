/**
 * async-task-runner — Priority Queue
 *
 * Min-heap priority queue: item với priority cao nhất được dequeue trước.
 * Operations: enqueue O(log n), dequeue O(log n), peek O(1).
 */

import type { QueueItem } from "./types.js"

export class PriorityQueue<T = unknown> {
  private readonly heap: QueueItem<T>[] = []

  get size(): number {
    return this.heap.length
  }

  isEmpty(): boolean {
    return this.heap.length === 0
  }

  /**
   * Thêm task vào queue theo priority (cao hơn → được xử lý trước).
   */
  enqueue(item: QueueItem<T>): void {
    this.heap.push(item)
    this._bubbleUp(this.heap.length - 1)
  }

  /**
   * Lấy và xoá item có priority cao nhất.
   * @throws Error nếu queue rỗng
   */
  dequeue(): QueueItem<T> {
    if (this.isEmpty()) throw new Error("PriorityQueue: dequeue từ queue rỗng")
    const top = this.heap[0]!
    const last = this.heap.pop()!
    if (this.heap.length > 0) {
      this.heap[0] = last
      this._sinkDown(0)
    }
    return top
  }

  /**
   * Xem item đầu queue mà không xoá.
   */
  peek(): QueueItem<T> | undefined {
    return this.heap[0]
  }

  /**
   * Xoá tất cả items trong queue.
   */
  clear(): void {
    this.heap.length = 0
  }

  /**
   * Trả về snapshot (copy) của tất cả items hiện tại.
   */
  toArray(): QueueItem<T>[] {
    return [...this.heap]
  }

  // ─── Heap helpers ──────────────────────────────────────────────────────────

  private _bubbleUp(i: number): void {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2)
      if (this._priority(this.heap[parent]!) >= this._priority(this.heap[i]!)) break
      this._swap(parent, i)
      i = parent
    }
  }

  private _sinkDown(i: number): void {
    const n = this.heap.length
    while (true) {
      const left  = 2 * i + 1
      const right = 2 * i + 2
      let largest = i

      if (left  < n && this._priority(this.heap[left]!)  > this._priority(this.heap[largest]!)) largest = left
      if (right < n && this._priority(this.heap[right]!) > this._priority(this.heap[largest]!)) largest = right

      if (largest === i) break
      this._swap(i, largest)
      i = largest
    }
  }

  private _priority(item: QueueItem<T>): number {
    return item.task.priority
  }

  private _swap(a: number, b: number): void {
    const tmp    = this.heap[a]!
    this.heap[a] = this.heap[b]!
    this.heap[b] = tmp
  }
}
