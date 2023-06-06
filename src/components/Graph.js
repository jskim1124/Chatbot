import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const App = ({ res }) => {
  const graphData = res; // 7개의 데이터로 변경
  const canvasRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawGraph(ctx);
  }, [graphData]);

  const graphDataInput = (event, i) => {
    const inputVal = Number(event.target.value);
    if (inputVal <= 0) {
      graphData[i] = 0;
      event.target.value = 0;
    } else if (inputVal > 100) {
      graphData[i] = 100;
      event.target.value = 100;
    } else {
      graphData[i] = inputVal;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    drawGraph(ctx);
  };

  const calculateAverage = () => {
    const sum = graphData.reduce((acc, val) => acc + val, 0);
    return sum / graphData.length;
  };

  const drawGraph = (ctx) => {
    const CANVAS_SIZE = 500;
    const CANVAS_CENTER = CANVAS_SIZE / 2;
    const GRAPH_RADIUS = 200;
    const TAG_RADIUS = 20;
    const NUM_SIDES = 7;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE); // input 변경시 그리기 전에 지우기

    drawBackground(ctx, GRAPH_RADIUS, CANVAS_CENTER, NUM_SIDES);
    drawData(ctx, GRAPH_RADIUS, CANVAS_CENTER, graphData, NUM_SIDES);
    drawTagTitles(ctx, GRAPH_RADIUS, CANVAS_CENTER, NUM_SIDES);
    drawAverageValue(ctx, CANVAS_CENTER, calculateAverage());
  };

  const drawData = (ctx, r, center, data, numSides) => {
    ctx.beginPath();
    for (let i = 0; i < numSides; i++) {
      const dataPercent = data[i] / 100;
      const angle = (2 * Math.PI * i) / numSides - Math.PI / 2;
      const x = center + r * Math.cos(angle) * dataPercent;
      const y = center + r * Math.sin(angle) * dataPercent;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.strokeStyle = "#7030A0";
    ctx.fillStyle = "rgba(153,102,255, 0.2)";
    ctx.stroke();
    ctx.fill();
  };

  const drawBackground = (ctx, r, center, numSides) => {
    const angle = (2 * Math.PI) / numSides;

    ctx.beginPath();
    for (let i = 0; i < numSides; i++) {
      const x = center + r * Math.cos(i * angle - Math.PI / 2);
      const y = center + r * Math.sin(i * angle - Math.PI / 2);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#d9d9d9";
    ctx.stroke();
  };

  const drawTagTitles = (ctx, r, center, numSides) => {
    const angle = (2 * Math.PI) / numSides;

    ctx.font = "15px Arial";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";

    for (let i = 0; i < numSides; i++) {
      let title;
      if (i === 0) {
        title = "체육: " + graphData[0];
      } else if (i === 1) {
        title = "음악: " + graphData[1];
      } else if (i === 2) {
        title = "언어: " + graphData[2];
      } else if (i === 3) {
        title = "사회: " + graphData[3];
      } else if (i === 4) {
        title = "과학: " + graphData[4];
      } else if (i === 5) {
        title = "수학: " + graphData[5];
      } else if (i === 6) {
        title = "미술: " + graphData[6];
      }

      const x = center + (r + 30) * Math.cos(i * angle - Math.PI / 2);
      const y = center + (r + 30) * Math.sin(i * angle - Math.PI / 2);
      ctx.fillText(title, x, y);
    }
  };

  const drawAverageValue = (ctx, center, average) => {
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "#7030A0";
    ctx.textAlign = "center";
    ctx.fillText(`${average.toFixed(0)}`, center, center);
  };

  return (
    <div>
      <canvas id="canvas" ref={canvasRef} width="500" height="500"></canvas>
      {graphData.map((data, i) => (
        <input key={i} type="text" onChange={(event) => graphDataInput(event, i)} />
      ))}
    </div>
  );
};

export default App;
