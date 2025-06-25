// import { useEffect, useRef } from "react";

// const useAudioVisualizer = (audioElementRef, canvasRef) => {
//   useEffect(() => {
//     if (!audioElementRef.current || !canvasRef.current) return;

//     const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//     const analyser = audioCtx.createAnalyser();
//     const source = audioCtx.createMediaElementSource(audioElementRef.current);
//     source.connect(analyser);
//     analyser.connect(audioCtx.destination);

//     analyser.fftSize = 128;
//     const bufferLength = analyser.frequencyBinCount;
//     const dataArray = new Uint8Array(bufferLength);

//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     const draw = () => {
//       requestAnimationFrame(draw);

//       analyser.getByteFrequencyData(dataArray);
//       ctx.fillStyle = "black";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       const barWidth = (canvas.width / bufferLength) * 2.5;
//       let x = 0;

//       for (let i = 0; i < bufferLength; i++) {
//         const barHeight = dataArray[i];
//         const r = barHeight + 25;
//         const g = 250 * (i / bufferLength);
//         const b = 50;

//         ctx.fillStyle = `rgb(${r},${g},${b})`;
//         ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

//         x += barWidth + 1;
//       }
//     };

//     draw();

//     return () => {
//       audioCtx.close();
//     };
//   }, [audioElementRef, canvasRef]);
// };

// export default useAudioVisualizer;
