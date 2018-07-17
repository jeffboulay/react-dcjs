import React, { Component } from "react";
import "./App.css";
import { scaleLinear } from "d3";
import crossfilter from "crossfilter2";
import BarChart from "./charts/bar-chart";

import PieChart from "./charts/pie-chart";
const records = [
    { x: 0, y: 1 },
    { x: 1, y: 3 },
    { x: 2, y: 5 },
    { x: 3, y: 1 },
    { x: 4, y: 2 }
];
const data = crossfilter(records);
const dimension = data.dimension(record => record.x);
const group = dimension.group().reduceSum(record => record.y);

class App extends Component {
    render() {
        return (
            <div>
                <BarChart
                    dimension={dimension}
                    group={group}
                    x={scaleLinear().domain([0, 5])}
                />
                <PieChart dimension={dimension} group={group} />
            </div>
        );
    }
}

export default App;
