import React from "react";

export default function GradientsBackground() {
  return (
    <>
      <style jsx>{`
        #yellow-ellipse-background {
          position: absolute;
          width: 100%;
          height: 200px;
          left: 10%;
          top: 0px;
          background: radial-gradient(
            50% 50% at 50% 50%,
            #fffb93 0%,
            rgba(189, 255, 48, 0) 100%
          );
          //   opacity: 0.3;
          filter: blur(121px);
          pointer-events: none;
        }
        #red-ellipse-background {
          position: absolute;
          width: 100%;
          height: 800px;
          right: -50%;
          top: -400px;
          background: radial-gradient(
            50% 50% at 50% 50%,
            #fc51ff 0%,
            rgba(255, 49, 185, 0) 100%
          );
          opacity: 0.2;
          filter: blur(121px);
          pointer-events: none;
        }
        #blue-ellipse-background {
          position: absolute;
          width: 100%;
          height: 800px;
          left: -50%;
          top: -400px;
          pointer-events: none;
          background: radial-gradient(
            50% 50% at 50% 50%,
            #93ffeb 0%,
            rgba(49, 218, 255, 0) 100%
          );
          opacity: 0.4;
          filter: blur(121px);
        }
      `}</style>
      <div id="yellow-ellipse-background" />
      <div id="red-ellipse-background" />
      <div id="blue-ellipse-background" />
    </>
  );
}
