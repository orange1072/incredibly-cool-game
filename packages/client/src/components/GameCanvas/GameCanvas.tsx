import { useEffect, useMemo, useRef } from 'react'
import { ReactAdapter } from '../../engine/adapters/ReactAdapter'
import { createGameEngine } from '../../engine/setup/createGameEngine'

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const adapterRef = useRef<ReactAdapter | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || adapterRef.current) return

    const engine = createGameEngine(canvas)
    const adapter = new ReactAdapter({ canvasRef, engine })

    adapterRef.current = adapter
    adapter.start()

    return () => {
      adapterRef.current?.destroy()
      adapterRef.current = null
    }
  }, [])

  const canvasStyle = useMemo(
    () => ({
      width: '100%',
      height: '100%',
      display: 'block',
      flex: 1,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
    }),
    []
  )

  return <canvas ref={canvasRef} className="game-canvas" style={canvasStyle} />
}
