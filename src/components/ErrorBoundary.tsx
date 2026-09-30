import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from './Button'

interface Props {
  children: ReactNode
  /** When this value changes (e.g. the route path) a caught error is cleared. */
  resetKey?: string
}

interface State {
  error: Error | null
  resetKey: string | undefined
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, resetKey: this.props.resetKey }

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { error: error instanceof Error ? error : new Error(String(error)) }
  }

  // Clear a caught error when the route changes so navigating away recovers.
  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey === state.resetKey) return null
    return { error: null, resetKey: props.resetKey }
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('ErrorBoundary caught a render error', error, info.componentStack)
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700"
      >
        <span className="text-4xl">💥</span>
        <p className="font-medium text-slate-600 dark:text-slate-300">
          Something went wrong
        </p>
        <p className="max-w-full break-words text-sm text-slate-500">
          {error.message || 'Unknown error'}
        </p>
        <Button className="mt-3 min-h-11 px-5" onClick={() => window.location.reload()}>
          Reload
        </Button>
        <a
          href="#/"
          className="inline-flex min-h-10 items-center text-sm font-medium text-indigo-600 dark:text-indigo-400"
        >
          Back to home
        </a>
      </div>
    )
  }
}
