import { computeGraphRows } from './computeGraphLanes'

self.onmessage = (e: MessageEvent) => {
  self.postMessage(computeGraphRows(e.data))
}
