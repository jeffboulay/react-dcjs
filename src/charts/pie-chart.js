import dc from "dc";
import BaseChart from "./base-chart";
import baseMixin from "../mixins/base-mixin";
import capMixin from "../mixins/cap-mixin";
import colorMixin from "../mixins/color-mixin";
import pieMixin from "../mixins/pie-mixin";
import { compose } from "react-apollo";

class PieChart extends BaseChart {
    static displayName = "PieChart";

    componentDidMount() {
        this.chart = dc.pieChart(this.chart);
        this.configure();
        this.chart.filterHandler(function(dimension, filters) {
            if (filters.length === 0) {
                // the empty case (no filtering)
                dimension.filter(null);
            } else if (filters.length === 1 && !filters[0].isFiltered) {
                // single value and not a function-based filter
                dimension.filterExact(filters[0]);
            } else if (
                filters.length === 1 &&
                filters[0].filterType === "RangedFilter"
            ) {
                // single range-based filter
                dimension.filterRange(filters[0]);
            } else {
                // an array of values, or an array of filter objects
                dimension.filterFunction(function(d) {
                    for (var i = 0; i < filters.length; i++) {
                        var filter = filters[i];
                        if (filter.isFiltered && filter.isFiltered(d)) {
                            return true;
                        } else if (filter <= d && filter >= d) {
                            return true;
                        }
                    }
                    return false;
                });
            }
            return filters;
        });
        this.chart.render();
    }
}

export default compose(
    pieMixin,
    colorMixin,
    capMixin,
    baseMixin
)(PieChart);
