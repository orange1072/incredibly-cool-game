import { render, screen } from '@testing-library/react'

// Простая заглушка компонента
const App = () => <div>Вот тут будет жить ваше приложение :)</div>

const appContent = 'Вот тут будет жить ваше приложение :)'

test('Example test', async () => {
  render(<App />)
  expect(screen.getByText(appContent)).toBeDefined()
})
