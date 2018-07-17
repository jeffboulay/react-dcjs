import dc from "dc";
import BaseChart from "./base-chart";
import coordinateGridMixin from "../mixins/coordinate-grid-mixin";
import stackMixin from "../mixins/stack-mixin";
import { compose } from "react-apollo";

class CompositeChart extends BaseChart {
    static displayName = "CompositeChart";

    componentDidMount() {
        this.chart = dc.compositeChart(this.chart);
        this.configure();
        this.chart.render();
    }
}
export default compose(
    coordinateGridMixin,
    stackMixin
)(CompositeChart);
