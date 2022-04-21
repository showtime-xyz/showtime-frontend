import React from "react";

export class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("error boundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <></>;
    }

    return <>{this.props.children}</>;
  }
}
