import { useEffect, useMemo, useRef } from 'react'
import { ReactAdapter } from '../../engine/adapters/ReactAdapter'
import { createGameEngine } from '../../engine/setup/createGameEngine'
import ReduxAdapter from '../../engine/adapters/ReduxAdapter'
import { useStore, type RootState } from '../../store'

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const adapterRef = useRef<ReactAdapter | null>(null)
  const reduxAdapterRef = useRef<ReduxAdapter | null>(null)
  const store = useStore()

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas || adapterRef.current) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const engine = createGameEngine(canvas, { store })
    const adapter = new ReactAdapter({ canvasRef, engine })
    const reduxAdapter = new ReduxAdapter<RootState>({ engine, store })

    adapterRef.current = adapter
    reduxAdapterRef.current = reduxAdapter

    reduxAdapter.connect()
    adapter.start()

    return () => {
      adapterRef.current?.destroy()
      adapterRef.current = null
      reduxAdapterRef.current?.destroy()
      reduxAdapterRef.current = null
    }
  }, [store])

  return <canvas ref={canvasRef} className="game-canvas" />
}
