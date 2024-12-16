import React from "react";

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Element extends React.ReactElement {}
  }
}
