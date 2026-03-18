declare module 'react-helmet' {
  import { Component } from 'react'

  interface HelmetProps {
    children?: React.ReactNode
  }

  export class Helmet extends Component<HelmetProps> {
    static renderStatic(): Record<string, unknown>
  }
}
