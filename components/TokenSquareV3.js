import React, { useState } from "react";
import LikeButton from "../components/LikeButton";
import ShareButton from "../components/ShareButton";
import Link from "next/link";
import _ from "lodash";

class TokenSquareV3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { spans: 0 };
    this.imageRef = React.createRef();
  }

  componentDidMount() {
    this.imageRef.current.addEventListener("load", this.setSpans);
  }

  setSpans = () => {
    const height = this.imageRef.current.clientHeight;
    const spans = Math.ceil(height / 120 + 1);
    this.setState({ spans });
  };

  render() {
    return (
      <div class={`row-span-${this.state.spans}`}>
        <img
          ref={this.imageRef}
          alt={this.props.item ? this.props.item.token_name : null}
          src={this.props.item ? this.props.item.token_img_url : null}
        />
      </div>
    );
  }
}

export default TokenSquareV3;
