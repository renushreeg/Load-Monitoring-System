export enum Graph {
    BarGraph,
    LineGraph,
    PieChart
}

export function getGraphText(graph: Graph): string {
    switch (graph) {
        case Graph.BarGraph:
            return "Bar Graph";
        case Graph.LineGraph:
            return "Line Graph";
        case Graph.PieChart:
            return "Pie Chart";
    }
}

export function getGraphFromURL(graph: string): Graph {
    switch (graph) {
        case "pie":
            return Graph.PieChart;
        case "line":
            return Graph.LineGraph;
        case "bar":
        default:
            return Graph.BarGraph;
    }
}

export function getGraphURL(graph: Graph): string {
    switch (graph) {
        case Graph.BarGraph:
            return "bar";
        case Graph.LineGraph:
            return "line";
        case Graph.PieChart:
            return "pie";
    }
}