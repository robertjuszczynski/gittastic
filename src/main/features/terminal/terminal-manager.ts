import * as pty from 'node-pty'
import os from 'os'

class TerminalManager {
  private ptyProcess: pty.IPty | null = null

  spawn(cwd: string, onData: (data: string) => void) {
    if (this.ptyProcess) {
      this.kill()
    }
    const shell = os.platform() === 'win32' ? 'powershell.exe' : (process.env.SHELL ?? '/bin/zsh')
    this.ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 24,
      cwd,
      env: process.env as Record<string, string>,
    })
    this.ptyProcess.onData(onData)
  }

  write(data: string) {
    this.ptyProcess?.write(data)
  }

  resize(cols: number, rows: number) {
    this.ptyProcess?.resize(cols, rows)
  }

  kill() {
    this.ptyProcess?.kill()
    this.ptyProcess = null
  }
}

export default new TerminalManager()
