import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import {
  VictoryChart,
  VictoryTooltip,
  VictoryBar,
  VictoryLine,
  VictoryVoronoiContainer,
} from 'victory'
import { getTotalViews, getDailyDurations, getDailyViews } from '../api/events'

export function PostStats({ postId }) {
  const totalViews = useQuery({
    queryKey: ['totalView', postId],
    queryFn: () => getTotalViews(postId),
  })

  const dailyViews = useQuery({
    queryKey: ['dailyViews', postId],
    queryFn: () => getDailyViews(postId),
  })

  const dailyDurations = useQuery({
    queryKey: ['dailyDurations', postId],
    queryFn: () => getDailyDurations(postId),
  })

  if (
    totalViews.isLoading ||
    dailyViews.isLoading ||
    dailyDurations.isLoading
  ) {
    return <div>Loading stats...</div>
  }

  return (
    <div>
      <h3>Total Views: {totalViews.data?.views}</h3>
      <div style={{ width: 512 }}>
        <h3>Daily views</h3>
        <VictoryChart domainPadding={16}>
          <VictoryBar
            labelComponent={<VictoryTooltip />}
            data={dailyViews.data?.map((d) => ({
              x: new Date(d._id),
              y: d.views,
              label: `${new Date(d._id).toLocaleDateString()}: ${d.views}`,
            }))}
          />
        </VictoryChart>
      </div>
      <div style={{ width: 512 }}>
        <h3>Daily Average Viewing Duration</h3>
        <VictoryChart
          domainPadding={16}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension='x'
              labels={({ datum }) =>
                `${datum.x.toLocaleDateString()}: ${datum.y.toFixed(2)} minutes`
              }
              labelComponent={<VictoryTooltip />}
            />
          }
        >
          <VictoryLine
            data={dailyDurations.data?.map((d) => ({
              x: new Date(d._id),
              y: d.averageDuration / (60 * 1000),
            }))}
          />
        </VictoryChart>
      </div>
      <pre>{JSON.stringify(dailyViews.data, null, 2)}</pre>
      <pre>{JSON.stringify(dailyDurations.data, null, 2)}</pre>
    </div>
  )
}

PostStats.propTypes = {
  postId: PropTypes.string.isRequired,
}
