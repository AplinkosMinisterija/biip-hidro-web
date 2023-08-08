import { lt } from "lodash";
import moment from "moment";
import { Line } from "react-chartjs-2";
import styled from "styled-components";
import { DateFormats, TimeRanges } from "../../utils/constants";
import { inRange } from "../../utils/functions";
import { descriptions, formLabels } from "../../utils/texts";
import { HydroPowerPlant } from "../../utils/types";
import MiniGraphWrapper from "./MiniGraphWrapper";

interface GraphsProps {
  timeFilter: TimeRanges;
  current: HydroPowerPlant;
}

export const Graphs = ({ current, timeFilter }: GraphsProps) => {
  const unit = timeFilter.replace("other", "hour");

  const upperBasinData = current?.events?.map((item) => {
    return { x: item.time, y: item.upperBasin };
  });

  const lowerBasinData = current?.events?.map((item) => {
    return { x: item.time, y: item.lowerBasin };
  });

  const violatedUpperBasinData = upperBasinData?.some((item) => {
    return !inRange(item.y, current.upperBasinMin, current.upperBasinMax);
  });

  const violatedLowerBasinData = lowerBasinData?.some((item) => {
    return lt(item.y, current.lowerBasinMin);
  });

  const commonOptions = {
    plugins: {
      legend: {
        display: false
      },
      crosshair: {
        enabled: true
      },
      tooltip: {
        mode: "interpolate",
        intersect: false,
        callbacks: {
          title: (context: any) => {
            let label = context?.[0]?.raw?.x || "";
            return moment(label).format(DateFormats.HOUR);
          }
        }
      }
    },
    scales: {
      y: {
        offset: true,
        ticks: {
          callback: function (value: number) {
            return value.toFixed(2) + " m";
          },
          stepSize: 1
        }
      },
      x: {
        ticks: { maxTicksLimit: 9 },
        offset: true,

        type: "time",
        time: {
          displayFormats: {
            hour: "HH:MM",
            day: "D MMM"
          },

          unit
        }
      }
    }
  };

  const commonDataSetOptions = {
    borderWidth: 1,
    pointRadius: 0
  };

  const upperBasinDataChartData = {
    datasets: [
      {
        borderColor: violatedUpperBasinData ? "#FE5B78" : "#0862AB",
        backgroundColor: violatedUpperBasinData ? "#FE5B78" : "#0862AB",
        data: upperBasinData,
        ...commonDataSetOptions
      }
    ]
  };

  const lowerBasinChartData = {
    datasets: [
      {
        borderColor: violatedLowerBasinData ? "#FE5B78" : "#0862AB",
        backgroundColor: violatedLowerBasinData ? "#FE5B78" : "#0862AB",
        data: lowerBasinData,
        ...commonDataSetOptions
      }
    ]
  };

  return (
    <>
      <MiniGraphWrapper label={formLabels.upperBasin}>
        <Line
          options={{
            //@ts-ignore
            plugins: {
              ...commonOptions.plugins,
              annotation: {
                annotations: {
                  box: {
                    drawTime: "beforeDraw",
                    display: true,
                    type: "box",
                    yMin: current?.upperBasinMin || 0,
                    yMax: current?.upperBasinMax || 0,
                    borderColor: "#11E011",
                    borderWidth: 0,
                    backgroundColor: "#d3f8d392"
                  }
                }
              }
            },
            scales: commonOptions.scales as any
          }}
          data={upperBasinDataChartData}
        />
        <Legend>
          <LegendItem>
            <LegendLabel color="#0862AB" />
            <Value>{descriptions.waterLevel}</Value>
          </LegendItem>
          <LegendItem>
            <LegendLabel color="#d3f8d392" />
            <Value>{descriptions.basinMax}</Value>
          </LegendItem>
        </Legend>
      </MiniGraphWrapper>
      <MiniGraphWrapper label={formLabels.lowerBasin}>
        <Line
          options={{
            //@ts-ignore
            plugins: {
              ...commonOptions.plugins,
              annotation: {
                annotations: {
                  box: {
                    drawTime: "beforeDraw",
                    display: true,
                    type: "box",
                    yMin: current?.lowerBasinMin || 0,
                    borderColor: "#11E011",
                    borderWidth: 0,
                    backgroundColor: "#d3f8d392"
                  }
                }
              }
            },
            scales: commonOptions.scales as any
          }}
          data={lowerBasinChartData}
        />
        <Legend>
          <LegendItem>
            <LegendLabel color="#0862AB" />
            <Value>{descriptions.waterLevel}</Value>
          </LegendItem>
          <LegendItem>
            <LegendLabel color="#d3f8d392" />
            <Value>{descriptions.basinMax}</Value>
          </LegendItem>
        </Legend>
      </MiniGraphWrapper>
    </>
  );
};

const Legend = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const LegendItem = styled.div`
  display: grid;
  align-items: center;
  gap: 5px;
  grid-template-columns: 30px 1fr;
`;

const LegendLabel = styled.div<{ color: string }>`
  height: 5px;
  background-color: ${({ color }) => color};
`;

const Value = styled.div``;
