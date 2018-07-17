import dc from "dc";
import BaseChart from "./base-chart";
import baseMixin from "../mixins/base-mixin";
import marginMixin from "../mixins/margin-mixin";
import capMixin from "../mixins/cap-mixin";
import colorMixin from "../mixins/color-mixin";
import rowMixin from "../mixins/row-mixin";
import { compose } from "react-apollo";

class RowChart extends BaseChart {
    static displayName = "RowChart";

    componentDidMount() {
        this.chart = dc.rowChart(this.chart);
        this.configure();
        this.chart.render();
    }
}

export default compose(
    rowMixin,
    colorMixin,
    capMixin,
    marginMixin,
    baseMixin
)(RowChart);
