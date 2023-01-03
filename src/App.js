import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import "./App.css";

function generateData() {
  const data = [];
  for (let i = 0; i < 75; i += 0.02) {
    const sinT = Math.sin(i);
    const cosT = Math.cos(i);
    const sinTSixth = Math.sin(i / 12);
    const cosFourT = Math.cos(4 * i);
    const x = sinT * (Math.pow(sinTSixth, 5) + Math.pow(Math.E, Math.cos(i)) - 2 * cosFourT);
    const y = cosT * (Math.pow(sinTSixth, 5) + Math.pow(Math.E, Math.cos(i)) - 2 * cosFourT);
    data.push([x * 15, y * 15]);
  }
  return data;
}

function Butterfly() {
  const [data] = useState(generateData);
  const stroke = "#336AFC";
  const strokeWidth = 0.1;
  const d = d3.line().curve(d3.curveCatmullRom)(data);
  const svgRef = useRef(null);
  const timeoutIDRef = useRef(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const path = svg
      .append("path")
      .attr("fill", "none")
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("d", d);

    const length = path.node().getTotalLength();

    function drawPath() {
      path
        .attr("stroke-dasharray", `${length} ${length}`)
        .attr("stroke-dashoffset", length)
        .transition()
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .duration(35000)
        .on("end", () => (timeoutIDRef.current = setTimeout(drawPath, 1000)));
    }

    drawPath();

    return () => {
      clearTimeout(timeoutIDRef.current);
    };
  }, [data, d]);

  return (
    <div className='butterfly'>
      <svg
        style={{ rotate: "180deg" }}
        className='butterfly-svg'
        ref={svgRef}
        viewBox='-100 -100 200 200'
      >
        {data.map((point, i) => (
          <circle key={i} cx={point[0]} cy={point[1]} r='0.1' fill='#FC338C' />
        ))}
      </svg>
    </div>
  );
}

export default Butterfly;