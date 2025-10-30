import { Component } from 'react';

interface Props {
  shouldThrow?: boolean;
}

/**
 * Это тестовый компонент для триггера ErrorBoundary
 * Можно вставить в любой компонент: <TestErrorComponent shouldThrow /> и потестить
 */
export class TestErrorComponent extends Component<Props> {
  render() {
    if (this.props.shouldThrow) {
      throw new Error('Test error for ErrorBoundary!');
    }
    return <div>Component works fine</div>;
  }
}
