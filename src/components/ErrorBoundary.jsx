import { Component } from 'react'
import { RotateCcw, TriangleAlert } from 'lucide-react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidUpdate(prevProps) {
    // Navigating to another page clears the error screen.
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  componentDidCatch(error, info) {
    console.error('PulseFit crashed:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="grid min-h-[70vh] place-items-center px-6">
        <div className="glass max-w-md p-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15">
            <TriangleAlert className="h-6 w-6 text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold">Oops, we dropped the barbell.</h2>
          <p className="mt-2 text-sm text-muted">
            Something went wrong on this screen. Your progress is safe. Try reloading and we’ll get you back to training.
          </p>
          <button className="btn-primary mt-6" onClick={() => window.location.reload()}>
            <RotateCcw className="h-4 w-4" /> Reload PulseFit
          </button>
        </div>
      </div>
    )
  }
}
