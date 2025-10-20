//функция сбрасывает канвас

function resetCanvas(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  ctx.clearRect(0, 0, width, height)
}

export { resetCanvas }
