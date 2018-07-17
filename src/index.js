import React from "react";
import ReactDOM from "react-dom";
import albums from "./albums";
import crossfilter from "crossfilter2";
import { scaleOrdinal, symbols, timeYears, scaleTime, scaleLinear } from "d3";
import dc from "dc";
import RowChart from "./charts/row-chart";
import BarChart from "./charts/bar-chart";
import LineChart from "./charts/line-chart";
import PieChart from "./charts/pie-chart";
import SeriesChart from "./charts/sieries-chart";

const scale = scaleOrdinal().range(symbols);
const top10Artists = [
    "Bob Dylan",
    "The Beatles",
    "The Rolling Stones",
    "Bruce Springsteen",
    "The Who",
    "Elton John",
    "David Bowie",
    "Radiohead",
    "Led Zeppelin",
    "U2"
];
const colors = [
    "#298245",
    "#6FD3C4",
    "#FDE830",
    "#FF7A2F",
    "#FFC62F",
    "#9AD144",
    "#C3A26F",
    "#FAABB7",
    "#E4A326",
    "#789146"
];

const data = crossfilter(albums);
const byArtist = data.dimension(album => album.artist);
const byGenre = data.dimension(album => album.genres, true);
const byYear = data.dimension(album => new Date(album.year, 0, 1));
const byArtistGroup = byArtist.group().reduceCount();
const byGenreGroup = byGenre.group().reduceCount();
const byYearGroup = byYear.group().reduceCount();

const byArtistAndYear = data.dimension(album => [
    album.artist,
    new Date(album.year, 0, 1),
    album.title
]);
const byArtistAndYearGroup = byArtistAndYear
    .group()
    .reduceSum(album => -album.rank);
const byArtistAndYearGroupTop10 = {
    all: () =>
        byArtistAndYearGroup.all().filter(d => top10Artists.includes(d.key[0]))
};

const rockByYearGroup = byYear
    .group()
    .reduceSum(album => (album.genres.includes("Rock") ? 1 : 0));
const popByYearGroup = byYear
    .group()
    .reduceSum(album => (album.genres.includes("Pop") ? 1 : 0));
const funkSoulByYearGroup = byYear
    .group()
    .reduceSum(album => (album.genres.includes("Funk / Soul") ? 1 : 0));
const electroByYearGroup = byYear
    .group()
    .reduceSum(album => (album.genres.includes("Electronic") ? 1 : 0));
const hipHopByYearGroup = byYear
    .group()
    .reduceSum(album => (album.genres.includes("Hip Hop") ? 1 : 0));

const graphs = (
    <div>
        <h3>Artists with the most albums</h3>
        <RowChart
            dimension={byArtist}
            group={byArtistGroup}
            title={record => record.value}
            ordering={record => -record.value}
            ordinalColors={colors}
            renderTitleLabel={true}
            cap={10}
            othersGrouper={false}
            height={300}
        />
        <h3>Distribution by year</h3>
        <BarChart
            dimension={byYear}
            group={byYearGroup}
            x={scaleTime()}
            renderHorizontalGridLines={true}
            elasticX={true}
            xUnits={timeYears}
            ordinalColors={colors}
        />
        <h3>Genres</h3>
        <div>
            <div style={{ float: "left", width: "calc(100% - 300px)" }}>
                <LineChart
                    dimension={byYear}
                    group={rockByYearGroup}
                    x={scaleTime()}
                    renderHorizontalGridLines={true}
                    elasticX={true}
                    xUnits={timeYears}
                    renderArea={true}
                    stack={[
                        popByYearGroup,
                        funkSoulByYearGroup,
                        electroByYearGroup,
                        hipHopByYearGroup
                    ]}
                    xyTipsOn={true}
                    brushOn={false}
                    ordinalColors={colors}
                />
            </div>
            <div style={{ float: "left" }}>
                <PieChart
                    dimension={byGenre}
                    group={byGenreGroup}
                    slicesCap={5}
                    ordering={d => -d.value}
                    ordinalColors={colors}
                    height={180}
                />
            </div>
            <div style={{ clear: "both" }} />
        </div>
        <h3>Albums by artist and year</h3>
        <SeriesChart
            dimension={byArtistAndYear}
            group={byArtistAndYearGroupTop10}
            x={scaleTime().domain([new Date(1955, 0, 1), new Date(2011, 0, 1)])}
            xUnits={timeYears}
            keyAccessor={record => record.key[1]}
            seriesAccessor={record => record.key[0]}
            renderHorizontalGridLines={true}
            renderVerticalGridLines={true}
            brushOn={false}
            title={d => d.key[0] + ": " + d.key[2]}
            y={scaleLinear().domain([-500, -1])}
            ordinalColors={colors}
            chart={chart =>
                dc
                    .scatterPlot(chart)
                    .symbol(r => scale(r.key[0]))
                    .symbolSize(8)
            }
            height={500}
        />
    </div>
);

ReactDOM.render(graphs, document.getElementById("root"));
