import { useEffect, useRef } from 'react'
import { Terminal as XTerm } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { Resizable } from 'react-resizable'
import { useTerminalStore } from '../model/useTerminalStore'
import '@xterm/xterm/css/xterm.css'

const XTERM_THEME = {
  background: '#f5f6fa',
  foreground: '#2c3040',
  cursor: '#1b70f8',
  cursorAccent: '#f5f6fa',
  selectionBackground: 'rgba(27, 112, 248, 0.15)',
  black: '#111318',
  red: '#c0392b',
  green: '#27ae60',
  yellow: '#b07d0d',
  blue: '#1b70f8',
  magenta: '#6f42c1',
  cyan: '#0598bc',
  white: '#4a4f66',
  brightBlack: '#6b7088',
  brightRed: '#e74c3c',
  brightGreen: '#2ecc71',
  brightYellow: '#d4a017',
  brightBlue: '#3d8ef8',
  brightMagenta: '#9b59b6',
  brightCyan: '#17a8d4',
  brightWhite: '#2c3040',
}

const Terminal = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const height = useTerminalStore((s) => s.height)
  const setHeight = useTerminalStore((s) => s.setHeight)

  useEffect(() => {
    if (!containerRef.current) return

    const xterm = new XTerm({
      theme: XTERM_THEME,
      fontSize: 13,
      fontFamily: '"Cascadia Code", "JetBrains Mono", "Fira Code", monospace',
      cursorBlink: true,
      cursorStyle: 'bar',
      scrollback: 1000,
    })

    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)
    xterm.open(containerRef.current)

    window.terminalAPI.create().then(() => {
      fitAddon.fit()
      window.terminalAPI.resize(xterm.cols, xterm.rows)
    })

    const removeOutputListener = window.terminalAPI.onOutput((data) => xterm.write(data))
    xterm.onData((data) => window.terminalAPI.sendInput(data))

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit()
      window.terminalAPI.resize(xterm.cols, xterm.rows)
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      removeOutputListener()
      window.terminalAPI.destroy()
      xterm.dispose()
    }
  }, [])

  return (
    <Resizable
      height={height}
      width={0}
      onResizeStart={() => document.body.classList.add('terminal-dragging')}
      onResize={(_, { size }) => setHeight(Math.max(100, Math.min(700, size.height)))}
      onResizeStop={() => document.body.classList.remove('terminal-dragging')}
      resizeHandles={['n']}
    >
      <div
        className='flex flex-col border-l border-l-black/[0.07] bg-surface'
        style={{ height }}
      >
        <div className='flex items-center px-3 h-8 shrink-0 border-b border-b-divider select-none'>
          <span className='text-[11px] font-medium text-neutral-400'>Terminal</span>
        </div>
        <div ref={containerRef} className='flex-1 min-h-0 px-1 py-1' />
      </div>
    </Resizable>
  )
}

export default Terminal
