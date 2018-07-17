import dc from "dc";
import { compose } from "react-apollo";
import BaseChart from "./base-chart";
import coordinateGridMixin from "../mixins/coordinate-grid-mixin";
import stackMixin from "../mixins/stack-mixin";
import barMixin from "../mixins/bar-mixin";

class BarChart extends BaseChart {
    static displayName = "BarChart";

    componentDidMount() {
        this.chart = dc.barChart(this.chart);
        this.configure();

        this.chart.render();
    }
}

export default compose(
    barMixin,
    stackMixin,
    coordinateGridMixin
)(BarChart);
