import * as d3 from 'd3'

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 20
}

const width = 700 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom

const svg = d3
  .select('#bar-chart')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const xPositionScale = d3
  .scaleBand()
  .range([0, width])
  .padding(0.25)

const yPositionScale = d3
  .scaleLinear()
  .domain([0, 85])
  .range([height, 0])

const colorScale = d3
  .scaleOrdinal()
  .range(['#fee5d9', '#fcbba1', '#fc9272', '#fb6a4a', '#de2d26', '#a50f15'])

d3.csv(require('./countries.csv')).then(ready)

function ready(datapoints) {
  // Sort the countries from low to high
  datapoints = datapoints.sort((a, b) => {
    return a.life_expectancy - b.life_expectancy
  })

  d3.select('#reset').on('click', function() {
    svg.selectAll('rect').attr('fill', 'gray')
  })

  d3.select('#asia').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'Asia') {
        return 'red'
      } else {
        return 'gray'
      }
    })
  })

  d3.select('#africa').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'Africa') {
        return 'red'
      } else {
        return 'gray'
      }
    })
  })
  d3.select('#n-america').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.continent === 'N. America') {
        return 'red'
      } else {
        return 'gray'
      }
    })
  })

  d3.select('#low-gdp').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      if (d.gdp_per_capita < 2500) {
        return 'red'
      } else {
        return 'gray'
      }
    })
  })

  d3.select('#continent').on('click', function() {
    svg.selectAll('rect').attr('fill', function(d) {
      return colorScale(d.continent)
    })
  })

  // And set up the domain of the xPositionScale
  // using the read-in data
  const countries = datapoints.map(d => d.country)
  xPositionScale.domain(countries)

  /* Add your rectangles here */
  svg
    .selectAll('rect')
    .data(datapoints)
    .enter()
    .append('rect')
    .attr('x', function(d) {
      return xPositionScale(d.country)
    })
    .attr('y', function(d) {
      return yPositionScale(d.life_expectancy)
    })
    .attr('fill', 'gray')
    .attr('width', function(d) {
      return xPositionScale.bandwidth()
    })
    .attr('height', function(d) {
      return height - yPositionScale(d.life_expectancy)
    })

  const yAxis = d3
    .axisLeft(yPositionScale)
    .tickSize(-width)
    .ticks(5)

  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)
    .lower()

  d3.select('.y-axis .domain').remove()
}
